import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import { tagList } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  RichEditor,
  Field,
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingSmsTemplate }) => {
    if (settingSmsTemplate.entity) {
      let newMessage = settingSmsTemplate.entity.templateMessage || ''
      const smsTaglist = tagList.filter((f) => f.value !== 'PatientInfo')
      smsTaglist.forEach((item) => {
        if (item.value && item.value !== '') {
          newMessage = newMessage.replaceAll(
            `@${item.value}`,
            `&lt;a&nbsp;href=&quot;&quot;&nbsp;class=&quot;wysiwyg-mention&quot;&nbsp;data-mention&nbsp;&gt;@${item.value}&lt;/a&gt;`,
          )
        }
      })

      return {
        ...settingSmsTemplate.entity,
        templateMessage: newMessage,
        isEditTemplate: true,
      }
    }
    return settingSmsTemplate.default
  },
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    templateMessage: Yup.string()
      .required()
      .max(1500, 'Message should not exceed 1500 characters'),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props

    dispatch({
      type: 'settingSmsTemplate/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
        resetForm()
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingSmsTemplate/query',
        })
      }
    })
  },
  displayName: 'TemplateMessageDetail',
})
class Detail extends PureComponent {
  state = { focused: false }

  setEditorReference = (ref) => {
    this.setState({ editorReferece: ref })
  }

  setTemplateFoucus () {
    if (
      !this.state.focused &&
      this.props.values.isEditTemplate &&
      this.state.editorReferece
    ) {
      this.state.editorReferece.focus()
      this.setState({ focused: true })
    }
  }

  render () {
    const { props } = this
    const { theme, footer, settingSmsTemplate, height } = props
    const smsTaglist = tagList.filter((f) => f.value !== 'PatientInfo')

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!settingSmsTemplate.entity}
                  />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label='Display Value' {...args} />}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              {this.setTemplateFoucus()}
              <Field
                name='templateMessage'
                render={(args) => {
                  const cfg = {}
                  if (height && height > 538) {
                    cfg.height = height - 330
                  }
                  return (
                    <RichEditor
                      toolbarHidden={() => true}
                      editorRef={this.setEditorReference}
                      label='Template Message'
                      tagList={smsTaglist}
                      {...cfg}
                      onBlur={(html, text) => {
                        this.props.setFieldValue('templateMessage', text)
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
