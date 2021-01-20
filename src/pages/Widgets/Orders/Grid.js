import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { Divider } from '@material-ui/core'

import numeral from 'numeral'
import {
  CommonTableGrid,
  Button,
  Tooltip,
  NumberInput,
  Checkbox,
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
}) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST, subTotal } = summary
  const [
    checkedStatusIncldGST,
    setCheckedStatusIncldGST,
  ] = useState(isGSTInclusive)

  const [
    isExistPackage,
    setIsExistPackage,
  ] = useState(false)

  const [
    expandedGroups,
    setExpandedGroups,
  ] = useState([])

  const handleExpandedGroupsChange = (e) => {
    setExpandedGroups(e)
  }

  useEffect(
    () => {
      setCheckedStatusIncldGST(orders.isGSTInclusive) 
      
      const settings = JSON.parse(localStorage.getItem('clinicSettings'))
      const { isEnablePackage = false } = settings

      const packageItems = rows.filter(item => item.isPackage)
      const existPackage = isEnablePackage && packageItems.length > 0
      setIsExistPackage(existPackage)

      if (existPackage && rows) {
        const groups = rows.reduce(
          (distinct, data) =>
            distinct.includes(data.packageGlobalId)
              ? [
                  ...distinct,
                ]
              : [
                  ...distinct,
                  data.packageGlobalId,
                ],
          [],
        )
  
        setExpandedGroups(groups)
      }
    },
    [
      orders,
    ],
  )

  const adjustments = finalAdjustments.filter((o) => !o.isDeleted)

  const OrderAccessRight = () => {
    let editAccessRight = ''
    if (from === 'EditOrder') {
      editAccessRight = 'queue.dispense.editorder'
    } else if (from === 'Consultation') {
      editAccessRight = 'queue.consultation.widgets.order'
    }
    return editAccessRight
  }

  const OrderItemAccessRight = (row) => {
    let editAccessRight
    const orderType = orderTypes.find((item) => item.value === row.type) || {
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

  const editRow = (row) => {
    if (!row.isActive && row.type !== '5' && !row.isDrugMixture) return

    if (row.type === '7' && from !== 'EditOrder') return

    const editAccessRight = OrderItemAccessRight(row)

    const accessRight = Authorized.check(editAccessRight)
    if (!accessRight || accessRight.rights !== 'enable') return

    dispatch({
      type: 'orders/updateState',
      payload: {
        entity: row,
        type: row.type,
      },
    })
    if (row.type === '7') {
      const treatment =
        (codetable.cttreatment || [])
          .find((o) => o.isActive && o.id === row.treatmentFK) || {}
      const action = (codetable.ctchartmethod || [])
        .find((o) => o.id === treatment.chartMethodFK)
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

  const editAdjustment = (adj) => {
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
    ...adjustments.map((o) => ({
      columnName: 'totalAfterItemAdjustment',
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
        <Authorized authority={OrderAccessRight()}>
          <Checkbox
            simple
            label={`Inclusive GST (${numeral(gstValue).format('0.00')}%)`}
            style={{
              position: 'absolute',
              marginTop: -1,
            }}
            controlStyle={{ fontWeight: 500 }}
            checked={checkedStatusIncldGST}
            onChange={(e) => {
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
        </Authorized>
      </div>
    )
  }
  totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'gst' })

  totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'total' })
  totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'subTotal' })
  adjustments.forEach((adj) => {
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
        <Authorized authority={OrderAccessRight()}>
          <div
            style={{
              marginLeft: isExistPackage ? theme.spacing(34.5) : theme.spacing(36.5),
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
                    })}
                />
              </Button>
            </Tooltip>
          </div>
        </Authorized>
      </div>
    )
  })

  const isEditingEntity = !_.isEmpty(orders.entity)

  const wrapCellTextStyle = {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }

  const drugMixtureIndicator = (row) => {
    if (row.type !== '1' || !row.isDrugMixture) return null
    const activePrescriptionItemDrugMixture = row.corPrescriptionItemDrugMixture.filter(
      (item) => !item.isDeleted,
    )

    return (
      <div style={{ position: 'relative', top: 2 }}>
        <DrugMixtureInfo
          values={activePrescriptionItemDrugMixture}
          isShowTooltip={false}
        />
      </div>
    )
  }

  const packageDrawdownIndicator = (row) => {
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
    if (row.value === undefined || row.value === '')
      return null

    let label = 'Package'
    let totalPrice = 0
    if (!rows) return ''
    const data = rows.filter(
      (item) => item.packageGlobalId === row.value,
    )
    if (data.length > 0) {
      totalPrice = _.sumBy(data, 'totalAfterItemAdjustment') || 0
      label = `${data[0].packageCode} - ${data[0].packageName} (Total: `
    }
    return (
      <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
        <strong>
          {label} 
          <NumberInput text currency value={totalPrice} />
          )        
        </strong>
      </span>
    )
  }

  let newColumns = [        
    { name: 'type', title: 'Type' },
    { name: 'subject', title: 'Name' },
    { name: 'description', title: 'Description' },
    { name: 'adjAmount', title: 'Adj.' },
    { name: 'totalAfterItemAdjustment', title: 'Total' },
    { name: 'actions', title: 'Actions' },    
  ]

  if (isExistPackage) {
    newColumns.push({
      name: 'packageGlobalId',
      title: 'Package',
    })
  }

  return (
    <CommonTableGrid
      size='sm'
      style={{ margin: 0 }}
      forceRender
      rows={rows}
      onRowDoubleClick={editRow}
      getRowId={(r) => r.uid}
      columns={newColumns}
      defaultSorting={[
        { columnName: 'packageGlobalId', direction: 'asc' },
        { columnName: 'sequence', direction: 'asc' },
      ]}
      FuncProps={{
        pager: false,
        grouping: isExistPackage,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'packageGlobalId' },
            ],
            expandedGroups: [
              ...expandedGroups,
            ],
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
              const adj = adjustments.find((o) => `${o.uid}` === type)
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
            totalRowComponent: (p) => {              
              const { children, ...restProps } = p              
              let newChildren = []
              if (isExistPackage) {
                newChildren = [
                  <Table.Cell colSpan={3} key={1} />,
                  React.cloneElement(children[5], {
                    colSpan: 3,
                    ...restProps,
                  }),
                ]
              }
              else {
                newChildren = [
                  <Table.Cell colSpan={2} key={1} />,
                  React.cloneElement(children[4], {
                    colSpan: 2,
                    ...restProps,
                  }),
                ]
              }
              
              return <Table.Row>{newChildren}</Table.Row>
            },
            itemComponent: (p) => {
              return (
                <div className={classes.summaryRow}>
                  {messages[p.type]}
                  {p.children}
                </div>
              )
            },
            totalCellComponent: (p) => {
              const { children, column } = p
              if (column.name === 'totalAfterItemAdjustment') {
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
                    colSpan={4}
                    style={{
                      fontSize: 'inherit',
                      color: 'inherit',
                      fontWeight: 500,
                      border: 'transparent',
                    }}
                  >
                    <div>
                      <div style={{ marginLeft: isExistPackage ? theme.spacing(26) : theme.spacing(31) }}>
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
                      <div style={{ marginLeft: isExistPackage ? theme.spacing(18) : theme.spacing(20) }}>
                        <span>
                          Invoice Adjustment
                          <Tooltip title='Add Adjustment'>
                            <Authorized authority={OrderAccessRight()}>
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
                            </Authorized>
                          </Tooltip>
                        </span>
                      </div>
                      {itemAdj}
                      {gstValue >= 0 && (
                        <div style={{ marginLeft: isExistPackage ? theme.spacing(13) : theme.spacing(15) }}>
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
                      <div style={{ marginLeft: isExistPackage ? theme.spacing(29.5) : theme.spacing(31.5) }}>
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
          width: 150,
          render: (row) => {
            const otype = orderTypes.find((o) => o.value === row.type)
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

            return (
              <Tooltip title={texts}>
                <div style={wrapCellTextStyle}>
                  {texts}
                  {drugMixtureIndicator(row)}
                </div>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'subject',
          render: (row) => {
            return (
              <div style={wrapCellTextStyle}>
                {packageDrawdownIndicator(row)}
                <div style={{
                    position: 'relative',
                    left: row.isPackage ? 22 : 0,
                  }}
                >
                  {row.subject}
                </div>
              </div>
            )
          },
        },
        {
          columnName: 'description',
          width: isExistPackage ? 220 : 260,
          observeFields: [
            'instruction',
            'remark',
            'remarks',
          ],
          render: (row) => {
            return (
              <Tooltip title={row.instruction}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.instruction || row.remark || row.remarks || ''}
                </div>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'adjAmount',
          type: 'currency',
          width: 90,
        },
        {
          columnName: 'totalAfterItemAdjustment',
          type: 'currency',
          width: 100,
        },

        {
          columnName: 'actions',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            if (row.type === '7' && from !== 'EditOrder') return null

            const editAccessRight = OrderItemAccessRight(row)

            return (
              <Authorized authority={editAccessRight}>
                <div>
                  <Tooltip title='Edit'>
                    <Button
                      size='sm'
                      onClick={() => {
                        editRow(row)
                      }}
                      justIcon
                      color='primary'
                      style={{ marginRight: 5 }}
                      disabled={
                        isEditingEntity ||
                        (!row.isActive &&
                          row.type !== '5' &&
                          !row.isDrugMixture)
                      }
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <Button
                      size='sm'
                      color='danger'
                      justIcon
                      disabled={isEditingEntity}
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
                  </Tooltip>
                </div>
              </Authorized>
            )
          },
        },        
      ]}
    />
  )
}
