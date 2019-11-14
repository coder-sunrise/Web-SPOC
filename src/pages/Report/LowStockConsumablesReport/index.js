import React from 'react'
import LowStockList from './LowStockList'
import ReportBase from '../ReportBase'

const reportId = 19
const fileName = 'Low Stock Consumables Report'

class LowStockConsumablesReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId,
      fileName,
    }
  }

  renderContent = (reportDatas) => {
    return <LowStockList reportDatas={reportDatas} />
  }

}
export default LowStockConsumablesReport
