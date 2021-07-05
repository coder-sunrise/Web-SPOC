import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import _ from 'lodash'
import useTranslation from "@/utils/useTranslation"
import { compose } from 'redux'
import { getTranslationValue } from '@/utils/utils'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DateRangePicker,
  NumberInput,
} from '@/components'

const Detail = ({
  theme, footer, settingMedicationContraIndication, clinicSettings, handleSubmit, values, setFieldValue
}) => {
  const { primaryPrintoutLanguage = 'EN', secondaryPrintOutLanguage = '' } = clinicSettings
  const isUseSecondLanguage = secondaryPrintOutLanguage !== ''
  const [
    translation,
    getValue,
    setValue,
    setLanguage,
    something
  ] = useTranslation(values.translationData || [], primaryPrintoutLanguage);

  const onSaveClick = async () => {
    await setFieldValue("translationData", [...something])
    handleSubmit()
  }
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
              render={(args) => <TextField label={`Display Value${isUseSecondLanguage ? ` (${primaryPrintoutLanguage})` : ''}`} {...args} maxLength={200}
                onChange={(e) => {
                  if (getValue(primaryPrintoutLanguage).displayValue !== e.target.value) {
                    setValue("displayValue", e.target.value, primaryPrintoutLanguage)
                  }
                }} />}
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
                  return (<TextField label={`Display Value (${secondaryPrintOutLanguage})`} {...args} maxLength={200}
                    onChange={(e) => {
                      if (getValue(secondaryPrintOutLanguage).displayValue !== e.target.value) {
                        setValue("displayValue", e.target.value, secondaryPrintOutLanguage)
                      }
                    }} />)
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
          onConfirm: onSaveClick,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </React.Fragment>
  )
}

export default compose(
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ settingMedicationContraIndication, clinicSettings }) => {
      let settings = settingMedicationContraIndication.entity || settingMedicationContraIndication.default
      const { secondaryPrintOutLanguage = '' } = clinicSettings
      settings.secondDisplayValue = getTranslationValue(settings.translationData, secondaryPrintOutLanguage, "displayValue")
      if (secondaryPrintOutLanguage !== '') {
        settings.secondLanguage = secondaryPrintOutLanguage
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
        type: 'settingMedicationContraIndication/upsert',
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
            type: 'settingMedicationContraIndication/query',
          })
        }
      })
    },
    displayName: 'MedicationContraIndicationDetail',
  }),
)(Detail)
