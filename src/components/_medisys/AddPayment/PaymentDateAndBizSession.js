import React from 'react'
import moment from 'moment'
import { FastField, Field } from 'formik'
import { DatePicker, Select, GridContainer, GridItem } from '@/components'

const PaymentDateAndBizSession = ({ handleDateChange, bizSessionList }) => {
  return (
    <GridContainer>
      <GridItem md={3}>
        <FastField
          name='paymentReceivedDate'
          render={(args) => (
            <DatePicker
              {...args}
              allowClear={false}
              disabledDate={(d) => !d || d.isAfter(moment())}
              label='Payment Date'
              onChange={handleDateChange}
            />
          )}
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          name='paymentReceivedBizSessionFK'
          render={(args) => (
            <Select {...args} options={bizSessionList} label='Clinic Session' />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default PaymentDateAndBizSession
