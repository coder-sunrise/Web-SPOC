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
  DataGridColExtensions,
} from './variables'

class InvoiceDetails extends Component {
  state = {
    showReport: false,
    isExistPackage: false,
    expandedGroups: [],
  }

  componentWillReceiveProps (nextProps) {
    const { values } = nextProps
    const settings = JSON.parse(localStorage.getItem('clinicSettings'))
    const { isEnablePackage = false } = settings

    if (values.invoiceItem) {
      const packageItems = values.invoiceItem.filter(item => item.isPackage && !item.isDeleted)
      const existPackage = isEnablePackage && packageItems.length > 0
      this.setState({
        isExistPackage: existPackage,
      })

      if (existPackage) {
        const groups = values.invoiceItem.reduce(
          (distinct, data) =>
            distinct.includes(data.packageGlobalId)
              ? [
                  ...distinct,
                ]
              : [
                  ...distinct,
                  data.packageGlobalId,
                ],
          [],
        )
  
        this.setState({
          expandedGroups: groups,
        })
      }
    }
  }

  toggleReport = () => {
    this.setState((preState) => ({ showReport: !preState.showReport }))
  }

  render () {
    const { classes, values } = this.props

    const handleExpandedGroupsChange = (e) => {
      this.setState({
        expandedGroups: e,
      })
    }
    
    const packageGroupCellContent = ({ row }) => {
      if (row.value === undefined || row.value === '')
        return null

      let label = 'Package'
      let totalPrice = 0
      if (!values.invoiceItem) return ''
      const data = values.invoiceItem.filter(
        (item) => item.packageGlobalId === row.value,
      )
      if (data.length > 0) {
        totalPrice = _.sumBy(data, 'totalAfterItemAdjustment') || 0
        label = `${data[0].packageCode} - ${data[0].packageName} (Total: `
      }
      return (
        <span style={{ verticalAlign: 'middle', paddingRight: 8 }}>
          <strong>
            {label} 
            <NumberInput text currency value={totalPrice} />
            )        
          </strong>
        </span>
      )
    }

    let newColumns = [
      { name: 'itemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'adjAmt', title: 'Adjustment' },
      { name: 'totalAfterItemAdjustment', title: 'Total ($)' },
    ]
  
    if (this.state.isExistPackage) {
      newColumns.push({
        name: 'packageGlobalId',
        title: 'Package',
      })
    }

    return (
      <div className={classes.cardContainer}>
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
          columns={newColumns}
          columnExtensions={DataGridColExtensions}
          defaultSorting={[
            { columnName: 'packageGlobalId', direction: 'asc' },
            { columnName: 'invoiceItemTypeFK', direction: 'asc' },
          ]}
          FuncProps={{
            pager: false,
            grouping: this.state.isExistPackage,
            groupingConfig: {
              state: {
                grouping: [
                  { columnName: 'packageGlobalId' },
                ],
                expandedGroups: [
                  ...this.state.expandedGroups,
                ],
                onExpandedGroupsChange: handleExpandedGroupsChange,
              },
              row: {
                contentComponent: packageGroupCellContent,
              },
            },
          }}
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
