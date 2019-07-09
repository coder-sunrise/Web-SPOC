import React from 'react'
import router from 'umi/router'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import BaseSearchBar from '../components/BaseSearchBar'
import TableGrid from '../components/TableGrid'
// variables
import {
  NewCHASColumnExtensions,
  NewCHASColumns,
  NewCHASTableData,
  TableConfig,
} from './variables'

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@withFormik({
  mapPropsToValues: () => ({}),
})
class NewCHAS extends React.Component {
  navigateToInvoiceDetails = (row) => {
    const { invoiceNo } = row
    const processedInvoiceNo = invoiceNo.replace('/', '-')
    router.push(`/claim-submission/chas/invoice/${processedInvoiceNo}`)
  }

  handleContextMenuItemClick = (currentTarget, row) => {
    const { id } = currentTarget
    switch (id) {
      case '0':
        this.openClaimDetails({ claimDetails: row })
        break
      case '1':
        this.navigateToInvoiceDetails(row)
        break
      default:
        break
    }
  }

  render () {
    const { classes, handleContextMenuItemClick } = this.props

    return (
      <CardContainer hideHeader size='sm'>
        <BaseSearchBar />
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={NewCHASTableData}
              columnExtensions={NewCHASColumnExtensions}
              columns={NewCHASColumns}
              tableConfig={TableConfig}
              onContextMenuItemClick={handleContextMenuItemClick}
            />
          </GridItem>
          <GridItem md={4} className={classes.buttonGroup}>
            <Button color='info'>Refresh</Button>
            <Button color='primary'>Submit Claim</Button>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'NewCHAS' })(NewCHAS)
