import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import { Tooltip } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'
import { consultationDocumentTypes } from '@/utils/codes'
import { download } from '@/utils/request'
import {
  CommonTableGrid,
  Button,
  CommonModal,
  Popconfirm,
  skeleton,
  notification,
} from '@/components'
import AddConsultationDocument from './AddConsultationDocument'
import model from './models'

window.g_app.replaceModel(model)

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
    const { codetable, patientDashboard } = props
    const { clinicianprofile = [] } = codetable
    const { patientInfo } = patientDashboard
    const obj =
      clinicianprofile.find(
        (o) =>
          o.id ===
          (row.issuedByUserFK ? row.issuedByUserFK : row.referredByUserFK),
      ) || {}

    row.doctorName = obj.name
    row.doctorMCRNo = obj.doctorProfile.doctorMCRNo

    row.patientName = patientInfo.name
    row.patientAccountNo = patientInfo.patientAccountNo

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
          reportContent: JSON.stringify(downloadConfig.draft(row)),
        },
      },
    )
  }
}

// @skeleton(['consultationDocument'])

@connect(({ consultationDocument, codetable, patientDashboard }) => ({
  consultationDocument,
  codetable,
  patientDashboard,
}))
class ConsultationDocument extends PureComponent {
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

  render () {
    const { consultationDocument, dispatch } = this.props
    const { showModal } = consultationDocument
    const { rows } = consultationDocument
    // console.log(consultationDocumentTypes, rows)

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
                      o.id ===
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
                printRow(row, this.props)
              },
              type: 'link',
              linkField: 'href',
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
export default ConsultationDocument
