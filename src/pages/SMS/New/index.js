import React, { useState } from 'react'
import Send from '@material-ui/icons/Send'
import MailIcon from '@material-ui/icons/Mail'
import { FastField, withFormik } from 'formik'
import { compose } from 'redux'
import lodash from 'lodash'
import { Badge } from '@material-ui/core'
import Authorized from '@/utils/Authorized'

import {
  GridContainer,
  GridItem,
  Select,
  OutlinedTextField,
  Button,
} from '@/components'
import { formatMessage } from 'umi/locale'

const New = ({ values, onSend, setFieldValue, errors }) => {
  const [
    messageNumber,
    setMessageNumber,
  ] = useState(1)
  const [
    messageArr,
    setMessageArr,
  ] = useState([])
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

  const splitMessage = (message, arr, limit) => {
    let i = 0
    while (message) {
      if (i + limit >= message.length) {
        arr.push(message.slice(i, message.length))
        break
      }
      let end = message.slice(0, i + limit).lastIndexOf(' ')
      arr.push(message.slice(i, end + 1))
      i = end + 1
    }
  }

  const handleClick = () => {
    onSend(messageArr)
    setFieldValue('message', '')
    setMessageNumber(1)
    setMessageArr([])
  }

  const handleChange = ({ target }) => {
    const { value } = target
    let arr = []
    if (value) {
      splitMessage(value, arr, 160)
      setMessageArr(arr)
      setMessageNumber(arr.length)
    }
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
      <Authorized authority='sms.sendsms'>
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
      </Authorized>
      <GridItem md={12}>
        <FastField
          name='message'
          render={(args) => {
            return (
              <OutlinedTextField
                onChange={handleChange}
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
      <GridItem md={1}>
        {values.message ? values.message.length : 0}/160
      </GridItem>
      <GridItem md={11}>
        <Badge badgeContent={messageNumber} color='error'>
          <Button justIcon color='primary'>
            <MailIcon />
          </Button>
        </Badge>
      </GridItem>
    </GridContainer>
  )
}

export default compose(
  // withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => {},
  }),
  // React.memo,
)(New)
