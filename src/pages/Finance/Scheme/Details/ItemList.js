import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
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
import Delete from '@material-ui/icons/Delete'
import { Tooltip } from '@material-ui/core'
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

const ItemList = ({
  CPSwitch,
  CPNumber,
  classes,
  setFieldValue,
  dispatch,
  ...props
}) => {
  console.log('ItemList', props)
  const [
    values,
    setValues,
  ] = useState({})

  const [
    itemRows,
    setItemRows,
  ] = useState([])

  useEffect(
    () => {
      setValues(props.values || {})
      const { entity } = props.schemeDetail
      if (entity) {
        setFieldValue('rows', entity.rows)
      }
    },
    [
      props.values,
    ],
  )

  useEffect(
    () => {
      const { entity } = props.schemeDetail
      if (entity) {
        setItemRows(entity.rows || [])
      }
      console.log('useEffect', entity)
    },
    [
      props.schemeDetail.entity,
    ],
  )

  function callback (key) {
    console.log('key', key)
  }

  function onClickDelete (row) {
    console.log('onClickDelete', row)
    console.log('onClickDelete2', values)
  }

  const addItemToRows = (obj) => {
    const newRows = values.rows
    newRows.push(obj)
    setFieldValue('rows', newRows)
  }

  const onClickAdd = (type) => {
    switch (type) {
      case 'InventoryConsumable':
        const inventoryConsumable = {
          uid: getUniqueId(),
          type: 1,
          itemFK: values.tempSelectedItemFK,
          inventoryConsumableFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }
        //const newConsumableValueDto = values.consumableValueDto
        //newConsumableValueDto.push(inventoryConsumable)

        addItemToRows(inventoryConsumable)

        break
      case 'InventoryMedication':
        const inventoryMedication = {
          uid: getUniqueId(),
          type: 2,
          itemFK: values.tempSelectedItemFK,
          inventoryMedicationFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        //const newMedicationValueDto = values.medicationValueDto
        //newMedicationValueDto.push(inventoryMedication)

        addItemToRows(inventoryMedication)

        break
      case 'InventoryVaccination':
        const inventoryVaccination = {
          uid: getUniqueId(),
          type: 3,
          itemFK: values.tempSelectedItemFK,
          inventoryVaccinationFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        //const newVaccinationValueDto = values.vaccinationValueDto
        //newVaccinationValueDto.push(inventoryVaccination)

        addItemToRows(inventoryVaccination)

        break
      case 'ctService':
        const ctService = {
          uid: getUniqueId(),
          type: 4,
          itemFK: values.tempSelectedItemFK,
          serviceCenterServiceFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemSellingPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }

        //const newServiceValueDto = values.serviceValueDto
        //newServiceValueDto.push(ctService)

        addItemToRows(ctService)

        break
      case 'InventoryPackage':
        const inventoryPackage = {
          uid: getUniqueId(),
          type: 5,
          itemFK: values.tempSelectedItemFK,
          inventoryPackageFK: values.tempSelectedItemFK,
          unitPrice: values.tempSelectedItemTotalPrice,
          itemValueType: 'ExactAmount',
          itemValue: 0,
        }
        //const newPackageValueDto = values.packageValueDto
        //newPackageValueDto.push(inventoryPackage)

        addItemToRows(inventoryPackage)

        break
      default:
    }
  }

  const onItemSelect = (e, option) => {
    if (e) {
      const { sellingPrice, totalPrice } = option
      console.log('onItemSelect', e)
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
                  onChange={(e, option) =>
                    onItemSelect(e, option, setFieldValue)}
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
      content: addContent('InventoryConsumable'),
    },
    {
      id: 2,
      name: 'Medications',
      content: addContent('InventoryMedication'),
    },
    {
      id: 3,
      name: 'Vaccines',
      content: addContent('InventoryVaccination'),
    },
    {
      id: 4,
      name: 'Services',
      content: addContent('ctService'),
    },
    {
      id: 5,
      name: 'Packages',
      content: addContent('InventoryPackage'),
    },
  ]

  const tableConfigs = {
    columns: [
      { name: 'type', title: 'Type' },
      { name: 'itemFK', title: 'Item' },
      { name: 'inventoryConsumableFK', title: 'dev:ItemFK' },
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
        type: 'codeSelect',
        code: 'InventoryConsumable',
        labelField: 'displayValue',
        valueField: 'id',
      },
      {
        columnName: 'inventoryConsumableFK',
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
                    ' ',
                    Array.isArray(values.consumableValueDto) &&
                    values.consumableValueDto.length >= 1
                      ? values.consumableValueDto[row.rowIndex - 1]
                          .itemValueType
                      : 'ExactAmount',
                  )}
                />
              </GridItem>
              <GridItem xs={4}>
                <Field
                  name={`rows[${row.rowIndex - 1}].itemValueType`}
                  render={CPSwitch}
                />
              </GridItem>
            </GridContainer>
          )
        },
      }, //
      {
        columnName: 'action',
        align: 'center',
        render: (row) => {
          return (
            <Popconfirm
              // onConfirm={() =>
              //   dispatch({
              //     type: 'schemeDetail/deleteRow',
              //     payload: {
              //       id: row.uid,
              //     },
              //   })}
              onConfirm={() => onClickDelete(row)}
            >
              <Tooltip title='Delete'>
                <Button size='sm' color='danger' justIcon>
                  <Delete />
                </Button>
              </Tooltip>
            </Popconfirm>

            // <Button
            //   //onClick={() => onClickDelete(row)}
            //   onClick={() => onClickDelete(row)}
            //   //onClick={(e) => {
            //   // updateGlobalVariable('gridIgnoreValidation', true)
            //   // onExecute(e)
            //   //}}
            //   justIcon
            //   color='danger'
            //   title='Delete'
            // >
            //   <Delete />
            // </Button>
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
