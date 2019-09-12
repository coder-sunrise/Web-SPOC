import React, { useState, useEffect } from 'react'
// formik
import { withFormik } from 'formik'
// ant design
import { Dropdown, Menu } from 'antd'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import Print from '@material-ui/icons/Print'
// common components
import {
  Accordion,
  Button,
  CardContainer,
  GridContainer,
  GridItem,
} from '@/components'
// sub components
import FilterBar from './FilterBar'
import {
  // ReportViewer,
  ReportDataGrid,
  AccordionTitle,
} from '@/components/_medisys'
// services
import { getQueueListingData } from '@/services/report'

/* PDF viewer sample */
// const QueueListing = ({ handleSubmit, values }) => {
//   return (
//     <CardContainer hideHeader>
//       <GridContainer>
//         <GridItem md={12}>
//           <FilterBar handleSubmit={handleSubmit} />
//         </GridItem>
//         <GridItem md={12}>
//           <ReportViewer />
//         </GridItem>
//       </GridContainer>
//     </CardContainer>
//   )
// }

const VisitListingColumns = [
  { name: 'invoiceID', title: 'Invoice ID' },
  { name: 'sessionNo', title: 'Session No.' },
  { name: 'queueNo', title: 'Queue No.' },
  { name: 'visitReferenceNo', title: 'Visit Reference No.' },
  { name: 'invoiceNo', title: 'Invoice No' },
  { name: 'patientName', title: 'Patient Name' },
  { name: 'visitDate', title: 'Visit Date' },
  { name: 'timeIn', title: 'Time In' },
  { name: 'timeout', title: 'Time Out' },
  { name: 'doctorCode', title: 'Doctor MCR No.' },
  { name: 'invoiceAmt', title: 'Invoice Amt.' },
  { name: 'gstAmt', title: 'GST Amt.' },
  { name: 'patientPayable', title: 'Patient Payable' },
  { name: 'totalPatientPaid', title: 'Total Patient Paid' },
  { name: 'patientPaid', title: 'Patient Paid' },
  { name: 'coPayerPayable', title: 'Copayer Payable' },
  { name: 'totalBalanceTrasfer', title: 'Total Balance Transfer' },
  { name: 'paymentMode', title: 'Payment Mode' },
  { name: 'countNumber', title: 'Count Number' },
  { name: 'coPayerName', title: 'Copayer Name' },
]

const InvoicePayerColumns = [
  { name: 'invoicePayerDetail', title: 'Invoice Payer Detail' },
  { name: 'coPayer', title: 'Copayer' },
  { name: 'coPayerPayable', title: 'Copayer Payable' },
]

const QueueListing = ({ values }) => {
  const [
    activePanel,
    setActivePanel,
  ] = useState(-1)

  const handleActivePanelChange = (event, panel) => {
    if (activePanel === panel.key) setActivePanel(-1)
    else setActivePanel(panel.key)
  }

  const [
    visitListingData,
    setVisitListingData,
  ] = useState([])

  const [
    invoicePayerData,
    setInvoicePayerData,
  ] = useState([])

  const asyncGetData = async () => {
    const queueListingResult = await getQueueListingData(values)
    if (queueListingResult) {
      setVisitListingData(queueListingResult.VisitListingDetails)
      setInvoicePayerData(queueListingResult.InvoicePayerDetails)
      setActivePanel(0)
    }
  }

  const onSubmitClick = () => asyncGetData()

  useEffect(() => {
    /* 
    clean up function
    set visit listing data to empty array when leaving the page 
    */
    return () => setVisitListingData([])
  }, [])

  return (
    <CardContainer hideHeader>
      <GridContainer>
        <GridItem md={12}>
          <FilterBar handleSubmit={onSubmitClick} />
        </GridItem>
        <GridItem md={12}>
          <CardContainer hideHeader size='sm'>
            <div style={{ textAlign: 'right' }}>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key='export-pdf' id='pdf'>
                      <span>PDF</span>
                    </Menu.Item>
                    <Menu.Item key='export-excel' id='excel'>
                      <span>Excel</span>
                    </Menu.Item>
                  </Menu>
                }
                trigger={[
                  'click',
                ]}
              >
                <Button color='info' size='sm'>
                  <SolidExpandMore />
                  Export As
                </Button>
              </Dropdown>
              <Button color='info' size='sm' justIcon>
                <Print />
              </Button>
            </div>
            <Accordion
              active={activePanel}
              onChange={handleActivePanelChange}
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              collapses={[
                {
                  title: <AccordionTitle title='Visit Listing' />,
                  content: (
                    <ReportDataGrid
                      height={500}
                      data={visitListingData}
                      columns={VisitListingColumns}
                    />
                  ),
                },
                {
                  title: <AccordionTitle title='Invoice Payer' />,
                  content: (
                    <ReportDataGrid
                      data={invoicePayerData}
                      columns={InvoicePayerColumns}
                    />
                  ),
                },
              ]}
            />
          </CardContainer>
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}

const QueueListingWithFormik = withFormik({
  mapPropsToValues: () => ({ listingFrom: undefined, listingTo: undefined }),
})(QueueListing)

export default QueueListingWithFormik
