import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: ({ settingMedicationContraIndication, clinicSettings }) => {
    let settings = settingMedicationContraIndication.entity || settingMedicationContraIndication.default
    if (!(settings.translationData || []).length) {
      const { secondaryPrintOutLanguage = '' } = clinicSettings
      if (secondaryPrintOutLanguage !== '') {
        settings.translationData = [{ language: secondaryPrintOutLanguage, type: 'DisplayValue' }]
      }
    }
    return settings
  },
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
    translationData: Yup.array().of(
      Yup.object().shape({
        value: Yup.string().when('language', {
          is: (v) => v !== undefined,
          then: Yup.string().required(),
        }),
      }),
    ),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const { effectiveDates, ...restValues } = values
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'settingMedicationContraIndication/upsert',
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
          type: 'settingMedicationContraIndication/query',
        })
      }
    })
  },
  displayName: 'MedicationContraIndicationDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { theme, footer, settingMedicationContraIndication, clinicSettings } = props
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
                    disabled={!!settingMedicationContraIndication.entity}
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
                  name='translationData[0].value'
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
