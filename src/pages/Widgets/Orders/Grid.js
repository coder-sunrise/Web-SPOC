import React, { useState, useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import _ from 'lodash'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { Table } from '@devexpress/dx-react-grid-material-ui'

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
import { orderTypes } from '@/utils/codes'

// console.log(orderTypes)
export default ({ orders, dispatch, classes }) => {
  const { rows, summary, finalAdjustments, isGSTInclusive, gstValue } = orders
  const { total, gst, totalWithGST } = summary
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
    dispatch({
      // force current edit row components to update
      type: 'global/incrementCommitCount',
    })
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
  }
  if (gstValue) {
    messages.gst = `${numeral(gstValue).format('0.00')}% GST`
    messages.total = 'Total '
    totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'gst' })
  }
  totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'total' })
  adjustments.forEach((adj) => {
    messages[adj.uid] = (
      <div
        style={{
          width: '60%',
          overflow: 'hidden',
          display: 'inline-block',
          textOverflow: 'ellipsis',
        }}
      >
        <Popconfirm
          onConfirm={() =>
            dispatch({
              type: 'orders/deleteFinalAdjustment',
              payload: {
                uid: adj.uid,
              },
            })}
        >
          <Tooltip title='Delete Adjustment'>
            <Button
              justIcon
              color='danger'
              style={{
                top: -1,
              }}
            >
              <Delete />
            </Button>
          </Tooltip>
        </Popconfirm>
        <Tooltip title={adj.adjRemark}>
          <span>{adj.adjRemark}</span>
        </Tooltip>
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
              if (type === 'gst') {
                return (
                  <span style={{ float: 'right' }}>
                    <NumberInput value={gst} text currency />
                  </span>
                )
              }

              if (type === 'total') {
                return (
                  <span style={{ float: 'right' }}>
                    <NumberInput value={totalWithGST} text currency />
                  </span>
                )
              }
              const adj = adjustments.find((o) => `${o.uid}` === type)
              if (adj) {
                return (
                  <span style={{ float: 'right' }}>
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
                <Table.Cell colSpan={3} key={1} />,
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
                const c1 = items.splice(0, items.length - 1)
                const c2 = items.splice(items.length - 1)
                return (
                  <Table.Cell
                    colSpan={3}
                    style={{
                      fontSize: 'inherit',
                      color: 'inherit',
                      fontWeight: 500,
                      border: 'transparent',
                    }}
                  >
                    <span>
                      Invoice Adjustment:&nbsp;
                      <Tooltip title='Add Adjustment'>
                        <Button
                          justIcon
                          color='primary'
                          style={{ top: -1 }}
                          onClick={addAdjustment}
                        >
                          <Add />
                        </Button>
                      </Tooltip>
                    </span>
                    {c1}
                    {gstValue >= 0 && (
                      <Checkbox
                        simple
                        label={formatMessage({
                          id: 'app.general.inclusiveGST',
                        })}
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
                    )}
                    {c2}
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
          render: (row) => {
            return (
              <Tooltip title={row.instruction}>
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
          columnName: 'remark',
          render: (r) => {
            return r.remark || r.remarks || ''
          },
        },
        {
          columnName: 'actions',
          width: 70,
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            if (row.type === '7') return null
            return (
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
                <Popconfirm
                  onConfirm={() => {
                    dispatch({
                      type: 'orders/deleteRow',
                      payload: {
                        uid: row.uid,
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
                >
                  <Tooltip title='Delete'>
                    <Button
                      size='sm'
                      color='danger'
                      justIcon
                      disabled={isEditingEntity}
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </div>
            )
          },
        },
      ]}
    />
  )
}
