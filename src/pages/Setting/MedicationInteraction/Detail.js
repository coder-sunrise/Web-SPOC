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
  theme, footer, settingMedicationInteraction, clinicSettings, handleSubmit, values, setFieldValue
}) => {
  const { primaryPrintoutLanguage = 'EN', secondaryPrintoutLanguage = '' } = clinicSettings
  const isUseSecondLanguage = secondaryPrintoutLanguage !== ''
  const [
    translation,
    getValue,
    setValue,
    setLanguage,
    translationData
  ] = useTranslation(values.translationData || [], primaryPrintoutLanguage);

  const onSaveClick = async () => {
    await setFieldValue("translationData", [...translationData])
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
                  disabled={!!settingMedicationInteraction.entity}
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
                  return (<TextField label={`Display Value (${secondaryPrintoutLanguage})`} {...args} maxLength={200}
                    onChange={(e) => {
                      if (getValue(secondaryPrintoutLanguage).displayValue !== e.target.value) {
                        setValue("displayValue", e.target.value, secondaryPrintoutLanguage)
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
    mapPropsToValues: ({ settingMedicationInteraction, clinicSettings }) => {
      let settings = settingMedicationInteraction.entity || settingMedicationInteraction.default
      const { secondaryPrintoutLanguage = '' } = clinicSettings
      settings.secondDisplayValue = getTranslationValue(settings.translationData, secondaryPrintoutLanguage, "displayValue")
      if (secondaryPrintoutLanguage !== '') {
        settings.secondLanguage = secondaryPrintoutLanguage
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
      const { primaryPrintoutLanguage = 'EN', secondaryPrintoutLanguage = '' } = clinicSettings

      let translationData = [{
        language: primaryPrintoutLanguage,
        list: [{
          key: 'displayValue',
          value: values.displayValue
        }]
      }]

      if (secondaryPrintoutLanguage !== '') {
        translationData = [...translationData, {
          language: secondaryPrintoutLanguage,
          list: [{
            key: 'displayValue',
            value: values.secondDisplayValue
          }]
        }]
      }
      dispatch({
        type: 'settingMedicationInteraction/upsert',
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
            type: 'settingMedicationInteraction/query',
          })
        }
      })
    },
    displayName: 'MedicationInteractionDetail',
  }),
)(Detail)
