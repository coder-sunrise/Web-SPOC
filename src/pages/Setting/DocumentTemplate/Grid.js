import React, { PureComponent } from 'react'
import { Badge } from 'antd'
import htmlToText from 'html-to-text'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { status, documentTemplateTypes, documentCategorys } from '@/utils/codes'
import { Edit } from '@material-ui/icons'
import MouseOverPopover from './MouseOverPopover'

class Grid extends PureComponent {
  editRow = row => {
    const { dispatch } = this.props
    dispatch({
      type: 'settingDocumentTemplate/queryOne',
      payload: { id: row.id },
    }).then(r => {
      if (!r) return
      dispatch({
        type: 'settingDocumentTemplate/updateState',
        payload: {
          showModal: true,
          entity: {
            ...r,
            effectiveDates: [r.effectiveStartDate, r.effectiveEndDate],
          },
        },
      })
    })
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        forceRender
        style={{ margin: 0 }}
        type='settingDocumentTemplate'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        columns={[
          { name: 'documentCategoryFK', title: 'Document Category' },
          { name: 'documentTemplateTypeFK', title: 'Document Type' },
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          // { name: 'templateContent', title: 'Template Message' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        columnExtensions={[
          {
            columnName: 'documentCategoryFK',
            sortingEnabled: true,
            width: 200,
            render: row => {
              const category =
                documentCategorys.find(
                  t => t.value === row.documentCategoryFK,
                ) || {}
              return category.name
            },
          },
          {
            columnName: 'documentTemplateTypeFK',
            sortingEnabled: false,
            width: 240,
            render: row => {
              const documentTemplateType =
                documentTemplateTypes.find(
                  type => type.value === row.documentTemplateTypeFK,
                ) || {}
              return (
                <div style={{ marginTop: 1 }}>
                  <span>{documentTemplateType.name || ''}</span>
                </div>
              )
            },
          },
          {
            columnName: 'displayValue',
            sortingEnabled: true,
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            width: 100,
          },
          // {
          //   columnName: 'templateContent',
          //   render: row => {
          //     let e = document.createElement('div')
          //     e.innerHTML = row.templateContent
          //     let htmlData =
          //       e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue

          //     const templateMessageProps = {
          //       templateContent: htmlToText.fromString(htmlData),
          //     }

          //     return <MouseOverPopover {...templateMessageProps} />
          //   },
          // },
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
            render: row => {
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
