import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FastField, withFormik } from 'formik'
import moment from 'moment'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Tooltip } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  CodeSelect,
  ProgressButton,
  DateRangePicker,
} from '@/components'

@connect(({ purchaseReceiveList }) => {
  return purchaseReceiveList.filterSearch
})
@withFormik({
  handleSubmit: () => {},
  displayName: 'PurchaseReceiveFilter',
})
class FilterBar extends PureComponent {
  onChangeAllDate = (e) => {
    const { setFieldValue } = this.props
    const { target } = e
    if (target.value) {
      // setFieldValue('transactionDates', [])
    } else {
      setFieldValue('transactionDates', [
        moment().format('YYYY-MM-01'),
        moment(),
      ])
    }
  }

  render () {
    const {
      classes,
      dispatch,
      values,
      actions: { handleNavigate },
    } = this.props

    return (
      <GridContainer>
        <GridItem xs={6} md={3}>
          <FastField
            name='purchaseOrderNo'
            render={(args) => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.pr.pono',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem md={6}>
          <FastField
            name='transactionDates'
            render={(args) => {
              return (
                <DateRangePicker
                  disabled={values.isAllDateChecked}
                  label={formatMessage({
                    id: 'inventory.pr.filter.datefrom',
                  })}
                  label2={formatMessage({
                    id: 'inventory.pr.filter.dateto',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs sm={6} md={3}>
          <FastField
            name='isAllDateChecked'
            render={(args) => {
              return (
                <Tooltip
                  title={formatMessage({
                    id: 'form.date.placeholder.allDate',
                  })}
                  placement='bottom'
                >
                  <Checkbox
                    label={formatMessage({
                      id: 'form.date.placeholder.allDate',
                    })}
                    inputLabel=' '
                    onChange={(e) => this.onChangeAllDate(e)}
                    {...args}
                  />
                </Tooltip>
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='invoiceStatusFK'
            render={(args) => {
              return (
                <CodeSelect
                  code='LTInvoiceStatus'
                  labelField='name'
                  label={formatMessage({
                    id: 'inventory.pr.invoiceStatus',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='supplierFK'
            render={(args) => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'inventory.pr.supplier',
                  })}
                  code='ctSupplier'
                  labelField='displayValue'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='purchaseOrderStatusFK'
            render={(args) => {
              return (
                <CodeSelect
                  code='LTPurchaseOrderStatus'
                  labelField='name'
                  label={formatMessage({
                    id: 'inventory.pr.poStatus',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <div className={classes.buttonGroup}>
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => {
                const {
                  purchaseOrderNo,
                  invoiceStatusFK,
                  purchaseOrderStatusFK,
                  transactionDates,
                  supplierFK,
                } = values
                dispatch({
                  type: 'purchaseReceiveList/query',
                  payload: {
                    lgteql_purchaseOrderDate: transactionDates
                      ? transactionDates[0]
                      : undefined,
                    lsteql_purchaseOrderDate: transactionDates
                      ? transactionDates[1]
                      : undefined,
                    purchaseOrderNo,
                    invoiceStatusFK,
                    purchaseOrderStatusFK,
                    supplierFK,
                    // group: [
                    //   {
                    //     purchaseOrderNo,
                    //     invoiceStatusFK,
                    //     purchaseOrderStatusFK,
                    //     supplierFK,
                    //     combineCondition: 'or',
                    //   },
                    // ],
                  },
                })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>

            <Button onClick={() => handleNavigate('new')} color='primary'>
              Add New
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default FilterBar
