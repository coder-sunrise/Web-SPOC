import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
// material ui
import { withStyles } from '@material-ui/core'
import moment from 'moment'
// common components
import { CardContainer } from '@/components'
// sub components
import FilterBar from './components/FilterBar'
import InvoiceDataGrid from './components/InvoiceDataGrid'
// styles
import styles from './styles'

@connect(({ invoiceList, global, clinicSettings }) => ({
  invoiceList,
  global,
  mainDivHeight: global.mainDivHeight,
  clinicSettings: clinicSettings.settings,
}))
class Invoice extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'invoiceList/query',
      payload: {
        lgteql_invoiceDate: moment()
          .add(-1, 'month')
          .formatUTC(),
        lsteql_invoiceDate: moment()
          .endOf('day')
          .formatUTC(false),
      },
    })
  }
  onRowDoubleClick = row => {
    this.props.history.push(`/finance/invoice/details?id=${row.id}`)
  }
  render() {
    const { classes, mainDivHeight = 700 } = this.props
    let height =
      window.innerHeight -
      190 -
      ($('.filterBar').height() || 0) -
      ($('.footerBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <FilterBar {...this.props} />
        </div>
        <InvoiceDataGrid
          handleRowDoubleClick={this.onRowDoubleClick}
          {...this.props}
          height={height}
        />
        <div className='footerBar'>
          <p className={classes.footerNote}>
            Note: Total Payment is the sum total of the payment amount of payers
          </p>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'InvoicePage' })(Invoice)
