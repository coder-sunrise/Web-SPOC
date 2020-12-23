import React, { PureComponent } from 'react'
import moment from 'moment'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  DateRangePicker,
  notification,
  NumberInput,
  withFormikExtend,
  FastField,
  CommonModal,
  Field,
  ClinicianSelect,
  Button,
  Popover, Tooltip,
} from '@/components'
import * as service from '@/services/common'
import { UNFIT_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'
import { Divider, withStyles } from '@material-ui/core'
import color from 'color'
import Settings from '@material-ui/icons/Settings'
import NavigateNext from '@material-ui/icons/NavigateNext'
import ListAlt from '@material-ui/icons/ListAlt'
import { CANNED_TEXT_TYPE_FIELD_NAME } from '@/pages/Widgets/ClinicalNotes/CannedText/utils'
import { connect } from 'dva'
import cannedTextModel from '@/pages/Widgets/ClinicalNotes/models'
import CannedText from '@/pages/Widgets/ClinicalNotes/CannedText'
import { primaryColor } from 'mui-pro-jss'
import { getClinicianProfile } from './utils'

window.g_app.replaceModel(cannedTextModel)

const styles = (theme) => ({
  item: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: color(primaryColor).lighten(0.9).hex(),
    },
    '& > svg': {
      marginRight: theme.spacing(1),
    },
    '& > span': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  popoverContainer: {
    width: 200,
    textAlign: 'left',
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  arrowRight: {
    float: 'right',
  },
})

@connect(({ loading, cannedText }) => {
  return {
    cannedText,
    loading: loading.effects[`cannedText/query`],
  }
})
@withFormikExtend({
  mapPropsToValues: ({ consultationDocument, codetable, visitEntity }) => {
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    const values = {
      ...(consultationDocument.entity ||
        consultationDocument.defaultMedicalCertificate),
      issuedByUserFK: clinicianProfile.userProfileFK,
    }

    return values
  },
  validationSchema: Yup.object().shape({
    mcIssueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    mcDays: Yup.number().required(),
    mcStartEndDate: Yup.array().of(Yup.date()).min(2).required(),
    unfitTypeFK: Yup.number().required(),
    otherUnfitTypeDescription: Yup.string().when('unfitTypeFK', {
      is: (val) => val && UNFIT_TYPE[val] === 'Others',
      then: Yup.string().required(),
    }),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, currentType, getNextSequence } = props
    const { mcStartEndDate } = values
    const nextSequence = getNextSequence()
    const data = {
      sequence: nextSequence,
      ...values,
      mcStartDate: mcStartEndDate[0],
      mcEndDate: mcStartEndDate[1],
    }
    // console.log(mcStartEndDate)
    data.subject = currentType.getSubject(data)
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class MedicalCertificate extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showCannedText: false,
    }
  }

  componentDidMount () {
    const { setFieldValue, values, dispatch } = this.props
    dispatch({
      type: 'cannedText/query',
      payload: CANNED_TEXT_TYPE.MEDICALCERTIFICATE,
    })

    if (values.mcReferenceNo === '-')
      service.runningNumber('mc').then((o) => {
        if (o && o.data) {
          setFieldValue('mcReferenceNo', o.data)
        } else {
          notification.error({
            message: 'Generate Reference Number fail',
          })
        }
      })
  }

  onDaysChange = (e) => {
    const { values, setFieldValue } = this.props
    if (e.target.value) {
      const startDate = moment(values.mcStartEndDate[0])
      setFieldValue('mcStartEndDate', [
        startDate,
        startDate.clone().add('days', Math.ceil(e.target.value - 1)),
      ])
    }
  }

  onDayRangeChange = (dateArray, moments) => {
    const { setFieldValue } = this.props

    setFieldValue(
      'mcDays',
      Math.ceil(moment.duration(moments[1].diff(moments[0])).asDays()),
    )
  }

  onListItemClick = (selectedCannedText) => {
    const { values, setFieldValue } = this.props
    setFieldValue('remarks', `${values.remarks || ''}${(values.remarks || '').length > 0 ? '\n' : ''}${selectedCannedText.text}`)
  }

  onSettingClick = () => {
    this.props.dispatch({
      type: 'cannedText/setSelectedNote',
      payload: { cannedTextTypeFK: CANNED_TEXT_TYPE.MEDICALCERTIFICATE, fieldName: CANNED_TEXT_TYPE_FIELD_NAME[CANNED_TEXT_TYPE.MEDICALCERTIFICATE] },
    })
    this.setState({
      showCannedText: true,
    })
  }

  closeCannedText = () => {
    this.setState({
      showCannedText: false,
    })
    this.props.dispatch({
      type: 'cannedText/query',
      payload: CANNED_TEXT_TYPE.MEDICALCERTIFICATE,
    })
  }

  render () {
    const { footer, handleSubmit, classes, values, setFieldValue, cannedText, user } = this.props
    // console.log({ values })
    const { unfitTypeFK } = values

    const { showCannedText } = this.state
    const ListItem = ({ title, onClick }) => {
      return (
        <Tooltip title={title}>
          <div className={classes.item} onClick={onClick}>
            <span>{title}</span>
          </div>
        </Tooltip>
      )
    }
    const fieldName = CANNED_TEXT_TYPE_FIELD_NAME[CANNED_TEXT_TYPE.MEDICALCERTIFICATE]
    let list = cannedText[fieldName] || []
    list = [
      ..._.orderBy(
        list.filter((o) => o.ownedByUserFK === user.id),
        [
          'sortOrder',
          'title',
        ],
        [
          'asc',
        ],
      ),
    ]

    return (
      <div>
        {values.mcReferenceNo && (
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='mcReferenceNo'
                render={(args) => {
                  return <TextField disabled label='Reference No' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
        )}
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='mcIssueDate'
              render={(args) => {
                return <DatePicker label='Issue Date' autoFocus {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect label='Issue By' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='mcDays'
              render={(args) => {
                return (
                  <NumberInput
                    step={0.5}
                    format='0.0'
                    min={0.5}
                    max={365}
                    label='Day(s)'
                    onChange={this.onDaysChange}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='mcStartEndDate'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='From'
                    label2='To'
                    onChange={this.onDayRangeChange}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='unfitTypeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    code='ctUnfitType'
                    label='Description'
                    onChange={(v) => {
                      if (!v || UNFIT_TYPE[v] !== 'Others') {
                        setFieldValue('otherUnfitTypeDescription', '')
                      }
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='otherUnfitTypeDescription'
              render={(args) => {
                return (
                  <TextField
                    label='If Others, pls. specify'
                    disabled={
                      !unfitTypeFK || UNFIT_TYPE[unfitTypeFK] !== 'Others'
                    }
                    maxLength={200}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <TextField label='Remarks' multiline rowsMax='4' {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={3} className={classes.editor}>
            <Popover
              icon={null}
              placement='right'
              trigger='hover'
              content={
                <div className={classes.popoverContainer}>
                  <div className={classes.listContainer}>
                    {list.map((item) => {
                      const handleClick = () => this.onListItemClick(item)
                      return (
                        <ListItem
                          key={`cannedText-${item.id}`}
                          classes={classes}
                          onClick={handleClick}
                          {...item}
                        />
                      )
                    })}
                  </div>
                  <Divider className={classes.divider} />
                  <div className={classes.item} onClick={() => { this.onSettingClick() }}>
                    <Settings />
                    <span>Settings</span>
                  </div>
                </div>
              }
            >
              <Button color='transparent' style={{ margin: "8px 0 " }}>
                <ListAlt />
                <span>Canned Text</span>
                <NavigateNext className={classes.arrowRight} />
              </Button>
            </Popover>
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
          })}
        <CommonModal
          open={showCannedText}
          title='Canned Text'
          observe='CannedText'
          onClose={this.closeCannedText}
        >
          <CannedText />
        </CommonModal>
      </div>

    )
  }
}

export default withStyles(styles, { name: 'MedicalCertificate' })(MedicalCertificate)
