import React from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
// material ui
import { Paper, withStyles } from '@material-ui/core'
// sub components
import TableData from './TableData'
// common component
import { GridItem, GridContainer } from '@/components'
// variables
import {
  PrescriptionColumns,
  PrescriptionColumnExtensions,
  VaccinationColumn,
  VaccinationColumnExtensions,
  OtherOrdersColumns,
  OtherOrdersColumnExtensions,
} from '../variables'
import AmountSummary from '@/pages/Shared/AmountSummary'

// const styles = (theme) => ({
//   gridRow: {
//     margin: `${theme.spacing.unit}px 0px`,
//     '& > h5': {
//       padding: theme.spacing.unit,
//     },
//   },
// })

const styles = (theme) => ({
  paper: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  gridContainer: {
    maxHeight: '60vh',
    overflow: 'auto',
  },
  gridRow: {
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
})

const DispenseDetails = ({
  classes,
  dispense,
  setFieldValue,
  values,
  dispatch,
  viewOnly = false,
  onPrint,
  codetable,
}) => {
  const { prescription, vaccination, otherOrder, invoice } = values || {
    invoice: { invoiceItem: [] },
  }
  const { invoiceItem = [], invoiceAdjustment = [] } = invoice

  const { inventorymedication } = codetable

  const handleSelectedBatch = (e, op = {}, row) => {
    // console.log({ e, op, row })
    if (op && op.length > 0) {
      // const currentItem = inventorymedication.find(
      //   (o) => o.id === row.inventoryMedicationFK,
      // )
      // let batchNoOptions = []
      // if (currentItem) {
      //   batchNoOptions = currentItem.medicationStock
      // }
      // const batchNo = batchNoOptions.find(
      //   (item) => parseInt(item.id, 10) === parseInt(e[0], 10),
      // )

      const { expiryDate } = op[0]

      // setFieldValue(`prescription[${row.rowIndex}]batchNo`, batchNo.batchNo)
      setFieldValue(`prescription[${row.rowIndex}]expiryDate`, expiryDate)
    } else {
      setFieldValue(`prescription[${row.rowIndex}]expiryDate`, undefined)
    }
  }

  // console.log({ values })
  return (
    <React.Fragment>
      <GridItem>
        <Paper className={classes.paper}>
          <GridContainer className={classes.gridContainer}>
            <GridItem className={classes.gridRow}>
              <TableData
                title='Prescription'
                // height={200}
                columns={PrescriptionColumns}
                colExtensions={PrescriptionColumnExtensions(
                  viewOnly,
                  onPrint,
                  inventorymedication,
                  handleSelectedBatch,
                )}
                data={prescription}
              />
            </GridItem>
            <GridItem className={classes.gridRow}>
              <TableData
                title='Vaccination'
                // TableProps={{
                //   height: 200,
                // }}
                columns={VaccinationColumn}
                colExtensions={VaccinationColumnExtensions(viewOnly)}
                data={vaccination}
              />
            </GridItem>
            <GridItem className={classes.gridRow}>
              <TableData
                title='Other Orders'
                // TableProps={{
                //   height: 200,
                // }}
                columns={OtherOrdersColumns}
                colExtensions={OtherOrdersColumnExtensions(viewOnly, onPrint)}
                data={otherOrder}
              />
            </GridItem>
          </GridContainer>
        </Paper>
        {!viewOnly && (
          <GridContainer className={classes.summaryPanel}>
            <GridItem xs={2} md={9} />
            <GridItem xs={10} md={3}>
              <AmountSummary
                rows={invoiceItem}
                adjustments={invoiceAdjustment}
                config={{
                  isGSTInclusive: invoice.isGSTInclusive,
                  totalField: 'totalAfterItemAdjustment',
                  adjustedField: 'totalAfterOverallAdjustment',
                  gstField: 'totalAfterGST',
                  gstAmtField: 'gstAmount',
                }}
                onValueChanged={(v) => {
                  setFieldValue('invoice.invoiceTotal', v.summary.total)
                  setFieldValue(
                    'invoice.invoiceTotalAftAdj',
                    v.summary.totalAfterAdj,
                  )
                  setFieldValue(
                    'invoice.invoiceTotalAftGST',
                    v.summary.totalWithGST,
                  )
                  setFieldValue(
                    'invoice.outstandingBalance',
                    v.summary.totalWithGST,
                  )
                  // console.log({ v })

                  setFieldValue(
                    'invoice.invoiceGSTAmt',
                    Math.round(v.summary.gst * 100) / 100,
                  )
                  setFieldValue('invoice.invoiceAdjustment', v.adjustments)
                  dispatch({
                    type: `dispense/updateState`,
                    payload: {
                      totalWithGST: v.summary.totalWithGST,
                    },
                  })
                }}
              />
            </GridItem>
          </GridContainer>
        )}
      </GridItem>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles, { name: 'DispenseDetailsGrid' }),
  connect(({ codetable }) => ({
    codetable,
  })),
)(DispenseDetails)
