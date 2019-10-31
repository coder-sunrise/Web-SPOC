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
  Select,
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
                // console.log(p)
                return (
                  <Table.Cell colSpan={2}>
                    <span style={{ color: 'initial' }}>
                      Adjustment
                      <Tooltip title='Add Adjustment'>
                        <IconButton style={{ top: -1 }} onClick={addAdjustment}>
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
              </div>
            )
          },
        },
        {
          columnName: 'description',
          width: 300,
          render: (row) => {
            let text = ''
            const codetableList = codetable
            return (
              <div>
                {row.corPrescriptionItemInstruction ? (
                  row.corPrescriptionItemInstruction.map((item) => {
                    text = ''
                    const usageMethod = codetableList.ctmedicationusage.filter(
                      (codeTableItem) =>
                        codeTableItem.id === item.usageMethodFK,
                    )
                    text += `${usageMethod[0].name} `
                    text += ' '
                    const dosage = codetableList.ctmedicationdosage.filter(
                      (codeTableItem) => codeTableItem.id === item.dosageFK,
                    )
                    text += `${dosage[0].displayValue} `
                    const prescribe = codetableList.ctmedicationunitofmeasurement.filter(
                      (codeTableItem) =>
                        codeTableItem.id === item.prescribeUOMFK,
                    )
                    text += `${prescribe[0].name} `
                    const drugFrequency = codetableList.ctmedicationfrequency.filter(
                      (codeTableItem) =>
                        codeTableItem.id === item.drugFrequencyFK,
                    )
                    text += `${drugFrequency[0].displayValue} For `
                    text += `${item.duration} day(s)`

                    return <p>{text}</p>
                  })
                ) : (
                  ''
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
