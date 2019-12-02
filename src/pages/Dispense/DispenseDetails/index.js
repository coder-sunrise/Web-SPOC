import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import Print from '@material-ui/icons/Print'
import Refresh from '@material-ui/icons/Refresh'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import AttachMoney from '@material-ui/icons/AttachMoney'
// sub components
import TableData from './TableData'
// common component
import {
  Button,
  ProgressButton,
  GridItem,
  GridContainer,
  CommonModal,
} from '@/components'
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
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE } from '@/utils/constants'
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  actionButtons: {
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    overflow: 'auto',
  },
  gridRow: {
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  rightActionButtons: {
    marginTop: theme.spacing(2),
    textAlign: 'right',
    '& > button:last-child': {
      marginRight: '0px !important',
    },
  },
})

const DispenseDetails = ({
  classes,
  setFieldValue,
  setValues,
  values,
  dispatch,
  viewOnly = false,
  onPrint,
  onReloadClick,
  onSaveClick,
  onEditOrderClick,
  onFinalizeClick,
  codetable,
  dispense,
}) => {
  const { prescription, vaccination, otherOrder, invoice } = values || {
    invoice: { invoiceItem: [] },
  }
  const { invoiceItem = [], invoiceAdjustment = [], visitPurposeFK } = invoice

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

  const updateGridData = (v) => {
    const { rows } = v
    const mapFromInvoiceItem = (result, item) => {
      const _item = rows.find(
        (_invoiceItem) => item.invoiceItemFK === _invoiceItem.id,
      )
      if (_item)
        return [
          ...result,
          {
            ...item,
            totalAfterGST: _item.totalAfterGST,
          },
        ]
      return [
        ...result,
        { ...item },
      ]
    }

    const newInvoice = {
      ...values.invoice,
      invoiceTotal: v.summary.total,
      invoiceTotalAftAdj: v.summary.totalAfterAdj,
      invoiceTotalAftGST: v.summary.totalWithGST,
      outstandingBalance: v.summary.totalWithGST,
      invoiceGSTAmt: Math.round(v.summary.gst * 100) / 100,
      invoiceAdjustment: v.adjustments,
      isGSTInclusive: !!v.summary.isGSTInclusive,
    }

    const newPrescription = prescription.reduce(mapFromInvoiceItem, [])
    const newVaccination = vaccination.reduce(mapFromInvoiceItem, [])
    const newOtherOrder = otherOrder.reduce(mapFromInvoiceItem, [])
    setFieldValue('prescription', newPrescription)
    setFieldValue('vaccination', newVaccination)
    setFieldValue('otherOrder', newOtherOrder)
    // console.log(1, newPrescription)
    setValues({
      ...values,
      invoice: newInvoice,
      prescription: newPrescription,
      vaccination: newVaccination,
      otherOrder: newOtherOrder,
    })
  }
  const isRetailVisit = visitPurposeFK === VISIT_TYPE.RETAIL
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem justify='flex-start' md={6} className={classes.actionButtons}>
          {!viewOnly &&
          !isRetailVisit && (
            <Button color='info' size='sm' onClick={onReloadClick}>
              <Refresh />
              Refresh
            </Button>
          )}
          <Button
            color='primary'
            size='sm'
            onClick={() => {
              onPrint('Medications')
            }}
          >
            <Print />
            Drug Label
          </Button>
          <Button
            color='primary'
            size='sm'
            onClick={() => {
              onPrint('Patient')
            }}
          >
            <Print />
            Patient Label
          </Button>
        </GridItem>
        {!viewOnly && (
          <GridItem className={classes.rightActionButtons} md={6}>
            {isRetailVisit && (
              <ProgressButton
                color='danger'
                size='sm'
                icon={<Delete />}
                // onClick={handleOrderModal}
              >
                Discard
              </ProgressButton>
            )}
            <Authorized authority='queue.dispense.savedispense'>
              <ProgressButton color='success' size='sm' onClick={onSaveClick}>
                Save Dispense
              </ProgressButton>
            </Authorized>
            <Authorized authority='queue.dispense.editorder'>
              <ProgressButton
                color='primary'
                size='sm'
                icon={<Edit />}
                onClick={onEditOrderClick}
              >
                {isRetailVisit ? 'Add Order' : 'Edit Order'}
              </ProgressButton>
            </Authorized>
            <Authorized authority='queue.dispense.makepayment'>
              <ProgressButton
                color='primary'
                size='sm'
                icon={<AttachMoney />}
                onClick={onFinalizeClick}
              >
                Finalize
              </ProgressButton>
            </Authorized>
          </GridItem>
        )}
        <GridItem md={12}>
          <Paper className={classes.paper}>
            <TableData
              title='Prescription'
              columns={PrescriptionColumns}
              colExtensions={PrescriptionColumnExtensions(
                viewOnly,
                onPrint,
                inventorymedication,
                handleSelectedBatch,
              )}
              data={prescription}
            />
            {!isRetailVisit && (
              <TableData
                title='Vaccination'
                columns={VaccinationColumn}
                colExtensions={VaccinationColumnExtensions(viewOnly)}
                data={vaccination}
              />
            )}

            <TableData
              title='Other Orders'
              columns={OtherOrdersColumns}
              colExtensions={OtherOrdersColumnExtensions(viewOnly, onPrint)}
              data={otherOrder}
            />
          </Paper>
        </GridItem>
        <GridItem xs={2} md={9} />
        {!viewOnly && (
          <GridItem xs={10} md={3}>
            <AmountSummary
              rows={invoiceItem}
              adjustments={invoiceAdjustment}
              config={{
                isGSTInclusive:
                  dispense.isGSTInclusive || invoice.isGSTInclusive,
                totalField: 'totalAfterItemAdjustment',
                adjustedField: 'totalAfterOverallAdjustment',
                gstField: 'totalAfterGST',
                gstAmtField: 'gstAmount',
              }}
              onValueChanged={(v) => {
                // console.log(newInvoice, v)
                // console.log('summary', { summary: v })
                updateGridData(v)

                // setFieldValue('invoice.invoiceTotal', v.summary.total)
                // setFieldValue(
                //   'invoice.invoiceTotalAftAdj',
                //   v.summary.totalAfterAdj,
                // )
                // setFieldValue(
                //   'invoice.invoiceTotalAftGST',
                //   v.summary.totalWithGST,
                // )
                // setFieldValue(
                //   'invoice.outstandingBalance',
                //   v.summary.totalWithGST,
                // )
                // // console.log({ v })

                // setFieldValue(
                //   'invoice.invoiceGSTAmt',
                //   Math.round(v.summary.gst * 100) / 100,
                // )
                // setFieldValue('invoice.invoiceAdjustment', v.adjustments)
                dispatch({
                  type: `dispense/updateState`,
                  payload: {
                    totalWithGST: v.summary.totalWithGST,
                    isGSTInclusive: v.summary.isGSTInclusive,
                  },
                })
              }}
            />
          </GridItem>
        )}
      </GridContainer>
    </React.Fragment>
  )
}

export default compose(
  withStyles(styles, { name: 'DispenseDetailsGrid' }),
  connect(({ codetable }) => ({
    codetable,
  })),
)(DispenseDetails)
