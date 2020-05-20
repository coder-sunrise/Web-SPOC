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
// utils
import { INVOICE_VIEW_MODE } from '@/utils/constants'
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

  switchMode = () => {
    this.props.dispatch({
      type: 'invoiceDetail/updateState',
      payload: {
        mode: INVOICE_VIEW_MODE.APPLIED_SCHEME,
      },
    })
  }

  render () {
    const { classes, values, clinicSettings, disableApplyScheme } = this.props
    return (
      <div className={classes.cardContainer}>
        <Button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
          color='primary'
          onClick={this.switchMode}
          disabled={disableApplyScheme}
        >
          Apply Scheme
        </Button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}
        >
          <Button size='sm' color='primary' icon onClick={this.toggleReport}>
            <Printer />Print Invoice
          </Button>
        </div>
        <CommonTableGrid
          size='sm'
          height={300}
          rows={values.invoiceItem}
          columns={DataGridColumns}
          columnExtensions={DataGridColExtensions}
          {...TableConfig}
        />
        <Summary values={values} />
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
      </div>
    )
  }
}

export default withStyles(styles, { name: 'InvoiceDetailsComp' })(
  InvoiceDetails,
)
