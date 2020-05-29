import React, { PureComponent, useCallback, useState } from 'react'
import { connect } from 'dva'
import { primaryColor } from 'mui-pro-jss'
import color from 'color'
import withStyles from '@material-ui/core/styles/withStyles'
import { Tooltip } from '@material-ui/core'
import { Delete, Edit, Print, Add } from '@material-ui/icons'
import { formTypes, formStatus } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform } from '@/utils/utils'
import Yup from '@/utils/yup'
import VoidWithPopover from './VoidWithPopover'

import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  notification,
  withFormikExtend,
  AuthorizedContext,
  TextField,
  Danger,
  Popover,
  Checkbox,
} from '@/components'
import AddForm from './AddForm'

const styles = (theme) => ({
  item: {
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
})
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
      `/api/Reports/${downloadConfig.id}?ReportFormat=pdf&ReportParameters={${downloadConfig.key}:${row.id},"FormCategory":"CORForm"}`,
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

export const viewReport = (row, props) => {
  const type = formTypes.find(
    (o) => o.value === row.type || o.name === row.type || o.code === row.type,
  )
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return false
  }

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
    const { onSave } = props
    if (onSave) onSave(values)
  },
  displayName: 'Forms',
})
class Forms extends PureComponent {
  constructor (props) {
    super(props)
    const { dispatch } = props

    this.state = {
      openFormType: false,
      includeVoidForms: false,
    }

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
    if (row.statusFK === 3 || row.statusFK === 4) return
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

  toggleVisibleChange = () =>
    this.setState((ps) => {
      return {
        ...ps,
        openFormType: !ps.openFormType,
      }
    })

  ListItem = ({ classes, title, onClick }) => {
    return (
      <Tooltip title={title} style={{ pidding: 0 }}>
        <div className={classes.item} onClick={onClick}>
          <span>{title}</span>
        </div>
      </Tooltip>
    )
  }

  VoidForm = ({ classes, dispatch, row }) => {
    const [
      reason,
      setReason,
    ] = useState(undefined)

    const handleConfirmDelete = useCallback((i, voidVisibleChange) => {
      if (reason) {
        voidVisibleChange()
        dispatch({
          type: 'forms/voidRow',
          payload: {
            id: row.uid,
            voidReason: reason,
            statusFK: 4,
          },
        })
      }
    })
    return (
      <VoidWithPopover
        title='Void Form'
        contentText='Confirm to void this form?'
        tooltipText='Void Form'
        extraCmd={
          <div className={classes.errorContainer}>
            <TextField
              label='Void Reason'
              autoFocus
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
              }}
            />
            {!reason && (
              <Danger>
                <span>Void reason is required</span>
              </Danger>
            )}
          </div>
        }
        onCancelClick={() => {
          setReason(undefined)
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    )
  }

  render () {
    const { forms, dispatch, theme, classes, setFieldValue } = this.props
    const { showModal } = forms
    const { rows = [] } = forms
    return (
      <div>
        <Checkbox
          style={{ marginLeft: 10 }}
          label='Include void forms'
          value={this.state.includeVoidForms}
          onChange={() => {
            this.setState((ps) => {
              return {
                ...ps,
                includeVoidForms: !ps.includeVoidForms,
              }
            })
          }}
        />
        <CommonTableGrid
          getRowId={(r) => r.uid}
          size='sm'
          style={{ margin: 0 }}
          rows={
            this.state.includeVoidForms ? (
              rows
            ) : (
              rows.filter((o) => o.statusFK !== 4)
            )
          }
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
                      <this.VoidForm
                        classes={setFieldValue}
                        dispatch={dispatch}
                        row={row}
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
              <Popover
                icon={null}
                trigger='click'
                placement='bottom'
                visible={this.state.openFormType}
                onVisibleChange={this.toggleVisibleChange}
                content={
                  <div className={classes.popoverContainer}>
                    <div className={classes.listContainer}>
                      {formTypes.map((item) => {
                        return (
                          <this.ListItem
                            key={item.value}
                            title={item.name}
                            classes={classes}
                            onClick={() => {
                              window.g_app._store.dispatch({
                                type: 'forms/updateState',
                                payload: {
                                  showModal: true,
                                  type: item.value,
                                  entity: undefined,
                                },
                              })
                              this.toggleVisibleChange()
                            }}
                            {...item}
                          />
                        )
                      })}
                    </div>
                  </div>
                }
              >
                <Tooltip title='Add Form'>
                  <Button color='primary' style={{ margin: theme.spacing(1) }}>
                    <Add />
                    Add New
                  </Button>
                </Tooltip>
              </Popover>
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
