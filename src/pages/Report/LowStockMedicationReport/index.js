import React from 'react'
import LowStockList from './LowStockList'
import ReportBase from '../ReportBase'

const reportId = 20
const fileName = 'Low Stock Medication Report'


class LowStockMedicationReport extends ReportBase {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderContent = (reportDatas) => {
    return <LowStockList reportDatas={reportDatas} />
  }

}

export default LowStockMedicationReport
