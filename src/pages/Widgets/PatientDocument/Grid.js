import React, { PureComponent } from 'react'
import Delete from '@material-ui/icons/Delete'
import { CommonTableGrid, Button, Tooltip, Popconfirm } from '@/components'
// import * as service from './services'

import { downloadAttachment } from '@/services/file'

class Grid extends PureComponent {
  downloadFile = (row, e) => {
    console.log("row ", row)  
    console.log("e ", e)
    downloadAttachment(row)
  }

  render () {
    const { patientAttachment, dispatch } = this.props
    const { list } = patientAttachment
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        rows={list !== undefined ? list : []}
        onRowDoubleClick={this.downloadFile}
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
            format: 'DD MMM YYYY h:mm a',
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            render: (row) => {
              return (
                <Popconfirm
                  onConfirm={() => {
                      dispatch({
                        type: 'patientAttachment/removeRow',
                        payload: {
                          id: row.id,
                        },
                      })
                      .then(() => {
                        dispatch({
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
