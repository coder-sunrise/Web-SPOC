import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import {  Tooltip } from '@material-ui/core'
import { CommonTableGrid, Button, CommonModal,Popconfirm } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import AddConsultationDocument from './AddConsultationDocument'
import model from './models'

const types = [
  {
    value: '3',
    name: 'Medical Certificate',
  },
  {
    value: '4',
    name: 'Certificate of Attendance',
  },
  {
    value: '1',
    name: 'Referral Letter',
  },
  {
    value: '2',
    name: 'Memo',
  },
  {
    value: '5',
    name: 'Others',
  },
]
window.g_app.replaceModel(model)
@connect(({ consultationDocument }) => ({
  consultationDocument,
}))
class ConsultationDocument extends PureComponent {

  
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
        editType:row.type,
      },
    })
    this.toggleModal()
  }

  render () {
    const { consultationDocument,dispatch } = this.props
    const { showModal } = consultationDocument
    const { rows } = consultationDocument
    return (
      <div>
        <CommonTableGrid
          getRowId={(r) => r.uid}
          size='sm'
          style={{ margin: 0 }}
          rows={rows}
          columns={[
            { name: 'type', title: 'Type' },
            { name: 'subject', title: 'Subject' },
            { name: 'from', title: 'From' },
            { name: 'action', title: 'Action' },
          ]}
          FuncProps={{ pager: false }}
          columnExtensions={[
            { columnName: 'type', type: 'select', options:types },

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
          <AddConsultationDocument {...this.props} types={types} />
        </CommonModal>
      </div>
    )
  }
}
export default ConsultationDocument
