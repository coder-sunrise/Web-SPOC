import React, { useState } from 'react'
import _ from 'lodash'
import { Typography, Card, Table } from 'antd'
import { useEffect } from 'react'

import {
  GridContainer,
  GridItem,
  NumberInput,
  Checkbox,
  EditableTableGrid,
  notification,
  CheckboxGroup,
  CommonTableGrid,
} from '@/components'
import { INVOICE_ITEM_TYPE, ORDER_TYPES } from '@/utils/constants'
import { orderTypes } from '@/pages/Consultation/utils'

const VisitOrderTemplateRevert = props => {
  const { footer, data, confirmRevert, dispatch, open, ...restProps } = props
  const [enableConfirm, setEnableConfirm] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])

  const columns = [
    {
      name: 'inventoryItemTypeFK',
      title: 'Type',
    },
    {
      name: 'inventoryItemName',
      title: 'Name',
    },
  ]
  const tableConfig = {
    FuncProps: {
      pager: false,
      selectable: true,
      selectConfig: {
        showSelectAll: true,
        selectByRowClick: false,
        rowSelectionEnabled: () => true,
      },
    },
  }
  const colExtensions = [
    {
      columnName: 'inventoryItemTypeFK',
      width: 100,
      render: row => {
        if (INVOICE_ITEM_TYPE[row.inventoryItemTypeFK] === 'Service') {
          let type = ORDER_TYPES.SERVICE
          const otype = orderTypes.find(o => o.value === type)
          return otype.name
        }
        return INVOICE_ITEM_TYPE[row.inventoryItemTypeFK]
      },
    },
    {
      columnName: 'displayName',
    },
  ]

  const handleSelectionChange = rows => {
    setEnableConfirm(rows.length === 0)
    setSelectedRows(rows)
  }
  return (
    <div>
      <GridContainer>
        <GridItem md={12}>
          <CommonTableGrid
            size='sm'
            columns={columns}
            columnExtensions={colExtensions}
            rows={data}
            {...tableConfig}
            selection={selectedRows}
            onSelectionChange={handleSelectionChange}
          />
        </GridItem>
      </GridContainer>
      {footer({
        onConfirm: () => {
          const selectedData = data.filter(item =>
            selectedRows.includes(item.id),
          )
          confirmRevert(selectedData)
        },
        confirmBtnText: 'Revert',
        confirmProps: { disabled: enableConfirm },
      })}
    </div>
  )
}

export default VisitOrderTemplateRevert
