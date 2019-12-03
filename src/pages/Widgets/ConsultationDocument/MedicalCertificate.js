import React, { PureComponent } from 'react'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  DateRangePicker,
  notification,
  NumberInput,
  withFormikExtend,
  FastField,
  Field,
  ClinicianSelect,
} from '@/components'
import * as service from '@/services/common'

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return (
      consultationDocument.entity ||
      consultationDocument.defaultMedicalCertificate
    )
  },
  validationSchema: Yup.object().shape({
    mcIssueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    mcDays: Yup.number().required(),
    mcStartEndDate: Yup.array().of(Yup.date()).min(2).required(),
    unfitTypeFK: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, currentType, getNextSequence } = props
    const { mcStartEndDate } = values
    const nextSequence = getNextSequence()
    const data = {
      sequence: nextSequence,
      ...values,
      mcStartDate: mcStartEndDate[0],
      mcEndDate: mcStartEndDate[1],
    }
    // console.log(mcStartEndDate)
    data.subject = currentType.getSubject(data)
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class MedicalCertificate extends PureComponent {
  componentDidMount () {
    const { setFieldValue, values } = this.props

    if (values.mcReferenceNo === '-')
      service.runningNumber('mc').then((o) => {
        if (o && o.data) {
          setFieldValue('mcReferenceNo', o.data)
        } else {
          notification.error({
            message: 'Generate Reference Number fail',
          })
        }
      })
  }

  onDaysChange = (e) => {
    const { values, setFieldValue } = this.props
    if (e.target.value) {
      const startDate = moment(values.mcStartEndDate[0])
      setFieldValue('mcStartEndDate', [
        startDate,
        startDate.clone().add('days', Math.ceil(e.target.value - 1)),
      ])
    }
  }

  onDayRangeChange = (dateArray, moments) => {
    const { setFieldValue } = this.props

    setFieldValue(
      'mcDays',
      Math.ceil(moment.duration(moments[1].diff(moments[0])).asDays()),
    )
  }

  render () {
    const { footer, handleSubmit, classes, values } = this.props
    // console.log({ values })
    return (
      <div>
        {values.mcReferenceNo && (
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='mcReferenceNo'
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
              name='mcIssueDate'
              render={(args) => {
                return <DatePicker label='Issue Date' autoFocus {...args} />
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
              name='mcDays'
              render={(args) => {
                return (
                  <NumberInput
                    step={0.5}
                    format='0.0'
                    min={0.5}
                    max={365}
                    label='Day(s)'
                    onChange={this.onDaysChange}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='mcStartEndDate'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='From'
                    label2='To'
                    onChange={this.onDayRangeChange}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='unfitTypeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    code='ctUnfitType'
                    label='Description'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <FastField
              name='remarks'
              render={(args) => {
                return (
                  <TextField label='Remarks' multiline rowsMax='4' {...args} />
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
export default MedicalCertificate
