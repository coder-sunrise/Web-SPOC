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
} from '@/components'

const styles = () => ({})
const Setting = ({ classes, setFieldValue, showTransfer }) => {
  const settingProps = {
    items: [
      {
        value: 'Anti-Inflmation',
        id: 1,
      },
      {
        value: 'Anti-Swelling',
        id: 2,
      },
      {
        value: 'Apply as instructed',
        id: 3,
      },
      {
        value: 'Apply on the ear only',
        id: 4,
      },
    ],
    classes,
    label: 'Precaution',
    limitTitle: formatMessage({
      id: 'inventory.master.setting.precaution',
    }),
    limit: 3,
    setFieldValue,
    fieldName: 'stockDrugDrugPrecaution',
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
                  name='prescribeDrugDosageFk'
                  render={(args) => (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.setting.dosage',
                      })}
                      options={[]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='prescribeUOMFk'
                  render={(args) => (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.setting.uom',
                      })}
                      options={[]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='prescribeDrugFrequencyFk'
                  render={(args) => (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.setting.frequency',
                      })}
                      options={[]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='prescribeDuration'
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
        <Card>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Dispensing</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='dispenseDrugConsumptionMethodFk'
                  render={(args) => (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.setting.usage',
                      })}
                      options={[]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dispenseQuantity'
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
                  name='dispenseUOMFk'
                  render={(args) => (
                    <Select
                      label={formatMessage({
                        id: 'inventory.master.setting.uom',
                      })}
                      options={[]}
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
