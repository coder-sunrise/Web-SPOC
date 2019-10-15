import React, { useState } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Tooltip } from '@material-ui/core'
import {
  Field,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  Select,
  CodeSelect,
  ProgressButton,
  DateRangePicker,
} from '@/components'

const FilterBar = ({
  classes,
  dispatch,
  values,
  actions: { handleNavigate },
}) => {
  const [
    isAllDateChecked,
    setIsAllDateChecked,
  ] = useState(false)
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
        <Field
          name='transactionDates'
          render={(args) => {
            return (
              <DateRangePicker
                disabled={isAllDateChecked}
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
          name='allDate'
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
                  onChange={() =>
                    setIsAllDateChecked(values ? values.allDate : false)}
                  {...args}
                />
              </Tooltip>
            )
          }}
        />
      </GridItem>
      <GridItem xs={6} md={3}>
        <FastField
          name='invoiceStatus'
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
          name='purchaseOrderStatus'
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
                invoiceStatus,
                purchaseOrderStatus,
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
                  group: [
                    {
                      purchaseOrderNo,
                      invoiceStatus,
                      purchaseOrderStatus,
                      supplierFK,
                      combineCondition: 'or',
                    },
                  ],
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
export default FilterBar
