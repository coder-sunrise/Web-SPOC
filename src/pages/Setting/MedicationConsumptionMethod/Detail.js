import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import { FormattedMessage } from 'umi/locale'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  dateFormatLong,
  CodeSelect,
  NumberInput,
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingMedicationConsumptionMethod }) =>
    settingMedicationConsumptionMethod.entity ||
    settingMedicationConsumptionMethod.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    sortOrder: Yup.number()
      .min(
        -2147483648,
        'The number should between -2,147,483,648 and 2,147,483,647',
      )
      .max(
        2147483647,
        'The number should between -2,147,483,648 and 2,147,483,647',
      )
      .nullable(),
    translatedDisplayValue: Yup.number().when('translationLanguage', {
      is: (v) => v !== undefined,
      then: Yup.number().required(),
    }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingMedicationConsumptionMethod/upsert',
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
          type: 'settingMedicationConsumptionMethod/query',
        })
      }
    })
  },
  displayName: 'MedicationConsumptionMethodDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { theme, footer, settingMedicationConsumptionMethod } = props
    // console.log('detail', props)
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
                    disabled={
                      settingMedicationConsumptionMethod.entity ? true : false
                    }
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

            <GridItem md={6}>
              <FastField
                name='effectiveDates'
                render={(args) => {
                  return (
                    <DateRangePicker
                      format={dateFormatLong}
                      label='Effective Start Date'
                      label2='End Date'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>

            <GridItem md={6}>
              <FastField
                name='sortOrder'
                render={(args) => <NumberInput label='Sort Order' {...args} />}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='description'
                render={(args) => {
                  return (
                    <TextField
                      label='Description'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='translationLanguage'
                render={(args) => {
                  return (
                    <CodeSelect
                      label='Translation Language'
                      code='ctLanguage'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={8}>
              <FastField
                name='translatedDisplayValue'
                render={(args) => {
                  return (
                    <TextField label='Translated Display Value' {...args} />
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
