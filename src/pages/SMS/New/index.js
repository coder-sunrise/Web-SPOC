import React, { useState } from 'react'
import Send from '@material-ui/icons/Send'
import MailIcon from '@material-ui/icons/Mail'
import { compose } from 'redux'
import lodash from 'lodash'
import { Badge } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import Authorized from '@/utils/Authorized'
import {
  GridContainer,
  GridItem,
  Select,
  OutlinedTextField,
  Button,
  withFormikExtend,
  FastField,
} from '@/components'

const New = ({
  values,
  onSend,
  setFieldValue,
  errors,
  selectedRows,
  handleSubmit,
}) => {
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
      // splitMessage(value, arr, 160)
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
              !values.content ||
              !lodash.isEmpty(errors) ||
              selectedRows.length <= 0
            }
            variant='contained'
            color='primary'
            onClick={handleSubmit}
          >
            <Send />
            Send
          </Button>
        </GridItem>
      </Authorized>
      <GridItem md={12}>
        <FastField
          name='content'
          render={(args) => {
            return (
              <OutlinedTextField
                onChange={handleChange}
                rows='4'
                multiline
                label={formatMessage({
                  id: 'sms.message',
                })}
                inputProps={{
                  inputProps: {
                    maxLength: 5,
                  },
                }}
                // maxLength={5}
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
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, onConfirm, selectedRows, sms } = props

      let payload = []

      selectedRows.forEach((o) => {
        const { patientProfileFK } = sms.list.find((r) => r.id === o)
        const smsObject = {
          ...values,
          patientOutgoingSMS: {
            patientProfileFK,
            appointmentReminderDto: {
              appointmentFK: o,
            },
          },
          sms: undefined,
          selectedRows: undefined,
        }
        payload.push(smsObject)
      })
      console.log({ payload })
      dispatch({
        type: 'sms/upsert',
        payload,
      }).then((r) => {
        if (r) {
          if (onConfirm) onConfirm()
          dispatch({
            type: 'sms/querySMSData',
            smsType: 'Appointment',
          })
        }
      })
    },
    displayName: 'Sms',
  }),
)(New)
