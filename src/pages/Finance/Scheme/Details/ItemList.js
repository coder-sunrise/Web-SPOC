import React from 'react'
import Delete from '@material-ui/icons/Delete'
import { Tooltip } from '@material-ui/core'
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
} from '@/components'
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

const ItemList = ({
  CPSwitch,
  CPNumber,
  setFieldValue,
  dispatch,
  values,
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

  const onClickAdd = (type) => {
    const itemFieldName = InventoryTypes.filter((x) => x.ctName === type)[0]
    let newItemRow = {
      uid: getUniqueId(),
      type: itemFieldName.value,
      [itemFieldName.itemFKName]: values.tempSelectedItemFK,
      itemFK: values.tempSelectedItemFK,
      unitPrice: values.tempSelectedItemSellingPrice,
      itemValueType: 'ExactAmount',
      itemValue: 0,
    }
    addItemToRows(newItemRow)
  }

  const onItemSelect = (e, option) => {
    if (e) {
      const { sellingPrice, totalPrice } = option
      // console.log('onItemSelect', option)
      setFieldValue('tempSelectedItemSellingPrice', sellingPrice)
      setFieldValue('tempSelectedItemTotalPrice', totalPrice)
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
                  onChange={(e, option) => onItemSelect(e, option)}
                  code={type}
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

  const options = () => [
    {
      id: 1,
      name: 'Consumables',
      content: addContent('inventoryconsumable'),
    },
    {
      id: 2,
      name: 'Medications',
      content: addContent('inventorymedication'),
    },
    {
      id: 3,
      name: 'Vaccines',
      content: addContent('inventoryvaccination'),
    },
    {
      id: 4,
      name: 'Services',
      content: addContent('ctservice'),
    },
    {
      id: 5,
      name: 'Packages',
      content: addContent('inventorypackage'),
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
    columnExtensions: [
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

          return (
            <FastField
              name={`rows[${row.rowIndex}].${itemFKName}`}
              render={(args) => {
                console.log(args)
                return (
                  <CodeSelect
                    text
                    labelField='displayValue'
                    code={ctName}
                    {...args}
                  />
                )
              }}
            />
          )
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
                {/* <Field
                name={`packageValueDto[${row.rowIndex }].itemValue`}
                render={(args) => <NumberInput {...args} />}
              /> */}
                <Field
                  name={`rows[${row.rowIndex}].itemValue`}
                  render={CPNumber(
                    undefined,
                    Array.isArray(values.rows) && values.rows.length >= 1
                      ? values.rows[row.rowIndex].itemValueType
                      : 'ExactAmount',
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
        render: (row) => {
          return (
            <Popconfirm
              onConfirm={() =>
                dispatch({
                  type: 'schemeDetail/deleteRow',
                  payload: {
                    id: row.uid,
                  },
                })}
              // onConfirm={() => onClickDelete(row)}
            >
              <Tooltip title='Delete'>
                <Button size='sm' color='danger' justIcon>
                  <Delete />
                </Button>
              </Tooltip>
            </Popconfirm>
          )
        },
      },
    ],
    FuncProps: {
      pager: false,
      // tree: true,
      // treeColumnConfig: {
      //   for: 'cpAmount',
      // },
    },
  }
  return (
    <div>
      <Tabs defaultActiveKey='1' options={options()} onChange={callback} />

      <CommonTableGrid rows={values.rows} {...tableConfigs} />
    </div>
  )
}

export default ItemList
