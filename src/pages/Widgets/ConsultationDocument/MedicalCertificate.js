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
} from '@/components'

class MedicalCertificate extends PureComponent {
  onDaysChange = (e) => {
    const { values, setFieldValue } = this.props
    console.log(e.target.value)
    if (e.target.value) {
      const startDate = moment(values.fromto[0])
      setFieldValue('fromto', [
        startDate,
        startDate.clone().add(e.target.value, 'days'),
      ])
    }
  }

  render () {
    const { theme, classes, consultationDocument, rowHeight } = this.props
    console.log('MedicalCertificate')
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
              name='days'
              render={(args) => {
                return (
                  <NumberInput
                    step={0.5}
                    min={1}
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
              name='fromto'
              render={(args) => {
                return <DateRangePicker label='From' label2='To' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name='description'
              render={(args) => {
                return <CodeSelect label='Description' {...args} />
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
export default MedicalCertificate
