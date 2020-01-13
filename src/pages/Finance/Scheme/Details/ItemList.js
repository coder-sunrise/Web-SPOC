import React, { useState, useEffect, useCallback } from 'react'
import Delete from '@material-ui/icons/Delete'
import {
  Field,
  FastField,
  GridContainer,
  GridItem,
  CodeSelect,
  Button,
  Tabs,
  CommonTableGrid,
  Popconfirm,
  Tooltip,
} from '@/components'
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

const ItemList = ({
  CPSwitch,
  CPNumber,
  setFieldValue,
  dispatch,
  values,
  setValues,
  theme,
  // ...props
}) => {
  function callback (key) {
    console.log('key', key)
  }

  const addItemToRows = (obj) => {
    const newRows = values.rows
    newRows.push(obj)
    setFieldValue('rows', newRows)

    // Reset field
    setFieldValue('tempSelectedItemFK', '')
    setFieldValue('tempSelectedItemSellingPrice', '')
    setFieldValue('tempSelectedItemTotalPrice', '')
  }

  const [
    itemList,
    setItemList,
  ] = useState(values.rows)

  useEffect(
    () => {
      console.log('set item list')
      setItemList(values.rows)
    },
    [
      values,
    ],
  )

  const onClickAdd = (type) => {
    const itemFieldName = InventoryTypes.filter((x) => x.ctName === type)[0]
    let newItemRow = {
      uid: getUniqueId(),
      type: itemFieldName.value,
      [itemFieldName.itemFKName]: values.tempSelectedItemFK,
      itemFK: values.tempSelectedItemFK,
      unitPrice: values.tempSelectedItemSellingPrice,
      name: values.tempSelectedItemName,
      itemValueType: 'ExactAmount',
      itemValue: 0,
    }

    addItemToRows(newItemRow)
  }

  const onItemSelect = (e, option, type) => {
    setFieldValue('tempSelectedItemName', option.displayValue)
    if (e && type !== 'ctservice') {
      const { sellingPrice, totalPrice } = option
      // console.log('onItemSelect', option)
      setFieldValue('tempSelectedItemSellingPrice', sellingPrice)
      setFieldValue('tempSelectedItemTotalPrice', totalPrice)
    }

    if (e && type === 'ctservice') {
      const { unitPrice } = option
      setFieldValue('tempSelectedItemSellingPrice', unitPrice)
    }
  }

  const addContent = (type) => {
    return (
      <GridContainer>
        <GridItem xs={8}>
          <FastField
            name='tempSelectedItemFK'
            render={(args) => {
              return (
                <CodeSelect
                  labelField='displayValue'
                  valueField={
                    type === 'ctservice' ? 'serviceCenter_ServiceId' : 'id'
                  }
                  onChange={(e, option) => onItemSelect(e, option, type)}
                  code={type}
                  renderDropdown={(option) => {
                    let suffix = ''
                    if (type === 'ctservice') {
                      suffix = option.serviceCenter
                        ? `(${option.serviceCenter})`
                        : ''
                    }
                    return (
                      <span>
                        {option.displayValue}&nbsp;
                        {suffix}
                      </span>
                    )
                  }}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <Button color='primary' onClick={() => onClickAdd(type)}>
            Add
          </Button>
        </GridItem>
      </GridContainer>
    )
  }

  const onDeleteClick = useCallback(
    (row) => {
      const deletedRow = itemList.find((o) => o.itemFK === row.itemFK)
      console.log({ deletedRow, itemList, rows: values.rows, row })
      // if (deletedRow) {
      //   deletedRow.isDeleted = true
      // }
      // const newRows = itemList.filter(
      //   (o) => o.isDeleted === false || o.isDeleted === undefined,
      // )
      // setItemList(newRows)
    },
    [
      itemList,
      values.rows,
    ],
  )

  const options = () => [
    {
      id: 1,
      name: 'Medication',
      content: addContent('inventorymedication'),
    },
    {
      id: 2,
      name: 'Consumable',
      content: addContent('inventoryconsumable'),
    },
    {
      id: 3,
      name: 'Vaccination',
      content: addContent('inventoryvaccination'),
    },
    {
      id: 4,
      name: 'Service',
      content: addContent('ctservice'),
    },
    {
      id: 5,
      name: 'OrderSet',
      content: addContent('inventoryOrderSet'),
    },
  ]

  const tableConfigs = {
    getRowId: (r) => r.uid,
    columns: [
      { name: 'type', title: 'Type' },
      { name: 'itemFK', title: 'Item' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'cpAmount', title: 'Co-Pay Amount' },
      { name: 'action', title: 'Actions' },
    ],
    // columnExtensions: ,
  }

  const renderDeleteButton = useCallback(
    (row) => {
      console.log({ row })
      return (
        <Popconfirm
          onConfirm={() => {
            const deletedRow = itemList.find((o) => o.itemFK === row.itemFK)
            // console.log({ itemList })
            // onDeleteClick(row)
            if (deletedRow) {
              deletedRow.isDeleted = true
            }
            const newRows = itemList.filter(
              (o) => o.isDeleted === false || o.isDeleted === undefined,
            )
            setItemList(newRows)
            // dispatch({
            //   type: 'schemeDetail/deleteRow',
            //   payload: {
            //     id: row.uid,
            //   },
            // })
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
    [
      itemList,
      values.rows,
    ],
  )

  return (
    <div style={{ marginTop: theme.spacing(1) }}>
      <Tabs defaultActiveKey='1' options={options()} onChange={callback} />

      <CommonTableGrid
        rows={itemList}
        // {...tableConfigs}
        getRowId={(r) => r.uid}
        columns={[
          { name: 'type', title: 'Type' },
          { name: 'itemFK', title: 'Item' },
          { name: 'unitPrice', title: 'Unit Price' },
          { name: 'cpAmount', title: 'Co-Pay Amount' },
          { name: 'action', title: 'Actions' },
        ]}
        columnExtensions={[
          {
            columnName: 'type',
            type: 'select',
            options: InventoryTypes,
          },
          {
            columnName: 'itemFK',
            render: (row) => {
              const inventory = InventoryTypes.filter(
                (x) => x.value === row.type,
              )[0]
              const { ctName, itemFKName } = inventory
              return row.name ? row.name : ''
            },
          },
          {
            columnName: 'unitPrice',
            type: 'currency',
          },
          {
            columnName: 'cpAmount',
            render: (row) => {
              return (
                <GridContainer>
                  <GridItem xs={8}>
                    <Field
                      name={`rows[${row.rowIndex}].itemValue`}
                      render={CPNumber(
                        undefined,
                        row.itemValueType === 'ExactAmount'
                          ? 'ExactAmount'
                          : 'Percentage',
                      )}
                    />
                  </GridItem>
                  <GridItem xs={4}>
                    <Field
                      name={`rows[${row.rowIndex}].itemValueType`}
                      render={CPSwitch(undefined)}
                    />
                  </GridItem>
                </GridContainer>
              )
            },
          },
          {
            columnName: 'action',
            align: 'center',
            render: renderDeleteButton,
          },
        ]}
        FuncProps={{
          pager: false,
        }}
      />
    </div>
  )
}

export default ItemList
