import React from 'react'
import { connect } from 'dva'
import { Send } from '@material-ui/icons'
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import * as Yup from 'yup'
import lodash from 'lodash'

import {
  GridContainer,
  GridItem,
  Select,
  OutlinedTextField,
  Button,
} from '@/components'
import { formatMessage, FormattedMessage } from 'umi/locale'

const New = (props) => {
  const { values, onSend, setFieldValue, errors } = props
  const SMSTemplate = [
    {
      name: 'Appointment Reminder',
      value: 'Appointment Reminder',
    },
    {
      name: 'Birthday Reminder',
      value: 'Birthday Reminder',
    },
  ]
  const handleClick = () => {
    setFieldValue('message', '')
    onSend(values.message)
  }
  return (
    <GridContainer>
      <GridItem md={9}>
        <FastField
          name='template'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.template',
                })}
                options={SMSTemplate}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={3} style={{ margin: 'auto' }}>
        <Button
          disabled={
            !values.message || !values.template || !lodash.isEmpty(errors)
          }
          variant='contained'
          color='primary'
          onClick={handleClick}
        >
          <Send />
          Send
        </Button>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name='message'
          render={(args) => {
            return (
              <OutlinedTextField
                multiline
                rows='4'
                label={formatMessage({
                  id: 'sms.message',
                })}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={12}>
        {values.message ? values.message.length : 0}/160
      </GridItem>
    </GridContainer>
  )
}

export default compose(
  withFormik({
    validationSchema: Yup.object().shape({
      message: Yup.string().max(20, 'Exceed Message Length'),
    }),
    mapPropsToValues: () => {},
  }),
  // React.memo,
)(New)
