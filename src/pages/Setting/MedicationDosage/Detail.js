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
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingMedicationDosage, clinicSettings }) => {
    let settings = settingMedicationDosage.entity || settingMedicationDosage.default
    const { secondaryPrintOutLanguage = '' } = clinicSettings
    const translationData = (settings.translationData || []).find(t => t.language === secondaryPrintOutLanguage)
    if (translationData) {
      const displayValueItem = (translationData.list || []).find(l => l.key === "displayValue")
      if (displayValueItem) {
        settings.secondDisplayValue = displayValueItem.value
      }
    }

    if (secondaryPrintOutLanguage !== '') {
      settings.secondLanguage = secondaryPrintOutLanguage
    }
    return settings
  }, 
  validationSchema: Yup.object().shape({
    code: Yup.string().required(),
    displayValue: Yup.string().required(),
    multiplier: Yup.number()
      .min(0, 'Multiplier must between 0 and 999,999.99')
      .max(999999.99, 'Multiplier must between 0 and 999,999.99')
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
    secondDisplayValue: Yup.string().when('secondLanguage', {
      is: (v) => v !== undefined,
      then: Yup.string().required(),
    }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm, clinicSettings } = props
    const { primaryPrintoutLanguage = 'EN', secondaryPrintOutLanguage = '' } = clinicSettings

    let translationData = [{
      language: primaryPrintoutLanguage,
      list: [{
        key: 'displayValue',
        value: values.displayValue
      }]
    }]

    if (secondaryPrintOutLanguage !== '') {
      translationData = [...translationData, {
        language: secondaryPrintOutLanguage,
        list: [{
          key: 'displayValue',
          value: values.secondDisplayValue
        }]
      }]
    }
    dispatch({
      type: 'settingMedicationDosage/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        translationData
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
    const { theme, footer, settingMedicationDosage, clinicSettings } = props
    const { primaryPrintoutLanguage = 'EN', secondaryPrintOutLanguage = '' } = clinicSettings
    const isUseSecondLanguage = secondaryPrintOutLanguage !== ''
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={4}>
              <FastField
                name='code'
                render={(args) => (
                  <TextField
                    label='Code'
                    autoFocus
                    {...args}
                    disabled={!!settingMedicationDosage.entity}
                  />
                )}
              />
            </GridItem>
            <GridItem md={8}>
              <FastField
                name='displayValue'
                render={(args) => <TextField label={`Display Value${isUseSecondLanguage ? ` (${primaryPrintoutLanguage})` : ''}`} {...args} maxLength={200} />}
              />
            </GridItem>
            <GridItem md={4}>
              <FastField
                name='sortOrder'
                render={(args) => <NumberInput label='Sort Order' {...args} />}
              />
            </GridItem>
            {isUseSecondLanguage && (
              <GridItem md={8}>
                <FastField
                  name='secondDisplayValue'
                  render={(args) => {
                    return (<TextField label={`Display Value (${secondaryPrintOutLanguage})`} {...args} maxLength={200} />)
                  }}
                />
              </GridItem>)}
            <GridItem md={isUseSecondLanguage ? 12 : 8}>
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
            <GridItem md={12}>
              <FastField
                name='multiplier'
                render={(args) => (
                  <NumberInput
                    label='Multiplier'
                    maxLength={9}
                    max={999999.99}
                    format='0.00'
                    precision={2}
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
