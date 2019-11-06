import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import moment from 'moment'
// common components
import { CardContainer, withFormikExtend } from '@/components'
// sub components
import FilterBar from './components/FilterBar'
import InvoiceDataGrid from './components/InvoiceDataGrid'
// styles
import styles from './styles'
import Authorized from '@/utils/Authorized'

@connect(({ invoiceList, global }) => ({
  invoiceList,
  global,
}))
@withFormikExtend({
  mapPropsToValues: () => {
    return {
      invoiceDates: [
        moment().add(-1, 'month'),
        moment(),
      ],
    }
  },
})
class Invoice extends React.Component {
  componentDidMount () {
    this.props.dispatch({
      type: 'invoiceList/query',
    })
  }

  onRowDoubleClick = (row) => {
    // this.props.history.push(`/finance/invoice/details?id=${row.invoiceNo}`)
    this.props.history.push(`/finance/invoice/details?id=${row.id}`)
  }

  render () {
    const { classes } = this.props
    return (
      <CardContainer hideHeader>
        <FilterBar {...this.props} />
        <InvoiceDataGrid
          handleRowDoubleClick={this.onRowDoubleClick}
          {...this.props}
        />
        <p className={classes.footerNote}>
          Note: Total Payment is the sum total of the payment amount of payers
        </p>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'InvoicePage' })(Invoice)
