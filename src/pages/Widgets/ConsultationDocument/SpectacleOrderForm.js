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
import { getClinicianProfile } from './utils'

@withFormikExtend({
  mapPropsToValues: ({
    consultationDocument,
    consultation,
    codetable,
    visitEntity,
  }) => {
    const clinicianProfile = getClinicianProfile(codetable, visitEntity)
    const values = {
      ...(consultationDocument.entity || consultationDocument.defaultMemo()),
      issuedByUserFK: clinicianProfile.userProfileFK,
    }
    console.log(consultation)
    return values
  },
  validationSchema: Yup.object().shape({
    issuedByUserFK: Yup.number().required(),
    subject: Yup.string().required(),
    content: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    // console.log(values)
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
  displayName: 'SpectacleOrderForm',
})
class SpectacleOrderForm extends PureComponent {
  state = {
    editorReferece: {},
  }

  setEditorReference = ref => {
    this.setState({ editorReferece: ref })
    // this.editorReferece = ref
  }

  render() {
    const {
      footer,
      handleSubmit,
      classes,
      codetable,
      rowHeight,
      setFieldValue,
      loadFromCodes,
      templateLoader,
      currentType,
      height,
    } = this.props
    console.log(this.props)
    // console.log(this.props.values, this.props.dirty, this.props)

    return (
      <div>
        {/* <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='memoDate'
              render={args => {
                return <DatePicker label='Date' autoFocus {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <Field
              name='issuedByUserFK'
              render={args => {
                return <ClinicianSelect label='From' disabled {...args} />
              }}
            />
          </GridItem> 
          <GridItem xs={6} />
          <GridItem xs={12}>
            <FastField
              name='subject'
              render={args => {
                return <TextField label='Subject' {...args} />
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
              render={args => {
                const cfg = {}
                if (height && height > 450) {
                  cfg.height = height - 400
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
        </GridContainer>*/}
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: 'Save',
          })}
      </div>
    )
  }
}
export default SpectacleOrderForm
