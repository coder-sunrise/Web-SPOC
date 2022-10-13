import React, { Component } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import _ from 'lodash'
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
  NumberInput,
  Popover,
} from '@/components'
import { ReportViewer } from '@/components/_medisys'
// utils
import { INVOICE_VIEW_MODE, INVOICE_REPORT_TYPES } from '@/utils/constants'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
// sub component
import Summary from './Summary'
// styling
import styles from './styles'
// variables
import { DataGridColExtensions } from './variables'

class InvoiceDetails extends Component {
  state = {
    showReport: false,
    showVisitInvoiceReport: false,
    showPrintInvoiceMenu: false,
    invoiceReportType: '',
  }

  componentWillReceiveProps(nextProps) {}

  toggleReport = invoiceReportType => {
    this.setState(preState => ({
      showReport: !preState.showReport,
      invoiceReportType: invoiceReportType,
    }))
  }

  toggleVisitInvoiceReport = () => {
    this.setState(preState => ({
      showVisitInvoiceReport: !preState.showVisitInvoiceReport,
    }))
  }

  render() {
    const { classes, values, isEnableVisitationInvoiceReport } = this.props

    let newColumns = [
      { name: 'itemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'adjAmt', title: 'Adjustment' },
      { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
    ]

    return (
      <div className={classes.cardContainer}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}
        >
          <Popover
            icon={null}
            trigger='click'
            placement='right'
            visible={this.state.showPrintInvoiceMenu}
            onVisibleChange={() => {
              if (!values.visitOrderTemplateFK) {
                this.toggleReport(INVOICE_REPORT_TYPES.INDIVIDUALINVOICE)
              } else {
                this.setState(preState => {
                  return {
                    showPrintInvoiceMenu: !preState.showPrintInvoiceMenu,
                  }
                })
              }
            }}
            content={
              <MenuList
                role='menu'
                onClick={() => this.setState({ showPrintInvoiceMenu: false })}
              >
                <MenuItem
                  onClick={() =>
                    this.toggleReport(INVOICE_REPORT_TYPES.SUMMARYINVOICE)
                  }
                >
                  Summary Invoice
                </MenuItem>

                <MenuItem
                  onClick={() =>
                    this.toggleReport(INVOICE_REPORT_TYPES.INDIVIDUALINVOICE)
                  }
                >
                  Individual Invoice
                </MenuItem>
              </MenuList>
            }
          >
            <Button size='sm' color='primary' icon>
              <Printer />
              Print Invoice
            </Button>
          </Popover>
          {isEnableVisitationInvoiceReport && (
            <Button
              size='sm'
              color='primary'
              icon
              onClick={this.toggleVisitInvoiceReport}
            >
              <Printer />
              Print Visit Invoice
            </Button>
          )}
        </div>
        <CommonTableGrid
          size='sm'
          height={300}
          rows={values.invoiceItem}
          columns={newColumns}
          columnExtensions={DataGridColExtensions}
          defaultSorting={[
            { columnName: 'invoiceItemTypeFK', direction: 'asc' },
          ]}
          FuncProps={{
            pager: false,
          }}
        />
        <Summary values={values} />
        <GridContainer className={classes.summaryContainer}>
          <GridItem md={6}>
            <FastField
              name='remark'
              render={args => {
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
            reportParameters={{
              InvoiceID: values ? values.id : '',
              printType: this.state.invoiceReportType,
              _key: values ? values.invoiceNo : '',
            }}
          />
        </CommonModal>
        <CommonModal
          open={this.state.showVisitInvoiceReport}
          onClose={this.toggleVisitInvoiceReport}
          title='Invoice'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={80}
            reportParameters={{
              InvoiceID: values ? values.id : '',
              _key: values ? values.invoiceNo : '',
            }}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'InvoiceDetailsComp' })(
  InvoiceDetails,
)
