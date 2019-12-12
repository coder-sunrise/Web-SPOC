import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'

import withStyles from '@material-ui/core/styles/withStyles'
import { Tooltip } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'
import Add from '@material-ui/icons/Add'
import { consultationDocumentTypes } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform } from '@/utils/utils'
import Yup from '@/utils/yup'

import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  skeleton,
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
  FastField,
  CodeSelect,
  Checkbox,
  TextField,
  ProgressButton,
  AuthorizedContext,
} from '@/components'
import AddConsultationDocument from './AddConsultationDocument'

// import model from './models'

// window.g_app.replaceModel(model)
const styles = (theme) => ({})
export const printRow = async (row, props) => {
  const type = consultationDocumentTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return
  }
  // return
  if (row.id) {
    download(
      `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${downloadConfig.key}:${row.id}}`,
      {
        subject: row.subject,
        type: 'pdf',
      },
    )
  } else {
    const { codetable, patient } = props
    const { clinicianprofile = [] } = codetable
    const { entity } = patient
    const obj =
      clinicianprofile.find(
        (o) =>
          o.userProfileFK ===
          (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
      ) || {}

    row.doctorName = (obj.title ? `${obj.title} ` : '') + obj.name
    row.doctorMCRNo = obj.doctorProfile.doctorMCRNo

    row.patientName = entity.name
    row.patientAccountNo = entity.patientAccountNo

    download(
      `/api/Reports/${downloadConfig.id}?ReportFormat=pdf`,
      {
        subject: row.subject,
        type: 'pdf',
      },
      {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          reportContent: JSON.stringify(
            commonDataReaderTransform(downloadConfig.draft(row)),
          ),
        },
      },
    )
  }
}

export const viewReport = (row, props, useID = false) => {
  const type = consultationDocumentTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return false
  }
  if (row.id && useID) {
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: downloadConfig.id,
        reportParameters: {
          [downloadConfig.key]: row.id,
          isSaved: true,
        },
      },
    })
  } else {
    const { codetable, patient } = props
    const { clinicianprofile = [] } = codetable
    const { entity } = patient
    const obj =
      clinicianprofile.find(
        (o) =>
          o.userProfileFK ===
          (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
      ) || {}

    const reportParameters = { ...row }
    const { subject } = row
    reportParameters.doctorName = (obj.title ? `${obj.title} ` : '') + obj.name
    reportParameters.doctorMCRNo = obj.doctorProfile
      ? obj.doctorProfile.doctorMCRNo
      : ''

    reportParameters.patientName = entity.name
    reportParameters.patientAccountNo = entity.patientAccountNo
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: downloadConfig.id,
        reportParameters: {
          isSaved: false,
          reportContent: JSON.stringify(
            commonDataReaderTransform(downloadConfig.draft(reportParameters)),
          ),
        },
      },
    })
  }

  return true
}

// @skeleton(['consultationDocument'])

@connect(({ consultationDocument, codetable, patient, consultation }) => ({
  consultationDocument,
  codetable,
  patient,
  consultation,
}))
@withFormikExtend({
  mapPropsToValues: ({ consultation, forDispense }) => {
    const _values = forDispense
      ? {
          ...(consultation.entity || consultation.default),
          dispenseAcknowledgement: {
            editDispenseReasonFK: 1,
          },
        }
      : consultation.entity || consultation.default
    return _values
  },
  validationSchema: Yup.object().shape({
    dispenseAcknowledgement: Yup.object().shape({
      editDispenseReasonFK: Yup.number().required(),
      remarks: Yup.string().when('editDispenseReasonFK', {
        is: (val) => val === 2,
        then: Yup.string().required(),
      }),
    }),
    // issuedByUserFK: Yup.number().required(),
    // subject: Yup.string().required(),
    // content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onSave } = props
    // dispatch({
    //   type: 'consultationDocument/upsertRow',
    //   payload: values,
    // })
    // if (onConfirm) onConfirm()
    if (onSave) onSave(values)
  },
  displayName: 'ConsultationDocumentList',
})
class ConsultationDocument extends PureComponent {
  state = {
    acknowledged: false,
  }

  constructor (props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
      },
    })
  }

  toggleModal = () => {
    const { consultationDocument } = this.props
    const { showModal } = consultationDocument
    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  editRow = (row) => {
    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        entity: row,
        type: row.type,
      },
    })
    this.toggleModal()
  }

  handleViewReport = (uid) => {
    const { consultationDocument } = this.props
    const { rows } = consultationDocument
    viewReport(rows.find((item) => item.uid === uid), this.props)
  }

  render () {
    const {
      consultationDocument,
      dispatch,
      forDispense,
      theme,
      onCancel,
      onSave,
      values,
    } = this.props
    const { showModal } = consultationDocument
    const { rows } = consultationDocument
    return (
      <div>
        <CommonTableGrid
          getRowId={(r) => r.uid}
          size='sm'
          style={{ margin: 0 }}
          rows={rows}
          onRowDoubleClick={this.editRow}
          columns={[
            { name: 'type', title: 'Type' },
            { name: 'subject', title: 'Subject' },
            { name: 'issuedByUserFK', title: 'From' },
            { name: 'action', title: 'Action' },
          ]}
          FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'type',
              type: 'select',
              options: consultationDocumentTypes,
            },
            {
              columnName: 'issuedByUserFK',
              render: (r) => {
                const { codetable } = this.props
                const { clinicianprofile = [] } = codetable
                const obj =
                  clinicianprofile.find(
                    (o) =>
                      o.userProfileFK ===
                      (r.issuedByUserFK
                        ? r.issuedByUserFK
                        : r.referredByUserFK),
                  ) || {}
                return `${obj.title || ''} ${obj.name || ''}`
              },
            },
            {
              columnName: 'subject',
              onClick: (row) => {
                this.handleViewReport(row.uid)
              },
              type: 'link',
              linkField: 'href',
              getLinkText: (row) => {
                return row.type === '4' ? row.title : row.subject
              },
            },
            {
              columnName: 'action',
              width: 110,
              render: (row) => {
                return (
                  <React.Fragment>
                    {/* <Tooltip title='Print'>
                      <Button
                        size='sm'
                        onClick={() => {
                          this.printRow(row)
                        }}
                        justIcon
                        color='primary'
                        style={{ marginRight: 5 }}
                      >
                        <Print />
                      </Button>
                    </Tooltip> */}
                    <Tooltip title='Edit'>
                      <Button
                        size='sm'
                        onClick={() => {
                          this.editRow(row)
                        }}
                        justIcon
                        color='primary'
                        style={{ marginRight: 5 }}
                      >
                        <Edit />
                      </Button>
                    </Tooltip>
                    <Popconfirm
                      onConfirm={() =>
                        dispatch({
                          type: 'consultationDocument/deleteRow',
                          payload: {
                            id: row.uid,
                          },
                        })}
                    >
                      <Tooltip title='Delete'>
                        <Button size='sm' color='danger' justIcon>
                          <Delete />
                        </Button>
                      </Tooltip>
                    </Popconfirm>
                  </React.Fragment>
                )
              },
            },
          ]}
        />
        <AuthorizedContext>
          {(r) => {
            if (r && r.rights !== 'enable') return null

            return (
              <Tooltip title='Add Consultation Document'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{ margin: theme.spacing(1) }}
                  onClick={() => {
                    window.g_app._store.dispatch({
                      type: 'consultationDocument/updateState',
                      payload: {
                        showModal: true,
                        type: '5',
                        entity: undefined,
                      },
                    })
                  }}
                >
                  Add New
                </ProgressButton>
              </Tooltip>
            )
          }}
        </AuthorizedContext>
        {forDispense && (
          <GridContainer>
            <GridItem xs={12} md={6}>
              <FastField
                name='dispenseAcknowledgement.editDispenseReasonFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Reason'
                      code='cteditdispensereasons'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='dispenseAcknowledgement.remarks'
                render={(args) => {
                  return (
                    <TextField
                      multiline
                      rowsMax='5'
                      label='Remarks'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='acknowledged'
                render={(args) => {
                  return (
                    <Checkbox
                      onChange={(e) => {
                        this.setState({
                          acknowledged: e.target.value,
                        })
                      }}
                      label='I hereby confirm the above orders are instructed by the attending physician'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem
              xs={12}
              style={{ textAlign: 'center', paddingTop: theme.spacing(2) }}
            >
              <Button color='danger' onClick={onCancel}>
                Cancel
              </Button>
              <ProgressButton
                color='primary'
                disabled={!this.state.acknowledged}
                onClick={() => {
                  this.props.handleSubmit()
                }}
              >
                Save
              </ProgressButton>
            </GridItem>
          </GridContainer>
        )}
        <CommonModal
          open={showModal}
          title='Add Consultation Document'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='AddConsultationDocument'
          maxWidth='md'
          bodyNoPadding
          // showFooter=
          // footProps={{
          //   confirmBtnText: 'Save',
          // }}
        >
          <AddConsultationDocument
            {...this.props}
            types={consultationDocumentTypes}
          />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ConsultationDocument)
