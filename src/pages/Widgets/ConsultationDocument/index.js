import React, { PureComponent } from 'react'
import { connect } from 'dva'

import withStyles from '@material-ui/core/styles/withStyles'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Add from '@material-ui/icons/Add'
import { consultationDocumentTypes } from '@/utils/codes'
import { download } from '@/utils/request'
import { commonDataReaderTransform } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import { CONSULTATION_DOCUMENTS } from './utils'
import { List } from 'antd'

import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  notification,
  ProgressButton,
  Popover,
  TextField,
  Tooltip,
  AuthorizedContext,
  withFormikExtend,
} from '@/components'
import AddConsultationDocument from './AddConsultationDocument'
import SpectacleOrderForm from './SpectacleOrderForm'

// import model from './models'

// window.g_app.replaceModel(model)
const styles = () => ({})
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
    const { codetable, patient } = props
    const { clinicianprofile = [] } = codetable
    const { entity } = patient
    const obj =
      clinicianprofile.find(
        o =>
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
    const { codetable, patient } = props
    const { clinicianprofile = [] } = codetable
    const { entity } = patient
    const obj =
      clinicianprofile.find(
        o =>
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
  }

  return true
}
@connect(({ consultationDocument, codetable, patient, consultation }) => ({
  consultationDocument,
  codetable,
  patient,
  consultation,
}))
@withFormikExtend({
  displayName: 'ConsultationDocumentList',
})
class ConsultationDocument extends PureComponent {
  constructor(props) {
    super(props)
    const { dispatch } = props

    console.log('consultation document props:', props)
    this.state = {
      openFormType: false,
      consultationDocumentTemplate: [...CONSULTATION_DOCUMENTS],
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
      },
    })
    this.toggleModal()
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
    this.toggleSpectacleOrderForm()
    this.toggleVisibleChange()
  }
  toggleSpectacleOrderForm = () => {
    const { consultationDocument } = this.props
    const { showSpectacleOrderForm } = consultationDocument
    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        showSpectacleOrderForm: !showSpectacleOrderForm,
      },
    })
  }

  render() {
    const { consultationDocument, dispatch, classes, theme } = this.props
    const { showModal } = consultationDocument
    const { showSpectacleOrderForm } = consultationDocument
    const { rows } = consultationDocument
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
                type: 'select',
                options: consultationDocumentTypes,
              },
              {
                columnName: 'issuedByUserFK',
                render: r => {
                  const { codetable } = this.props
                  const { clinicianprofile = [] } = codetable
                  const obj =
                    clinicianprofile.find(
                      o =>
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
                onClick: row => {
                  this.handleViewReport(row.uid)
                },
                type: 'link',
                linkField: 'href',
                getLinkText: row => {
                  return row.type === '4' ? row.title : row.subject
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
          <Popover
            icon={null}
            trigger='click'
            placement='bottomLeft'
            visible={this.state.openFormType}
            onVisibleChange={this.toggleVisibleChange}
            content={
              <div>
                <List
                  size='small'
                  bordered
                  dataSource={this.state.consultationDocumentTemplate}
                  renderItem={item => (
                    <List.Item
                      onClick={item => {
                        this.openConsultationDocumentModal(item)
                      }}
                    >
                      {item}
                    </List.Item>
                  )}
                />
                {/* {this.state.consultationDocumentTemplate.map(item => {
                    return (
                      <this.ListItem
                        key={item.id}
                        title={item.name}
                        classes={classes}
                        onClick={() => {
                          dispatch({
                            type: 'consultationDocument/updateState',
                            payload: {
                              showModal: true,
                              type: item.value,
                              entity: undefined,
                              formName: item.name,
                              templateContent: null,
                            },
                          })
                          this.toggleVisibleChange()
                        }}
                        {...item}
                      />
                    )
                  })} */}
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
        </AuthorizedContext.Provider>
        <CommonModal
          open={showModal}
          title='Add Consultation Document'
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
          observe='AddConsultationDocument'
          maxWidth='md'
          bodyNoPadding
        >
          <AddConsultationDocument
            {...this.props}
            types={consultationDocumentTypes}
          />
        </CommonModal>
        {showSpectacleOrderForm && (
          <CommonModal
            open={true}
            title='Spectacle Order Form'
            onClose={this.toggleSpectacleOrderForm}
            onConfirm={this.toggleSpectacleOrderForm}
            maxWidth='md'
            bodyNoPadding
          >
            <SpectacleOrderForm {...this.props} />
          </CommonModal>
        )}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ConsultationDocument)
