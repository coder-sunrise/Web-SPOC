import React, { PureComponent } from 'react'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  Accordion,
  CardContainer,
  dateFormatLongWithTimeNoSec12h,
  DatePicker,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import * as WidgetConfig from './config'
import { deleteFileByFileID } from '@/services/file'
import { LAB_TRACKING_STATUS } from '@/utils/constants'

const styles = (theme) => ({
  root: {},
  hide: {
    display: 'none',
  },
  title: {
    fontSize: '1em',
  },
  note: {
    fontSize: '0.85em',
    fontWeight: 400,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: '0.85em',
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  paragraph: {
    marginLeft: theme.spacing(1),
  },
  leftPanel: {
    position: 'sticky',
    width: 400,
    top: 0,
    float: 'left',
    marginRight: theme.spacing(1),
    marginTop: 0,
  },
  rightPanel: {
    marginTop: 0,

    '& h5': {
      textDecoration: 'underline',
      marginTop: theme.spacing(2),
      fontSize: '1em',
    },
  },
  integratedLeftPanel: {
    width: '100%',
  },
})

@connect(({ codetable }) => ({
  codetable,
}))
@withFormikExtend({
  mapPropsToValues: ({ labTrackingDetails }) => {
    // Construct Attachment
    let labTrackingResults = []
    labTrackingDetails.entity.labTrackingResults.map((labTrackingResult) => {
      labTrackingResults.push({
        ...labTrackingResult,
        thumbnailIndexFK: undefined,
        attachmentType: 'labTrackingResults',
        fileExtension: 'pdf',
      })
      return labTrackingResult
    })

    return {
      ...labTrackingDetails.entity,
      labTrackingResults,
    }
  },
  handleSubmit: (values, { props, resetForm }) => {
    let { ...restValues } = values
    const { dispatch, onConfirm } = props

    if (values) {
      let sortOrder =
        0 && values.labTrackingResults.length
          ? values.labTrackingResults.length
          : 0

      let item = values.labTrackingResults.map((x) => {
        sortOrder += 1
        if (x.fileIndexFK) {
          return {
            ...x,
            sortOrder,
          }
        }
        return {
          fileIndexFK: x.id,
          sortOrder,
          fileName: x.fileName,
        }
      })
      restValues.labTrackingResults = item
    }

    dispatch({
      type: 'labTrackingDetails/upsert',
      payload: {
        ...restValues,
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'labTrackingDetails/query',
        })
      }
    })
  },
  displayName: 'labTrackingDetails',
})
class Detail extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
    this.widgets = WidgetConfig.widgets(props)
  }

  componentDidMount () {
    const { values } = this.props
    if (values && values.labTrackingResults) {
      const { labTrackingResults } = values

      const notConfirmedFiles = labTrackingResults.filter(
        (att) => att.fileIndexFK === undefined,
      )
      notConfirmedFiles.forEach((item) => {
        !item.isDeleted && deleteFileByFileID(item.id)
      })
    }
    if (values.labTrackingStatusFK) {
      this.toggleAccordion(values.labTrackingStatusFK)
    }
  }

  renderDropdown = (option) => <DoctorLabel doctor={option} />

  getTitle = (row) => {
    const { name = '' } = row

    return (
      <div className={this.props.classes.title}>
        <GridContainer>
          <GridItem sm={12}>
            <p>
              <span>{name}</span>
            </p>
          </GridItem>
        </GridContainer>
      </div>
    )
  }

  updateAttachments = ({ added, deleted }) => {
    const { values: { labTrackingResults = [] }, setFieldValue } = this.props

    let updated = [
      ...labTrackingResults,
    ]

    if (added)
      updated = [
        ...updated,
        ...added,
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])

    setFieldValue('labTrackingResults', updated)
  }

  changeToggle = (event, p, expanded) => {
    if (expanded) {
      setTimeout(() => {
        $(this.myRef.current)
          .find('div[aria-expanded=true]')
          .next()
          .find('div[role="button"]:eq(0)')
          .trigger('click')
      }, 1)
    }
  }

  toggleAccordion = (e) => {
    const { activedKeys } = this.myRef.current.state
    let newActivedKeys = activedKeys || []
    switch (e) {
      case LAB_TRACKING_STATUS.ORDERED:
        if (newActivedKeys.indexOf(0) === -1) {
          newActivedKeys.push(0)
        }
        break
      case LAB_TRACKING_STATUS.RECEIVED:
        if (newActivedKeys.indexOf(1) === -1) {
          newActivedKeys.push(1)
        }
        break
      default:
        break
    }

    this.setState({ activedKeys: [] })
  }

  getContent = (data) => {
    const Widget = data.component
    const { values } = this.props

    return (
      <Widget
        current={values || {}}
        attachment={values.labTrackingResults}
        updateAttachments={this.updateAttachments}
      />
    )
  }

  render () {
    const { props } = this
    const { theme, footer, values, codetable } = props
    const { doctorprofile } = codetable
    const { doctorProfileFK } = values

    let doctorNameLabel = ''
    let selectDoctor = doctorprofile.find((d) => d.id === doctorProfileFK)
    if (selectDoctor) {
      const { doctorMCRNo, clinicianProfile: { name } } = selectDoctor
      doctorNameLabel = `${name} (${doctorMCRNo})`
    }
    return (
      <CardContainer hideHeader size='sm'>
        <div>
          <GridContainer>
            <GridItem md={4}>
              <FastField
                name='patientAccountNo'
                render={(args) => (
                  <TextField label='Patient Acc No.' {...args} disabled />
                )}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='patientName'
                render={(args) => (
                  <TextField label='Patient Name' {...args} disabled />
                )}
              />
            </GridItem>
            <GridItem md={4}>
              <TextField disabled label='Doctor' value={doctorNameLabel} />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='visitDate'
                render={(args) => {
                  return (
                    <DatePicker
                      label='Visit Date'
                      {...args}
                      disabled
                      format={dateFormatLongWithTimeNoSec12h}
                      showTime
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='serviceName'
                render={(args) => (
                  <TextField label='Service Name' {...args} disabled />
                )}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='labTrackingStatusFK'
                render={(args) => (
                  <CodeSelect
                    label='Status'
                    {...args}
                    code='ltlabtrackingstatus'
                    onChange={this.toggleAccordion}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </div>
        <div>
          <div>
            <Accordion
              ref={this.myRef}
              onChange={this.changeToggle}
              mode='multiple'
              collapses={this.widgets.map((o) => {
                return {
                  title: this.getTitle(o),
                  hideExpendIcon: false,
                  content: this.getContent(o),
                }
              })}
            />
          </div>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
