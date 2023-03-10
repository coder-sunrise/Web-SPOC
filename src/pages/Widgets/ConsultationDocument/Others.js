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
import { getClinicianProfile } from './utils'

// @skeleton()
@withFormikExtend({
  mapPropsToValues: ({ consultationDocument, codetable, visitEntity }) => {
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    const values = {
      ...(consultationDocument.entity || consultationDocument.defaultOthers()),
      issuedByUserFK: clinicianProfile.userProfileFK,
    }
    return values
  },
  validationSchema: Yup.object().shape({
    issueDate: Yup.date().required(),
    issuedByUserFK: Yup.number().required(),
    title: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence } = props
    const nextSequence = getNextSequence()

    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: nextSequence,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class Others extends PureComponent {
  state = {
    editorReferece: {},
  }

  setEditorReference = (ref) => {
    this.setState({ editorReferece: ref })
    // this.editorReferece = ref
  }

  render () {
    const {
      footer,
      handleSubmit,
      theme,
      classes,
      consultationDocument,
      templateLoader,
      currentType,
      rowHeight,
      setFieldValue,
      height,
    } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='title'
              render={(args) => {
                return <TextField label='Title' autoFocus {...args} />
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
          <GridItem xs={12}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Re:' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.editor}>
            {templateLoader(
              this.state.editorReferece,
              setFieldValue,
              currentType,
            )}

            <FastField
              name='content'
              render={(args) => {
                const cfg = {}
                if (height && height > 450) {
                  cfg.height = height - 420
                }
                return (
                  <RichEditor
                    editorRef={this.setEditorReference}
                    {...cfg}
                    {...args}
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
export default Others
