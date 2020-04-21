import React, { Component, PureComponent, useCallback } from 'react'
import { connect } from 'dva'

import { FastField } from 'formik'
import withStyles from '@material-ui/core/styles/withStyles'
import { Tooltip } from '@material-ui/core'
import { Delete, Edit, Print, Add, Undo } from '@material-ui/icons'
import { formTypes, formStatus } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform } from '@/utils/utils'
import Yup from '@/utils/yup'
import { DeleteWithPopover } from '@/components/_medisys'

import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  notification,
  withFormikExtend,
  ProgressButton,
  AuthorizedContext,
  TextField,
  Danger,
} from '@/components'
import AddForm from './AddForm'

const styles = (theme) => ({})
export const printRow = async (row, props) => {
  const type = formTypes.find(
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
  const type = formTypes.find(
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

@connect(({ forms, codetable, patient, consultation }) => ({
  forms,
  codetable,
  patient,
  consultation,
}))
@withFormikExtend({
  authority: [
    'queue.consultation.widgets.consultationdocument',
  ],
  mapPropsToValues: ({ consultation }) => {
    const _values = consultation.entity || consultation.default
    return _values
  },
  validationSchema: Yup.object().shape({}),

  handleSubmit: (values, { props }) => {
    const { dispatch, onSave } = props
    if (onSave) onSave(values)
  },
  displayName: 'Forms',
})
class Forms extends PureComponent {
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
    const { forms } = this.props
    const { showModal } = forms
    this.props.dispatch({
      type: 'forms/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  editRow = (row) => {
    this.props.dispatch({
      type: 'forms/updateState',
      payload: {
        entity: row,
        type: row.type,
      },
    })
    this.toggleModal()
  }

  handleViewReport = (uid) => {
    const { forms } = this.props
    const { rows } = forms
    viewReport(rows.find((item) => item.uid === uid), this.props)
  }

  render () {
    const { forms, dispatch, theme, classes, setFieldValue } = this.props
    const { showModal } = forms
    const { rows } = forms
    return (
      <div>
        <CommonTableGrid
          getRowId={(r) => r.uid}
          size='sm'
          style={{ margin: 0 }}
          rows={rows}
          onRowDoubleClick={this.editRow}
          columns={[
            { name: 'typeName', title: 'Type' },
            { name: 'updateByUser', title: 'Last Update By' },
            { name: 'statusFK', title: 'Status' },
            { name: 'action', title: 'Action' },
          ]}
          FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'typeName',
              type: 'link',
              linkField: 'href',
              onClick: (row) => {
                this.handleViewReport(row.uid)
              },
            },
            {
              columnName: 'updateByUser',
            },
            {
              columnName: 'statusFK',
              type: 'select',
              options: formStatus,
            },
            {
              columnName: 'action',
              width: 110,
              render: (row) => {
                const handleConfirmDelete = useCallback(
                  (id, toggleVisibleCallback) => {
                    const form = rows.find(
                      (item) => parseInt(item.id, 10) === parseInt(id, 10),
                    )

                    if (
                      form.voidReason !== '' &&
                      form.voidReason !== undefined
                    ) {
                      toggleVisibleCallback()
                      const index = rows.findIndex(
                        (item) => item.uid === row.uid,
                      )
                      setFieldValue(`rows[${index}].statusFK`, 4)
                    }
                  },
                  [
                    rows,
                  ],
                )
                return (
                  <React.Fragment>
                    <Tooltip title='Print'>
                      <Button
                        size='sm'
                        onClick={() => {
                          printRow(row, this.props)
                        }}
                        justIcon
                        color='primary'
                        style={{ marginRight: 5 }}
                      >
                        <Print />
                      </Button>
                    </Tooltip>
                    {(row.statusFK === 1 || row.statusFK === 2) && (
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
                    )}
                    {(row.statusFK === 1 || row.statusFK === 2) && (
                      <Popconfirm
                        onConfirm={() =>
                          dispatch({
                            type: 'forms/deleteRow',
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
                    )}
                    {row.statusFK === 3 && (
                      <DeleteWithPopover
                        title='Void Form'
                        contentText='Confirm to void this form?'
                        extraCmd={
                          <div className={classes.errorContainer}>
                            <FastField
                              name='voidReason'
                              render={(args) => (
                                <TextField
                                  label='Void Reason'
                                  autoFocus
                                  {...args}
                                />
                              )}
                            />
                            {row.voidReason === '' &&
                            row.voidReason === undefined && (
                              <Danger>
                                <span>Void reason is required</span>
                              </Danger>
                            )}
                          </div>
                        }
                        onCancelClick={() => {
                          const index = rows.findIndex(
                            (item) => item.uid === row.uid,
                          )
                          setFieldValue(`rows[${index}].voidReason`, undefined)
                        }}
                        onConfirmDelete={handleConfirmDelete}
                      />
                    )}
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
              <Tooltip title='Add Form'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{ margin: theme.spacing(1) }}
                  onClick={() => {
                    window.g_app._store.dispatch({
                      type: 'forms/updateState',
                      payload: {
                        showModal: true,
                        type: '1',
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
        <CommonModal
          open={showModal}
          title='Add Form'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='AddForm'
          maxWidth='md'
          bodyNoPadding
        >
          <AddForm {...this.props} types={formTypes} />
        </CommonModal>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Forms)
