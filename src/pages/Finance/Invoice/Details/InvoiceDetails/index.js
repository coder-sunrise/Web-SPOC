import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  CommonTableGrid,
  GridContainer,
  GridItem,
  OutlinedTextField,
} from '@/components'
// sub component
import Summary from './Summary'
// styling
import styles from './styles'
// variables
import {
  TableConfig,
  DataGridColumns,
  DataGridColExtensions,
} from './variables'

class InvoiceDetails extends Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.cardContainer}>
        <CommonTableGrid
          size='sm'
          height={300}
          rows={[
            {
              id: 1,
              type: 'Medication',
              name: 'Panadol',
              quantity: 1,
              adjustment: 0,
              total: 8,
            },
            {
              id: 2,
              type: 'Vaccination',
              name: 'Chicken Pox Vaccine',
              quantity: 1,
              adjustment: 0,
              total: 1,
            },
            {
              id: 3,
              type: 'Service',
              name: 'Consulation Service',
              quantity: 1,
              adjustment: 0,
              total: 1,
            },
          ]}
          columns={DataGridColumns}
          columnExtensions={DataGridColExtensions}
          {...TableConfig}
        />
        <Summary />
        <GridContainer className={classes.summaryContainer}>
          <GridItem md={6}>
            <OutlinedTextField
              label='Invoice Remarks'
              multiline
              rowsMax={3}
              rows={3}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'InvoiceDetailsComp' })(
  InvoiceDetails,
)
