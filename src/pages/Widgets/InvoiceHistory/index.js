import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
import Printer from '@material-ui/icons/Print'
// common components
import {
  GridContainer,
  GridItem,
  CardContainer,
  Accordion,
  dateFormatLong,
  Button,
  CommonModal,
} from '@/components'
// utils
import { currencyFormatter } from '@/utils/utils'
import { ReportViewer } from '@/components/_medisys'
import PaymentDetails from '@/pages/Finance/Invoice/Details/PaymentDetails'

const styles = () => ({
  totalOSStyle: {
    float: 'right',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  accordionStyle: {
    marginTop: 50,
  },
  titleContainer: {
    display: 'flex',
  },
  title: {
    marginRight: 30,
    marginTop: 5,
    fontWeight: 'normal',
  },
  titleBold: {
    marginRight: 30,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'red',
  },
  printButtonStyle: {
    marginLeft: 'auto',
  },
})

const InvoiceHistory = ({
  dispatch,
  patient,
  invoiceHistory: { list },
  classes,
}) => {
  const refreshInvoiceList = () => {
    const { id } = patient.entity
    dispatch({
      type: 'patientHistory/queryInvoiceHistory',
      payload: {
        'VisitInvoice.VisitFKNavigation.PatientProfileFkNavigation.Id': id,
        pagesize: 9999,
      },
    })
  }

  useEffect(() => {
    refreshInvoiceList()
  }, [])

  const [
    showReport,
    setShowReport,
  ] = useState({ show: false, invoiceId: null })
  const { show, invoiceId } = showReport

  const toggleReport = (row) => {
    const setShowValue = !show
    setShowReport({
      ...showReport,
      show: setShowValue,
      invoiceId: setShowValue ? row.id : null,
    })
  }

  const getContent = () => {
    return (
      <PaymentDetails
        patientIsActive={patient && patient.isActive}
        refreshInvoiceList={refreshInvoiceList}
      />
    )
  }

  const getTitle = (row) => {
    const {
      invoiceNo,
      invoiceDate,
      totalPayment,
      totalOutstanding,
      patientOutstanding,
      invoiceTotalAftGST,
    } = row

    return (
      <GridContainer>
        <GridItem sm={12}>
          <div className={classes.titleContainer}>
            <p className={classes.title}>Invoice No: {invoiceNo}</p>
            <p className={classes.title}>
              Date: {moment(invoiceDate).format(dateFormatLong)}
            </p>
            <p className={classes.title}>
              Invoice Amount: {currencyFormatter(invoiceTotalAftGST)}
            </p>
            <p className={classes.title}>
              Total Paid: {currencyFormatter(totalPayment)}
            </p>
            <p
              className={
                patientOutstanding > 0 ? classes.titleBold : classes.title
              }
            >
              Patient O/S Balance: {currencyFormatter(patientOutstanding)}
            </p>
            <p className={classes.printButtonStyle}>
              <Button
                size='sm'
                color='primary'
                icon
                onClick={(event) => {
                  toggleReport(row)
                  event.stopPropagation()
                }}
              >
                <Printer />Print Invoice
              </Button>
            </p>
          </div>
        </GridItem>
      </GridContainer>
    )
  }

  const getTotalPatientOS = () => {
    return list.reduce((totalOS, invoice) => {
      return totalOS + invoice.patientOutstanding
    }, 0)
  }

  return (
    <div>
      <CardContainer hideHeader size='sm'>
        <div className={classes.totalOSStyle}>
          Total Patient O/S Balance: {currencyFormatter(getTotalPatientOS())}
        </div>

        <div className={classes.accordionStyle}>
          <Accordion
            onChange={(event, p, expanded) => {
              if (expanded) {
                const { row } = p.prop

                dispatch({
                  type: 'invoicePayment/updateState',
                  payload: {
                    entity: null,
                    currentId: null,
                  },
                })

                dispatch({
                  type: 'invoiceDetail/query',
                  payload: {
                    id: row.id,
                  },
                })

                dispatch({
                  type: 'invoicePayment/query',
                  payload: {
                    id: row.id,
                  },
                })
              }
            }}
            collapses={list.map((o) => {
              const returnValue = {
                title: getTitle(o),
                content: getContent(o),
              }
              return {
                ...returnValue,
                row: o,
              }
            })}
          />
        </div>

        <CommonModal
          open={show}
          onClose={toggleReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={15}
            reportParameters={{ InvoiceID: invoiceId || '' }}
          />
        </CommonModal>
      </CardContainer>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ patient, patientHistory }) => ({
    patient,
    invoiceHistory: patientHistory.invoiceHistory,
  })),
)(InvoiceHistory)
