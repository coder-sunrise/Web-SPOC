import React, { PureComponent } from 'react'
import Delete from '@material-ui/icons/Delete'
import Download from '@material-ui/icons/GetApp'
import {
  CommonTableGrid,
  Button,
  Tooltip,
  Popconfirm,
  DatePicker,
} from '@/components'
// import * as service from './services'

import { downloadAttachment } from '@/services/file'

class Grid extends PureComponent {
  downloadFile = (row) => {
    downloadAttachment(row)
  }

  render () {
    const { dispatch } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='patientAttachment'
        // onRowDoubleClick={this.downloadFile}
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
            format: 'DD MMM YYYY ',
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            render: (row) => {
              return (
                <React.Fragment>
                  <Tooltip title='Download'>
                    <Button
                      size='sm'
                      onClick={() => {
                        this.downloadFile(row)
                      }}
                      justIcon
                      color='primary'
                      style={{ marginRight: 5 }}
                    >
                      <Download />
                    </Button>
                  </Tooltip>
                  <Popconfirm
                    onConfirm={() => {
                      dispatch({
                        type: 'patientAttachment/removeRow',
                        payload: {
                          id: row.id,
                        },
                      }).then(() => {
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
                </React.Fragment>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
