import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
//import CheckCircle from '@material-ui/icons/CheckCircle'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Divider } from '@material-ui/core'
import Cross from '@material-ui/icons/HighlightOff'
import { currencySymbol, currencyFormat } from '@/utils/config'
import { Link } from 'umi'

import numeral from 'numeral'
import {
  RADIOLOGY_WORKITEM_STATUS,
  NURSE_WORKITEM_STATUS,
  LAB_WORKITEM_STATUS,
  ORDER_TYPES,
} from '@/utils/constants'
import {
  CommonTableGrid,
  Button,
  Tooltip,
  NumberInput,
  Checkbox,
  Switch,
  AuthorizedContext,
} from '@/components'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'
import DrugMixtureInfo from '@/pages/Widgets/Orders/Detail/DrugMixtureInfo'
import PackageDrawdownInfo from '@/pages/Widgets/Orders/Detail/PackageDrawdownInfo'

export default ({
  orders,
  dispatch,
  classes,
  from = 'Consultation',
  codetable,
  theme,
  isFullScreen = false,
  isEnableEditOrder = true,
}) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST, subTotal } = summary
  const [checkedStatusIncldGST, setCheckedStatusIncldGST] = useState(
    isGSTInclusive,
  )

  const [isExistPackage, setIsExistPackage] = useState(false)

  const [expandedGroups, setExpandedGroups] = useState([])

  const getOrderAccessRight = accessRight => {
    let right = Authorized.check(accessRight) || {
      rights: 'hidden',
    }
    if (right.rights === 'enable' && !isEnableEditOrder) {
      right = { rights: 'disable' }
    }
    return right
  }

  const handleExpandedGroupsChange = e => {
    setExpandedGroups(e)
  }

  useEffect(() => {
    setCheckedStatusIncldGST(orders.isGSTInclusive)

    const settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { isEnablePackage = false } = settings

    const packageItems = rows.filter(item => item.isPackage && !item.isDeleted)
    const existPackage = isEnablePackage && packageItems.length > 0
    setIsExistPackage(existPackage)

    if (existPackage && rows) {
      const groups = rows.reduce(
        (distinct, data) =>
          distinct.includes(data.packageGlobalId)
            ? [...distinct]
            : [...distinct, data.packageGlobalId],
        [],
      )

      setExpandedGroups(groups)
    }
  }, [orders])

  const adjustments = finalAdjustments.filter(o => !o.isDeleted)

  const OrderAccessRight = () => {
    let editAccessRight = ''
    if (from === 'EditOrder') {
      editAccessRight = 'queue.dispense.editorder'
    } else if (from === 'Consultation') {
      editAccessRight = 'queue.consultation.widgets.order'
    }
    return editAccessRight
  }

  const OrderItemAccessRight = row => {
    let editAccessRight
    const orderType = orderTypes.find(item => item.value === row.type) || {
      accessRight: '',
    }
    editAccessRight = orderType.accessRight

    if (from === 'EditOrder') {
      const EditOrderAccessRight = Authorized.check('queue.dispense.editorder')
      if (!EditOrderAccessRight || EditOrderAccessRight.rights !== 'enable')
        editAccessRight = 'queue.dispense.editorder'
      else if (row.isOrderedByDoctor) {
        const itemAccessRight = Authorized.check(editAccessRight)
        if (itemAccessRight && itemAccessRight.rights === 'enable') {
          editAccessRight = 'queue.dispense.editorder.modifydoctororder'
        }
      }
    } else if (from === 'Consultation') {
      const consultaionAccessRight = Authorized.check(
        'queue.consultation.widgets.order',
      )
      if (!consultaionAccessRight || consultaionAccessRight.rights !== 'enable')
        editAccessRight = 'queue.consultation.widgets.order'
    }
    return editAccessRight
  }

  const editRow = row => {
    if (!isEnableEditOrder) return
    const { workitem = {} } = row
    const { nurseWorkitem = {}, radiologyWorkitem = {} } = workitem
    const { nuseActualize = [] } = nurseWorkitem
    if (!row.isPreOrder) {
      if (
        (row.type === ORDER_TYPES.RADIOLOGY &&
          radiologyWorkitem.statusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED) ||
        nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
      ) {
        return
      }
    }

    if (row.isPreOrderActualize) return
    if (
      !row.isActive &&
      row.type !== ORDER_TYPES.OPEN_PRESCRIPTION &&
      !row.isDrugMixture
    )
      return

    if (row.type === ORDER_TYPES.TREATMENT && from !== 'EditOrder') return

    const editAccessRight = OrderItemAccessRight(row)

    const accessRight = Authorized.check(editAccessRight)
    if (!accessRight || accessRight.rights !== 'enable') return
    if (row.type === ORDER_TYPES.RADIOLOGY) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: {
            radiologyItems: [{ ...row }],
            editServiceId: row.serviceFK,
            selectCategory: 'All',
            selectTag: 'All',
            filterService: '',
            serviceCenterFK: row.serviceCenterFK,
            quantity: row.quantity,
            total: row.total,
            totalAfterItemAdjustment: row.totalAfterItemAdjustment,
          },
          type: row.type,
        },
      })
    } else if (row.type === ORDER_TYPES.LAB) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: {
            labItems: [{ ...row }],
            editServiceId: row.serviceFK,
            selectCategory: 'All',
            selectTag: 'All',
            filterService: '',
            serviceCenterFK: row.serviceCenterFK,
            quantity: row.quantity,
            total: row.total,
            totalAfterItemAdjustment: row.totalAfterItemAdjustment,
          },
          type: row.type,
        },
      })
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: row,
          isPreOrderItemExists: false,
          type: row.type,
        },
      })
    }
    if (row.type === '7') {
      const treatment =
        (codetable.cttreatment || []).find(
          o => o.isActive && o.id === row.treatmentFK,
        ) || {}
      const action = (codetable.ctchartmethod || []).find(
        o => o.id === treatment.chartMethodFK,
      )
      dispatch({
        type: 'dentalChartComponent/updateState',
        payload: {
          mode: 'treatment',
          action,
        },
      })
    }
  }
  const addAdjustment = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'addFinalAdjustment',
          },
          showRemark: true,
          showAmountPreview: false,
          rows,
          adjustments,
          editAdj: undefined,
          defaultValues: {
            initialAmout: total,
          },
        },
      },
    })
  }

  const editAdjustment = adj => {
    dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'editFinalAdjustment',
          },
          showRemark: true,
          showAmountPreview: false,
          rows,
          adjustments,
          editAdj: adj,
          defaultValues: {
            ...adj,
            initialAmout: total,
          },
        },
      },
    })
  }
  const totalItems = [
    ...adjustments.map(o => ({
      columnName: 'currentTotal',
      type: `${o.uid}`,
    })),
  ]
  const messages = {
    total: 'Total',
    subTotal: 'Sub Total',
  }

  if (gstValue >= 0) {
    messages.gst = (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          marginLeft: theme.spacing(1),
        }}
      >
        <AuthorizedContext.Provider
          value={getOrderAccessRight(OrderAccessRight())}
        >
          <Checkbox
            simple
            label={`Inclusive GST (${numeral(gstValue).format('0.00')}%)`}
            style={{
              position: 'absolute',
              marginTop: -1,
            }}
            controlStyle={{ fontWeight: 500 }}
            checked={checkedStatusIncldGST}
            onChange={e => {
              dispatch({
                type: 'orders/updateState',
                payload: {
                  isGSTInclusive: e.target.value,
                },
              })
              dispatch({
                type: 'orders/calculateAmount',
              })
            }}
          />
        </AuthorizedContext.Provider>
      </div>
    )
  }
  totalItems.push({ columnName: 'currentTotal', type: 'gst' })

  totalItems.push({ columnName: 'currentTotal', type: 'total' })
  totalItems.push({ columnName: 'currentTotal', type: 'subTotal' })
  adjustments.forEach(adj => {
    messages[adj.uid] = (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div
          style={{
            width: isExistPackage ? '54%' : '58%',
            overflow: 'hidden',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            marginLeft: theme.spacing(-1),
            textAlign: 'right',
            position: 'absolute',
          }}
        >
          <Tooltip title={adj.adjRemark}>
            <span>{adj.adjRemark}</span>
          </Tooltip>
        </div>
        <AuthorizedContext.Provider
          value={getOrderAccessRight(OrderAccessRight())}
        >
          <div
            style={{
              marginLeft: isExistPackage
                ? theme.spacing(31.5)
                : theme.spacing(36.5),
              position: 'absolute',
            }}
          >
            <Tooltip title='Edit Adjustment'>
              <Button
                justIcon
                color='primary'
                style={{
                  top: -1,
                }}
              >
                <Edit onClick={() => editAdjustment(adj)} />
              </Button>
            </Tooltip>
            <Tooltip title='Delete Adjustment'>
              <Button
                justIcon
                color='danger'
                style={{
                  top: -1,
                }}
              >
                <Delete
                  onClick={() =>
                    dispatch({
                      type: 'orders/deleteFinalAdjustment',
                      payload: {
                        uid: adj.uid,
                      },
                    })
                  }
                />
              </Button>
            </Tooltip>
          </div>
        </AuthorizedContext.Provider>
      </div>
    )
  })

  const isEditingEntity = !_.isEmpty(orders.entity)

  const wrapCellTextStyle = {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }

  const drugMixtureIndicator = (row, right) => {
    if (row.type !== '1' || !row.isDrugMixture) return null
    const activePrescriptionItemDrugMixture = row.corPrescriptionItemDrugMixture.filter(
      item => !item.isDeleted,
    )

    return (
      <DrugMixtureInfo
        values={activePrescriptionItemDrugMixture}
        isShowTooltip={true}
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

  const packageGroupCellContent = ({ row }) => {
    if (row.value === undefined || row.value === '') {
      return (
        <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
          <strong>Non-Package Items</strong>
        </span>
      )
    }

    let label = 'Package'
    let totalPrice = 0
    if (!rows) return ''
    const data = rows.filter(item => item.packageGlobalId === row.value)
    if (data.length > 0) {
      totalPrice = _.sumBy(data, 'totalAfterItemAdjustment') || 0
      label = `${data[0].packageCode} - ${data[0].packageName} (Total: `
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
        <strong>
          {label}
          <NumberInput text currency value={totalPrice} />)
        </strong>
      </span>
    )
  }

  const getDisplayName = row => {
    if (row.type === '10' || row.type === '3') {
      if (row.newServiceName && row.newServiceName.trim() !== '') {
        return row.newServiceName
      }
    }
    return row.subject
  }

  const radiologyWorkitemStatus = radiologyWorkitemStatusFK => {
    if (radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.NEW)
      return (
        <Tooltip title='New'>
          <div
            style={{
              position: 'absolute',
              bottom: 3,
              right: -15,
              borderRadius: 8,
              height: 16,
              width: 16,
              border: '2px solid #4876FF',
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      )

    if (
      radiologyWorkitemStatusFK ===
        RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED ||
      radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.COMPLETED ||
      radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.INPROGRESS
    )
      return (
        <Tooltip
          title={
            radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.INPROGRESS
              ? 'In Progress'
              : radiologyWorkitemStatusFK ===
                RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED
              ? 'Modality Completed'
              : 'Completed'
          }
        >
          <div
            style={{
              position: 'absolute',
              bottom: 3,
              right: -15,
              borderRadius: 8,
              height: 16,
              width: 16,
              backgroundColor:
                radiologyWorkitemStatusFK ===
                RADIOLOGY_WORKITEM_STATUS.INPROGRESS
                  ? '#1890FF'
                  : '#009900',
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      )
    if (radiologyWorkitemStatusFK === RADIOLOGY_WORKITEM_STATUS.CANCELLED)
      return (
        <Tooltip title='Cancelled'>
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -16,
              cursor: 'pointer',
            }}
          >
            <Cross
              style={{ color: 'black', height: 20, width: 20 }}
              color='black'
            />
          </div>
        </Tooltip>
      )
    return ''
  }
  return (
    <CommonTableGrid
      size='sm'
      style={{ margin: 0 }}
      forceRender
      rows={(rows || []).map(r => {
        return {
          ...r,
          currentTotal:
            (!r.isPreOrder && !r.hasPaid) || r.isChargeToday
              ? r.totalAfterItemAdjustment
              : 0,
          isEditingEntity: isEditingEntity,
        }
      })}
      onRowDoubleClick={editRow}
      getRowId={r => r.uid}
      columns={[
        { name: 'type', title: 'Type' },
        { name: 'subject', title: 'Name' },
        { name: 'priority', title: 'Urgent' },
        { name: 'description', title: 'Instructions' },
        { name: 'quantity', title: 'Qty.' },
        { name: 'adjAmount', title: 'Adj.' },
        { name: 'currentTotal', title: 'Total' },
        { name: 'actions', title: 'Actions' },
        { name: 'packageGlobalId', title: 'Package' },
      ]}
      defaultSorting={[
        { columnName: 'packageGlobalId', direction: 'asc' },
        { columnName: 'sequence', direction: 'asc' },
      ]}
      FuncProps={{
        pager: false,
        fixedHiddenColumns: ['packageGlobalId'],
        grouping: isExistPackage,
        groupingConfig: {
          state: {
            grouping: [{ columnName: 'packageGlobalId' }],
            expandedGroups: [...expandedGroups],
            onExpandedGroupsChange: handleExpandedGroupsChange,
          },
          row: {
            contentComponent: packageGroupCellContent,
          },
        },
        summary: true,
        summaryConfig: {
          state: {
            totalItems,
          },
          integrated: {
            calculator: (type, r, getValue) => {
              if (type === 'subTotal') {
                return (
                  <span style={{ float: 'right', paddingRight: 70 }}>
                    <NumberInput value={subTotal} text currency />
                  </span>
                )
              }

              if (type === 'gst') {
                return (
                  <span style={{ float: 'right', paddingRight: 70 }}>
                    <NumberInput value={gst} text currency />
                  </span>
                )
              }

              if (type === 'total') {
                return (
                  <span style={{ float: 'right', paddingRight: 70 }}>
                    <NumberInput value={totalWithGST} text currency />
                  </span>
                )
              }
              const adj = adjustments.find(o => `${o.uid}` === type)
              if (adj) {
                return (
                  <span style={{ float: 'right', paddingRight: 70 }}>
                    <NumberInput value={adj.adjAmount} text currency />
                  </span>
                )
              }

              return IntegratedSummary.defaultCalculator(type, r, getValue)
            },
          },
          row: {
            messages,
            totalRowComponent: p => {
              const { children, ...restProps } = p
              let newChildren = []
              if (isExistPackage) {
                newChildren = [
                  <Table.Cell
                    colSpan={4}
                    key={1}
                    style={{ position: 'relative' }}
                  />,
                  React.cloneElement(children[7], {
                    colSpan: 3,
                    ...restProps,
                  }),
                ]
              } else {
                newChildren = [
                  <Table.Cell
                    colSpan={3}
                    key={1}
                    style={{ position: 'relative' }}
                  />,
                  React.cloneElement(children[6], {
                    colSpan: 2,
                    ...restProps,
                  }),
                ]
              }

              return <Table.Row>{newChildren}</Table.Row>
            },
            itemComponent: p => {
              return (
                <div className={classes.summaryRow}>
                  {messages[p.type]}
                  {p.children}
                </div>
              )
            },
            totalCellComponent: p => {
              const { children, column } = p
              if (column.name === 'currentTotal') {
                const items = children.props.children
                const itemAdj = items.splice(0, items.length - 3)
                const itemGST = items.splice(items.length - 3, items.length - 2)
                const itemTotal = items.splice(
                  items.length - 2,
                  items.length - 1,
                )
                const itemSubTotal = items.splice(items.length - 1)
                return (
                  <Table.Cell
                    colSpan={5}
                    style={{
                      fontSize: 'inherit',
                      color: 'inherit',
                      fontWeight: 500,
                      border: 'transparent',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          marginLeft: isExistPackage
                            ? theme.spacing(23)
                            : theme.spacing(28),
                        }}
                      >
                        {itemSubTotal}
                      </div>
                      <div
                        style={{
                          marginBottom: theme.spacing(1),
                          marginLeft: theme.spacing(1),
                          paddingRight: theme.spacing(8),
                        }}
                      >
                        <Divider />
                      </div>
                      <div
                        style={{
                          marginLeft: isExistPackage
                            ? theme.spacing(15)
                            : theme.spacing(20),
                        }}
                      >
                        <span>
                          Invoice Adjustment
                          <Tooltip title='Add Adjustment'>
                            <AuthorizedContext.Provider
                              value={getOrderAccessRight(OrderAccessRight())}
                            >
                              <Button
                                justIcon
                                color='primary'
                                style={{
                                  top: -1,
                                  marginLeft: theme.spacing(1),
                                }}
                                onClick={addAdjustment}
                              >
                                <Add />
                              </Button>
                            </AuthorizedContext.Provider>
                          </Tooltip>
                        </span>
                      </div>
                      {itemAdj}
                      {gstValue >= 0 && (
                        <div
                          style={{
                            marginLeft: isExistPackage
                              ? theme.spacing(10)
                              : theme.spacing(15),
                          }}
                        >
                          {itemGST}
                        </div>
                      )}
                      <div
                        style={{
                          marginBottom: theme.spacing(1),
                          marginLeft: theme.spacing(1),
                          paddingRight: theme.spacing(8),
                        }}
                      >
                        <Divider />
                      </div>
                      <div
                        style={{
                          marginLeft: isExistPackage
                            ? theme.spacing(26.5)
                            : theme.spacing(31.5),
                        }}
                      >
                        {itemTotal}
                      </div>
                    </div>
                  </Table.Cell>
                )
              }
              return null
            },
          },
        },
      }}
      columnExtensions={[
        {
          columnName: 'type',
          width: 140,
          render: row => {
            const otype = orderTypes.find(o => o.value === row.type)
            let texts = []

            if (row.type === '1') {
              if (row.isDrugMixture === true) texts = 'Drug Mixture'
              else {
                texts = [
                  otype.name,
                  row.isExternalPrescription === true ? '(Ext.)' : '',
                  row.isActive ? '' : '(Inactive)',
                ].join(' ')
              }
            } else {
              texts = [
                otype.name,
                row.type === '5' || row.isActive ? '' : '(Inactive)',
              ].join(' ')
            }

            let radiologyWorkitemStatusFK
            if (row.type === '10' && !row.isPreOrder) {
              const { workitem = {} } = row
              const { radiologyWorkitem = {} } = workitem
              radiologyWorkitemStatusFK = radiologyWorkitem.statusFK
            }

            let paddingRight = 0
            if (row.isPreOrder && row.isExclusive) {
              paddingRight = 52
            } else if (row.isPreOrder || row.isExclusive) {
              paddingRight = 24
            }

            if (row.isDrugMixture || radiologyWorkitemStatusFK) {
              paddingRight = 10
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
                  <Tooltip title={texts}>
                    <span>{texts}</span>
                  </Tooltip>
                  <div style={{ position: 'relative', top: 2 }}>
                    {drugMixtureIndicator(row, -20)}
                    {row.isPreOrder && (
                      <Tooltip title='New Pre-Order'>
                        <div
                          className={classes.rightIcon}
                          style={{
                            right: -30,
                            borderRadius: 4,
                            backgroundColor: '#4255bd',
                          }}
                        >
                          Pre
                        </div>
                      </Tooltip>
                    )}
                    {row.actualizedPreOrderItemFK && (
                      <Tooltip title='Actualized Pre-Order'>
                        <div
                          className={classes.rightIcon}
                          style={{
                            right: -5,
                            borderRadius: 4,
                            backgroundColor: 'green',
                          }}
                        >
                          Pre
                        </div>
                      </Tooltip>
                    )}
                    {row.isExclusive && (
                      <Tooltip title='The item has no local stock, we will purchase on behalf and charge to patient in invoice'>
                        <div
                          className={classes.rightIcon}
                          style={{
                            right:
                              row.isPreOrder || row.actualizedPreOrderItemFK
                                ? -60
                                : -30,
                            borderRadius: 4,
                            backgroundColor: 'green',
                          }}
                        >
                          Excl.
                        </div>
                      </Tooltip>
                    )}
                    {radiologyWorkitemStatusFK &&
                      radiologyWorkitemStatus(radiologyWorkitemStatusFK)}
                  </div>
                </div>
              </div>
            )
          },
        },
        {
          columnName: 'subject',
          render: row => {
            return (
              <div style={{ position: 'relative' }}>
                <Tooltip
                  title={
                    <div>
                      {`Code: ${row.serviceCode ||
                        row.drugCode ||
                        row.consumableCode ||
                        row.vaccinationCode}`}
                      <br />
                      {`Name: ${getDisplayName(row)}`}
                    </div>
                  }
                >
                  <div style={wrapCellTextStyle}>
                    {packageDrawdownIndicator(row)}
                    <div
                      style={{
                        position: 'relative',
                        left: row.isPackage ? 22 : 0,
                      }}
                    >
                      {getDisplayName(row)}
                    </div>
                  </div>
                </Tooltip>
              </div>
            )
          },
        },
        {
          columnName: 'description',
          width: isFullScreen ? 300 : isExistPackage ? 120 : 160,
          observeFields: ['instruction', 'remark', 'remarks'],
          render: row => {
            return (
              <Tooltip title={row.instruction}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.instruction || ''}
                </div>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'adjAmount',
          type: 'currency',
          width: 80,
        },
        {
          columnName: 'currentTotal',
          type: 'currency',
          width: 100,
        },
        {
          columnName: 'quantity',
          type: 'number',
          width: 100,
          render: row => {
            let qty = '0.0'
            if (row.type === '1' || row.type === '5' || row.type === '2') {
              qty = `${numeral(row.quantity || 0).format(
                '0,0.0',
              )} ${row.dispenseUOMDisplayValue || ''}`
            } else if (
              row.type === '3' ||
              row.type === '7' ||
              row.type === '10'
            ) {
              qty = `${numeral(row.quantity || 0).format('0,0.0')}`
            } else if (row.type === '4') {
              qty = `${numeral(row.quantity || 0).format('0,0.0')} ${
                row.unitOfMeasurement
              }`
            }
            return (
              <Tooltip title={qty}>
                <span>{qty}</span>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'actions',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: row => {
            if (row.type === '7' && from !== 'EditOrder') return null

            const editAccessRight = OrderItemAccessRight(row)
            const { workitem = {} } = row
            const {
              nurseWorkitem = {},
              radiologyWorkitem = {},
              labWorkitems = [],
            } = workitem
            const { nuseActualize = [] } = nurseWorkitem
            let editMessage = 'Edit'
            let deleteMessage = 'Delete'
            let editEnable = true
            let deleteEnable = true
            if (!row.isPreOrder) {
              if (row.type === ORDER_TYPES.RADIOLOGY) {
                if (
                  [
                    RADIOLOGY_WORKITEM_STATUS.INPROGRESS,
                    RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED,
                    RADIOLOGY_WORKITEM_STATUS.COMPLETED,
                  ].indexOf(radiologyWorkitem.statusFK) >= 0
                ) {
                  deleteEnable = false
                  deleteMessage =
                    'No modification is allowed on processed order'
                }
                if (
                  radiologyWorkitem.statusFK ===
                  RADIOLOGY_WORKITEM_STATUS.CANCELLED
                ) {
                  editEnable = false
                }
              } else if (row.type === ORDER_TYPES.LAB) {
                if (
                  labWorkitems.filter(
                    item => item.statusFK !== LAB_WORKITEM_STATUS.NEW,
                  ).length > 0
                ) {
                  editEnable = false
                  deleteEnable = false
                  deleteMessage =
                    'Specimen Collected. No modification is allowed on processed order'
                }
              } else {
                if (
                  nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
                ) {
                  editEnable = false
                  deleteEnable = false
                  const lastNuseActualize = _.orderBy(
                    nuseActualize,
                    ['actulizeDate'],
                    ['desc'],
                  )[0]
                  deleteMessage = editMessage = `Item actualized by ${lastNuseActualize.actulizeByUser}. Modification allowed after nurse cancel actualization`
                }
              }
            }
            return (
              <AuthorizedContext.Provider
                value={getOrderAccessRight(editAccessRight)}
              >
                <div>
                  <Tooltip title={editMessage}>
                    <Button
                      size='sm'
                      onClick={() => {
                        editRow(row)
                      }}
                      justIcon
                      color='primary'
                      style={{ marginRight: 5 }}
                      disabled={
                        row.isEditingEntity ||
                        (!row.isActive &&
                          row.type !== '5' &&
                          !row.isDrugMixture) ||
                        row.isPreOrderActualize ||
                        !editEnable
                      }
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Tooltip title={deleteMessage}>
                    <span>
                      <Button
                        size='sm'
                        color='danger'
                        justIcon
                        disabled={
                          row.isEditingEntity ||
                          row.isPreOrderActualize ||
                          !deleteEnable
                        }
                      >
                        <Delete
                          onClick={() => {
                            dispatch({
                              type: 'orders/deleteRow',
                              payload: {
                                uid: row.uid,
                              },
                            })

                            if (row.isPackage === true) {
                              dispatch({
                                type: 'orders/deletePackageItem',
                                payload: {
                                  packageGlobalId: row.packageGlobalId,
                                },
                              })
                            }

                            dispatch({
                              type: 'orders/updateState',
                              payload: {
                                entity: undefined,
                              },
                            })
                            // let commitCount = 1000 // uniqueNumber
                            // dispatch({
                            //   // force current edit row components to update
                            //   type: 'global/updateState',
                            //   payload: {
                            //     commitCount: (commitCount += 1),
                            //   },
                            // })
                          }}
                        />
                      </Button>
                    </span>
                  </Tooltip>
                </div>
              </AuthorizedContext.Provider>
            )
          },
        },
        {
          columnName: 'priority',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: row => {
            if (
              row.type !== ORDER_TYPES.RADIOLOGY &&
              row.type !== ORDER_TYPES.SERVICE &&
              row.type !== ORDER_TYPES.LAB
            )
              return ''
            const editAccessRight = OrderItemAccessRight(row)
            const { workitem = {} } = row
            const {
              nurseWorkitem = {},
              radiologyWorkitem = {
                statusFK: RADIOLOGY_WORKITEM_STATUS.NEW,
              },
              labWorkitems = [],
            } = workitem
            let editEnable = true
            if (!row.isPreOrder) {
              if (row.type === ORDER_TYPES.RADIOLOGY) {
                if (
                  radiologyWorkitem.statusFK !== RADIOLOGY_WORKITEM_STATUS.NEW
                ) {
                  editEnable = false
                }
              } else if (
                nurseWorkitem.statusFK === NURSE_WORKITEM_STATUS.ACTUALIZED
              ) {
                editEnable = false
              } else if (row.type === ORDER_TYPES.LAB) {
                if (
                  labWorkitems.filter(
                    item => item.statusFK !== LAB_WORKITEM_STATUS.NEW,
                  ).length > 0
                )
                  editEnable = false
              }
            }
            return (
              <AuthorizedContext.Provider
                value={getOrderAccessRight(editAccessRight)}
              >
                <Switch
                  checkedValue='Urgent'
                  unCheckedValue='Normal'
                  value={row.priority}
                  className={classes.switchContainer}
                  preventToggle
                  disabled={
                    row.isEditingEntity ||
                    row.isPreOrderActualize ||
                    !editEnable
                  }
                  onClick={checked => {
                    dispatch({
                      type: 'orders/updatePriority',
                      payload: {
                        uid: row.uid,
                        priority: checked ? 'Urgent' : 'Normal',
                      },
                    })
                  }}
                />
              </AuthorizedContext.Provider>
            )
          },
        },
      ]}
    />
  )
}
