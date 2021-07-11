import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField, Field } from 'formik'
import { compose } from 'redux'
import { List, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { formatMessage } from 'umi'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  Transfer,
  CodeSelect,
  NumberInput,
} from '@/components'
import { SectionHeader, SelectList, AutoCalculateDosage } from '../Components'

const styles = () => ({})

const Setting = ({
  classes,
  setFieldValue,
  showTransfer,
  language,
  isMultiLanguage,
  dispatch,
  global,
  ...props
}) => {
  const { medicationDetail, vaccinationDetail, theme } = props
  const optionLabelLength = 40
  const [languageLabel, setLanguageLabel] = useState('')
  useEffect(() => {
    setLanguageLabel(isMultiLanguage ? `(${language})` : '')
    console.log('languageLabel', language)
    console.log('mulitilang', isMultiLanguage)
  }, [language])

  const { ctmedicationprecaution, entity, config = {} } =
    medicationDetail || vaccinationDetail
  const entityData = entity || []
  let addedItems = []
  if (
    entityData &&
    entityData.inventoryMedication_MedicationPrecaution &&
    entityData.inventoryMedication_MedicationPrecaution.length > 0
  ) {
    addedItems = entityData.inventoryMedication_MedicationPrecaution.map(
      item => ({
        medicationPrecautionFK: item.medicationPrecautionFK,
        value: item.medicationPrecaution.name,
      }),
    )
  }
  const settingProps = {
    items: ctmedicationprecaution || [],
    addedItems,
    classes,
    label: 'Precaution',
    limitTitle: formatMessage({
      id: 'inventory.master.setting.precaution',
    }),
    limit: 3,
    setFieldValue,
    fieldName: 'inventoryMedication_MedicationPrecaution',
    searchLabel: 'Precaution Name',
  }

  return (
    <div
      hideHeader
      style={{
        margin: theme.spacing(1),
      }}
    >
      <AutoCalculateDosage></AutoCalculateDosage>
      <GridContainer>
        <GridItem md={6}>
          <Field
            name='precautionFK'
            render={args => (
              <SelectList
                header={'Precaution' + languageLabel}
                codeset='ctMedicationPrecaution'
                note='* ONLY THE TOP 3 PRECAUTIONS WILL BE DISPLAYED IN DRUG LABEL'
                label={formatMessage({
                  id: 'inventory.master.medication.precaution',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>
          <Field
            name='sideEffectFK'
            render={args => (
              <SelectList
                header={'Side Effect' + languageLabel}
                codeset='ctMedicationSideEffect'
                label={formatMessage({
                  id: 'inventory.master.medication.sideEffect',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={6} style={{ marginTop: 20 }}>
          <Field
            name='sideEffectFK'
            render={args => (
              <SelectList
                header={'Contraindication' + languageLabel}
                codeset='ctMedicationContraIndication'
                language={language}
                label={formatMessage({
                  id: 'inventory.master.medication.contraindication',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={6} style={{ marginTop: 20 }}>
          <Field
            name='medicationInteractionFK'
            render={args => (
              <SelectList
                header={'Interaction' + languageLabel}
                codeset='ctMedicationInteraction'
                label={formatMessage({
                  id: 'inventory.master.medication.interaction',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}

const ConnectedSetting = connect(({ global }) => ({
  global,
}))(Setting)

export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
)(ConnectedSetting)
