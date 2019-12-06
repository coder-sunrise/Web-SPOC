import React from 'react'
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

class ItemList extends React.Component {
  state = {
    itemList: [
      ...this.props.values.rows,
    ],
  }

  addItemToRows = (obj) => {
    const { setFieldValue, values } = this.props
    const newRows = values.rows
    newRows.push(obj)
    setFieldValue('rows', newRows)

    // Reset field
    setFieldValue('tempSelectedItemFK', '')
    setFieldValue('tempSelectedItemSellingPrice', '')
    setFieldValue('tempSelectedItemTotalPrice', '')
  }

  onClickAdd = (type) => {
    const { setFieldValue, values } = this.props

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
    console.log({})
    this.addItemToRows(newItemRow)
  }

  onItemSelect = (e, option, type) => {
    const { setFieldValue, values } = this.props

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
          <Button color='primary' onClick={() => this.onClickAdd(type)}>
            Add
          </Button>
        </GridItem>
      </GridContainer>
    )
  }

  onDeleteClick = (row) => {
    const { itemList } = this.state
    const { values } = this.props
    const deletedRow = itemList.find((o) => o.itemFK === row.itemFK)
    console.log({ deletedRow, itemList, rows: values.rows, row })
    // if (deletedRow) {
    //   deletedRow.isDeleted = true
    // }
    // const newRows = itemList.filter(
    //   (o) => o.isDeleted === false || o.isDeleted === undefined,
    // )
    // setItemList(newRows)
  }

  render () {
    const { theme, CPSwitch, CPNumber } = this.props
    const { itemList } = this.state
    return (
      <div style={{ marginTop: theme.spacing(1) }}>
        <Tabs
          defaultActiveKey='1'
          options={[
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
            {
              id: 5,
              name: 'Package',
              content: this.addContent('inventorypackage'),
            },
          ]}
        />

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
              render: (row) => {
                console.log({ row })
                return (
                  <Popconfirm
                    onConfirm={() => {
                      const deletedRow = itemList.find(
                        (o) => o.itemFK === row.itemFK,
                      )
                      console.log({ itemList })
                      this.onDeleteClick(row)
                      // if (deletedRow) {
                      //   deletedRow.isDeleted = true
                      // }
                      // const newRows = itemList.filter(
                      //   (o) => o.isDeleted === false || o.isDeleted === undefined,
                      // )
                      // setItemList(newRows)
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
            },
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </div>
    )
  }
}
