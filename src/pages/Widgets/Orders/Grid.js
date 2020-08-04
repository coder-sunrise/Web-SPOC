import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi/locale'
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
  Popconfirm,
  Tooltip,
  NumberInput,
  Select,
  Checkbox,
} from '@/components'
import { orderTypes } from '@/pages/Consultation/utils'
import Authorized from '@/utils/Authorized'

// console.log(orderTypes)
export default ({ orders, dispatch, classes, from, codetable }) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST, subTotal } = summary
  const [
    checkedStatusIncldGST,
    setCheckedStatusIncldGST,
  ] = useState(isGSTInclusive)

  useEffect(
    () => {
      setCheckedStatusIncldGST(orders.isGSTInclusive)
    },
    [
      orders,
    ],
  )

  const adjustments = finalAdjustments.filter((o) => !o.isDeleted)
  const editRow = (row) => {
    if (!row.isActive && row.type !== '5') return

    dispatch({
      type: 'orders/updateState',
      payload: {
        entity: row,
        type: row.type,
        // adjustment: {
        //   adjValue: row.adjValue,
        //   adjAmount: row.adjAmount,
        //   adjType: row.adjType,
        // },
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

    // dispatch({
    //   // force current edit row components to update
    //   type: 'global/incrementCommitCount',
    // })
  }
  // console.log(total, summary)
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
          defaultValues: {
            // ...this.props.orders.entity,
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
          overflow: 'hidden',
          display: 'inline-block',
          textOverflow: 'ellipsis',
          position: 'relative',
        }}
      >
        <Checkbox
          simple
          label=''
          style={{ position: 'absolute', marginTop: -1 }}
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
        <span
          style={{
            marginLeft: 18,
            fontWeight: 500,
          }}
        >
          Inclusive
        </span>
        <span
          style={{
            marginLeft: 4,
            fontWeight: 500,
          }}
        >
          GST ({numeral(gstValue).format('0.00')}%)
        </span>
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
            width: '60%',
            overflow: 'hidden',
            display: 'inline-block',
            textOverflow: 'ellipsis',
            marginLeft: 10,
            textAlign: 'right',
            position: 'absolute',
          }}
        >
          <Tooltip title={adj.adjRemark}>
            <span>{adj.adjRemark}</span>
          </Tooltip>
        </div>
        <div
          style={{
            marginLeft: 320,
            position: 'absolute',
          }}
        >
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
      </div>
    )
  })

  const isEditingEntity = !_.isEmpty(orders.entity)

  return (
    <CommonTableGrid
      size='sm'
      style={{ margin: 0 }}
      rows={rows}
      onRowDoubleClick={editRow}
      getRowId={(r) => r.uid}
      columns={[
        { name: 'type', title: 'Type' },
        { name: 'subject', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'adjAmount', title: 'Adj.' },
        { name: 'totalAfterItemAdjustment', title: 'Total' },
        { name: 'actions', title: 'Actions' },
      ]}
      FuncProps={{
        pager: false,
        summary: true,
        summaryConfig: {
          state: {
            totalItems,
          },
          integrated: {
            calculator: (type, r, getValue) => {
              // console.log(type, rows, getValue)
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
              const newChildren = [
                <Table.Cell colSpan={2} key={1} />,
                React.cloneElement(children[4], {
                  colSpan: 2,
                  ...restProps,
                }),
              ]
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
                      <div style={{ marginLeft: 252 }}>{itemSubTotal}</div>
                      <div
                        style={{
                          marginBottom: 3,
                          marginLeft: 10,
                          paddingRight: 70,
                        }}
                      >
                        <Divider />
                      </div>
                      <div style={{ marginLeft: 188 }}>
                        <span>
                          Invoice Adjustment
                          <Tooltip title='Add Adjustment'>
                            <Button
                              justIcon
                              color='primary'
                              style={{ top: -1, marginLeft: 8 }}
                              onClick={addAdjustment}
                            >
                              <Add />
                            </Button>
                          </Tooltip>
                        </span>
                      </div>
                      {itemAdj}
                      {gstValue >= 0 && (
                        <div style={{ marginLeft: 154 }}>{itemGST}</div>
                      )}
                      <div
                        style={{
                          marginTop: 3,
                          marginLeft: 10,
                          paddingRight: 70,
                        }}
                      >
                        <Divider />
                      </div>
                      <div style={{ marginLeft: 280 }}>{itemTotal}</div>
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
            const texts = [
              otype.name,
              row.isExternalPrescription === true ? '(Ext.)' : '',
              row.type === '5' || row.isActive ? '' : '(Inactive)',
            ].join(' ')

            return (
              <Tooltip title={texts}>
                <div
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {texts}
                </div>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'subject',
          render: (row) => {
            return (
              <div
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {row.subject}
              </div>
            )
          },
        },
        {
          columnName: 'description',
          width: 260,
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
          // align: 'right',
          type: 'currency',
          width: 100,
          // render: (r) => {
          //   if (!r.totalAfterItemAdjustment) return ''
          //   return (
          //     <NumberInput text currency value={r.totalAfterItemAdjustment} />
          //   )
          // },
        },

        {
          columnName: 'actions',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            if (row.type === '7' && from !== 'ca') return null
            const orderType = orderTypes.find(
              (item) => item.value === row.type,
            ) || { accessRight: '' }
            const { accessRight } = orderType
            return (
              <Authorized authority={accessRight}>
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
                        isEditingEntity || (!row.isActive && row.type !== '5')
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
