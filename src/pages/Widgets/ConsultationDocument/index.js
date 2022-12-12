import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FastField } from 'formik'
import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import { consultationDocumentTypes } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform, ableToViewByAuthority } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { List } from 'antd'

import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  notification,
  ProgressButton,
  Popover,
  Tooltip,
  AuthorizedContext,
} from '@/components'
import AddConsultationDocument from './AddConsultationDocument'
const styles = () => ({
  popContainer: {
    '& .ant-popover-inner-content': {
      padding: '0',
    },
    '& ul': {
      cursor: 'pointer',
    },
  },
})
export const printRow = async (row, props) => {
  const type = consultationDocumentTypes.find(
    o => o.value === row.type || o.name === row.type || o.code === row.type,
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
    const { codetable, visitEntity } = props
    const { doctorprofile = [] } = codetable
    const obj =
      doctorprofile.find(o => o.id === visitEntity?.visit?.doctorProfileFK) ||
      {}
    row.optometristName =
      (obj?.clinicianProfile?.title ? `${obj?.clinicianProfile?.title} ` : '') +
      obj?.clinicianProfile?.name

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
            commonDataReaderTransform(downloadConfig.draft(row, codetable)),
          ),
        },
      },
    )
  }
}

export const viewReport = (row, props, useID = false) => {
  const type = consultationDocumentTypes.find(
    o => o.value === row.type || o.name === row.type || o.code === row.type,
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
    const { codetable, visitEntity } = props
    const { doctorprofile = [] } = codetable
    const obj =
      doctorprofile.find(o => o.id === visitEntity?.visit?.doctorProfileFK) ||
      {}
    const reportParameters = { ...row }
    reportParameters.optometristName =
      (obj?.clinicianProfile?.title ? `${obj?.clinicianProfile?.title} ` : '') +
      obj?.clinicianProfile?.name
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: downloadConfig.id,
        reportParameters: {
          isSaved: false,
          reportContent: JSON.stringify(
            commonDataReaderTransform(
              downloadConfig.draft(reportParameters, codetable),
            ),
          ),
        },
      },
    })
  }

  return true
}
@connect(
  ({
    consultationDocument,
    codetable,
    patient,
    consultation,
    visitRegistration,
  }) => ({
    consultationDocument,
    codetable,
    patient,
    consultation,
    visitEntity: visitRegistration.entity || {},
  }),
)
class ConsultationDocument extends PureComponent {
  constructor(props) {
    super(props)
    const { dispatch } = props
    this.state = {
      openFormType: false,
    }
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
        entity: undefined,
        type: undefined,
      },
    })
  }

  editRow = row => {
    const { isEnableEditOrder = true } = this.props
    if (!isEnableEditOrder) return
    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        entity: row,
        type: row.type,
        showModal: true,
      },
    })
  }

  handleViewReport = uid => {
    const { consultationDocument } = this.props
    const { rows } = consultationDocument
    viewReport(
      rows.find(item => item.uid === uid),
      this.props,
    )
  }

  getDocumentAccessRight = () => {
    const { isEnableEditOrder = true } = this.props
    let right = Authorized.check(
      'queue.consultation.widgets.consultationdocument',
    ) || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  toggleVisibleChange = () => {
    this.setState(ps => {
      return {
        ...ps,
        openFormType: !ps.openFormType,
      }
    })
  }

  openConsultationDocumentModal = item => {
    let {
      consultationDocument: { rows = [] },
      dispatch,
    } = this.props
    rows.find(subjectItem => subjectItem.type == item.value)
      ? notification.error({
          message: `${item.name} can only be added once for current visit.`,
        })
      : dispatch({
          type: 'consultationDocument/updateState',
          payload: {
            entity: undefined,
            type: item.value,
            showModal: true,
          },
        })
    this.toggleVisibleChange()
  }

  render() {
    const { consultationDocument, dispatch, theme, classes } = this.props
    const { showModal, rows, entity, type } = consultationDocument
    const selectType = consultationDocumentTypes.find(
      item => item.value === type,
    )
    const title = `${_.isEmpty(entity) ? 'Add' : 'Edit'} ${selectType?.name}`
    return (
      <div>
        <AuthorizedContext.Provider value={this.getDocumentAccessRight()}>
          <CommonTableGrid
            getRowId={r => r.uid}
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
                render: r => {
                  return consultationDocumentTypes.find(t => t.value === r.type)
                    .name
                },
                width: 250,
              },
              {
                columnName: 'issuedByUserFK',
                render: r => {
                  return `${r.issuedByUserTitle || ''} ${r.issuedByUser || ''}`
                },
                width: 250,
              },
              {
                columnName: 'subject',
                onClick: row => {
                  this.handleViewReport(row.uid)
                },
                type: 'link',
                linkField: 'href',
                getLinkText: row => {
                  return row.subject
                },
              },
              {
                columnName: 'action',
                width: 110,
                render: row => {
                  return (
                    <React.Fragment>
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
                          })
                        }
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
        </AuthorizedContext.Provider>
        <AuthorizedContext.Provider
          value={{
            rights:
              this.getDocumentAccessRight()?.rights !== 'enable'
                ? 'hidden'
                : 'enable',
          }}
        >
          <div className={classes.popContainer}>
            <Popover
              icon={null}
              trigger='click'
              placement='bottomLeft'
              visible={this.state.openFormType}
              onVisibleChange={this.toggleVisibleChange}
              getPopupContainer={() =>
                document.getElementsByClassName(classes.popContainer)[0]
              }
              content={
                <div>
                  <List
                    size='small'
                    bordered
                    dataSource={consultationDocumentTypes
                      .filter(item => ableToViewByAuthority(item.authority))
                      .map(item => ({
                        value: item.value,
                        name: item.name,
                      }))}
                    renderItem={item => (
                      <List.Item
                        onClick={() => {
                          this.openConsultationDocumentModal(item)
                        }}
                      >
                        {item.name}
                      </List.Item>
                    )}
                  />
                </div>
              }
            >
              <Tooltip title='Add Consultation Document'>
                <ProgressButton
                  color='primary'
                  icon={<Add />}
                  style={{ margin: theme.spacing(1) }}
                  onClick={() => {
                    this.toggleVisibleChange()
                  }}
                >
                  Add New
                </ProgressButton>
              </Tooltip>
            </Popover>
          </div>
        </AuthorizedContext.Provider>
        {showModal && (
          <FastField
            name='corDoctorNote.corVisionRefractionEntity'
            render={args => {
              return (
                <CommonModal
                  open={true}
                  title={title}
                  onClose={this.toggleModal}
                  onConfirm={this.toggleModal}
                  observe='AddConsultationDocument'
                  maxWidth='md'
                  bodyNoPadding
                >
                  <AddConsultationDocument
                    {...this.props}
                    corVisionRefraction={args.field?.value}
                  />
                </CommonModal>
              )
            }}
          />
        )}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ConsultationDocument)
