import React, { useState } from 'react'
import _ from 'lodash'
import { Typography, Card, Table } from 'antd'

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
import { INVOICE_ITEM_TYPE } from '@/utils/constants'

const VisitOrderTemplateRevert = props => {
  const { footer, data, confirmRevert, dispatch, ...restProps } = props
  const [enableConfirm, setEnableConfirm] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])

  const codeTableNameArray = [
    'inventorymedication',
    'ctservice',
    'inventoryconsumable',
    'ctMedicationUnitOfMeasurement',
    'ctMedicationFrequency',
    'ctgender',
    'inventoryvaccination',
    'ctvaccinationusage',
    'ctmedicationdosage',
    'ctvaccinationunitofmeasurement',
    'ctmedicationusage',
    'ctmedicationprecaution',
  ]
  dispatch({
    type: 'codetable/batchFetch',
    payload: {
      codes: codeTableNameArray,
    },
  })

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
