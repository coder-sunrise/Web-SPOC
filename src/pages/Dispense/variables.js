import moment from 'moment'
import Print from '@material-ui/icons/Print'
import { FileCopySharp } from '@material-ui/icons'
import { FormattedMessage } from 'umi'
import numeral from 'numeral'
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
  Icon,
} from '@/components'
import LowStockInfo from '@/pages/Widgets/Orders/Detail/LowStockInfo'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'
import { InventoryTypes } from '@/utils/codes'
import CONSTANTS from './DispenseDetails/constants'
import { UnorderedListOutlined, CheckOutlined } from '@ant-design/icons'
import { NURSE_WORKITEM_STATUS } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
export const tableConfig = {
  FuncProps: { pager: false },
}

export const actualizeTableConfig = (selectable) => {
  return {
    FuncProps: {
      pager: false,
      selectable: selectable,
      selectConfig: {
        showSelectAll: true,
        rowSelectionEnabled: row => {
          const {
            isNurseActualizeRequired = false,
            workitem: { nurseWorkitem: { statusFK } = {} } = {},
            isPreOrder,
            isExternalPrescription,
          } = row

          return (
            !isPreOrder &&
            !isExternalPrescription &&
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

const lowStockIndicator = (row, itemIdFieldName, right) => {
  const currentType = InventoryTypes.find(type => type.name === row.type)
  if (!currentType) return null

  const values = {
    [currentType.itemFKName]: row[itemIdFieldName],
  }

  // If is drug mixture, show drug mixture indicator
  const isDrugMixture = currentType.name === 'Medication' && row.isDrugMixture

  return isDrugMixture ? (
    <DrugMixtureInfo values={row.prescriptionDrugMixture} right={right} />
  ) : (
    <LowStockInfo
      sourceType={currentType.name.toLowerCase()}
      values={values}
      right={right}
    />
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
    workitem: { nurseWorkitem: { statusFK } = {} } = {},
  } = row
  return { isNurseActualizeRequired, statusFK }
}

export const isActualizable = row => {
  const { isNurseActualizeRequired, statusFK } = checkActualizable(row)
  return (
    isNurseActualizeRequired &&
    [NURSE_WORKITEM_STATUS.NEW, NURSE_WORKITEM_STATUS.CANCELLED].includes(
      statusFK,
    )
  )
}

const actualizationButton = (row, buttonClickCallback) => {
  let actualizationBtn = null
  const { isNurseActualizeRequired, statusFK } = checkActualizable(row)
  const cancelActualizeRight = Authorized.check('dispense.cancelactualizeorderitems')
  const isHiddenCancelActualize = cancelActualizeRight && cancelActualizeRight.rights === 'hidden'

  if (isNurseActualizeRequired) {
    if (
      [NURSE_WORKITEM_STATUS.NEW, NURSE_WORKITEM_STATUS.CANCELLED].includes(
        statusFK,
      )
    ) {
      actualizationBtn = (
        <Authorized authority='dispense.actualizeorderitems'>
          <Tooltip title='To do'>
            <Button
              color='primary'
              justIcon
              onClick={() =>
                buttonClickCallback(row, NURSE_WORKITEM_STATUS.NEW)
              }
            >
              <span style={{fontSize:10,lineHeight:'14px'}}>TD</span>
            </Button>
          </Tooltip>
        </Authorized>
      )
    } else if (statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED) {
      actualizationBtn = !isHiddenCancelActualize && (
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

export const DispenseItemsColumns = [
  { name: 'dispenseGroupId', title: '' },
  {
    name: 'isCheckActualize', title: ' ',
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
    name: 'stockBalance',
    title: 'Balance Qty.',
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

export const DispenseItemsColumnExtensions = (
  viewOnly = false,
  onPrint,
  onActualizeBtnClick,
  showDrugLabelRemark,
) => [
    {
      columnName: 'dispenseGroupId',
      width: 0,
      sortingEnabled: false,
    },
    {
      columnName: 'isCheckActualize',
      width: 50,
      sortingEnabled: false,
      align: 'center',
      render: row => {
        const {
          isNurseActualizeRequired = false,
          workitem: { nurseWorkitem: { statusFK } = {} } = {},
          isPreOrder,
          isExternalPrescription,
        } = row

        if (
          !isPreOrder &&
          !isExternalPrescription &&
          isNurseActualizeRequired &&
          statusFK !== NURSE_WORKITEM_STATUS.ACTUALIZED
        ) {
          return (
            <FastField
              name={`dispenseItems[${row.rowIndex}]isCheckActualize`}
              render={args => {
                return <Checkbox label='' style={{ marginLeft: 10 }} {...args} />
              }} />
          )
        }
        return ''
      }
    },
    {
      columnName: 'type',
      compare: compareString,
      width: 120,
      sortingEnabled: false,
      render: row => {
        let paddingRight = 0
        if (row.isPreOrder && row.isExclusive) {
          paddingRight = 52
        } else if (row.isPreOrder || row.isExclusive) {
          paddingRight = 24
        }
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight: paddingRight,
            }}
          >
            <Tooltip title={row.type}>
              <span>{row.type}</span>
            </Tooltip>
            <div style={{ position: 'relative', top: 2 }}>
              {row.isPreOrder && (
                <Tooltip title='Pre-Order'>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: -27,
                      borderRadius: 4,
                      backgroundColor: '#4255bd',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 3px',
                      height: 20,
                    }}
                  >
                    Pre
                  </div>
                </Tooltip>
              )}
              {row.isExclusive && (
                <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: row.isPreOrder ? -60 : -30,
                      borderRadius: 4,
                      backgroundColor: 'green',
                      fontWeight: 500,
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '2px 3px',
                      height: 20,
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
      sortingEnabled: false,
    },
    {
      columnName: 'unitPrice',
      width: 100,
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
    },
    {
      columnName: 'name',
      width: '30%',
      sortingEnabled: false,
      render: row => {
        const isShowStockIndicator = ['Medication', 'Medication (Ext.)', 'Vaccination'].indexOf(row.type) > -1
        let paddingRight = 0
        if (isShowStockIndicator) {
          paddingRight = 10
        }
        return (
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight,
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
            <div style={{ position: 'relative', top: 2 }}>
              {lowStockIndicator(
                { ...row, isDrugMixture: false, type: row.type === 'Medication (Ext.)' ? 'Medication' : row.type },
                ['Medication', 'Medication (Ext.)'].indexOf(row.type) > -1
                  ? 'inventoryMedicationFK'
                  : 'inventoryVaccinationFK',
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
      sortingEnabled: false,
      render: row => {
        const existsDrugLabelRemarks =
          showDrugLabelRemark &&
          row.drugLabelRemarks &&
          row.drugLabelRemarks.trim() !== ''
        return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                paddingRight: existsDrugLabelRemarks ? 10 : 0,
              }}
            >
              {row.remarks || ' '}
              <div style={{ position: 'relative', top: 2 }}>
                {existsDrugLabelRemarks && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: -15,
                    }}
                  >
                    <Tooltip
                      title={
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            Drug Label Remarks
                          </div>
                          <div>{row.drugLabelRemarks}</div>
                        </div>
                      }
                    >
                      <FileCopySharp style={{ color: '#4255bd' }} />
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      columnName: 'totalAfterItemAdjustment',
      width: 100,
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
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
      align: 'right',
      type: 'currency',
      sortingEnabled: false,
    },
    {
      columnName: 'dispenseUOM',
      width: 80,
      sortingEnabled: false,
    },
    {
      columnName: 'dispenseQuantity',
      width: 80,
      sortingEnabled: false,
      render: row => {
        if (viewOnly || !row.stockFK) {
          const qty = !row.stockFK ? '-' : numeral(row.dispenseQuantity).format('0.0')
          return (
            <Tooltip title={qty}>
              <span>{qty}</span>
            </Tooltip>
          )
        }
        return (
          <FastField
            name={`dispenseItems[${row.rowIndex}]dispenseQuantity`}
            render={args => {
              let maxQuantity
              if (row.isDefault || row.isDispensedByPharmacy) {
                maxQuantity = row.quantity
              }
              else {
                maxQuantity = row.quantity > row.stock ? row.stock : row.quantity
              }
              return (
                <NumberInput
                  label=''
                  step={1}
                  format='0.0'
                  max={maxQuantity}
                  min={0}
                  disabled={row.isDispensedByPharmacy}
                  precision={1}
                  {...args}
                />
              )
            }}
          />
        )
      },
      align: 'right',
    },
    {
      columnName: 'quantity',
      type: 'number',
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
      width: 100,
      sortingEnabled: false,
      render: row => {
        const balStock = row.stock - row.dispenseQuantity
        const stock =
          balStock || balStock === 0
            ? `${numeral(balStock).format(
              '0.0',
            )} ${row.uomDisplayValue}`
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
      columnName: 'batchNo',
      width: 100,
      sortingEnabled: false,
      render: row => {
        if (viewOnly || !row.isDefault) {
          return (
            <Tooltip title={row.batchNo}>
              <span>{row.batchNo}</span>
            </Tooltip>
          )
        }
        return (
          <FastField
            name={`dispenseItems[${row.rowIndex}]batchNo`}
            render={args => {
              return (
                <TextField maxLength={100} text={viewOnly} label='' {...args} />
              )
            }}
          />
        )
      },
    },
    {
      columnName: 'expiryDate',
      width: 110,
      sortingEnabled: false,
      render: row => {
        if (viewOnly || !row.isDefault) {
          const expiryDate = row.expiryDate
            ? moment(row.expiryDate).format('DD MMM YYYY')
            : '-'
          return (
            <Tooltip title={expiryDate}>
              <span>{expiryDate}</span>
            </Tooltip>
          )
        }
        return (
          <FastField
            name={`dispenseItems[${row.rowIndex}]expiryDate`}
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
      width: 70,
      render: row => {
        return (
          <div>
            {actualizationButton(row, onActualizeBtnClick)}
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

const compareString = (a, b) => a.localeCompare(b)

const urgentIndicator = (row, right) => {
  return (
    row.priority === 'Urgent' && (
      <Tooltip title='Urgent'>
        <div
          style={{
            right: right,
            borderRadius: 4,
            backgroundColor: 'red',
            position: 'absolute',
            bottom: 2,
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

export const OtherOrdersColumnExtensions = (
  viewOnly = false,
  onPrint,
  onActualizeBtnClick,
) => [
    {
      columnName: 'type',
      compare: compareString,
      width: 160,
      render: row => {
      let paddingRight = row.isPreOrder ? 24 : 0
      let urgentRight = 0

      if(row.priority === 'Urgent')
      {
        paddingRight += 34
        urgentRight = -paddingRight - 4
      }

      return (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              paddingRight: paddingRight,
              }}
            >
              {row.type}
              <div style={{ position: 'relative', top: 2 }}>
                {row.isPreOrder && (
                  <Tooltip title='Pre-Order'>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        right: -30,
                        borderRadius: 4,
                        backgroundColor: '#4255bd',
                        fontWeight: 500,
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 3px',
                        height: 20,
                      }}
                    >
                      Pre
                    </div>
                  </Tooltip>
                )}
              {urgentIndicator(row,urgentRight)}
            </div>
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
      width: 100,
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
      width: 70,
      render: r => {
        const { type } = r

        if (['Service','Consumable','Treatment','Radiology','Lab'].includes(type))
          return actualizationButton(r, onActualizeBtnClick)
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

export const PackageColumnExtensions = (onPrint, showDrugLabelRemark) => [
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
            paddingRight: 24,
          }}
        >
          {row.type}
          <div style={{ position: 'relative', top: 2 }}>
            {row.isExclusive && (
              <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: -30,
                    borderRadius: 4,
                    backgroundColor: 'green',
                    fontWeight: 500,
                    color: 'white',
                    fontSize: '0.7rem',
                    padding: '2px 3px',
                    height: 20,
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
              {`Code: ${code}`}
              <br />
              {`Name: ${description}`}
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
            <div style={{ position: 'relative', top: 2 }}>
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
    render: row => {
      const existsDrugLabelRemarks =
        showDrugLabelRemark &&
        row.drugLabelRemarks &&
        row.drugLabelRemarks.trim() !== ''
      return (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              paddingRight: existsDrugLabelRemarks ? 10 : 0,
            }}
          >
            {row.remarks || ' '}
            <div style={{ position: 'relative', top: 2 }}>
              {existsDrugLabelRemarks && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: -15,
                  }}
                >
                  <Tooltip
                    title={
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          Drug Label Remarks
                        </div>
                        <div>{row.drugLabelRemarks}</div>
                      </div>
                    }
                  >
                    <FileCopySharp style={{ color: '#4255bd' }} />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
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
