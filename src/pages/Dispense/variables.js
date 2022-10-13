import moment from 'moment'
import Print from '@material-ui/icons/Print'
import { FileCopySharp } from '@material-ui/icons'
import { FormattedMessage } from 'umi'
import numeral from 'numeral'
import _ from 'lodash'
import { currencySymbol, currencyFormat } from '@/utils/config'
import { Space, Checkbox } from 'antd'
import {
  NumberInput,
  TextField,
  FastField,
  DatePicker,
  Button,
  Tooltip,
  CodeSelect,
} from '@/components'
import LowStockInfo from '@/pages/Widgets/Orders/Detail/LowStockInfo'
import { InventoryTypes, orderItemTypes } from '@/utils/codes'
import CONSTANTS from './DispenseDetails/constants'
import Cross from '@material-ui/icons/HighlightOff'
import { UnorderedListOutlined, CheckOutlined } from '@ant-design/icons'
import Authorized from '@/utils/Authorized'
export const tableConfig = {
  FuncProps: { pager: false },
}

const ServiceTypes = ['Service', 'Consumable', 'Treatment']

const iconStyle = {
  position: 'relative',
  borderRadius: 4,
  fontWeight: 500,
  color: 'white',
  fontSize: '0.7rem',
  padding: '2px 3px',
  height: 20,
  display: 'inline-block',
  margin: '0px 1px',
  lineHeight: '16px',
}

const showMoney = (v = 0) => {
  if (v < 0)
    return (
      <span
        style={{ fontWeight: 500, color: 'red' }}
      >{`(${currencySymbol}${numeral(v * -1.0).format('0.00')})`}</span>
    )
  return (
    <span
      style={{ fontWeight: 500, color: 'darkblue' }}
    >{`${currencySymbol}${numeral(v).format('0.00')}`}</span>
  )
}

const getBatchOptions = row => {
  let stockList = []
  if (row.type === 'Consumable') {
    stockList = (row.consumableStock || []).filter(
      s =>
        s.isDefault ||
        (s.stock > 0 &&
          (!s.expiryDate ||
            moment(s.expiryDate).startOf('day') >= moment().startOf('day'))),
    )
  }

  stockList = _.orderBy(stockList, ['expiryDate'], ['asc'])

  if (row.stockFK) {
    const selectStock = stockList.find(sl => sl.id === row.stockFK)
    if (!selectStock) {
      return [
        {
          id: row.stockFK,
          batchNo: row.batchNo,
          expiryDate: row.expiryDate,
          isDefault: row.isDefault,
        },
        ...stockList,
      ]
    } else {
      return [
        { ...selectStock },
        ...stockList.filter(sl => sl.id !== row.stockFK),
      ]
    }
  }
  return stockList
}

export const getRowId = (r, idPrefix) => {
  const suffix = r.type
  if (idPrefix === 'OtherOrders') {
    const itemFK = r.invoiceItemFK || r.sourceFK
    return `${idPrefix}-${r.id}-${itemFK}-${suffix}`
  }
  return `${idPrefix}-${r.id}-${suffix}`
}

const columnWidth = '10%'

const lowStockIndicator = (row, itemIdFieldName, right) => {
  const currentType = InventoryTypes.find(type => type.name === row.type)
  if (!currentType) return null

  const values = {
    [currentType.itemFKName]: row[itemIdFieldName],
  }
  return (
    <LowStockInfo
      sourceType={currentType.name.toLowerCase()}
      values={values}
      right={right}
      style={{}}
    />
  )
}

export const DispenseItemsColumns = [
  { name: 'dispenseGroupId', title: '' },
  {
    name: 'isCheckActualize',
    title: ' ',
  },
  {
    name: 'type',
    title: 'Type',
  },
  { name: 'code', title: 'Code' },
  {
    name: 'name',
    title: 'Name',
  },
  { name: 'dispenseUOM', title: 'UOM' },
  {
    name: 'quantity',
    title: (
      <div>
        <p style={{ height: 16 }}>Ordered</p>
        <p style={{ height: 16 }}>Qty.</p>
      </div>
    ),
  },
  {
    name: 'dispenseQuantity',
    title: (
      <div>
        <p style={{ height: 16 }}>Dispensed</p>
        <p style={{ height: 16 }}>Qty.</p>
      </div>
    ),
  },
  {
    name: 'stock',
    title: 'Stock Qty.',
  },
  {
    name: 'stockFK',
    title: 'Batch #',
  },
  {
    name: 'expiryDate',
    title: 'Expiry Date',
  },
  {
    name: 'stockBalance',
    title: 'Balance Qty.',
  },
  {
    name: 'instruction',
    title: 'Instructions',
  },
  {
    name: 'remarks',
    title: 'Remarks',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'adjAmt',
    title: 'Item Adj. ($)',
  },
  {
    name: 'totalAfterItemAdjustment',
    title: 'Total ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const DispenseItemsColumns1 = (viewOnly = false, onValueChange) => {
  let columns = [
    {
      dataIndex: 'type',
      key: 'type',
      title: 'Type',
      width: 105,
      onCell: row => {
        if (row.isGroup) {
          let mergeCell = 0
          if (viewOnly) mergeCell = viewOnly ? 14 : 15
          return {
            colSpan: mergeCell,
            style: { backgroundColor: 'rgb(240, 248, 255)' },
          }
        }
        return {
          rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
        }
      },
      render: (_, row) => {
        if (row.isGroup && viewOnly) {
          if (row.groupName === 'NormalDispense')
            return (
              <div style={{ padding: '3px 0px' }}>
                <span style={{ fontWeight: 600 }}>Normal Dispense Items</span>
              </div>
            )
          if (row.groupName === 'NoNeedToDispense')
            return (
              <div style={{ padding: '3px 0px' }}>
                <span style={{ fontWeight: 600 }}>
                  No Need To Dispense Items
                </span>
              </div>
            )
          return (
            <div style={{ padding: '3px 0px' }}>
              <span style={{ fontWeight: 600 }}>{'Drug Mixture: '}</span>
              {row.groupName}
            </div>
          )
        }

        let paddingRight = 0
        if (row.isExclusive) {
          paddingRight = 24
        }
        const itemType = orderItemTypes.find(
          t => t.type.toUpperCase() === (row.type || '').toUpperCase(),
        )
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight: paddingRight,
              position: 'relative',
            }}
          >
            <Tooltip title={row.type}>
              <span>{itemType?.displayValue}</span>
            </Tooltip>
            <div
              style={{
                position: 'absolute',
                top: '-1px',
                right: '-6px',
              }}
            >
              {row.isExclusive && (
                <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 4,
                      backgroundColor: 'green',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 3px',
                      height: 20,
                      display: 'inline-block',
                      margin: '0px 1px',
                      lineHeight: '16px',
                    }}
                  >
                    Excl.
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
      width: 200,
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.countNumber === 1 ? row.rowspan : 0,
      }),
      render: (_, row) => {
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              position: 'relative',
              top: 2,
            }}
          >
            <Tooltip
              title={
                <div>
                  {`Code: ${row.code}`}
                  <br />
                  {`Name: ${row.name}`}
                </div>
              }
            >
              <span>{row.name}</span>
            </Tooltip>
            <div style={{ position: 'absolute', top: 0, right: '-10px' }}>
              {lowStockIndicator(
                {
                  ...row,
                  type: row.type,
                },
                'itemFK',
                -20,
              )}
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'dispenseUOM',
      key: 'dispenseUOM',
      title: 'UOM',
      width: 80,
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.countNumber === 1 ? row.rowspan : 0,
      }),
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: 'Ord. Qty.',
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.countNumber === 1 ? row.rowspan : 0,
      }),
      align: 'right',
      width: 80,
      render: (_, row) => {
        const qty = numeral(row.quantity).format('0.0')
        return (
          <Tooltip title={qty}>
            <span>{qty}</span>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'dispenseQuantity',
      key: 'dispenseQuantity',
      title: 'Disp. Qty.',
      width: 85,
      onCell: row => ({ colSpan: row.isGroup ? 0 : 1 }),
      align: 'right',
      render: (_, row) => {
        if (viewOnly || !row.allowToDispense) {
          const qty = !row.stockFK
            ? '-'
            : numeral(row.dispenseQuantity).format('0.0')
          return (
            <Tooltip title={qty}>
              <span>{qty}</span>
            </Tooltip>
          )
        }
        let maxQuantity
        if (row.isDefault) {
          maxQuantity = row.quantity
        } else {
          maxQuantity = row.quantity > row.stock ? row.stock : row.quantity
        }
        return (
          <div style={{ position: 'relative' }}>
            <NumberInput
              label=''
              step={1}
              format='0.0'
              //max={maxQuantity}
              min={0}
              precision={1}
              value={row.dispenseQuantity}
              onChange={e => {
                onValueChange(
                  row.uid,
                  'dispenseQuantity',
                  e.target.value < 0 ? 0 : e.target.value,
                )
              }}
            />
            {row.dispenseQuantity > maxQuantity && (
              <Tooltip
                title={`Dispense quantity cannot be more than ${numeral(
                  maxQuantity,
                ).format('0.0')}`}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -5,
                    top: 5,
                    color: 'red',
                  }}
                >
                  *
                </div>
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      dataIndex: 'stock',
      key: 'stock',
      title: 'Stock Qty.',
      width: 100,
      onCell: row => ({ colSpan: row.isGroup ? 0 : 1 }),
      align: 'right',
      render: (_, row) => {
        const stock = row.stockFK
          ? `${numeral(row.stock || 0).format('0.0')} ${row.uomDisplayValue}`
          : '-'
        return (
          <Tooltip title={stock}>
            <span>{stock}</span>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'stockFK',
      key: 'stockFK',
      title: 'Batch #',
      width: 100,
      onCell: row => ({ colSpan: row.isGroup ? 0 : 1 }),
      render: (_, row) => {
        const isExpire =
          !viewOnly &&
          row.expiryDate &&
          moment(row.expiryDate).startOf('day') < moment().startOf('day')
        if (viewOnly || !row.allowToDispense) {
          return (
            <div>
              <Tooltip title={row.batchNo}>
                <div>{row.batchNo || '-'}</div>
              </Tooltip>
              {isExpire && <p style={{ color: 'red' }}>EXPIRED!</p>}
            </div>
          )
        }
        return (
          <div>
            <CodeSelect
              value={row.stockFK}
              labelField='batchNo'
              valueField='id'
              options={getBatchOptions(row)}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: '200px!important' }}
              renderDropdown={option => {
                const batchtext = option.expiryDate
                  ? `${option.batchNo}, Exp.: ${moment(
                      option.expiryDate,
                    ).format('DD MMM YYYY')}`
                  : option.batchNo
                return (
                  <Tooltip title={batchtext}>
                    <div
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: 230,
                      }}
                    >
                      {batchtext}
                    </div>
                  </Tooltip>
                )
              }}
              onChange={(v, option) => {
                onValueChange(row.uid, 'stockFK', option)
              }}
            ></CodeSelect>
            {isExpire && <p style={{ color: 'red' }}>EXPIRED!</p>}
          </div>
        )
      },
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: 'Expiry Date',
      width: 110,
      onCell: row => ({ colSpan: row.isGroup ? 0 : 1 }),
      render: (_, row) => {
        if (viewOnly || !row.isDefault) {
          const expiryDate = row.expiryDate
            ? moment(row.expiryDate).format('DD MMM YYYY')
            : '-'
          const isExpire =
            !viewOnly &&
            row.expiryDate &&
            moment(row.expiryDate).startOf('day') < moment().startOf('day')
          return (
            <Tooltip title={expiryDate}>
              <span style={{ color: isExpire ? 'red' : 'black' }}>
                {expiryDate}
              </span>
            </Tooltip>
          )
        } else {
          return (
            <DatePicker
              value={row.expiryDate}
              onChange={value => {
                onValueChange(row.uid, 'expiryDate', value)
              }}
            />
          )
        }
      },
    },
    {
      dataIndex: 'stockBalance',
      key: 'stockBalance',
      title: 'Bal. Qty.',
      width: 80,
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.countNumber === 1 ? row.rowspan : 0,
      }),
      align: 'right',
      render: (_, row) => {
        const balStock = row.stockBalance
        const stock = balStock ? `${numeral(balStock).format('0.0')}` : '-'
        return (
          <Tooltip title={stock}>
            <span>{stock}</span>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'instruction',
      key: 'instruction',
      title: 'Instructions',
      width: 140,
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      render: (_, row) => {
        return (
          <Tooltip title={<div>{row.instruction}</div>}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.instruction}
            </div>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'remarks',
      key: 'remarks',
      title: 'Remarks',
      width: 140,
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      render: (_, row) => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                minHeight: 20,
              }}
            >
              <Tooltip title={row.remarks || ''}>
                <span className='oneline_textblock'>{row.remarks || ' '}</span>
              </Tooltip>
            </div>
          </div>
        )
      },
    },
    {
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      title: 'Unit Price ($)',
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      align: 'right',
      width: 110,
      render: (_, row) => {
        return showMoney(row.unitPrice)
      },
    },
    {
      dataIndex: 'adjAmt',
      key: 'adjAmt',
      title: 'Item Adj. ($)',
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      align: 'right',
      width: 100,
      render: (_, row) => {
        return showMoney(row.hasPaid ? 0 : row.adjAmt)
      },
    },
    {
      dataIndex: 'totalAfterItemAdjustment',
      key: 'totalAfterItemAdjustment',
      title: 'Total ($)',
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      align: 'right',
      width: 100,
      render: (_, row) => {
        return showMoney(row.hasPaid ? 0 : row.totalAfterItemAdjustment)
      },
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: 'Action',
      onCell: row => ({
        colSpan: row.isGroup ? 0 : 1,
        rowSpan: row.groupNumber === 1 ? row.groupRowSpan : 0,
      }),
      width: 75,
      render: (_, row) => {
        return <div></div>
      },
    },
  ]

  if (viewOnly) {
    columns = columns.filter(c => c.dataIndex !== 'stock')
  }

  return columns
}

export const DispenseItemsColumnExtensions = (viewOnly = false) => {
  return [
    {
      columnName: 'dispenseGroupId',
      width: 0,
      sortingEnabled: false,
    },
    {
      columnName: 'type',
      compare: compareString,
      width: 120,
      sortingEnabled: false,
      disabled: true,
      render: row => {
        let paddingRight = 0
        if (row.isExclusive) {
          paddingRight = 52
        } else if (row.isExclusive) {
          paddingRight = 24
        }
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight: paddingRight,
              position: 'relative',
            }}
          >
            <Tooltip title={row.type}>
              <span>{row.type}</span>
            </Tooltip>
            <div style={{ position: 'absolute', top: '-1px', right: '-6px' }}>
              {row.isExclusive && (
                <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: 4,
                      backgroundColor: 'green',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 3px',
                      height: 20,
                      display: 'inline-block',
                      margin: '0px 1px',
                      lineHeight: '16px',
                    }}
                  >
                    Excl.
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'code',
      width: 100,
      disabled: true,
      sortingEnabled: false,
    },
    {
      columnName: 'unitPrice',
      width: 100,
      disabled: true,
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
    },
    {
      columnName: 'name',
      width: '30%',
      disabled: true,
      sortingEnabled: false,
      render: row => {
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            <Tooltip title={row.name}>
              <span>{row.name}</span>
            </Tooltip>
            <div style={{ position: 'relative', top: 2 }}>
              {lowStockIndicator(
                {
                  ...row,
                  type: row.type,
                },
                'itemFK',
                -20,
              )}
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'instruction',
      width: '40%',
      disabled: true,
      sortingEnabled: false,
      render: row => {
        return (
          <Tooltip title={<div>{row.instruction}</div>}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.instruction}
            </div>
          </Tooltip>
        )
      },
    },
    {
      columnName: 'remarks',
      width: '30%',
      disabled: true,
      sortingEnabled: false,
      render: row => {
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                paddingRight: 0,
                minHeight: 20,
              }}
            >
              <Tooltip title={row.remarks || ''}>
                <span>{row.remarks || ' '}</span>
              </Tooltip>
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'totalAfterItemAdjustment',
      width: 100,
      disabled: true,
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
      render: row => {
        return showMoney(row.hasPaid ? 0 : row.totalAfterItemAdjustment)
      },
    },
    {
      columnName: 'adjAmt',
      width: 100,
      disabled: true,
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
      render: row => {
        return showMoney(row.adjAmt)
      },
    },
    {
      columnName: 'dispenseUOM',
      width: 80,
      disabled: true,
      sortingEnabled: false,
    },
    {
      columnName: 'dispenseQuantity',
      width: 80,
      sortingEnabled: false,
      type: 'number',
      isDisabled: row => {
        return viewOnly || !row.allowToDispense || row.isDispensedByPharmacy
      },
      render: row => {
        if (viewOnly || !row.allowToDispense) {
          const qty = !row.stockFK
            ? '-'
            : numeral(row.dispenseQuantity).format('0.0')
          return (
            <Tooltip title={qty}>
              <span>{qty}</span>
            </Tooltip>
          )
        }
        let maxQuantity
        if (row.isDefault || row.isDispensedByPharmacy) {
          maxQuantity = row.quantity
        } else {
          maxQuantity = row.quantity > row.stock ? row.stock : row.quantity
        }
        return (
          <div style={{ position: 'relative' }}>
            <NumberInput
              label=''
              step={1}
              format='0.0'
              //max={maxQuantity}
              min={0}
              disabled={row.isDispensedByPharmacy}
              precision={1}
              value={row.dispenseQuantity}
            />
            {row.dispenseQuantity > maxQuantity && (
              <Tooltip
                title={`Dispense quantity cannot be more than ${numeral(
                  maxQuantity,
                ).format('0.0')}`}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -5,
                    top: 5,
                    color: 'red',
                  }}
                >
                  *
                </div>
              </Tooltip>
            )}
          </div>
        )
      },
      align: 'right',
    },
    {
      columnName: 'quantity',
      type: 'number',
      disabled: true,
      sortingEnabled: false,
      align: 'right',
      width: 80,
      render: row => {
        const qty = numeral(row.quantity).format('0.0')
        return (
          <Tooltip title={qty}>
            <span>{qty}</span>
          </Tooltip>
        )
      },
    },
    {
      columnName: 'stock',
      width: 100,
      disabled: true,
      sortingEnabled: false,
      render: row => {
        const stock = row.stockFK
          ? `${numeral(row.stock || 0).format('0.0')} ${row.uomDisplayValue}`
          : '-'
        return (
          <Tooltip title={stock}>
            <span>{stock}</span>
          </Tooltip>
        )
      },
      align: 'right',
    },
    {
      columnName: 'stockBalance',
      width: 95,
      disabled: true,
      sortingEnabled: false,
      render: row => {
        const balStock = row.stockBalance
        const stock = balStock ? `${numeral(balStock).format('0.0')}` : '-'
        return (
          <Tooltip title={stock}>
            <span>{stock}</span>
          </Tooltip>
        )
      },
      align: 'right',
    },
    {
      columnName: 'stockFK',
      width: 100,
      sortingEnabled: false,
      type: 'codeSelect',
      labelField: 'batchNo',
      valueField: 'id',
      options: row => {
        let stockList = []
        if (row.type === 'Consumable') {
          stockList = (row.consumableStock || []).filter(
            s =>
              s.isDefault ||
              (s.stock > 0 &&
                (!s.expiryDate ||
                  moment(s.expiryDate).startOf('day') >=
                    moment().startOf('day'))),
          )
        }

        stockList = _.orderBy(stockList, ['expiryDate'], ['asc'])

        if (row.stockFK) {
          const selectStock = stockList.find(sl => sl.id === row.stockFK)
          if (!selectStock) {
            return [
              {
                id: row.stockFK,
                batchNo: row.batchNo,
                expiryDate: row.expiryDate,
                isDefault: row.isDefault,
              },
              ...stockList,
            ]
          } else {
            return [
              { ...selectStock },
              ...stockList.filter(sl => sl.id !== row.stockFK),
            ]
          }
        }
        return stockList
      },
      dropdownMatchSelectWidth: false,
      dropdownStyle: {
        width: '200px!important',
      },
      renderDropdown: option => {
        const batchtext = option.expiryDate
          ? `${option.batchNo}, Exp.: ${moment(option.expiryDate).format(
              'DD MMM YYYY',
            )}`
          : option.batchNo
        return (
          <Tooltip title={batchtext}>
            <div
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: 230,
              }}
            >
              {batchtext}
            </div>
          </Tooltip>
        )
      },
      isDisabled: row => {
        return viewOnly || !row.allowToDispense
      },
      onChange: ({ option, row }) => {
        if (option) {
          row.stockFK = option.id
          row.batchNo = option.batchNo
          row.expiryDate = option.expiryDate
          row.isDefault = option.isDefault
          row.stock = option.stock
        } else {
          row.stockFK = undefined
          row.batchNo = undefined
          row.expiryDate = undefined
          row.isDefault = false
          row.stock = 0
          row.dispenseQuantity = 0
        }
      },
      render: row => {
        const isExpire =
          !viewOnly &&
          row.expiryDate &&
          moment(row.expiryDate).startOf('day') < moment().startOf('day')
        return (
          <div>
            <Tooltip title={row.batchNo}>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.batchNo || '-'}
              </div>
            </Tooltip>
            {isExpire && <p style={{ color: 'red' }}>EXPIRED!</p>}
          </div>
        )
      },
    },
    {
      columnName: 'expiryDate',
      width: 110,
      sortingEnabled: false,
      type: 'date',
      isDisabled: row => {
        return viewOnly || !row.isDefault
      },
      render: row => {
        const expiryDate = row.expiryDate
          ? moment(row.expiryDate).format('DD MMM YYYY')
          : '-'
        const isExpire =
          !viewOnly &&
          row.expiryDate &&
          moment(row.expiryDate).startOf('day') < moment().startOf('day')
        return (
          <Tooltip title={expiryDate}>
            <span style={{ color: isExpire ? 'red' : 'black' }}>
              {expiryDate}
            </span>
          </Tooltip>
        )
      },
    },
    {
      columnName: 'action',
      width: 70,
      disabled: true,
      align: 'left',
      render: row => {
        return <div></div>
      },
    },
  ]
}

export const ServiceColumns = [
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'description',
    title: 'Name',
  },
  {
    name: 'instruction',
    title: 'Instructions',
  },
  {
    name: 'remarks',
    title: 'Remarks',
  },
  {
    name: 'quantity',
    title: 'Qty.',
  },
  {
    name: 'unitPrice',
    title: 'Unit Price ($)',
  },
  {
    name: 'adjAmt',
    title: 'Item Adj. ($)',
  },
  {
    name: 'totalAfterItemAdjustment',
    title: 'Total ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const ServiceColumns1 = (
  viewOnly = false,
  onPrint,
  dispatch,
  visitFK,
  onValueChange,
) => {
  let columns = [
    {
      dataIndex: 'type',
      key: 'type',
      title: 'Type',
      width: 180,
      render: (_, row) => {
        let paddingRight = 0
        let urgentRight = 0

        if (row.priority === 'Urgent') {
          paddingRight += 34
          urgentRight = -paddingRight
        }
        const itemType = orderItemTypes.find(
          t => t.type.toUpperCase() === (row.type || '').toUpperCase(),
        )
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Tooltip title={row.type}>
              <span style={{ width: 40 }}>{itemType?.displayValue}</span>
            </Tooltip>
            <Space
              direction='horizontal'
              align='end'
              style={{
                flexGrow: 1,
                alignItems: 'start',
              }}
            >
              {urgentIndicator(row, urgentRight)}
            </Space>
          </div>
        )
      },
    },
    {
      dataIndex: 'description',
      key: 'description',
      width: 250,
      title: 'Name',
      render: (_, row) => {
        const { code = '', description = '', unitPrice = 0 } = row
        return (
          <Tooltip
            title={
              <div>
                {`Code: ${code}`}
                <br />
                {`Name: ${description}`}
              </div>
            }
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {row.description}
                <div style={{ position: 'relative', top: 2 }}>
                  {lowStockIndicator(row, 'itemFK')}
                </div>
              </div>
            </div>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'serviceCenter',
      key: 'serviceCenter',
      title: 'Service Center',
      width: 200,
    },
    {
      dataIndex: 'instruction',
      key: 'instruction',
      title: 'Instructions',
      width: 230,
    },
    {
      dataIndex: 'remarks',
      key: 'remarks',
      title: 'Remarks',
      width: 230,
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: 'Qty.',
      align: 'right',
      width: 130,
      render: (_, row) => {
        let qty = `${numeral(row.quantity || 0).format(
          '0,0.0',
        )} ${row.dispenseUOM || ''}`
        return (
          <Tooltip title={qty}>
            <span>{qty}</span>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      title: 'Unit Price ($)',
      align: 'right',
      width: 110,
      render: (_, row) => {
        const { type } = row
        if (!ServiceTypes.includes(type)) return 'N/A'
        return showMoney(row.unitPrice)
      },
    },
    {
      dataIndex: 'adjAmt',
      key: 'adjAmt',
      title: 'Item Adj. ($)',
      align: 'right',
      width: 100,
      render: (_, row) => {
        const { type } = row
        if (!ServiceTypes.includes(type)) return 'N/A'
        return showMoney(row.adjAmt)
      },
    },
    {
      dataIndex: 'totalAfterItemAdjustment',
      key: 'totalAfterItemAdjustment',
      title: 'Total ($)',
      align: 'right',
      width: 100,
      render: (_, row) => {
        const { type } = row
        if (!ServiceTypes.includes(type)) return 'N/A'
        return showMoney(row.hasPaid ? 0 : row.totalAfterItemAdjustment)
      },
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: 'Action',
      width: 75,
      render: (_, r) => {
        const { type } = r

        if (!viewOnly && ServiceTypes.includes(type)) {
          return <div></div>
        }
        return (
          <Tooltip title='Print'>
            <Button
              color='primary'
              justIcon
              onClick={() => {
                onPrint({ type: CONSTANTS.DOCUMENTS, row: r })
              }}
            >
              <Print />
            </Button>
          </Tooltip>
        )
      },
    },
  ]
  return columns
}

export const OtherOrdersColumns = [
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'description',
    title: 'Name',
  },
  {
    name: 'remarks',
    title: 'Remarks',
  },
  {
    name: 'action',
    title: 'Action',
  },
]

export const OtherOrdersColumns1 = onPrint => [
  {
    dataIndex: 'type',
    key: 'type',
    title: 'Type',
    width: 180,
  },
  {
    dataIndex: 'description',
    key: 'description',
    title: 'Name',
    width: 700,
  },
  { dataIndex: 'remarks', key: 'remarks', title: 'Remarks', width: 700 },
  {
    dataIndex: 'action',
    key: 'action',
    title: 'Action',
    width: 70,
    render: (_, row) => {
      return (
        <Tooltip title='Print'>
          <Button
            color='primary'
            justIcon
            onClick={() => {
              onPrint({ type: CONSTANTS.DOCUMENTS, row })
            }}
          >
            <Print />
          </Button>
        </Tooltip>
      )
    },
  },
]

const compareString = (a, b) => a.localeCompare(b)

const urgentIndicator = (row, right) => {
  return (
    row.priority === 'Urgent' && (
      <Tooltip title='Urgent'>
        <div
          style={{
            borderRadius: 4,
            backgroundColor: 'red',
            fontWeight: 500,
            color: 'white',
            fontSize: '0.7rem',
            padding: '2px 3px',
            height: 20,
            cursor: 'pointer',
          }}
        >
          Urg.
        </div>
      </Tooltip>
    )
  )
}

export const OtherOrdersColumnExtensions = (viewOnly = false, onPrint) => [
  {
    columnName: 'type',
    compare: compareString,
    width: 180,
    render: row => {
      let paddingRight = 0
      let urgentRight = 0

      if (row.priority === 'Urgent') {
        paddingRight += 34
        urgentRight = -paddingRight
      }
      return (
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ width: 80 }}>{row.type}</span>
          <Space
            direction='horizontal'
            align='end'
            style={{
              flexGrow: 1,
              alignItems: 'start',
            }}
          >
            {urgentIndicator(row, urgentRight)}
          </Space>
        </div>
      )
    },
  },
  {
    columnName: 'description',
    compare: compareString,
    width: '60%',
    render: row => {
      const { code = '', description = '', unitPrice = 0 } = row
      return (
        <Tooltip
          title={
            <div>
              {`Code: ${code}`}
              <br />
              {`Name: ${description}`}
            </div>
          }
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.description}
              <div style={{ position: 'relative', top: 2 }}>
                {lowStockIndicator(row, 'itemFK')}
              </div>
            </div>
          </div>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'instruction',
    width: 200,
  },
  {
    columnName: 'remarks',
    width: '40%',
  },
  {
    columnName: 'quantity',
    type: 'number',
    align: 'right',
    width: 130,
    render: row => {
      let qty = `${numeral(row.quantity || 0).format(
        '0,0.0',
      )} ${row.dispenseUOM || ''}`
      return (
        <Tooltip title={qty}>
          <span>{qty}</span>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'unitPrice',
    // type: 'currency',
    align: 'right',
    width: 100,
    render: row => {
      const { type } = row
      if (!ServiceTypes.includes(type)) return 'N/A'
      return showMoney(row.unitPrice)
    },
  },
  {
    columnName: 'adjAmt',
    // type: 'currency',
    align: 'right',
    width: 100,
    render: row => {
      const { type } = row
      if (!ServiceTypes.includes(type)) return 'N/A'
      return showMoney(row.adjAmt)
    },
  },
  {
    columnName: 'totalAfterItemAdjustment',
    // type: 'currency',
    align: 'right',
    width: 100,
    render: row => {
      const { type } = row
      if (!ServiceTypes.includes(type)) return 'N/A'
      return showMoney(row.hasPaid ? 0 : row.totalAfterItemAdjustment)
    },
  },
  {
    columnName: 'action',
    align: 'left',
    width: 70,
    render: r => {
      const { type } = r

      if (!viewOnly && ServiceTypes.includes(type)) {
        return <div></div>
      }
      return (
        <Tooltip title='Print'>
          <Button
            color='primary'
            justIcon
            onClick={() => {
              onPrint({ type: CONSTANTS.DOCUMENTS, row: r })
            }}
          >
            <Print />
          </Button>
        </Tooltip>
      )
    },
  },
]
