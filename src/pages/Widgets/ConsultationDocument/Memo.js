import React, { Component, PureComponent } from 'react'
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
  Modifier,
  Entity,
  ContentBlock,
  List,
} from 'draft-js'
import { stateFromHTML } from 'draft-js-import-html'

import Yup from '@/utils/yup'
import { tagList } from '@/utils/codes'
import { getUniqueId } from '@/utils/utils'
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

const templateReg = /<a.*?data-value="(.*?)".*?<\/a>/gm
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
  constructor (props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctReferralLetterTemplate',
      },
    })
  }

  setEditorReference = (ref) => {
    this.editorReferece = ref
    // ref.focus()
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
    } = this.props
    const { ctReferralLetterTemplate } = codetable

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
                return <ClinicianSelect label='From' {...args} />
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
          <GridItem xs={6}>
            <FastField
              name='subject'
              render={(args) => {
                return <TextField label='Subject' {...args} />
              }}
            />
          </GridItem>
          <GridItem
            xs={6}
            style={{ lineHeight: rowHeight, textAlign: 'right' }}
          >
            <ButtonSelect
              options={ctReferralLetterTemplate}
              textField='displayValue'
              onClick={(option) => {
                let msg = option.templateMessage
                const match = option.templateMessage.match(templateReg)
                match.forEach((s) => {
                  const text = s.match(/data-value="(.*?)"/)[1]
                  const m = tagList.find((o) => o.text === text)
                  if (m && m.getter) msg = msg.replace(s, m.getter())
                })

                setFieldValue('content', msg)
              }}
            >
              Load Template
            </ButtonSelect>
            <ButtonSelect
              options={loadFromCodes}
              onClick={(option) => {
                console.log(this.editorReferece, parentProps)
                const { values } = parentProps
                console.log(
                  values[option.value],
                  Object.byString(values, option.value),
                  values,
                  option.value,
                )
                const v = Object.byString(values, option.value) || '-'
                const blocksFromHTML = convertFromHTML(v)
                console.log(blocksFromHTML)
                // const state = ContentState.createFromBlockArray(
                //   blocksFromHTML.contentBlocks,
                //   blocksFromHTML.entityMap
                // );
                // this.state = {
                //   editorState: EditorState.createWithContent(state),
                // };
                const { editorState } = this.editorReferece.props

                this.editorReferece.update(
                  RichEditor.insertBlock(
                    editorState,
                    blocksFromHTML.contentBlocks,
                  ),
                )
                // setFieldValue('content', option.templateMessage)
              }}
            >
              Load From
            </ButtonSelect>
          </GridItem>

          <GridItem xs={12} className={classes.editor}>
            {/* <Select className={classes.editorBtn} /> */}
            {/* <Button link className={classes.editorBtn}>
              Add Diagnosis
            </Button> */}
            <FastField
              name='content'
              render={(args) => {
                return (
                  <RichEditor
                    // tagList={loadFromCodes.map((o) => ({
                    //   id: o.value,
                    //   text: o.name,
                    // }))}
                    editorRef={this.setEditorReference}
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
export default Memo
