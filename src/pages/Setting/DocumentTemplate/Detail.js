import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  Button,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  OutlinedTextField,
  RichEditor,
  Field,
  Select,
  SizeContainer,
  CodeSelect,
} from '@/components'
import { tagList } from '@/utils/codes'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingDocumentTemplate }) =>
    settingDocumentTemplate.entity || settingDocumentTemplate.default,
  validationSchema: Yup.object().shape({
    documentTemplateTypeFK: Yup.string().required(),
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    templateContent: Yup.string().required(),
    // .max(2000, 'Message should not exceed 2000 characters'),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    // console.log(restValues)

    dispatch({
      type: 'settingDocumentTemplate/upsert',
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
          type: 'settingDocumentTemplate/query',
        })
      }
    })
  },
  displayName: 'DocumentTemplateDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const {
      theme,
      footer,
      settingDocumentTemplate,
      setFieldValue,
      height,
    } = props
    // console.log(htmlDecodeByRegExp(props.values.templateContent))
    return (
      <SizeContainer size='sm'>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='documentTemplateTypeFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      code='LTDocumentTemplateType'
                      label='Document Type'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!settingDocumentTemplate.entity}
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
              <Field
                name='templateContent'
                render={(args) => {
                  const cfg = {}
                  if (height && height > 538) {
                    cfg.height = height - 440
                  }
                  return (
                    <RichEditor
                      // toolbarHidden={() => true}
                      label='Template Message'
                      tagList={tagList}
                      {...cfg}
                      {...args}
                      onBlur={(html, text) => {
                        console.log(htmlDecodeByRegExp(html), text)
                        // this.props.setFieldValue('templateContent', text)
                      }}
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
      </SizeContainer>
    )
  }
}

export default Detail
