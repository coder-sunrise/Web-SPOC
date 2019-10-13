import React, { PureComponent } from 'react'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  TextField,
  notification,
  DatePicker,
  TimePicker,
  withFormikExtend,
  FastField,
  Field,
  ClinicianSelect,
} from '@/components'
import * as service from '@/services/common'

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument, visitEntity }) => {
    const values = {
      ...(consultationDocument.entity ||
        consultationDocument.defaultCertOfAttendance),
      attendanceStartTime: visitEntity.visit
        ? moment(visitEntity.visit.visitDate).format('HH:mm')
        : moment().format('HH:mm'),
    }
    return values
  },
  validationSchema: Yup.object().shape({
    issueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    accompaniedBy: Yup.string().required(),
    attendanceStartTime: Yup.string().required(),
    attendanceEndTime: Yup.string()
      .laterThan(
        Yup.ref('attendanceStartTime'),
        'Time From must be later than Time To',
      )
      .required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, consultationDocument, currentType } = props
    const { rows } = consultationDocument

    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: rows.length,
        ...values,
        subject: currentType.getSubject(values),
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class CertificateAttendance extends PureComponent {
  componentDidMount () {
    const { setFieldValue, values } = this.props
    // console.log({ values })
    if (values.referenceNo === '-')
      service.runningNumber('coa').then((o) => {
        if (o && o.data) {
          setFieldValue('referenceNo', o.data)
        } else {
          notification.error({
            message: 'Generate Reference Number fail',
          })
        }
      })
  }

  render () {
    const { footer, handleSubmit, classes, values } = this.props
    console.log({ props: this.props })
    return (
      <div>
        {values.referenceNo && (
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='referenceNo'
                render={(args) => {
                  return <TextField disabled label='Reference No' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
        )}

        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='issueDate'
              render={(args) => {
                return <DatePicker label='Issue Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect label='Issue By' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='attendanceStartTime'
              render={(args) => {
                return <TimePicker label='From' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='attendanceEndTime'
              render={(args) => {
                return <TimePicker label='To' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='accompaniedBy'
              render={(args) => {
                return <TextField label='Accompanied By' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <TextField
                    label='Remarks'
                    multiline
                    rowsMax='4'
                    {...args}
                    inputProps={{ maxLength: 1900 }}
                    maxLength={1900}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
          })}
      </div>
    )
  }
}
export default CertificateAttendance
