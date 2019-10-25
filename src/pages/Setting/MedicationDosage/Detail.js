import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
  dateFormatLong,
  CodeSelect,
} from '@/components'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingMedicationDosage }) =>
    settingMedicationDosage.entity || settingMedicationDosage.default,
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    multiplier: Yup.number()
      .min(0, 'Multiplier must between 0 and 999,999.9999')
      .max(999999.9999, 'Multiplier must between 0 and 999,999.9999')
      .required(),
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
    translationLink: Yup.object().shape({
      translationMasters: Yup.array().of(
        Yup.object().shape({
          displayValue: Yup.string().when('languageFK', {
            is: (v) => v !== undefined,
            then: Yup.string().required(),
          }),
        }),
      ),
    }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingMedicationDosage/upsert',
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
          type: 'settingMedicationDosage/query',
        })
      }
    })
  },
  displayName: 'MedicationDosageDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { theme, footer, settingMedicationDosage } = props
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
                    disabled={!!settingMedicationDosage.entity}
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
                render={(args) => {
                  return <NumberInput label='Sort Order' {...args} />
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='multiplier'
                render={(args) => (
                  <NumberInput
                    label='Multiplier'
                    maxLength={11}
                    max={999999.9999}
                    format='0.0000'
                    {...args}
                  />
                )}
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
                name='translationLink.translationMasters[0].languageFK'
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
                name='translationLink.translationMasters[0].displayValue'
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
