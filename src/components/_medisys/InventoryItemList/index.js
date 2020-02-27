import React, { Fragment } from 'react'
import Delete from '@material-ui/icons/Delete'
import _ from 'lodash'
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
  notification,
  NumberInput,
  Switch,
  SizeContainer,
} from '@/components'
import { getUniqueId, currencyFormatter } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

const CPSwitch = (label) => (args) => {
  if (!args.field.value) {
    args.field.value = 'ExactAmount'
  }

  return (
    <Switch
      checkedChildren='$'
      checkedValue='ExactAmount'
      unCheckedChildren='%'
      unCheckedValue='Percentage'
      label={label}
      {...args}
    />
  )
}
const CPNumber = (label, type) => (args) => {
  return (
    <NumberInput
      label={label}
      currency={type === 'ExactAmount'}
      percentage={type === 'Percentage'}
      min={0}
      defaultValue='0.00'
      {...args}
    />
  )
}

class InventoryItemList extends React.Component {
  state = {
    currentTab: 1,
  }

  addItemToRows = (obj) => {
    const { setFieldValue, values, dispatch } = this.props
    const newRows = values.rows
    newRows.push(obj)
    setFieldValue('rows', newRows)

    // Reset field
    setFieldValue('tempSelectedItem', '')
    setFieldValue('tempSelectedItemFK', '')
    setFieldValue('tempSelectedItemSellingPrice', '')
    setFieldValue('tempSelectedItemTotalPrice', '')
    dispatch({
      type: 'global/incrementCommitCount',
    })
  }

  showConfirmationBox = (existingItemArray, newItemArray) => {
    const { dispatch } = this.props

    const medicationArray = existingItemArray.filter(
      (item) => item.inventoryMedicationFK,
    )
    const consumableArray = existingItemArray.filter(
      (item) => item.inventoryConsumableFK,
    )
    const vaccinationArray = existingItemArray.filter(
      (item) => item.inventoryVaccinationFK,
    )
    const serviceArray = existingItemArray.filter(
      (item) => item.serviceCenterServiceFK,
    )

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Order set item(s) are already in the list and will not be added.`,
        alignContent: 'left',
        additionalInfo: (
          <div>
            <ul style={{ listStylePosition: 'inside' }}>
              {medicationArray.length > 0 && (
                <Fragment>
                  {medicationArray.map((item) => (
                    <li>
                      <b>{item.medicationName}</b>
                    </li>
                  ))}
                </Fragment>
              )}
              {consumableArray.length > 0 && (
                <Fragment>
                  {consumableArray.map((item) => (
                    <li>
                      <b>{item.consumableName}</b>
                    </li>
                  ))}
                </Fragment>
              )}
              {vaccinationArray.length > 0 && (
                <Fragment>
                  {vaccinationArray.map((item) => (
                    <li>
                      <b>{item.vaccinationName}</b>
                    </li>
                  ))}
                </Fragment>
              )}
              {serviceArray.length > 0 && (
                <Fragment>
                  {serviceArray.map((item) => (
                    <li>
                      <b>{item.serviceName}</b>
                    </li>
                  ))}
                </Fragment>
              )}
            </ul>
          </div>
        ),
        onConfirmSave: () => {
          this.addOrderSetItemToRows(newItemArray)
        },
      },
    })
  }

  addOrderSetItemToRows = (newItemArray) => {
    newItemArray.map((item) => {
      const itemFieldName = InventoryTypes.filter(
        (x) => x.value === item.type,
      )[0]
      const typeFieldName = item[itemFieldName.field]
      let newItemRow = {
        uid: getUniqueId(),
        type: itemFieldName.value,
        [itemFieldName.itemFKName]:
          item.type === 4 ? item.serviceCenterServiceFK : typeFieldName.id,
        itemFK:
          item.type === 4 ? item.serviceCenterServiceFK : typeFieldName.id,
        unitPrice:
          item.type === 4 ? item.unitPrice : typeFieldName.sellingPrice,
        name: item.type === 4 ? item.serviceName : typeFieldName.displayValue,
        itemValueType: 'ExactAmount',
        itemValue: 0,
        quantity: item.quantity,
      }

      this.addItemToRows(newItemRow)
      return item
    })
  }

  checkOrderSetItemIsExisted = (
    orderSetItemArray,
    fieldName,
    existingRows,
    type,
  ) => {
    let existingItem = []

    const filteredRows = existingRows
      .filter((row) => !row.isDeleted && row.type === type)
      .map((row) => row.itemFK)

    const updatedItemArray = orderSetItemArray.map((row) => {
      if (filteredRows.includes(row[fieldName])) {
        existingItem.push(row)
        return null
      }
      return {
        ...row,
        type,
      }
    })
    console.log({ updatedItemArray })

    return [
      existingItem,
      updatedItemArray,
    ]
  }

  onClickAdd = (type) => {
    const { currentTab } = this.state
    const { values } = this.props
    const {
      tempSelectedItem,
      rows,
      tempSelectedItemFK,
      tempSelectedItemSellingPrice,
      tempSelectedItemName,
    } = values
    if (tempSelectedItemFK === undefined) return
    console.log(tempSelectedItem, rows, currentTab)

    let itemFieldName
    let existingItem = []
    let newItem = []
    if (currentTab === 5) {
      const {
        medicationOrderSetItem,
        consumableOrderSetItem,
        vaccinationOrderSetItem,
        serviceOrderSetItem,
      } = tempSelectedItem

      const [
        existingMedicationItem,
        newMedicationItem,
      ] = this.checkOrderSetItemIsExisted(
        medicationOrderSetItem,
        'inventoryMedicationFK',
        rows,
        1,
      )

      existingItem.push(...existingMedicationItem)
      newItem.push(...newMedicationItem.filter((item) => item !== null))

      const [
        existingConsumableItem,
        newConsumableItem,
      ] = this.checkOrderSetItemIsExisted(
        consumableOrderSetItem,
        'inventoryConsumableFK',
        rows,
        2,
      )

      existingItem.push(...existingConsumableItem)
      newItem.push(...newConsumableItem.filter((item) => item !== null))

      const [
        existingVaccinationItem,
        newVaccinationItem,
      ] = this.checkOrderSetItemIsExisted(
        vaccinationOrderSetItem,
        'inventoryVaccinationFK',
        rows,
        3,
      )

      existingItem.push(...existingVaccinationItem)
      newItem.push(...newVaccinationItem.filter((item) => item !== null))

      const [
        existingServiceItem,
        newServiceItem,
      ] = this.checkOrderSetItemIsExisted(
        serviceOrderSetItem,
        'serviceCenterServiceFK',
        rows,
        4,
      )

      existingItem.push(...existingServiceItem)
      newItem.push(...newServiceItem.filter((item) => item !== null))

      console.log({ existingItem, newItem })

      if (existingItem.length > 0) {
        this.showConfirmationBox(existingItem, newItem)
      } else {
        this.addOrderSetItemToRows(newItem)
      }
    } else {
      const isExisted = rows
        .filter((row) => !row.isDeleted && row.type === currentTab)
        .map((row) => row.itemFK)
        .includes(tempSelectedItemFK)

      if (isExisted) {
        notification.error({ message: 'Item is already in the list' })
        return
      }

      itemFieldName = InventoryTypes.filter((x) => x.ctName === type)[0]
      let newItemRow = {
        uid: getUniqueId(),
        type: itemFieldName.value,
        [itemFieldName.itemFKName]: tempSelectedItemFK,
        itemFK: tempSelectedItemFK,
        unitPrice: tempSelectedItemSellingPrice,
        name: tempSelectedItemName,
        itemValueType: 'ExactAmount',
        quantity: 1,
        itemValue: 0,
      }
      this.addItemToRows(newItemRow)
    }
  }

  onItemSelect = (e, option, type) => {
    const { setFieldValue } = this.props
    console.log(e, option, type)
    setFieldValue('tempSelectedItemName', option.displayValue)
    setFieldValue('tempSelectedItem', option)
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

  addContent = (type) => {
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
                  onChange={(e, option) => this.onItemSelect(e, option, type)}
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
          <Button
            color='primary'
            // disabled={this.props.values.tempSelectedItemFK === undefined}
            onClick={() => this.onClickAdd(type)}
          >
            Add
          </Button>
        </GridItem>
      </GridContainer>
    )
  }

  onDeleteClick = (row) => {
    const { values, setFieldValue, dispatch } = this.props
    const newRows = values.rows.map(
      (item) =>
        item.itemFK === row.itemFK ? { ...item, isDeleted: true } : { ...item },
    )
    setFieldValue('rows', newRows)
    dispatch({
      type: 'global/incrementCommitCount',
    })
  }

  onTabChange = (tabId) => {
    const { setFieldValue } = this.props
    setFieldValue('tempSelectedItemFK', undefined)
    this.setState({
      currentTab: parseInt(tabId, 10),
    })
  }

  getOptions = () => {
    const commonOptions = [
      {
        id: 1,
        name: 'Medication',
        content: this.addContent('inventorymedication'),
      },
      {
        id: 2,
        name: 'Consumable',
        content: this.addContent('inventoryconsumable'),
      },
      {
        id: 3,
        name: 'Vaccination',
        content: this.addContent('inventoryvaccination'),
      },
      {
        id: 4,
        name: 'Service',
        content: this.addContent('ctservice'),
      },
    ]

    if (this.props.includeOrderSet) {
      return [
        ...commonOptions,
        {
          id: 5,
          name: 'Order Set',
          content: this.addContent('inventoryorderset'),
        },
      ]
    }

    return commonOptions
  }

  getColumns = () => {
    const commonColumns = [
      { name: 'type', title: 'Type' },
      { name: 'itemFK', title: 'Item' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'action', title: 'Actions' },
    ]

    if (this.props.includeOrderSet) {
      commonColumns.splice(2, 0, {
        name: 'quantity',
        title: 'Quantity',
      })
      commonColumns.splice(commonColumns.length - 1, 0, {
        name: 'amount',
        title: 'Amount',
      })
    } else {
      commonColumns.splice(commonColumns.length - 1, 0, {
        name: 'cpAmount',
        title: 'Co-Pay Amount',
      })
    }

    return commonColumns
  }

  getColumnsExtensions = (values) => {
    const commonExtensions = [
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
        columnName: 'action',
        align: 'center',
        render: (row) => {
          const onConfirm = () => this.onDeleteClick(row)
          return (
            <Popconfirm onConfirm={onConfirm}>
              <Tooltip title='Delete'>
                <Button size='sm' color='danger' justIcon>
                  <Delete />
                </Button>
              </Tooltip>
            </Popconfirm>
          )
        },
      },
    ]

    if (this.props.includeOrderSet) {
      commonExtensions.splice(
        commonExtensions.length - 1,
        0,
        {
          columnName: 'quantity',
          type: 'number',
          render: (row) => {
            const { rows = [] } = values
            const index = rows.map((i) => i.uid).indexOf(row.uid)
            return (
              <Field
                name={`rows[${index}].quantity`}
                render={(args) => (
                  <NumberInput {...args} min={1} precision={0} />
                )}
              />
            )
          },
        },
        {
          columnName: 'unitPrice',
          type: 'currency',
          render: (row) => {
            const { rows = [] } = values
            const index = rows.map((i) => i.uid).indexOf(row.uid)
            return (
              <Field
                name={`rows[${index}].unitPrice`}
                render={(args) => <NumberInput {...args} currency />}
              />
            )
          },
        },
        {
          columnName: 'amount',
          type: 'currency',
          render: (row) => {
            return (
              <p
                style={{
                  color: 'darkblue',
                  fontWeight: 500,
                }}
              >
                {currencyFormatter(row.unitPrice * row.quantity)}
              </p>
            )
          },
        },
      )
    } else {
      commonExtensions.splice(
        commonExtensions.length - 1,
        0,
        {
          columnName: 'quantity',
          type: 'number',
        },
        {
          columnName: 'unitPrice',
          type: 'currency',
        },
        {
          columnName: 'cpAmount',
          render: (row) => {
            const { rows = [] } = values
            const index = rows.map((i) => i.uid).indexOf(row.uid)
            return (
              <GridContainer>
                <GridItem xs={8}>
                  <Field
                    name={`rows[${index}].itemValue`}
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
                    name={`rows[${index}].itemValueType`}
                    render={CPSwitch(undefined)}
                  />
                </GridItem>
              </GridContainer>
            )
          },
        },
      )
    }

    return commonExtensions
  }

  render () {
    const { theme, values } = this.props
    return (
      <SizeContainer size='sm'>
        <div style={{ marginTop: theme.spacing(1) }}>
          <Tabs
            defaultActiveKey='1'
            onChange={this.onTabChange}
            options={this.getOptions()}
          />
          <CommonTableGrid
            rows={values.rows}
            // {...tableConfigs}
            getRowId={(r) => r.uid}
            columns={this.getColumns()}
            columnExtensions={this.getColumnsExtensions(values)}
            FuncProps={{
              pager: false,
            }}
          />
        </div>
      </SizeContainer>
    )
  }
}

export default InventoryItemList
