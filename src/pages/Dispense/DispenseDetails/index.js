import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
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
  handleClickPrintDrugLabel,
}) => {
  const { prescription, vaccination, otherOrder, invoice } = values || {
    invoice: { invoiceItem: [] },
  }
  const { invoiceItem = [], invoiceAdjustment = [] } = invoice
  return (
    <React.Fragment>
      <GridItem>
        <GridContainer>
          <GridItem className={classes.gridRow}>
            <TableData
              title='Prescription'
              height={200}
              columns={PrescriptionColumns}
              colExtensions={PrescriptionColumnExtensions(
                viewOnly,
                handleClickPrintDrugLabel,
              )}
              data={prescription}
            />
          </GridItem>
          <GridItem className={classes.gridRow}>
            <TableData
              title='Vaccination'
              height={150}
              columns={VaccinationColumn}
              colExtensions={VaccinationColumnExtensions(viewOnly)}
              data={vaccination}
            />
          </GridItem>
          <GridItem className={classes.gridRow}>
            <TableData
              title='Other Orders'
              height={150}
              columns={OtherOrdersColumns}
              colExtensions={OtherOrdersColumnExtensions(viewOnly)}
              data={otherOrder}
            />
          </GridItem>
        </GridContainer>
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

export default withStyles(styles, { name: 'DispenseDetailsGrid' })(
  DispenseDetails,
)
