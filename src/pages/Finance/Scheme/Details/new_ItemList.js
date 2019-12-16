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
  notification,
} from '@/components'
import { getUniqueId } from '@/utils/utils'
import { InventoryTypes } from '@/utils/codes'

class ItemList extends React.Component {
  state = {
    currentTab: 1,
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
    const { currentTab } = this.state
    const { values } = this.props
    if (values.tempSelectedItemFK === undefined) return
    const isExisted = values.rows
      .filter((row) => !row.isDeleted && row.type === currentTab)
      .map((row) => row.itemFK)
      .includes(values.tempSelectedItemFK)

    if (isExisted) {
      notification.error({ message: 'Item is already in the list' })
      return
    }

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

    this.addItemToRows(newItemRow)
  }

  onItemSelect = (e, option, type) => {
    const { setFieldValue } = this.props

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
    const { values, setFieldValue } = this.props
    const newRows = values.rows.map(
      (item) =>
        item.itemFK === row.itemFK ? { ...item, isDeleted: true } : { ...item },
    )
    setFieldValue('rows', newRows)
  }

  onTabChange = (tabId) => {
    const { setFieldValue } = this.props
    setFieldValue('tempSelectedItemFK', undefined)
    this.setState({
      currentTab: parseInt(tabId, 10),
    })
  }

  render () {
    const { theme, CPSwitch, CPNumber, values } = this.props
    return (
      <div style={{ marginTop: theme.spacing(1) }}>
        <Tabs
          defaultActiveKey='1'
          onChange={this.onTabChange}
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
          rows={values.rows}
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
                // const index = values.rows
                //   .map((i) => i.itemFK)
                //   .indexOf(row.itemFK)
                // console.log({ row, index, rows: values.rows })
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
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </div>
    )
  }
}

export default ItemList
