import React, { Component, PureComponent } from 'react'

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
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
  withFormikExtend,
  FastField,
  Field,
  ButtonSelect,
  ClinicianSelect,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ consultationDocument }) => {
    return consultationDocument.entity || consultationDocument.defaultMemo
  },
  validationSchema: Yup.object().shape({
    issuedByUserFK: Yup.number().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    // console.log(values)
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: values,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'AddConsultationDocument',
})
class Memo extends PureComponent {
  setEditorReference = (ref) => {
    this.editorReferece = ref
  }

  render () {
    const {
      footer,
      handleSubmit,
      classes,
      codetable,
      rowHeight,
      setFieldValue,
      loadFromCodes,
      parentProps,
      templateLoader,
      currentType,
    } = this.props
    // console.log(this.props.values, this.props.dirty, this.props)

    return (
      <div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='memoDate'
              render={(args) => {
                return <DatePicker label='Date' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={(args) => {
                return <ClinicianSelect label='From' disabled {...args} />
              }}
            />
          </GridItem>
          {/* <GridItem xs={12}>
            <FastField
              name='address'
              render={(args) => {
                return (
                  <TextField label='Address' multiline rowsMax={3} {...args} />
                )
              }}
            />
          </GridItem> */}
          <GridItem xs={6} />
          <GridItem xs={12}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>

          <GridItem xs={12} className={classes.editor}>
            {templateLoader(this.editorReferece, setFieldValue, currentType)}
            <FastField
              name='content'
              render={(args) => {
                return (
                  <RichEditor editorRef={this.setEditorReference} {...args} />
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
export default Memo
