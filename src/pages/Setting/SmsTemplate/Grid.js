import React, { PureComponent } from 'react'

import Edit from '@material-ui/icons/Edit'
import htmlToText from 'html-to-text'
import { status } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import MouseOverPopover from './MouseOverPopover'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingSmsTemplate } = this.props

    const { list } = settingSmsTemplate

    dispatch({
      type: 'settingSmsTemplate/updateState',
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
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingSmsTemplate'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'templateMessage', title: 'Template Message' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        // FuncProps={{ pager: false }}
        columnExtensions={[
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            align: 'center',
            width: 100,
          },
          {
            columnName: 'code',
            width: 200,
          },
          {
            columnName: 'displayValue',
            width: 350,
          },
          {
            columnName: 'templateMessage',
            render: (row) => {
              // return htmlToText.fromString(row.templateMessage)
              const templateMessageProps = {
                templateMessage: htmlToText.fromString(row.templateMessage),
              }

              return <MouseOverPopover {...templateMessageProps} />
            },
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            align: 'center',
            width: 100,
            render: (row) => {
              return (
                <Tooltip title='Edit SMS Template' placement='top-end'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginLeft: 0 }}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
