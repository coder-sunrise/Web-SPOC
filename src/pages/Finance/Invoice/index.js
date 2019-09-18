import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer, withFormikExtend } from '@/components'
// sub components
import FilterBar from './components/FilterBar'
import InvoiceDataGrid from './components/InvoiceDataGrid'
// styles
import styles from './styles'

@withFormikExtend({
  mapPropsToValues: () => {},
})
@connect(({ invoiceList, global }) => ({
  invoiceList,
  global,
}))
class Invoice extends React.Component {
  onRowDoubleClick = (row) => {
    this.props.history.push(`/finance/invoice/details?id=${row.invoiceNo}`)
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'invoiceList/query',
    })
  }

  render () {
    const { classes, invoiceList } = this.props
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
