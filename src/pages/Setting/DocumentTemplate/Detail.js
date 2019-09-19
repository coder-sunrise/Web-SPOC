import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
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

const tagList = [
  {
    id: 1,
    text: '<#PatientName#>',
  },
  {
    id: 2,
    text: '<#AppointmentDateTime#>',
  },
  {
    id: 3,
    text: '<#Doctor#>',
  },
  {
    id: 4,
    text: '<#NewLine#>',
  },
  {
    id: 5,
    text: '<#PatientCallingName#>',
  },
  {
    id: 6,
    text: '<#LastVisitDate#>',
  },
]

@withFormikExtend({
  mapPropsToValues: ({ settingDocumentTemplate }) =>
  settingDocumentTemplate.entity || settingDocumentTemplate.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    templateMessage: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
  }),
  handleSubmit: (values, { props }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    //console.log(restValues)


    dispatch({
      type: 'settingDocumentTemplate/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
      },
    }).then((r) => {
      if (r) {
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
    const { theme, footer, settingDocumentTemplate, setFieldValue } = props
    //console.log('detail', props)

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <FastField
                name='documentType'
                render={() => (
                  <Select
                    label='Document Type'
                    options={[
                      { name: 'Referral Letter', value: 'referral letter' },
                      { name: 'Vaccination Cert', value: 'vaccination cert' },
                      { name: 'Memo', value: 'memo' },
                      { name: 'Others', value: 'others' },
                    ]}
                  />
                )}
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
                    autoFocused
                    {...args}
                    disabled={settingDocumentTemplate.entity ? true : false}
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
                      label='Template Message'
                      tagList={tagList}
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
