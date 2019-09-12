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
import { getPatientListingReport } from '@/services/report'

const PatientListingColumns = [
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

const PatientListing = ({ values }) => {
  const [
    activePanel,
    setActivePanel,
  ] = useState(-1)

  const handleActivePanelChange = (event, panel) => {
    if (activePanel === panel.key) setActivePanel(-1)
    else setActivePanel(panel.key)
  }

  const [
    patientListingData,
    setPatientListingData,
  ] = useState([])

  const asyncGetData = async () => {
    const result = await getPatientListingReport(values)
    if (result) {
      setPatientListingData(result.patientListingDetails)
      // setInvoicePayerData(queueListingResult.InvoicePayerDetails)
      setActivePanel(0)
    }
  }

  const onSubmitClick = () => asyncGetData()

  useEffect(() => {
    /* 
    clean up function
    set visit listing data to empty array when leaving the page 
    */
    return () => setPatientListingData([])
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
                      data={patientListingData}
                      columns={PatientListingColumns}
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

const PatientListingWithFormik = withFormik({
  mapPropsToValues: () => ({ listingFrom: undefined, listingTo: undefined }),
})(PatientListing)

export default PatientListingWithFormik
