import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import Printer from '@material-ui/icons/Print'
import {
  CommonModal,
  CommonTableGrid,
  GridContainer,
  GridItem,
  OutlinedTextField,
  FastField,
  Button,
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
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
  state = {
    showReport: false,
  }

  toggleReport = () => {
    this.setState((preState) => ({ showReport: !preState.showReport }))
  }

  render () {
    const { classes, values } = this.props
    return (
      <div className={classes.cardContainer}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <Button size='sm' color='primary' icon onClick={this.toggleReport}>
            <Printer />Print Invoice
          </Button>
        </div>
        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={15}
            reportParameters={{ InvoiceID: values ? values.id : '' }}
          />
        </CommonModal>
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
                    disabled
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
