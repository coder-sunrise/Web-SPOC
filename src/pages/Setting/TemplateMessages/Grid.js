import React, { PureComponent } from 'react'

import { CommonTableGrid, Button, Tooltip } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import * as service from './services'
import htmlToText from 'html-to-text'
import MouseOverPopover from './MouseOverPopover'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingTemplateMessage } = this.props

    const { list } = settingTemplateMessage

    dispatch({
      type: 'settingTemplateMessage/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  getTooltipTitle = () => {
    const pathname = window.location.pathname.trim().toLowerCase()

    const modalTitle =
      pathname == '/setting/smstemplate'
        ? 'SMS Template'
        : 'Referral Letter Template'

    return `Edit ${modalTitle}`
  }

  render () {
    const { classes } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingTemplateMessage'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'templateMessage', title: 'Template Message' },
          { name: 'effectiveStartDate', title: 'Effective Start Date' },
          { name: 'effectiveEndDate', title: 'Effective End Date' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        // FuncProps={{ pager: false }}
        columnExtensions={[
          {
            columnName: 'templateMessage',
            render: (row) => {
              //return htmlToText.fromString(row.templateMessage)
              const templateMessageProps = {
                templateMessage: htmlToText.fromString(row.templateMessage),
              }

              return <MouseOverPopover {...templateMessageProps} />
            },
          },
          {
            columnName: 'effectiveStartDate',
            type: 'date',
            format: 'DD MMM YYYY',
          },
          {
            columnName: 'effectiveEndDate',
            type: 'date',
            format: 'DD MMM YYYY',
          },
          {
            columnName: 'action',
            sortingEnabled: false,
            align: 'center',
            render: (row) => {
              return (
                <Tooltip title={this.getTooltipTitle()} placement='top-end'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
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
