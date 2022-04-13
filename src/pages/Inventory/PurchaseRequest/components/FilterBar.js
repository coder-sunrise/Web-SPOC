import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
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
  DatePicker,
  Tooltip,
  Field,
  ClinicianSelect,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { FilterBarDate } from '@/components/_medisys'

@withFormik({
  mapPropsToValues: () => ({
    transactionStartDate: moment()
      .startOf('month')
      .formatUTC(),
    transactionEndDate: moment()
      .endOf('day')
      .formatUTC(false),
    requestBy: [-99],
  }),
  handleSubmit: () => {},
  displayName: 'PurchaseRequestFilter',
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
        <GridItem md={3}>
          <FastField
            name='purchaseRequestNo'
            render={args => {
              return (
                <TextField
                  label={formatMessage({
                    id: 'inventory.purchaserequest.prno',
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
                label='Date From'
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
                label='Date To'
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
          <Field
            name='requestBy'
            render={args => {
              return (
                <ClinicianSelect
                  label='Requested By'
                  mode='multiple'
                  maxTagCount={0}
                  maxTagPlaceholder='Requesters'
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={3}>
          <FastField
            name='purchaseRequestStatusFK'
            render={args => {
              return (
                <CodeSelect
                  code='LTPurchaseRequestStatus'
                  labelField='name'
                  label={formatMessage({
                    id: 'inventory.purchaserequest.status',
                  })}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={6} md={12}>
          <div className={classes.buttonGroup}>
            <ProgressButton
              color='primary'
              icon={<Search />}
              onClick={() => {
                const {
                  purchaseRequestNo,
                  purchaseRequestStatusFK,
                  isAllDateChecked,
                  requestBy,
                } = values

                dispatch({
                  type: 'purchaseRequestList/query',
                  payload: {
                    lgteql_purchaseRequestDate: isAllDateChecked
                      ? undefined
                      : transactionStartDate,
                    lsteql_purchaseRequestDate: isAllDateChecked
                      ? undefined
                      : transactionEndDate,
                    purchaseRequestNo,
                    purchaseRequestStatusFK,
                    apiCriteria: {
                      requesters: requestBy?.includes(-99) ? undefined : requestBy?.join(),
                    },
                  },
                })
              }}
            >
              <FormattedMessage id='form.search' />
            </ProgressButton>
            <Authorized authority='purchasingrequest.createpurchasingrequest'>
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
