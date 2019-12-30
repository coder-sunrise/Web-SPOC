import React from 'react'
// formik
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  DateRangePicker,
  Checkbox,
  GridItem,
  TextField,
  Select,
  GridContainer,
  CheckboxGroup,
} from '@/components'
import { smsStatus, messageStatus } from '@/utils/codes'

const styles = (theme) => ({
  checkbox: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
})

const FilterByPatient = ({ classes, setFieldValue }) => {
  return (
    <React.Fragment>
      <GridItem md={4}>
        <FastField
          name='patientName'
          render={(args) => (
            <TextField
              {...args}
              label={formatMessage({
                id: 'reception.queue.patientSearchPlaceholder',
              })}
            />
          )}
        />
      </GridItem>
      {/* <GridItem md={4}>
        <FastField
          name='lastVisitDate'
          render={(args) => (
            <DateRangePicker
              {...args}
              label='Last Visit Date From'
              label2='To'
              onChange={(e) => {
                if (e.length === 0) setFieldValue('lastVisitDate', undefined)
              }}
            />
          )}
        />
      </GridItem> */}
      {/* <GridItem md={4} /> */}
      <GridItem md={2}>
        <FastField
          name='lastSMSSendStatus'
          render={(args) => (
            <Select {...args} label='SMS Status' options={smsStatus} />
          )}
        />
      </GridItem>
      <GridItem xs={3}>
        <FastField
          name='pdpaConsent'
          render={(args) => (
            <CheckboxGroup
              label='PDPA Consent - Agree to receive marketing material via:'
              horizontal
              valueField='id'
              textField='name'
              options={[
                {
                  id: '1',
                  name: 'Phone Call',
                  layoutConfig: {
                    style: {},
                  },
                },
                {
                  id: '2',
                  name: 'Text Message',
                  layoutConfig: {
                    style: {},
                  },
                },
                {
                  id: '3',
                  name: 'Email',
                  layoutConfig: {
                    style: {},
                  },
                },
              ]}
              {...args}
            />
          )}
        />
        {/* <GridContainer>
          <GridItem xs={5} className={classes.checkbox}>
            <FastField
              name='phoneCall'
              render={(args) => <Checkbox label='Phone Call' {...args} />}
            />
          </GridItem>
          <GridItem xs={5} className={classes.checkbox}>
            <FastField
              name='textMessage'
              render={(args) => <Checkbox label='Text Message' {...args} />}
            />
          </GridItem>
          <GridItem xs={2} className={classes.checkbox}>
            <FastField
              name='email'
              render={(args) => <Checkbox label='Email' {...args} />}
            />
          </GridItem>
        </GridContainer> */}
      </GridItem>
      <GridItem md={6} />

      {/* <GridItem md={2}>
        <FastField
          name='messageStatus'
          render={(args) => (
            <Select {...args} label='Message Status' options={messageStatus} />
          )}
        />
      </GridItem> */}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'FilterByPatient' })(FilterByPatient)
