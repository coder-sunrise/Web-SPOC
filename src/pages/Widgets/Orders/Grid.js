import React from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { formatMessage } from 'umi/locale'

import { withStyles, Divider, Paper, IconButton } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import numeral from 'numeral'
import {
  CommonTableGrid,
  Button,
  Popconfirm,
  Tooltip,
  NumberInput,
  Select,
  Checkbox,
  CodeSelect,
} from '@/components'
import { orderTypes } from '@/utils/codes'
import { sumReducer } from '@/utils/utils'

// console.log(orderTypes)
export default ({
  orders,
  dispatch,
  classes,
  theme,
  handleAddAdjustment,
  codetable,
}) => {
  const { rows, summary, finalAdjustments } = orders
  // console.log(orders)
  const { total, gst, totalWithGST, gSTPercentage, isEnableGST } = summary
  const adjustments = finalAdjustments.filter((o) => !o.isDeleted)
  const editRow = (row) => {
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
  if (isEnableGST) {
    messages.gst = `${numeral(gSTPercentage * 100).format('0.00')}% GST`
    messages.total = 'Total '
    totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'gst' })
  }
  totalItems.push({ columnName: 'totalAfterItemAdjustment', type: 'total' })
  adjustments.forEach((adj) => {
    messages[adj.uid] = (
      <span>
        {adj.adjRemark}

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
            <IconButton
              style={{
                top: -1,
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Popconfirm>
      </span>
    )
  })
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
                <Table.Cell colSpan={1} key={2} />,
              ]
              return <Table.Row>{newChildren}</Table.Row>
            },
            totalCellComponent: (p) => {
              const { children, column } = p
              if (column.name === 'totalAfterItemAdjustment') {
                const items = children.props.children
                const c1 = items.splice(0, items.length - 1)
                const c2 = items.splice(items.length - 1)
                return (
                  <Table.Cell colSpan={2}>
                    <span>
                      Adjustment
                      <Tooltip title='Add Adjustment'>
                        <IconButton style={{ top: -1 }} onClick={addAdjustment}>
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </span>
                    {c1}
                    <Checkbox
                      label={formatMessage({
                        id: 'app.general.inclusiveGST',
                      })}
                      simple
                      onChange={(e) => {}}
                    />
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
          // type: 'select',
          // options: orderTypes,
          render: (row) => {
            return (
              <div>
                <Select
                  text
                  options={orderTypes}
                  labelField='name'
                  value={row.type}
                />
                {row.isExternalPrescription === true ? (
                  <span> (Ext.) </span>
                ) : (
                  ''
                )}
                {row.isActive ? '' : '(Inactive)'}
              </div>
            )
          },
        },
        {
          columnName: 'description',
          width: 300,
          render: (row) => {
            let text = ''
            if (row.usageMethodFK && row.dosageFK && row.uomfk) {
              text = `${row.usageMethodDisplayValue
                ? row.usageMethodDisplayValue
                : ''} ${row.dosageDisplayValue
                ? row.dosageDisplayValue
                : ''} ${row.uomDisplayValue ? row.uomDisplayValue : ''} `
            }

            return (
              <div>
                {row.corPrescriptionItemInstruction ? (
                  row.corPrescriptionItemInstruction.map((item) => {
                    text = `${item.usageMethodDisplayValue
                      ? item.usageMethodDisplayValue
                      : ''} ${item.dosageDisplayValue
                      ? item.dosageDisplayValue
                      : ''} ${item.prescribeUOMDisplayValue
                      ? item.prescribeUOMDisplayValue
                      : ''} ${item.drugFrequencyDisplayValue
                      ? item.drugFrequencyDisplayValue
                      : ''} For ${item.duration ? item.duration : ''} day(s)`

                    return <p>{text}</p>
                  })
                ) : (
                  text
                )}
              </div>
            )
          },
        },
        {
          columnName: 'adjAmount',
          type: 'currency',
          width: 100,
        },
        {
          columnName: 'totalAfterItemAdjustment',
          // align: 'right',
          type: 'currency',
          // width: 130,
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
          align: 'center',
          sortingEnabled: false,
          render: (row) => {
            return (
              <React.Fragment>
                <Tooltip title='Edit'>
                  <Button
                    size='sm'
                    onClick={() => {
                      editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 5 }}
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
                    <Button size='sm' color='danger' justIcon>
                      <Delete />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </React.Fragment>
            )
          },
        },
      ]}
    />
  )
}
