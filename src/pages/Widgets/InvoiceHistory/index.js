import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
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
  WarningSnackbar,
  NumberInput,
  Popover,
} from '@/components'
// utils
import { ReportViewer } from '@/components/_medisys'
import { getBizSession } from '@/services/queue'
import { INVOICE_REPORT_TYPES } from '@/utils/constants'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import PaymentDetails from './PaymentDetails'
import './CustomStyle.css'

const styles = () => ({
  totalOSStyle: {
    float: 'right',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
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
  rightIcon: {
    position: 'absolute',
    bottom: 2,
    fontWeight: 500,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
  },
})

const InvoiceHistory = ({
  dispatch,
  patient,
  invoiceHistory: { list },
  classes,
  clinicSettings,
  mainDivHeight = 700,
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

  const [showPrintInvoiceMenu, setShowPrintInvoiceMenu] = useState(undefined)

  const { settings = [] } = clinicSettings
  const { isEnableVisitationInvoiceReport = false } = settings
  const [hasActiveSession, setHasActiveSession] = useState(true)

  const checkHasActiveSession = () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    getBizSession(bizSessionPayload).then(result => {
      if (result) {
        const { data } = result.data
        setHasActiveSession(data.length > 0)
      }
    })
  }

  useEffect(() => {
    checkHasActiveSession()
    refreshInvoiceList()
  }, [])

  const [showReport, setShowReport] = useState({
    show: false,
    invoiceId: null,
    printType,
  })
  const { show, invoiceId, printType } = showReport

  const toggleReport = (row, invoiceReportType) => {
    const setShowValue = !show
    setShowReport({
      ...showReport,
      show: setShowValue,
      invoiceId: setShowValue ? row.id : null,
      printType: invoiceReportType,
    })
  }

  const [showVisitInvoiceReport, setShowVisitInvoiceReport] = useState({
    showVisitInvoice: false,
    invoiceId: null,
  })
  const { showVisitInvoice, invId } = showVisitInvoiceReport

  const toggleVisitInvoiceReport = row => {
    const setShowVisitInvoiceValue = !showVisitInvoice
    setShowVisitInvoiceReport({
      ...showVisitInvoiceReport,
      showVisitInvoice: setShowVisitInvoiceValue,
      invId: setShowVisitInvoiceValue ? row.id : null,
    })
  }

  const getContent = o => {
    const { entity = {} } = patient || {}

    return (
      <PaymentDetails
        invoiceDetail={o.invoiceDetail}
        invoicePayer={o.invoicePayer}
        refreshInvoiceList={refreshInvoiceList}
        readOnly={!hasActiveSession}
        hasActiveSession={hasActiveSession}
        patientIsActive={entity.isActive}
        dispatch={dispatch}
      />
    )
  }

  const getTitle = row => {
    const {
      invoiceNo,
      invoiceDate,
      totalPayment,
      patientOutstanding,
      invoiceTotalAftGST,
      invoiceDetail = {},
    } = row
    const { visitOrderTemplateFK } = invoiceDetail

    return (
      <GridContainer>
        <GridItem sm={12}>
          <div className={classes.titleContainer}>
            <p className={classes.title}>Invoice No: {invoiceNo}</p>
            <p className={classes.title}>
              Date: {moment(invoiceDate).format(dateFormatLong)}
            </p>
            <p className={classes.title}>
              Invoice Amount:{' '}
              <NumberInput text currency value={invoiceTotalAftGST} />
            </p>
            <p className={classes.title}>
              Total Paid: <NumberInput text currency value={totalPayment} />
            </p>
            <p
              className={
                patientOutstanding !== 0 ? classes.titleBold : classes.title
              }
            >
              Patient O/S Balance:{' '}
              <NumberInput text currency value={patientOutstanding} />
            </p>
            <p className={classes.printButtonStyle}>
              {visitOrderTemplateFK && (
                <Popover
                  icon={null}
                  trigger='click'
                  placement='left'
                  visible={showPrintInvoiceMenu === row.id}
                  onVisibleChange={visible => {
                    if (!visible && showPrintInvoiceMenu)
                      setShowPrintInvoiceMenu(undefined)
                  }}
                  content={
                    <MenuList
                      role='menu'
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <MenuItem
                        onClick={e => {
                          e.stopPropagation()
                          setShowPrintInvoiceMenu(undefined)
                          toggleReport(row, INVOICE_REPORT_TYPES.SUMMARYINVOICE)
                        }}
                      >
                        Summary Invoice
                      </MenuItem>
                      <MenuItem
                        onClick={e => {
                          e.stopPropagation()
                          setShowPrintInvoiceMenu(undefined)
                          toggleReport(
                            row,
                            INVOICE_REPORT_TYPES.INDIVIDUALINVOICE,
                          )
                        }}
                      >
                        Individual Invoice
                      </MenuItem>
                    </MenuList>
                  }
                >
                  <Button
                    size='sm'
                    color='primary'
                    icon
                    onClick={event => {
                      setShowPrintInvoiceMenu(row.id)
                      event.stopPropagation()
                    }}
                  >
                    <Printer />
                    Print Invoice
                  </Button>
                </Popover>
              )}
              {!visitOrderTemplateFK && (
                <Button
                  size='sm'
                  color='primary'
                  icon
                  onClick={event => {
                    toggleReport(row, INVOICE_REPORT_TYPES.INDIVIDUALINVOICE)
                    event.stopPropagation()
                  }}
                >
                  <Printer />
                  Print Invoice
                </Button>
              )}
              {isEnableVisitationInvoiceReport && (
                <Button
                  size='sm'
                  color='primary'
                  icon
                  onClick={event => {
                    toggleVisitInvoiceReport(row)
                    event.stopPropagation()
                  }}
                >
                  <Printer />
                  Print Visit Invoice
                </Button>
              )}
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

  let height = mainDivHeight - 230 - ($('.filterBar').height() || 0)
  if (height < 300) height = 300
  return (
    <div>
      <CardContainer hideHeader size='sm'>
        <div className='filterBar'>
          {!hasActiveSession ? (
            <div style={{ paddingTop: 5 }}>
              <WarningSnackbar
                variant='warning'
                className={classes.margin}
                message='Action(s) is not allowed due to no active session was found.'
              />
            </div>
          ) : (
            ''
          )}
          <div className={classes.totalOSStyle}>
            Total Patient O/S Balance:
            <NumberInput text currency value={getTotalPatientOS()} />
          </div>
        </div>
        <div style={{ height, marginTop: 50, overflow: 'auto' }}>
          <Accordion
            mode='multiple'
            collapses={list.map(o => {
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
            reportParameters={{
              InvoiceID: invoiceId || '',
              printType: printType,
            }}
          />
        </CommonModal>
        <CommonModal
          open={showVisitInvoice}
          onClose={toggleVisitInvoiceReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={80}
            reportParameters={{ InvoiceID: invId || '' }}
          />
        </CommonModal>
      </CardContainer>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ patient, patientHistory, clinicSettings, global }) => ({
    patient,
    invoiceHistory: patientHistory.invoiceHistory,
    clinicSettings,
    mainDivHeight: global.mainDivHeight,
  })),
)(InvoiceHistory)
