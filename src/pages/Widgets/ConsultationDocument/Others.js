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

class Others extends PureComponent {
  render () {
    const { theme, classes, consultationDocument, rowHeight } = this.props
    console.log('Others')
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='title'
              render={(args) => {
                return <TextField label='Title' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='date'
              render={(args) => {
                return <DatePicker label='Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='from'
              render={(args) => {
                return <TextField disabled label='From' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={9}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>
          <GridItem
            xs={3}
            style={{ lineHeight: rowHeight, textAlign: 'right' }}
          >
            <Button color='info'>Load Template</Button>
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button>
            <RichEditor />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}
export default Others
