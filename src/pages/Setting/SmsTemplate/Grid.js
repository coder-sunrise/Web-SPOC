import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip, dateFormatLong } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'
import htmlToText from 'html-to-text'
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
    const { classes } = this.props
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
            columnName: 'displayValue',
            width: 500,
          },
          {
            columnName: 'templateMessage',
            width: 500,
            render: (row) => {
              // return htmlToText.fromString(row.templateMessage)
              const templateMessageProps = {
                templateMessage: htmlToText.fromString(row.templateMessage),
              }

              return <MouseOverPopover {...templateMessageProps} />
            },
          },
          {
            columnName: 'effectiveStartDate',
            sortingEnabled: false,
            width: 130,
            type: 'date',
            format: { dateFormatLong },
          },
          {
            columnName: 'effectiveEndDate',
            sortingEnabled: false,
            width: 130,
            type: 'date',
            format: { dateFormatLong },
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            align: 'center',
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
