import React, { Component, PureComponent } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import moment from 'moment'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  DateRangePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  NumberInput,
  RichEditor,
  TimePicker,
} from '@/components'

class CertificateAttendance extends PureComponent {
  render () {
    const { theme, classes, consultationDocument, rowHeight } = this.props
    console.log('CertificateAttendance')
    return (
      <div>
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
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='fromtime'
              render={(args) => {
                return <TimePicker label='From' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='totime'
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
            <RichEditor />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default CertificateAttendance
