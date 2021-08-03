import moment from 'moment'
import Print from '@material-ui/icons/Print'
import { FormattedMessage } from 'umi'
import numeral from 'numeral'
import { Tag } from 'antd'
import { currencySymbol, currencyFormat } from '@/utils/config'
import {
  NumberInput,
  TextField,
  FastField,
  DatePicker,
  Button,
  Tooltip,
  Checkbox,
  Select,
} from '@/components'
import LowStockInfo from '@/pages/Widgets/Orders/Detail/LowStockInfo'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'
import { InventoryTypes } from '@/utils/codes'
import CONSTANTS from './DispenseDetails/constants'
import { UnorderedListOutlined, CheckOutlined } from '@ant-design/icons'
import { NURSE_WORKITEM_STATUS } from '@/utils/constants'

export const tableConfig = {
  FuncProps: { pager: false },
}

export const actualizeTableConfig = selectable => {
  return {
    FuncProps: {
      pager: false,
      selectable: selectable,
      selectConfig: {
        showSelectAll: true,
        rowSelectionEnabled: row => {
          const {
            isNurseActualizeRequired = false,
            workitem: {
              nurseWorkitem: { statusFK },
            },
          } = row

          return (
            isNurseActualizeRequired &&
            statusFK !== NURSE_WORKITEM_STATUS.ACTUALIZED
          )
        },
      },
    },
  }
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

const lowStockIndicator = (row, itemIdFieldName) => {
  const currentType = InventoryTypes.find(type => type.name === row.type)
  if (!currentType) return null

  const values = {
    [currentType.itemFKName]: row[itemIdFieldName],
  }

  // If is drug mixture, show drug mixture indicator
  const isDrugMixture = currentType.name === 'Medication' && row.isDrugMixture

  return (
    <div style={{ position: 'relative', top: 2 }}>
      {isDrugMixture ? (
        <DrugMixtureInfo values={row.prescriptionDrugMixture} />
      ) : (
        <LowStockInfo
          sourceType={currentType.name.toLowerCase()}
          values={values}
        />
      )}
    </div>
  )
}

const packageDrawdownIndicator = row => {
  if (!row.isPackage) return null

  return (
    <div style={{ position: 'relative' }}>
      <PackageDrawdownInfo
        drawdownData={row}
        asAtDate={row.packageDrawdownAsAtDate}
      />
    </div>
  )
}

const checkActualizable = row => {
  const {
    isNurseActualizeRequired = false,
    workitem: {
      nurseWorkitem: { statusFK },
    },
  } = row
  return { isNurseActualizeRequired, statusFK }
}

export const isActualizable = row => {
  const { isNurseActualizeRequired, statusFK } = checkActualizable(row)
  return isNurseActualizeRequired && [NURSE_WORKITEM_STATUS.NEW,NURSE_WORKITEM_STATUS.CANCCELED].indexOf(statusFK) > -1
}

const actualizationButton = (row, buttonClickCallback) => {
  let actualizationBtn = null
  const { isNurseActualizeRequired, statusFK } = checkActualizable(row)

  if (isNurseActualizeRequired) {
    if ([NURSE_WORKITEM_STATUS.NEW,NURSE_WORKITEM_STATUS.CANCCELED].indexOf(statusFK) > -1) {
      actualizationBtn = (
        <Tooltip title='Todo'>
          <Button
            color='primary'
            justIcon
            onClick={() =>
              buttonClickCallback(row, NURSE_WORKITEM_STATUS.NEW)
            }
          >
            <UnorderedListOutlined />
          </Button>
        </Tooltip>
      )
    } else if (statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED) {
      actualizationBtn = (
        <Tooltip title='Actualized'>
          <Button
            color='success'
            justIcon
            onClick={() =>
              buttonClickCallback(row, NURSE_WORKITEM_STATUS.ACTUALIZED)
            }
          >
            <CheckOutlined />
          </Button>
        </Tooltip>
      )
    }
  }
  return actualizationBtn
}


export const PrescriptionColumns = [
  // { name: 'id', title: 'id' },
  {
    name: 'name',
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
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'expiryDate',
    title: 'Expiry Date',
  },
  {
    name: 'orderedQuantity',
    title: 'Qty. Ordered',
  },
  {
    name: 'dispensedQuanity',
    title: 'Qty. Dispensed',
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

export const PrescriptionColumnExtensions = (
  viewOnly = false,
  onPrint,
  inventorymedication = [],
  handleSelectedBatch,
  onActualizeBtnClick,
) => [
  { columnName: 'unitPrice', width: 100, type: 'currency' },
  {
    columnName: 'name',
    width: '30%',
    render: row => {
      return (
        <Tooltip
          title={
            <div>
              {`Code/Name: ${row.code} / ${row.name}`}
              <br />
              {`UnitPrice/UOM: ${currencySymbol}${numeral(row.unitPrice).format(
                currencyFormat,
              )} / ${row.orderUOM}`}
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
              {row.name}
              {row.isPreOrder && (
                <Tooltip title='Pre-Order'>
                  <Tag
                    color='#4255bd'
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 10,
                      borderRadius: 10,
                    }}
                  >
                    Pre
                  </Tag>
                </Tooltip>
              )}
              {lowStockIndicator(row, 'inventoryMedicationFK')}
            </div>
          </div>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'instruction',
    width: '40%',
    render: row => {
      return (
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {row.instruction}
        </div>
      )
    },
  },
  {
    columnName: 'remarks',
    width: '30%',
  },
  {
    columnName: 'totalAfterItemAdjustment',
    width: 110,
    type: 'currency',
    render: row => (
      <NumberInput
        value={
          row.isPreOrder && !row.isChargeToday
            ? 0
            : row.totalAfterItemAdjustment
        }
        text
        currency
      />
    ),
  },
  {
    columnName: 'adjAmt',
    width: 100,
    type: 'currency',
  },
  {
    columnName: 'dispensedQuanity',
    type: 'number',
    width: 130,
    render: row => {
      let qty = `${numeral(row.dispensedQuanity || 0).format(
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
    columnName: 'orderedQuantity',
    type: 'number',
    width: 130,
    render: row => {
      let qty = `${numeral(row.orderedQuantity || 0).format(
        '0,0.0',
      )} ${row.orderUOM || ''}`
      return (
        <Tooltip title={qty}>
          <span>{qty}</span>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'batchNo',
    width: 150,
    render: row => {
      const currentItem = inventorymedication.find(
        o => o.id === row.inventoryMedicationFK,
      )
      let batchNoOptions = []
      if (currentItem) {
        batchNoOptions = currentItem.medicationStock
      }
      return (
        <FastField
          name={`prescription[${row.rowIndex}]batchNo`}
          render={args => {
            const restProps = viewOnly ? { value: row.batchNo } : { ...args }
            return (
              <Select
                simple
                options={batchNoOptions}
                mode='tags'
                // valueField='id'
                valueField='batchNo'
                labelField='batchNo'
                maxSelected={1}
                disableAll
                disabled={viewOnly}
                onChange={(e, op = {}) => handleSelectedBatch(e, op, row)}
                {...restProps}
              />
            )
          }}
        />
      )
    },
  },
  {
    columnName: 'expiryDate',
    width: 130,
    render: row => {
      return (
        <FastField
          name={`prescription[${row.rowIndex}]expiryDate`}
          render={args => {
            const restProps = viewOnly ? { value: row.expiryDate } : { ...args }

            return (
              <DatePicker
                text={viewOnly}
                disabled={viewOnly}
                disabledDate={d => !d || d.isBefore(moment().add('days', -1))}
                simple
                {...restProps}
              />
            )
          }}
        />
      )
    },
  },
  {
    columnName: 'action',
    align: 'center',
    width: 70,
    render: row => {
      return (
        <div>
          {actualizationButton(row,onActualizeBtnClick)}
          <Tooltip
            title={
              <FormattedMessage id='reception.queue.dispense.printDrugLabel' />
            }
          >
            <Button
              color='primary'
              onClick={() => {
                onPrint({ type: CONSTANTS.DRUG_LABEL, row })
              }}
              justIcon
            >
              <Print />
            </Button>
          </Tooltip>
        </div>
      )
    },
  },
]

export const VaccinationColumn = [
  {
    name: 'name',
    title: 'Name',
  },
  {
    name: 'remarks',
    title: 'Remarks',
  },
  {
    name: 'batchNo',
    title: 'Batch #',
  },
  {
    name: 'expiryDate',
    title: 'Expiry Date',
  },
  {
    name: 'dispensedQuanity',
    title: 'Qty. Dispensed',
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

export const VaccinationColumnExtensions = (
  viewOnly = false,
  inventoryvaccination = [],
  handleSelectedBatch = () => {},
  onActualizeBtnClick,
) => [
  {
    columnName: 'name',
    width: '60%',
    render: row => {
      return (
        <Tooltip
          title={
            <div>
              {`Code/Name: ${row.code} / ${row.name}`}
              <br />
              {`UnitPrice/UOM: ${currencySymbol}${numeral(row.unitPrice).format(
                currencyFormat,
              )} / ${row.dispenseUOM}`}
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
              {row.name}
              {row.isPreOrder && (
                <Tooltip title='Pre-Order'>
                  <Tag
                    color='#4255bd'
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 10,
                      borderRadius: 10,
                    }}
                  >
                    Pre
                  </Tag>
                </Tooltip>
              )}
              {lowStockIndicator(row, 'inventoryVaccinationFK')}
            </div>
          </div>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'remarks',
    width: '40%',
  },
  {
    columnName: 'dispensedQuanity',
    type: 'number',
    width: 130,
    render: row => {
      let qty = `${numeral(row.dispensedQuanity || 0).format(
        '0,0.0',
      )} ${row.dispenseUOM || ''}`
      return (
        <Tooltip title={qty}>
          <span>{qty}</span>
        </Tooltip>
      )
    },
  },
  { columnName: 'unitPrice', width: 100, type: 'currency' },
  {
    columnName: 'totalAfterItemAdjustment',
    width: 110,
    type: 'currency',
    render: row => (
      <NumberInput
        value={
          row.isPreOrder && !row.isChargeToday
            ? 0
            : row.totalAfterItemAdjustment
        }
        text
        currency
      />
    ),
  },
  {
    columnName: 'adjAmt',
    width: 100,
    type: 'currency',
  },
  {
    columnName: 'batchNo',
    width: 150,
    render: row => {
      const currentItem = inventoryvaccination.find(
        o => o.id === row.inventoryVaccinationFK,
      )
      let batchNoOptions = []
      if (currentItem) {
        batchNoOptions = currentItem.vaccinationStock
      }

      return (
        <FastField
          name={`vaccination[${row.rowIndex}]batchNo`}
          render={args => {
            const restProps = viewOnly ? { value: row.batchNo } : { ...args }
            return (
              <Select
                simple
                options={batchNoOptions}
                mode='tags'
                // valueField='id'
                valueField='batchNo'
                labelField='batchNo'
                maxSelected={1}
                disableAll
                disabled={viewOnly}
                onChange={(e, op = {}) => handleSelectedBatch(e, op, row)}
                {...restProps}
              />
            )
            // return (
            //   <TextField
            //     simple
            //     text={viewOnly}
            //     disabled={viewOnly}
            //     {...restProps}
            //   />
            // )
          }}
        />
      )
    },
  },
  {
    columnName: 'expiryDate',
    width: 130,
    render: row => {
      return (
        <FastField
          name={`vaccination[${row.rowIndex}]expiryDate`}
          render={args => {
            const restProps = viewOnly ? { value: row.expiryDate } : { ...args }
            return (
              <DatePicker
                disabledDate={d => !d || d.isBefore(moment().add('days', -1))}
                text={viewOnly}
                disabled={viewOnly}
                simple
                {...restProps}
              />
            )
          }}
        />
      )
    },
  },
  {
    columnName: 'action',
    width: 60,
    render: () => actualizationButton(row,onActualizeBtnClick),
  },
]

export const OtherOrdersColumns = [
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'description',
    title: 'Description',
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

const compareString = (a, b) => a.localeCompare(b)

export const OtherOrdersColumnExtensions = (viewOnly = false, onPrint,onActualizeBtnClick) => [
  {
    columnName: 'type',
    compare: compareString,
    width: 160,
    render: row => {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {row.type}
            {row.isPreOrder && (
              <Tooltip title='Pre-Order'>
                <Tag
                  color='#4255bd'
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: -10,
                    borderRadius: 10,
                  }}
                >
                  Pre
                </Tag>
              </Tooltip>
            )}
          </div>
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
              {`Code/Name: ${code} / ${description}`}
              <br />
              {`UnitPrice/UOM: ${currencySymbol}${numeral(unitPrice).format(
                currencyFormat,
              )} / ${row.dispenseUOM || '-'}`}
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
              {lowStockIndicator(row, 'itemFK')}
            </div>
          </div>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'remarks',
    width: '40%',
  },
  {
    columnName: 'quantity',
    type: 'number',
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
      if (type !== 'Service' && type !== 'Consumable' && type !== 'Treatment')
        return 'N/A'
      return <NumberInput text currency showZero value={row.unitPrice} />
    },
  },
  {
    columnName: 'adjAmt',
    // type: 'currency',
    align: 'right',
    width: 100,
    render: row => {
      const { type } = row
      if (type !== 'Service' && type !== 'Consumable' && type !== 'Treatment')
        return 'N/A'
      return <NumberInput text currency showZero value={row.adjAmt} />
    },
  },
  {
    columnName: 'totalAfterItemAdjustment',
    // type: 'currency',
    align: 'right',
    width: 110,
    render: row => {
      const { type } = row
      if (type !== 'Service' && type !== 'Consumable' && type !== 'Treatment')
        return 'N/A'
      return (
        <NumberInput
          text
          currency
          showZero
          value={
            row.isPreOrder && !row.isChargeToday
              ? 0
              : row.totalAfterItemAdjustment
          }
        />
      )
    },
  },
  {
    columnName: 'action',
    align: 'center',
    width: 60,
    render: r => {
      const { type } = r

      if (type === 'Service' || type === 'Consumable' || type === 'Treatment')
        return actualizationButton(r,onActualizeBtnClick)
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

export const DrugLabelSelectionColumns = [
  {
    name: 'code',
    title: 'Code',
  },
  {
    name: 'name',
    title: 'Description',
  },
  {
    name: 'instruction',
    title: 'Instructions',
  },
  {
    name: 'dispensedQuanity',
    title: 'Qty. Dispensed',
  },
  {
    name: 'no',
    title: 'No. Of Label',
  },
  {
    name: 'print',
    title: 'Print',
  },
]

export const DrugLabelSelectionColumnExtensions = (
  handleDrugLabelSelected,
  handleDrugLabelNoChanged,
) => [
  {
    columnName: 'code',
    width: 150,
    render: row => {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {row.code}
          </div>
        </div>
      )
    },
  },
  {
    columnName: 'name',
    width: 210,
    render: row => {
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {row.name}
          </div>
        </div>
      )
    },
  },
  {
    columnName: 'instruction',
    width: 260,
    render: row => {
      return (
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {row.instruction}
        </div>
      )
    },
  },
  {
    columnName: 'dispensedQuanity',
    type: 'number',
    width: 100,
    render: row => {
      return (
        <span>
          {row.dispensedQuanity} {row.dispenseUOM}
        </span>
      )
    },
  },
  {
    columnName: 'no',
    type: 'number',
    width: 100,
    render: row => {
      return (
        <p>
          <NumberInput
            max={99}
            precision={0}
            min={1}
            value={row.no}
            defaultValue={1}
            onChange={obj => {
              handleDrugLabelNoChanged(row.id, obj.target.value)
            }}
          />
        </p>
      )
    },
  },
  {
    columnName: 'print',
    align: 'center',
    width: 80,
    render: row => {
      return (
        <Checkbox
          onChange={obj => {
            handleDrugLabelSelected(row.id, obj.target.value)
          }}
          checked={row.selected}
          simple
        />
      )
    },
  },
]

export const PackageColumns = [
  {
    name: 'type',
    title: 'Type',
  },
  {
    name: 'description',
    title: 'Description',
  },
  {
    name: 'remarks',
    title: 'Remarks',
  },
  {
    name: 'packageConsumeQuantity',
    title: 'Consumed',
  },
  {
    name: 'packageRemainingQuantity',
    title: 'Balance',
  },
  {
    name: 'totalAfterItemAdjustment',
    title: 'Total ($)',
  },
  {
    name: 'action',
    title: 'Action',
  },
  {
    name: 'packageGlobalId',
    title: 'Package',
  },
]

export const PackageColumnExtensions = onPrint => [
  {
    columnName: 'type',
    compare: compareString,
    width: 160,
    sortingEnabled: false,
    render: row => {
      return (
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {row.type}
        </div>
      )
    },
  },
  {
    columnName: 'description',
    compare: compareString,
    sortingEnabled: false,
    width: '60%',
    render: row => {
      const { code = '', description = '', unitPrice = 0 } = row
      return (
        <Tooltip
          title={
            <div>
              {`Code/Name: ${code} / ${description}`}
              <br />
              {`UnitPrice/UOM: ${currencySymbol}${numeral(unitPrice).format(
                currencyFormat,
              )} / ${row.dispenseUOM || '-'}`}
            </div>
          }
        >
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {packageDrawdownIndicator(row)}
            <div
              style={{
                position: 'relative',
                left: 22,
              }}
            >
              {row.description}
            </div>
            {lowStockIndicator(row, 'itemFK')}
          </div>
        </Tooltip>
      )
    },
  },
  {
    columnName: 'remarks',
    width: '40%',
  },
  {
    columnName: 'packageConsumeQuantity',
    align: 'right',
    width: 130,
    sortingEnabled: false,
    render: row => {
      let qty = `${numeral(row.packageConsumeQuantity || 0).format(
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
    columnName: 'packageRemainingQuantity',
    align: 'right',
    width: 130,
    sortingEnabled: false,
    render: row => {
      const { packageDrawdown } = row
      let drawdownTransaction = []
      let balanceQty = row.quantity
      const todayQuantity = row.packageConsumeQuantity

      if (packageDrawdown) {
        if (
          packageDrawdown.packageDrawdownTransaction &&
          packageDrawdown.packageDrawdownTransaction.length > 0
        ) {
          drawdownTransaction = packageDrawdown.packageDrawdownTransaction.filter(
            t => t.consumeDate < row.packageDrawdownAsAtDate,
          )
        }

        // Transferred quantity
        let transferredQty = 0
        const { packageDrawdownTransfer } = packageDrawdown
        if (packageDrawdownTransfer && packageDrawdownTransfer.length > 0) {
          const drawdownTransfer = packageDrawdownTransfer.filter(
            t => t.transferDate < row.packageDrawdownAsAtDate,
          )
          drawdownTransfer.forEach(transfer => {
            transferredQty += transfer.quantity
          })
        }

        // Received (Transfer back) quantity
        let receivedQty = 0
        const { packageDrawdownReceive } = packageDrawdown
        if (packageDrawdownReceive && packageDrawdownReceive.length > 0) {
          const drawdownReceive = packageDrawdownReceive.filter(
            t => t.transferDate < row.packageDrawdownAsAtDate,
          )
          drawdownReceive.forEach(receive => {
            receivedQty += receive.quantity
          })
        }

        const totalQty =
          packageDrawdown.totalQuantity - transferredQty + receivedQty
        let totalDrawdown = 0
        drawdownTransaction.forEach(txn => {
          totalDrawdown += txn.consumeQuantity
        })
        balanceQty = totalQty - totalDrawdown
      }

      let qty = `${numeral((balanceQty || 0) - (todayQuantity || 0)).format(
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
    columnName: 'totalAfterItemAdjustment',
    align: 'right',
    width: 110,
    sortingEnabled: false,
    render: row => {
      return (
        <NumberInput
          text
          currency
          showZero
          value={row.totalAfterItemAdjustment}
        />
      )
    },
  },
  {
    columnName: 'action',
    align: 'center',
    width: 60,
    sortingEnabled: false,
    render: r => {
      const { type } = r

      if (type === 'Service' || type === 'Consumable' || type === 'Vaccination')
        return null
      return (
        <Tooltip
          title={
            <FormattedMessage id='reception.queue.dispense.printDrugLabel' />
          }
        >
          <Button
            color='primary'
            justIcon
            onClick={() => {
              onPrint({ type: CONSTANTS.DRUG_LABEL, row: r })
            }}
          >
            <Print />
          </Button>
        </Tooltip>
      )
    },
  },
]
