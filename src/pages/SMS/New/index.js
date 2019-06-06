import React from 'react'
import { connect } from 'dva'
import { Send } from '@material-ui/icons'
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import {
  GridContainer,
  GridItem,
  Select,
  OutlinedTextField,
  Button,
  Card,
  CardBody,
} from '@/components'
import { formatMessage, FormattedMessage } from 'umi/locale'

const New = (props) => {
  const { values, onSend, setFieldValue } = props
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
          disabled={!values.message || !values.template}
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
      <GridItem md={12}>{values.message ? values.message.length : 0}/160</GridItem>
    </GridContainer>
  )
}

export default compose(
  withFormik({
    mapPropsToValues: () => {},
  }),
  // React.memo,
)(New)
