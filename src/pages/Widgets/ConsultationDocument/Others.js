import React, { Component, PureComponent } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import moment from 'moment'
import Yup from '@/utils/yup'
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
  ClinicianSelect,
  withFormikExtend,
  skeleton,
} from '@/components'

// @skeleton()
@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return consultationDocument.entity || consultationDocument.defaultOthers
  },
  validationSchema: Yup.object().shape({
    issueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    title: Yup.string().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, consultationDocument, currentType } = props
    const { rows } = consultationDocument

    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: rows.length,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class Others extends PureComponent {
  render () {
    const {
      footer,
      handleSubmit,
      theme,
      classes,
      consultationDocument,
      rowHeight,
    } = this.props
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
              name='issueDate'
              render={(args) => {
                return <DatePicker label='Date' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect disabled label='From' {...args} />
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
            <FastField
              name='content'
              render={(args) => {
                return <RichEditor {...args} />
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
export default Others
