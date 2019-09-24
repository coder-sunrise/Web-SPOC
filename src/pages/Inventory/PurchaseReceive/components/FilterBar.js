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
const filterPrefix = 'filter'

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
          name={`${filterPrefix}.poNo`}
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
          name={`${filterPrefix}.transactionDates`}
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
          name={`${filterPrefix}.allDate`}
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
                    setIsAllDateChecked(values ? values.filter.allDate : false)}
                  {...args}
                />
              </Tooltip>
            )
          }}
        />
      </GridItem>
      <GridItem xs={6} md={3}>
        <FastField
          name={`${filterPrefix}.invoiceStatus`}
          render={(args) => {
            return (
              <Select
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
          name={`${filterPrefix}.supplier`}
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
          name={`${filterPrefix}.poStatus`}
          render={(args) => {
            return (
              <Select
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
                poNo,
                invoiceStatus,
                transactionDates,
                supplier,
                poStatus,
              } = values.filter
              dispatch({
                type: 'purchaseReceiveList/query',
                // payload: {}
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
