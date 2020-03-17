import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getBizSession } from '@/services/queue'

import {
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
} from '@/utils/codes'

import {
  withFormikExtend,
  Field,
  GridContainer,
  GridItem,
  CardContainer,
  Select,
  Button,
  Switch,
  WarningSnackbar,
  CodeSelect,
  TextField,
  EditableTableGrid,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import {
  DoctorLabel,
  DoctorProfileSelect,
  Attachment,
  AttachmentWithThumbnail,
} from '@/components/_medisys'

const styles = (theme) => ({
  ...basicStyle(theme),
  queueDiplayButton: {
    margin: theme.spacing(2),
    marginLeft: 0,
  },
  container: {
    marginTop: 0,
  },
  tableHeader: {
    marginTop: theme.spacing(2),
  },
})

const tableParas = {
  columns: [
    { name: 'doctor', title: 'Doctor' },
    { name: 'room', title: 'Room' },
    { name: 'roomDisplayName', title: 'Room Display Name' },
  ],
  columnExtensions: [
    {
      columnName: 'doctor',
      type: 'codeSelect',
      code: 'doctorprofile',
      labelField: 'clinicianProfile.name',
      valueField: 'clinicianProfile.id',
      remoteFilter: {
        'clinicianProfile.isActive': false,
      },
      renderDropdown: (option) => <DoctorLabel doctor={option} />,
    },
    {
      columnName: 'room',
      type: 'codeSelect',
      code: 'ctroom',
    },
    {
      columnName: 'roomDisplayName',
      maxLength: 10,
    },
  ],
}

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
@withFormikExtend({
  enableReinitialize: true,

  mapPropsToValues: ({ clinicSettings }) => {
    if (
      clinicSettings.entity &&
      clinicSettings.entity.showConsultationVersioning
    ) {
      const {
        showConsultationVersioning,
        autoRefresh,
        defaultVisitType,
      } = clinicSettings.entity

      return {
        ...clinicSettings.entity,
        defaultVisitType: {
          ...defaultVisitType,
          settingValue: Number(defaultVisitType.settingValue),
        },
        autoRefresh: {
          ...autoRefresh,
          settingValue: autoRefresh.settingValue === 'true',
        },
        showConsultationVersioning: {
          ...showConsultationVersioning,
          settingValue: showConsultationVersioning.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },

  handleSubmit: (values, { props }) => {
    const {
      systemCurrency,
      currencyRounding,
      currencyRoundingToTheClosest,
      showConsultationVersioning,
      autoRefresh,
      defaultVisitType,
    } = values

    const payload = [
      {
        ...systemCurrency,
      },
      {
        ...currencyRounding,
      },
      {
        ...currencyRoundingToTheClosest,
      },
      {
        ...showConsultationVersioning,
      },
      {
        ...autoRefresh,
      },
      {
        ...defaultVisitType,
      },
    ]
    const { dispatch, history } = props

    dispatch({
      type: 'clinicSettings/upsert',
      payload,
    }).then((r) => {
      if (r) {
        history.push('/setting')
        dispatch({
          type: 'clinicSettings/query',
        })
      }
    })
  },
  displayName: 'clinicSettings',
})
class QueueDisplaySetup extends PureComponent {
  state = {
    hasActiveSession: false,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props.dispatch({
      type: 'clinicSettings/query',
    })
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  handleUpdateAttachments = ({ added, deleted }) => {
    const { values: { queueDisplayImages = [] }, setFieldValue } = this.props
    let updated = [
      ...queueDisplayImages,
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
    console.log({ updated })
    setFieldValue('queueDisplayImages', updated)
  }

  onAddedRowsChange = (addedRows) => {
    return addedRows.map((row) => ({
      patientAllergyStatusFK: 1,
      ...row,
      isConfirmed: true,
    }))
  }

  onCommitChanges = ({ rows, added, changed, deleted }) => {
    this.props.setFieldValue('rows', rows)
  }

  render () {
    const {
      classes,
      clinicSettings,
      dispatch,
      theme,
      handleSubmit,
      values,
      ...restProps
    } = this.props
    const { queueDisplayImages = [], rows } = values
    const { hasActiveSession } = this.state
    console.log(this.props.values)

    const activeQueueDisplayImages = queueDisplayImages.filter(
      (image) => !image.isDeleted,
    )
    return (
      <React.Fragment>
        {/* {hasActiveSession && (
          <div style={{ paddingTop: 5 }}>
            <WarningSnackbar
              variant='warning'
              className={classes.margin}
              message='Active Session detected!'
            />
          </div>
        )} */}
        <Button color='info' className={classes.queueDiplayButton}>
          Open Queue Display
        </Button>
        <CardContainer hideHeader className={classes.container}>
          <GridContainer>
            <GridItem md={10}>
              <AttachmentWithThumbnail
                label='Image: (maximum 5)'
                attachmentType='Visit'
                handleUpdateAttachments={this.handleUpdateAttachments}
                attachments={queueDisplayImages}
                disableUpload={activeQueueDisplayImages.length >= 5}
                maxFilesAllowUpload={5}
                restrictFileTypes={[
                  'image/jpeg',
                  'image/png',
                  'image/bmp',
                ]}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem md={10}>
              <Field
                name='message'
                render={(args) => (
                  <TextField
                    label='Message (max 150 characters)'
                    multiline
                    maxLength={150}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem md={3}>
              <Field
                name='showDateTime.settingValue'
                render={(args) => (
                  <Switch
                    label='Show Date and Time after the message'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridItem md={3} className={classes.tableHeader}>
            <p>
              <b>Doctor Room Assignment</b>
            </p>
          </GridItem>
          <EditableTableGrid
            // schema={schema}
            rows={rows}
            FuncProps={{
              pager: false,
            }}
            EditingProps={{
              showAddCommand: true,
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
            }}
            {...tableParas}
          />
          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              onClick={navigateDirtyCheck({
                redirectUrl: '/setting',
              })}
            >
              Cancel
            </Button>

            <Button color='primary' onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(QueueDisplaySetup)
