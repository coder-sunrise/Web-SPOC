import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip, Popconfirm } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
//import * as service from './services'
import htmlToText from 'html-to-text'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingDocumentTemplate } = this.props

    const { list } = settingDocumentTemplate

    dispatch({
      type: 'settingDocumentTemplate/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  // getTooltipTitle = () => {
  //   const pathname = window.location.pathname.trim().toLowerCase()

  //   const modalTitle =
  //     pathname == '/setting/smstemplate'
  //       ? 'SMS Template'
  //       : 'Document Template'

  //   return `Edit ${modalTitle}`
  // }

  render () {
    const { patientAttachment, dispatch } = this.props
    const { list } = patientAttachment
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        rows={list !== undefined ? list : []}
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'fileName', title: 'Document' },
          { name: 'createDate', title: 'Create Date' },
          { name: 'action', title: 'Action' },
        ]}
        // FuncProps={{ pager: false }}
        columnExtensions={[
          {
            columnName: 'documentTemplateTypeFK',
            sortingEnabled: false,
            type: 'codeSelect',
            code: 'LTDocumentTemplateType',
          },
          {
            columnName: 'createDate',
            type: 'date',
            format: 'DD MMM YYYY',
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            render: (row) => {
              return (
                <Popconfirm
                  onConfirm={() => {

             
                    this.props
                      .dispatch({
                        type: 'patientAttachment/removeRow',
                        payload: {
                          id: row.id,
                        },
                      })
                      .then(() => {
                        this.props.dispatch({
                          type: 'patientAttachment/query',
                        })
                      })
                  }}
                >
                  <Tooltip title='Delete'>
                    <Button size='sm' color='danger' justIcon>
                      <Delete />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
