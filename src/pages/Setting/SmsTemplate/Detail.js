import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import { tagList } from '@/utils/codes'
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
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingSmsTemplate }) =>
    settingSmsTemplate.entity || settingSmsTemplate.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    templateMessage: Yup.string()
      .required()
      .max(2000, 'Message should not exceed 2000 characters'),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    // console.log(restValues)

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
  state = {}

  render () {
    const { props } = this
    const { theme, footer, settingSmsTemplate } = props

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
                    autoFocused
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
              <Field
                name='templateMessage'
                render={(args) => {
                  return (
                    <RichEditor
                      toolbarHidden={() => true}
                      // handlePastedText={() => false}
                      label='Template Message'
                      tagList={tagList}
                      onBlur={(html, text) => {
                        this.props.setFieldValue('templateMessage', text)
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            {/* <GridItem md={12}>
              <Field
                name='templateMessage'
                render={(args) => {
                  return (
                    <TextField
                      label='Template Message'
                      multiline
                      rowsMax='5'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem> */}
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
