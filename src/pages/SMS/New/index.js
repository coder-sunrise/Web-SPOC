import React, { useState } from 'react'
import Send from '@material-ui/icons/Send'
import MailIcon from '@material-ui/icons/Mail'
import { FastField, withFormik } from 'formik'
import { compose } from 'redux'
import lodash from 'lodash'
import { withStyles } from '@material-ui/core'
import Badge from '@material-ui/core/Badge'

import {
  GridContainer,
  GridItem,
  Select,
  OutlinedTextField,
  Button,
} from '@/components'
import { formatMessage } from 'umi/locale'

// const styles = (theme) => ({
//   messageBadge: {
//     margin: theme.spacing(2),
//     marginRight: theme.spacing(3),
//   },
// })

const New = (props) => {
  const [ messageNumber, setMessageNumber ] = useState(1)
  const [ messageArr, setMessageArr ] = useState([])
  const { values, onSend, setFieldValue, errors, classes } = props
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
        <Badge
          // className={classes.messageBadge}
          badgeContent={messageNumber}
          color='primary'
        >
          <MailIcon />
        </Badge>
      </GridItem>
    </GridContainer>
  )
}

export default compose(
  // withStyles(styles, { withTheme: true }),
  withFormik({
    // validationSchema: Yup.object().shape({
    //   message: Yup.string().max(160, 'Exceed Message Length'),
    // }),
    mapPropsToValues: () => {},
  }),

  // React.memo,
)(New)
