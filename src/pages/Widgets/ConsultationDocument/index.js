import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import {  Tooltip } from '@material-ui/core'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import {consultationDocumentTypes} from '@/utils/codes'
import { CommonTableGrid, Button, CommonModal,Popconfirm ,skeleton} from '@/components'
import AddConsultationDocument from './AddConsultationDocument'
import model from './models'


window.g_app.replaceModel(model)

@connect(({ consultationDocument,codetable,patientDashboard }) => ({
  consultationDocument,codetable,patientDashboard,
}))
// @skeleton(['consultationDocument'])

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

  editRow =(row)=>{
    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        entity: row,
        type:row.type,
      },
    })
    this.toggleModal()
  }

  render () {
    const { consultationDocument,dispatch} = this.props
    const { showModal } = consultationDocument
    const { rows } = consultationDocument
// console.log(consultationDocumentTypes,rows)

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
            { columnName: 'type', type: 'select', options:consultationDocumentTypes },
            { columnName: 'issuedByUserFK',render:(r)=>{
              const {codetable}=this.props
              const {clinicianprofile=[]}=codetable
              const obj = clinicianprofile.find(o=>o.id===(r.issuedByUserFK?r.issuedByUserFK: r.referredByUserFK)) || {}
              return `${obj.title || ''} ${ obj.name || ''}`
            } },
            { columnName: 'subject', onClick:this.editRow, type: 'link', linkField: 'href' },
            { columnName: 'action', render:(row)=>{
              return (
                <>
                  <Button
                    size='sm'
                    onClick={()=>{
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
                  >
                    <Edit />
                  </Button>
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
                      <Button
                        size='sm'
                        color='danger'
                        justIcon
                      >
                        <Delete />
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                  
                </>
              )
            } },
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
          <AddConsultationDocument {...this.props} types={consultationDocumentTypes} />
        </CommonModal>
      </div>
    )
  }
}
export default ConsultationDocument
