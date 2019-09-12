import React from 'react'
import { Table } from '@devexpress/dx-react-grid-material-ui'
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
} from '@/components'
import { orderTypes } from '@/utils/codes'
import { sumReducer } from '@/utils/utils'

export default ({
  orders,
  dispatch,
  classes,
  summary,
  theme,
  handleAddAdjustment,
}) => {
  const { rows } = orders
  const { adjustments, total, gst, totalWithGst } = summary
  const editRow = (row) => {
    dispatch({
      type: 'orders/updateState',
      payload: {
        entity: row,
        editType: row.editType,
        // adjustment: {
        //   adjValue: row.adjValue,
        //   adjAmount: row.adjAmount,
        //   adjType: row.adjType,
        // },
      },
    })
  }
  const totalItems = [
    ...adjustments.map((o) => ({
      columnName: 'totalAfterItemAdjustment',
      type: `${o.uid}`,
    })),
    { columnName: 'totalAfterItemAdjustment', type: 'gst' },
    { columnName: 'totalAfterItemAdjustment', type: 'total' },
  ]
  const messages = {
    gst: '7.00% GST',
    total: 'Total (GST)',
  }
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
        { name: 'editType', title: 'Type' },
        { name: 'subject', title: 'Name' },
        { name: 'remark', title: 'Description' },
        { name: 'adjAmount', title: 'Adj.' },
        { name: 'totalAfterItemAdjustment', title: 'Total' },
        { name: 'action', title: 'Action' },
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
                    <NumberInput value={total} text currency />
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
                // console.log(p)
                return (
                  <Table.Cell colSpan={2}>
                    <span style={{ color: 'initial' }}>
                      Adjustment
                      <Tooltip title='Add Adjustment'>
                        <IconButton
                          style={{ top: -1 }}
                          onClick={handleAddAdjustment}
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                    </span>
                    {children}
                  </Table.Cell>
                )
              }
              return null
            },
          },
        },
      }}
      columnExtensions={[
        { columnName: 'editType', type: 'select', options: orderTypes },
        { columnName: 'adjAmount', type: 'currency', width: 100 },
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
            const rmk = r.remark || r.remarks || ''
            return (
              <Tooltip title={rmk} placement='top-end'>
                <span>{rmk}</span>
              </Tooltip>
            )
          },
        },
        {
          columnName: 'action',
          render: (row) => {
            return (
              <React.Fragment>
                <Tooltip title='Add'>
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
                  onConfirm={() =>
                    dispatch({
                      type: 'orders/deleteRow',
                      payload: {
                        uid: row.uid,
                      },
                    })}
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
