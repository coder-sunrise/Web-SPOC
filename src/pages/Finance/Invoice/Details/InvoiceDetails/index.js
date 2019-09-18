import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  CommonTableGrid,
  GridContainer,
  GridItem,
  OutlinedTextField,
  FastField,
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
    const { classes, values } = this.props
    return (
      <div className={classes.cardContainer}>
        <CommonTableGrid
          size='sm'
          height={300}
          rows={values.invoiceItem}
          columns={DataGridColumns}
          columnExtensions={DataGridColExtensions}
          {...TableConfig}
        />
        <Summary />
        <GridContainer className={classes.summaryContainer}>
          <GridItem md={6}>
            <FastField
              name='remark'
              render={(args) => {
                return (
                  <OutlinedTextField
                    label='Invoice Remarks'
                    multiline
                    rowsMax={2}
                    rows={2}
                    {...args}
                  />
                )
              }}
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
