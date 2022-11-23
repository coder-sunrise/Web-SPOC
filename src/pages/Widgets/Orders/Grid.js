import React, { useState, useEffect, Fragment } from 'react'
import _ from 'lodash'
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Divider } from '@material-ui/core'
import Cross from '@material-ui/icons/HighlightOff'
import { isMatchInstructionRule } from '@/pages/Widgets/Orders/utils'
import {
  calculateAdjustAmount,
  getUniqueId,
  getTranslationValue,
} from '@/utils/utils'
import { currencySymbol, currencyFormat } from '@/utils/config'
import { Link } from 'umi'
import { orderItemTypes } from '@/utils/codes'

import numeral from 'numeral'
import { ORDER_TYPES, INVENTORY_TYPE, VISIT_TYPE } from '@/utils/constants'
import {
  CommonTableGrid,
  Tooltip,
  CommonModal,
  NumberInput,
  Checkbox,
  notification,
  Switch,
  AuthorizedContext,
} from '@/components'
import { Button } from 'antd'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'
import moment from 'moment'
export default ({
  orders,
  dispatch,
  classes,
  from = 'Consultation',
  codetable,
  theme,
  user,
  patient,
  isFullScreen = false,
  isEnableEditOrder = true,
  visitRegistration,
  consultationDocument,
}) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST, subTotal } = summary
  const [checkedStatusIncldGST, setCheckedStatusIncldGST] = useState(
    isGSTInclusive,
  )

  const [expandedGroups, setExpandedGroups] = useState([])

  const getOrderAccessRight = (accessRight, isEnableEditOrder) => {
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

    if (!row.isActive) return

    const editAccessRight = OrderItemAccessRight(row)

    const accessRight = Authorized.check(editAccessRight)
    if (!accessRight || accessRight.rights !== 'enable') return
    if (row.type === ORDER_TYPES.SERVICE) {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: {
            serviceItems: [{ ...row }],
            editServiceId: row.serviceFK,
            selectCategory: 'All',
            selectTag: 'All',
            filterService: '',
            serviceCenterFK: row.serviceCenterFK,
            quantity: row.quantity,
            total: row.total,
            totalAfterItemAdjustment: row.totalAfterItemAdjustment,
            isMinus: row.isMinus,
            adjValue: row.adjValue,
            adjType: row.adjType,
          },
          type: row.type,
        },
      })
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          entity: row,
          type: row.type,
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
    total: (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 175,
        }}
      >
        <div>Total</div>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput
            value={totalWithGST}
            text
            currency
            style={{ width: 90 }}
          />
        </div>
      </div>
    ),
    subTotal: (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 175,
        }}
      >
        <div>Sub Total</div>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput value={subTotal} text currency style={{ width: 90 }} />
        </div>
      </div>
    ),
  }

  if (gstValue >= 0) {
    messages.gst = (
      <div
        style={{
          textAlign: 'right',
          position: 'relative',
          paddingRight: 175,
        }}
      >
        <AuthorizedContext.Provider
          value={getOrderAccessRight(OrderAccessRight(), isEnableEditOrder)}
        >
          {/* TODO: Show based on setting */}
          {/* <Checkbox
            simple
            label={`Inclusive GST (${numeral(gstValue).format('0.00')}%)`}
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
          /> */}
          <span>{`GST Amount (${numeral(gstValue).format('0.00')}%)`}</span>
        </AuthorizedContext.Provider>
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput value={gst} text currency style={{ width: 90 }} />
        </div>
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
          textAlign: 'right',
          position: 'relative',
          paddingRight: 225,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'right',
            margin: '6px 0px',
          }}
        >
          <Tooltip title={adj.adjRemark}>
            <span>{adj.adjRemark}</span>
          </Tooltip>
        </div>
        {getOrderAccessRight(OrderAccessRight(), isEnableEditOrder).rights !==
          'hidden' && (
          <div
            style={{
              position: 'absolute',
              right: 160,
              top: 0,
            }}
          >
            <Tooltip title='Edit Adjustment'>
              <Button
                size='small'
                type='primary'
                style={{
                  top: -1,
                }}
                onClick={() => editAdjustment(adj)}
                disabled={
                  getOrderAccessRight(OrderAccessRight(), isEnableEditOrder)
                    .rights !== 'enable'
                }
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
            <Tooltip title='Delete Adjustment'>
              <Button
                size='small'
                type='danger'
                style={{
                  top: -1,
                  marginLeft: 8,
                }}
                disabled={
                  getOrderAccessRight(OrderAccessRight(), isEnableEditOrder)
                    .rights !== 'enable'
                }
                onClick={() =>
                  dispatch({
                    type: 'orders/deleteFinalAdjustment',
                    payload: {
                      uid: adj.uid,
                    },
                  })
                }
                icon={<DeleteFilled />}
              ></Button>
            </Tooltip>
          </div>
        )}
        <div style={{ position: 'absolute', right: 68, top: 0 }}>
          <NumberInput
            value={adj.adjAmount}
            text
            currency
            style={{ width: 90 }}
          />
        </div>
      </div>
    )
  })

  const isEditingEntity = !_.isEmpty(orders.entity)

  const wrapCellTextStyle = {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }

  const getDisplayName = row => {
    if (row.type === ORDER_TYPES.SERVICE) {
      if (row.newServiceName && row.newServiceName.trim() !== '') {
        return row.newServiceName
      }
    }
    return row.subject
  }
  return (
    <Fragment>
      <CommonTableGrid
        size='sm'
        style={{ margin: 0 }}
        forceRender
        rows={(rows || [])
          .filter(x => !x.isDeleted)
          .map(r => {
            return {
              ...r,
              currentTotal: r.totalAfterItemAdjustment,
              isEditingEntity: isEditingEntity,
              isEnableEditOrder: isEnableEditOrder,
            }
          })}
        onRowDoubleClick={editRow}
        getRowId={r => r.uid}
        columns={[
          { name: 'type', title: 'Type' },
          { name: 'subject', title: 'Name' },
          // { name: 'priority', title: 'Urgent' },
          // { name: 'description', title: 'Instructions' },
          { name: 'quantity', title: 'Qty.' },
          { name: 'adjAmount', title: 'Adj.' },
          { name: 'currentTotal', title: 'Total' },
          { name: 'actions', title: 'Actions' },
        ]}
        defaultSorting={[{ columnName: 'sequence', direction: 'asc' }]}
        FuncProps={{
          pager: false,
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
                const { entity } = visitRegistration || {}
                const { visit } = entity || {}
                const { children, ...restProps } = p
                let newChildren = []
                newChildren = [
                  <Table.Cell
                    colSpan={2}
                    key={1}
                    style={{
                      position: 'relative',
                      color: 'rgba(0, 0, 0, 1)',
                    }}
                  ></Table.Cell>,
                  React.cloneElement(children[4], {
                    colSpan: 1,
                    ...restProps,
                  }),
                ]

                return <Table.Row>{newChildren}</Table.Row>
              },
              itemComponent: p => {
                return (
                  <div className={classes.summaryRow}>{messages[p.type]}</div>
                )
              },
              totalCellComponent: p => {
                const { children, column } = p
                if (column.name === 'currentTotal') {
                  const items = children.props.children
                  const itemAdj = items.splice(0, items.length - 2)
                  const itemGST = items.splice(
                    items.length - 2,
                    items.length - 1,
                  )
                  const itemTotal = items.splice(items.length - 1, items.length)
                  const itemSubTotal = items.splice(items.length)
                  return (
                    <Table.Cell
                      colSpan={4}
                      style={{
                        fontSize: 'inherit',
                        color: 'inherit',
                        fontWeight: 500,
                        border: 'transparent',
                      }}
                    >
                      <div>
                        {itemSubTotal}
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
                            textAlign: 'right',
                            position: 'relative',
                            paddingRight: 160,
                          }}
                        >
                          <span>
                            Invoice Adjustment
                            {getOrderAccessRight(
                              OrderAccessRight(),
                              isEnableEditOrder,
                            ).rights !== 'hiddent' && (
                              <Tooltip title='Add Adjustment'>
                                <Button
                                  size='small'
                                  type='primary'
                                  style={{
                                    top: -1,
                                    marginLeft: theme.spacing(1),
                                  }}
                                  disabled={
                                    getOrderAccessRight(
                                      OrderAccessRight(),
                                      isEnableEditOrder,
                                    ).rights !== 'enable'
                                  }
                                  onClick={addAdjustment}
                                  icon={<PlusOutlined />}
                                ></Button>
                              </Tooltip>
                            )}
                          </span>
                        </div>
                        {itemAdj}
                        {gstValue >= 0 && itemGST}
                        <div
                          style={{
                            marginBottom: theme.spacing(1),
                            marginLeft: theme.spacing(1),
                            paddingRight: theme.spacing(8),
                          }}
                        >
                          <Divider />
                        </div>
                        {itemTotal}
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
            width: 105,
            render: row => {
              const otype = orderTypes.find(o => o.value === row.type)
              let texts
              let displayText

              const itemType = orderItemTypes.find(
                t => t.type.toUpperCase() === (otype.type || '').toUpperCase(),
              )
              texts = [
                otype.name,
                row.type === '5' || row.isActive ? '' : '(Inactive)',
              ].join(' ')
              displayText = [
                itemType.displayValue,
                row.type === '5' || row.isActive ? '' : '(Inactive)',
              ].join(' ')

              return (
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <Tooltip title={texts}>
                      <span>{displayText}</span>
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
                            className={classes.rightIcon}
                            style={{
                              borderRadius: 4,
                              backgroundColor: 'green',
                              display: 'inline-block',
                            }}
                          >
                            Excl.
                          </div>
                        </Tooltip>
                      )}
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
                        {`Code: ${row.serviceCode || row.consumableCode}`}
                        <br />
                        {`Name: ${getDisplayName(row)}`}
                      </div>
                    }
                  >
                    <div style={wrapCellTextStyle}>
                      <div
                        style={{
                          position: 'relative',
                          left: 0,
                        }}
                        className='threeline_textblock'
                      >
                        {getDisplayName(row)}
                      </div>
                    </div>
                  </Tooltip>
                </div>
              )
            },
          },
          // {
          //   columnName: 'description',
          //   width: isFullScreen ? 300 : 150,
          //   observeFields: ['instruction', 'remark', 'remarks'],
          //   render: row => {
          //     return (
          //       <Tooltip title={row.instruction}>
          //         <div
          //           style={{
          //             wordWrap: 'break-word',
          //             whiteSpace: 'pre-wrap',
          //           }}
          //         >
          //           {row.instruction || ''}
          //         </div>
          //       </Tooltip>
          //     )
          //   },
          // },
          {
            columnName: 'adjAmount',
            type: 'currency',
            width: 80,
          },
          {
            columnName: 'currentTotal',
            type: 'currency',
            width: 90,
          },
          {
            columnName: 'quantity',
            type: 'number',
            width: 90,
            render: row => {
              let qty = '0.0'
              if (row.type === '1' || row.type === '5' || row.type === '2') {
                qty = `${numeral(row.quantity || 0).format(
                  '0,0.0',
                )} ${row.dispenseUOMDisplayValue || ''}`
              } else if (row.type === ORDER_TYPES.SERVICE) {
                qty = `${numeral(row.quantity || 0).format('0,0.0')}`
              } else if (row.type === ORDER_TYPES.CONSUMABLE) {
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
              if (row.isAnyPayment) {
                deleteEnable = false
                deleteMessage = 'Payment made. Item cannot be deleted.'
              }

              if (
                getOrderAccessRight(editAccessRight, row.isEnableEditOrder)
                  .rights === 'hidden'
              )
                return ''
              return (
                <div>
                  <Button
                    size='small'
                    onClick={() => {
                      editRow(row)
                    }}
                    type='primary'
                    style={{ marginRight: 5 }}
                    disabled={
                      row.isEditingEntity ||
                      (!row.isActive && row.type !== '5') ||
                      !editEnable ||
                      getOrderAccessRight(
                        editAccessRight,
                        row.isEnableEditOrder,
                      ).rights !== 'enable'
                    }
                    icon={<EditFilled />}
                  ></Button>
                  <Tooltip title={deleteMessage}>
                    <Button
                      size='small'
                      type='danger'
                      disabled={
                        row.isEditingEntity ||
                        !deleteEnable ||
                        getOrderAccessRight(
                          editAccessRight,
                          row.isEnableEditOrder,
                        ).rights !== 'enable'
                      }
                      onClick={() => {
                        dispatch({
                          type: 'orders/deleteRow',
                          payload: {
                            uid: row.uid,
                          },
                        })

                        dispatch({
                          type: 'orders/updateState',
                          payload: {
                            entity: undefined,
                          },
                        })
                      }}
                      icon={<DeleteFilled />}
                    ></Button>
                  </Tooltip>
                </div>
              )
            },
          },
          // {
          //   columnName: 'priority',
          //   width: 70,
          //   align: 'center',
          //   sortingEnabled: false,
          //   render: row => {
          //     if (row.type !== ORDER_TYPES.SERVICE) return ''
          //     const editAccessRight = OrderItemAccessRight(row)
          //     return (
          //       <AuthorizedContext.Provider
          //         value={getOrderAccessRight(editAccessRight)}
          //       >
          //         <Switch
          //           checkedValue='Urgent'
          //           unCheckedValue='Normal'
          //           value={row.priority}
          //           className={classes.switchContainer}
          //           preventToggle
          //           disabled={row.isEditingEntity}
          //           onClick={checked => {
          //             dispatch({
          //               type: 'orders/updatePriority',
          //               payload: {
          //                 uid: row.uid,
          //                 priority: checked ? 'Urgent' : 'Normal',
          //               },
          //             })
          //           }}
          //         />
          //       </AuthorizedContext.Provider>
          //     )
          //   },
          // },
        ]}
      />
    </Fragment>
  )
}
