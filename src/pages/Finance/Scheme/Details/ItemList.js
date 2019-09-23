import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import Delete from '@material-ui/icons/Delete'
import { Tooltip } from '@material-ui/core'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  CodeSelect,
  TextField,
  NumberInput,
  Button,
  Tabs,
  Switch,
  CommonTableGrid,
  Popconfirm,
} from '@/components'
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

const ItemList = ({
  CPSwitch,
  CPNumber,
  classes,
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
    switch (type) {
      case 'inventoryconsumable':
        const inventoryConsumable = {
          uid: getUniqueId(),
          type: 1,
          itemFK: values.tempSelectedItemFK,
          inventoryConsumableFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }
        // const newConsumableValueDto = values.consumableValueDto
        // newConsumableValueDto.push(inventoryConsumable)

        addItemToRows(inventoryConsumable)

        break
      case 'inventorymedication':
        const inventoryMedication = {
          uid: getUniqueId(),
          type: 2,
          itemFK: values.tempSelectedItemFK,
          inventoryMedicationFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        // const newMedicationValueDto = values.medicationValueDto
        // newMedicationValueDto.push(inventoryMedication)

        addItemToRows(inventoryMedication)

        break
      case 'inventoryvaccination':
        const inventoryVaccination = {
          uid: getUniqueId(),
          type: 3,
          itemFK: values.tempSelectedItemFK,
          inventoryVaccinationFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        // const newVaccinationValueDto = values.vaccinationValueDto
        // newVaccinationValueDto.push(inventoryVaccination)

        addItemToRows(inventoryVaccination)

        break
      case 'ctservice':
        const ctService = {
          uid: getUniqueId(),
          type: 4,
          itemFK: values.tempSelectedItemFK,
          serviceCenterServiceFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        // const newServiceValueDto = values.serviceValueDto
        // newServiceValueDto.push(ctService)

        addItemToRows(ctService)

        break
      case 'inventorypackage':
        const inventoryPackage = {
          uid: getUniqueId(),
          type: 5,
          itemFK: values.tempSelectedItemFK,
          inventoryPackageFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemTotalPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }
        // const newPackageValueDto = values.packageValueDto
        // newPackageValueDto.push(inventoryPackage)

        addItemToRows(inventoryPackage)

        break
      default:
    }
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
              name={`rows[${row.rowIndex - 1}].${itemFKName}`}
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
                name={`packageValueDto[${row.rowIndex - 1}].itemValue`}
                render={(args) => <NumberInput {...args} />}
              /> */}
                <Field
                  name={`rows[${row.rowIndex - 1}].itemValue`}
                  render={CPNumber(
                    undefined,
                    Array.isArray(values.rows) && values.rows.length >= 1
                      ? values.rows[row.rowIndex - 1].itemValueType
                      : 'ExactAmount',
                  )}
                />
              </GridItem>
              <GridItem xs={4}>
                <Field
                  name={`rows[${row.rowIndex - 1}].itemValueType`}
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
