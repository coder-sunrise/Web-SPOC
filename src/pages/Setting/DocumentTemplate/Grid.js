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
    const { classes } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingDocumentTemplate'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'documentTemplateTypeFK', title: 'Document Type' },
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'templateContent', title: 'Template Message' },
          { name: 'isActive', title: 'Status' },
          // { name: 'effectiveStartDate', title: 'Effective Start Date' },
          // { name: 'effectiveEndDate', title: 'Effective End Date' },

          {
            name: 'action',
            title: 'Action',
          },
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
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
          },
          {
            columnName: 'templateContent',
            render: (row) => {
              //return htmlToText.fromString(row.templateMessage)
              const templateMessageProps = {
                templateContent: htmlToText.fromString(row.templateContent),
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
            alignContent: 'center',
            alignItems: 'center',
            justify: 'center',
            render: (row) => {  
              return (
                <Tooltip title='Edit Document Template' placement='top-end'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 0}}
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
