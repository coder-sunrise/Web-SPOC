import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import { formatMessage } from 'umi/locale'

import {
  Card,
  CardHeader,
  CardText,
  CardBody,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Transfer,
  CodeSelect,
} from '@/components'

const styles = () => ({})
const Setting = ({ classes, setFieldValue, showTransfer }) => {
  const settingProps = {
    items: [
      {
        medicationPrecautionFK: 1,
      },
      {
        medicationPrecautionFK: 2,
      },
      {
        medicationPrecautionFK: 3,
      },
      {
        medicationPrecautionFK: 4,
      },
    ],
    classes,
    label: 'Precaution',
    limitTitle: formatMessage({
      id: 'inventory.master.setting.precaution',
    }),
    limit: 3,
    setFieldValue,
    fieldName: 'inventoryMedication_MedicationPrecaution',
  }
  return (
    <GridContainer>
      <GridItem xs={6}>
        <Card>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Prescribing</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='prescribingDosageFK'
                  render={(args) => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.setting.dosage',
                      })}
                      code='ctMedicationDosage'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='prescribingUOMFK'
                  render={(args) => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.setting.uom',
                      })}
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
              <GridItem xs={12}>
                <FastField
                  name='medicationFrequencyFK'
                  render={(args) => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.setting.frequency',
                      })}
                      code='ctMedicationFrequency'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='duration'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.setting.duration',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={6}>
        <Card style={{ height: 250 }}>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Dispensing</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='medicationUsageFK'
                  render={(args) => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.setting.usage',
                      })}
                      code={
                        showTransfer ? (
                          'ctMedicationUsage'
                        ) : (
                          'ctvaccinationusage'
                        )
                      }
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dispensingQuantity'
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.master.setting.quantity',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dispensingUOMFK'
                  render={(args) => (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.master.setting.uom',
                      })}
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
              <GridItem xs={6} />
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <p style={{ textAlign: 'Center' }}>
          1 Dispense UOM = <u>1.00</u> Prescribing UOM
        </p>
      </GridItem>
      {showTransfer && (
        <GridItem xs={12}>
          <Card>
            <CardHeader color='primary' text>
              <CardText color='primary'>
                <h5 className={classes.cardTitle}>Medication Precaution</h5>
              </CardText>
            </CardHeader>
            <CardBody>
              <Transfer {...settingProps} />
            </CardBody>
          </Card>
        </GridItem>
      )}
    </GridContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  Setting,
)
