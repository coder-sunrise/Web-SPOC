import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import { formatMessage } from 'umi/locale'

import {
  GridContainer,
  GridItem,
  Transfer,
  CodeSelect,
  CardContainer,
  NumberInput,
} from '@/components'

const styles = () => ({})
const Setting = ({
  classes,
  setFieldValue,
  showTransfer,
  dispatch,
  ...props
}) => {
  const { medicationDetail, vaccinationDetail, theme, values } = props
  const optionLabelLength = 40

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
      (item) => ({
        sequence: item.sequence,
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
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(1),
        minHeight: 700,
        maxHeight: 700,

        // overflow: showTransfer ? 'auto' : 'hidden',
        overflow: 'hidden',
      }}
    >
      <h4 style={{ fontWeight: 400 }}>
        <b>Prescribing</b>
      </h4>
      <GridContainer>
        <GridItem xs={6}>
          <FastField
            name={showTransfer ? 'medicationUsageFK' : 'vaccinationUsageFK'}
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.usage',
                })}
                labelField='name'
                code={showTransfer ? 'ctMedicationUsage' : 'ctvaccinationusage'}
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={3}>
          <FastField
            name='prescribingDosageFK'
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.dosage',
                })}
                labelField='displayValue'
                code='ctMedicationDosage'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={3}>
          <FastField
            name='prescribingUOMFK'
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.uom',
                })}
                labelField='name'
                code={
                  showTransfer ? (
                    'ctmedicationunitofmeasurement'
                  ) : (
                    'ctvaccinationunitofmeasurement'
                  )
                }
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={3}>
          <FastField
            name={
              showTransfer ? 'medicationFrequencyFK' : 'vaccinationFrequencyFK'
            }
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.frequency',
                })}
                labelField='displayValue'
                code='ctMedicationFrequency'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={3}>
          <FastField
            name='duration'
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.setting.duration',
                  })}
                  {...args}
                  precision={0}
                />
              )
            }}
          />
        </GridItem>
      </GridContainer>

      <h4 style={{ fontWeight: 400, marginTop: 25 }}>
        <b>Dispensing</b>
      </h4>

      <GridContainer>
        <GridItem xs={3}>
          <FastField
            name='dispensingQuantity'
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.setting.quantity',
                  })}
                  format={config.dispenseQuantityFormat || '0.0'}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={3}>
          <FastField
            name='dispensingUOMFK'
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.uom',
                })}
                // code={
                //   showTransfer ? (
                //     'ctmedicationunitofmeasurement'
                //   ) : (
                //     'ctvaccinationunitofmeasurement'
                //   )
                // }
                // Fix work item ID: 10993
                labelField='name'
                code='ctmedicationunitofmeasurement'
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={1}>
          <FastField
            name='prescriptionToDispenseConversion'
            render={(args) => (
              <NumberInput
                label={formatMessage({
                  id:
                    'inventory.master.setting.prescriptionToDispenseConversion',
                })}
                format='0.0'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem>
          <FastField
            name='prescribingUOMFK'
            render={(args) => (
              <CodeSelect
                style={{ marginTop: 15 }}
                label=''
                text
                labelField='name'
                optionLabelLength={optionLabelLength}
                code={
                  showTransfer ? (
                    'ctmedicationunitofmeasurement'
                  ) : (
                    'ctvaccinationunitofmeasurement'
                  )
                }
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem style={{ padding: 0 }}>
          <React.Fragment>
            <div style={{ marginTop: 30, fontSize: 16 }}>= 1.0</div>
          </React.Fragment>
        </GridItem>
        <GridItem>
          <FastField
            name='dispensingUOMFK'
            render={(args) => (
              <CodeSelect
                style={{ marginTop: 15 }}
                optionLabelLength={optionLabelLength}
                text
                label=''
                labelField='name'
                code='ctmedicationunitofmeasurement'
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
      {showTransfer && (
        <React.Fragment>
          <h4 style={{ fontWeight: 400, marginTop: 25 }}>
            <b>Medication Precaution</b>
          </h4>

          <Transfer {...settingProps} style={{ paddingLeft: 0 }} />
        </React.Fragment>
      )}
    </CardContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  Setting,
)
