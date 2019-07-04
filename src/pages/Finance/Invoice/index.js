import React from 'react'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
// sub components
import FilterBar from './components/FilterBar'
import InvoiceDataGrid from './components/InvoiceDataGrid'
// styles
import styles from './styles'

@withFormik({
  mapPropsToValues: () => {},
})
class Invoice extends React.Component {
  onRowDoubleClick = (row) => {
    this.props.history.push(`/finance/invoice/${row.invoiceNo}`)
  }

  render () {
    const { classes } = this.props
    return (
      <CardContainer hideHeader>
        <FilterBar />
        <InvoiceDataGrid handleRowDoubleClick={this.onRowDoubleClick} />
        <p className={classes.footerNote}>
          Note: Total Payment is the sum total of the payment amount of payers
        </p>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'InvoicePage' })(Invoice)
