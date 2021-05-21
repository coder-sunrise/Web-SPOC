import React, { PureComponent } from 'react'
import moment from 'moment'
// umi
import { formatMessage, FormattedMessage } from 'umi'
// formik
import { FastField, withFormik } from 'formik'
// material ui
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
// common components
import {
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  CodeSelect,
  ProgressButton,
  Tooltip,
  Field,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { FilterBarDate } from '@/components/_medisys'
import { LTInvoiceStatus, LTReceivingGoodsStatus } from '../variables'

@withFormik({
  mapPropsToValues: () => ({
    transactionStartDate: moment()
      .startOf('month')
      .formatUTC(),
    transactionEndDate: moment()
      .endOf('day')
      .formatUTC(false),
  }),
  handleSubmit: () => {},
  displayName: 'ReceivingGoodsFilter',
})
class FilterBar extends PureComponent {
  render() {
    const {
      classes,
      dispatch,
      values,
      actions: { handleNavigate },
    } = this.props

    const {
      transactionStartDate,
      transactionEndDate,
      isAllDateChecked,
    } = values

    return (
      <GridContainer>
        <GridItem xs={6} md={3}>
          <FastField
            name='searchNo'
            render={args => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.rg.filter.rgno',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem md={3}>
          <Field
            name='transactionStartDate'
            render={args => (
              <FilterBarDate
                noTodayLimit
                args={args}
                disabled={isAllDateChecked}
                label='Transaction Date From'
                formValues={{
                  startDate: transactionStartDate,
                  endDate: transactionEndDate,
                }}
              />
            )}
          />
        </GridItem>
        <GridItem md={3}>
          <Field
            name='transactionEndDate'
            render={args => (
              <FilterBarDate
                noTodayLimit
                isEndDate
                args={args}
                label='Transaction Date To'
                disabled={isAllDateChecked}
                formValues={{
                  startDate: transactionStartDate,
                  endDate: transactionEndDate,
                }}
              />
            )}
          />
        </GridItem>
        <GridItem xs sm={6} md={3}>
          <FastField
            name='isAllDateChecked'
            render={args => {
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
            render={args => {
              return (
                <CodeSelect
                  options={LTInvoiceStatus.filter(is => is.code !== 'OVERPAID')}
                  labelField='name'
                  label={formatMessage({
                    id: 'inventory.rg.invoiceStatus',
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
            render={args => {
              return (
                <CodeSelect
                  label={formatMessage({
                    id: 'inventory.rg.supplier',
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
            name='receivingGoodsStatusFK'
            render={args => {
              return (
                <CodeSelect
                  options={LTReceivingGoodsStatus}
                  labelField='name'
                  label={formatMessage({
                    id: 'inventory.rg.rgStatus',
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
              icon={<Search />}
              onClick={() => {
                const {
                  searchNo,
                  invoiceStatusFK,
                  receivingGoodsStatusFK,
                  supplierFK,
                } = values

                dispatch({
                  type: 'receivingGoodsList/query',
                  payload: {
                    lgteql_receivingGoodsDate: isAllDateChecked
                      ? undefined
                      : transactionStartDate,
                    lsteql_receivingGoodsDate: isAllDateChecked
                      ? undefined
                      : transactionEndDate,
                    group: [
                      {
                        like_receivingGoodsNo: searchNo,
                        like_documentNo: searchNo,
                        combineCondition: 'or',
                      },
                    ],
                    invoiceStatusFK,
                    receivingGoodsStatusFK,
                    supplierFK,
                  },
                })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Authorized authority='receivinggoods.newreceivinggoods'>
              <Button onClick={() => handleNavigate('new')} color='primary'>
                <Add />
                Add New
              </Button>
            </Authorized>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}

export default FilterBar
