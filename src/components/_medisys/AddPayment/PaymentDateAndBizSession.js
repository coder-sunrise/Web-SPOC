import React from 'react'
import moment from 'moment'
import { FastField, Field } from 'formik'
import { DatePicker, Select, GridContainer, GridItem } from '@/components'

const PaymentDateAndBizSession = ({ handleDateChange, bizSessionList }) => {
  return (
    <GridContainer>
      <GridItem
        md={4}
        container
        style={{ paddingLeft: 100, position: 'relative' }}
      >
        <div style={{ position: 'absolute', left: 0, bottom: 4 }}>
          Payment Date:
        </div>
        <FastField
          name='paymentReceivedDate'
          render={args => (
            <DatePicker
              {...args}
              allowClear={false}
              disabledDate={d => !d || d.isAfter(moment())}
              onChange={handleDateChange}
            />
          )}
        />
      </GridItem>
      <GridItem
        md={4}
        container
        style={{ paddingLeft: 100, position: 'relative' }}
      >
        <div style={{ position: 'absolute', left: 0, bottom: 4 }}>
          Clinic Session:
        </div>
        <Field
          name='paymentReceivedBizSessionFK'
          render={args => <Select {...args} options={bizSessionList} />}
        />
      </GridItem>
    </GridContainer>
  )
}

export default PaymentDateAndBizSession
