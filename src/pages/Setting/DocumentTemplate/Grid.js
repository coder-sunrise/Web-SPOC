import React, { PureComponent } from 'react'
import htmlToText from 'html-to-text'
import { CommonTableGrid, Button, Tooltip, CodeSelect } from '@/components'
import { status } from '@/utils/codes'
import { Edit, DescriptionOutlined } from '@material-ui/icons'
import MouseOverPopover from './MouseOverPopover'

class Grid extends PureComponent {
  editRow = (row) => {
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

  render () {
    return (
      <CommonTableGrid
        forceRender
        style={{ margin: 0 }}
        type='settingDocumentTemplate'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'documentTemplateTypeFK', title: 'Document Type' },
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'templateContent', title: 'Template Message' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        columnExtensions={[
          {
            columnName: 'documentTemplateTypeFK',
            sortingEnabled: false,
            width: 240,
            render: (row) => {
              return (
                <div style={{ display: 'flex' }}>
                  {row.isDefaultTemplate && (
                    <div style={{ height: 24 }}>
                      <Tooltip title='Default vaccination template'>
                        <DescriptionOutlined
                          color='primary'
                          style={{ height: 24, width: 24 }}
                        />
                      </Tooltip>
                    </div>
                  )}
                  <div>
                    <CodeSelect
                      label=''
                      text
                      value={row.documentTemplateTypeFK}
                      code='LTDocumentTemplateType'
                    />
                  </div>
                </div>
              )
            },
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            width: 100,
          },
          {
            columnName: 'templateContent',
            render: (row) => {
              let e = document.createElement('div')
              e.innerHTML = row.templateContent
              let htmlData =
                e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

              const templateMessageProps = {
                templateContent: htmlToText.fromString(htmlData),
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
                    style={{ marginRight: 0 }}
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
