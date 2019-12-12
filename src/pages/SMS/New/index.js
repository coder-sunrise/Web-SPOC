import React from 'react'
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
  OutlinedTextField,
  Button,
  withFormikExtend,
  FastField,
  CodeSelect,
  Field,
} from '@/components'

const New = ({
  values,
  errors,
  selectedRows,
  handleSubmit,
  recipient,
  setFieldValue,
}) => {
  const allowSent = () => {
    if (recipient && values.content) {
      return true
    }

    if (values.content && lodash.isEmpty(errors) && selectedRows.length > 0) {
      return true
    }

    return false
  }

  return (
    <GridContainer>
      <GridItem md={9}>
        <Field
          name='template'
          render={(args) => {
            return (
              <CodeSelect
                label={formatMessage({
                  id: 'sms.template',
                })}
                code='SmsTemplate'
                labelField='displayValue'
                onChange={(e, op = {}) => {
                  const { templateMessage } = op
                  if (templateMessage) {
                    const prevContent = values.content || ''
                    setFieldValue('content', prevContent + templateMessage)
                  } else {
                    setFieldValue('content', undefined)
                  }
                }}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <Authorized authority='sms.sendsms'>
        <GridItem md={3} style={{ margin: 'auto' }}>
          <Button
            disabled={!allowSent()}
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
                rows='4'
                multiline
                label={formatMessage({
                  id: 'sms.message',
                })}
                maxLength={9999999999}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem md={1}>
        {values.content ? values.content.length : 0}/160
      </GridItem>
      <GridItem md={11}>
        <Badge
          badgeContent={
            values.content ? Math.ceil(values.content.length / 160) : null
          }
          color='error'
        >
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
      const {
        dispatch,
        onConfirm,
        selectedRows,
        recipient,
        setSelectedRows,
        currentTab,
        smsAppointment,
        smsPatient,
      } = props
      let payload = []
      const createPayload = (patientProfFK, o) => {
        const {
          smsPatient: smsPat,
          smsAppointment: smsAppt,
          ...restValues
        } = values
        let patientProfileFK = patientProfFK
        let appointmentFK = o
        if (!patientProfileFK) {
          patientProfileFK = o
          appointmentFK = undefined
        }
        const tempObject = {
          ...restValues,
          patientOutgoingSMS: {
            patientProfileFK,
            appointmentReminderDto: {
              appointmentFK,
            },
          },
          selectedRows: undefined,
        }

        if (!appointmentFK) {
          delete tempObject.patientOutgoingSMS.appointmentReminderDto
        }

        payload.push(tempObject)
      }
      if (recipient) {
        const { id, patientProfileFK } = recipient
        createPayload(patientProfileFK, id)
      } else {
        selectedRows.forEach((o) => {
          const { patientProfileFK } =
            smsAppointment.list.find((r) => r.id === o) ||
            smsPatient.list.find((r) => r.id === o)
          createPayload(patientProfileFK, o)
        })
      }

      dispatch({
        type: 'sms/upsert',
        payload,
      }).then((r) => {
        if (r) {
          if (setSelectedRows) {
            setSelectedRows([])
          }
          resetForm()
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
