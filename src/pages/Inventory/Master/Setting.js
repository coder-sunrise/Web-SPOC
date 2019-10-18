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
  const [
    search,
    setSearch,
  ] = useState('')

  const { medicationDetail, vaccinationDetail, theme } = props

  const [
    list,
    setList,
  ] = useState([])

  const { ctmedicationprecaution, entity } =
    medicationDetail || vaccinationDetail
  const entityData = entity || []

  const settingProps = {
    items: ctmedicationprecaution ? list : [],
    addedItems: entityData
      ? entityData.inventoryMedication_MedicationPrecaution
      : [],
    classes,
    label: 'Precaution',
    limitTitle: formatMessage({
      id: 'inventory.master.setting.precaution',
    }),
    limit: 3,
    setFieldValue,
    fieldName: 'inventoryMedication_MedicationPrecaution',
    setSearch,
    search,
  }

  useEffect(
    () => {
      if (ctmedicationprecaution) {
        const filteredList = ctmedicationprecaution.filter((o) => {
          return o.value.toLowerCase().indexOf(search) >= 0
        })
        setList(filteredList)
      }
    },
    [
      search,
    ],
  )

  return (
    <CardContainer
      hideHeader
      style={{
        margin: theme.spacing(2),
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
        <GridItem xs={3}>
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
        <GridItem xs={3}>
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
                code='ctMedicationFrequency'
                labelField='displayValue'
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
        <GridItem xs={6}>
          <FastField
            name={showTransfer ? 'medicationUsageFK' : 'vaccinationUsageFK'}
            render={(args) => (
              <CodeSelect
                label={formatMessage({
                  id: 'inventory.master.setting.usage',
                })}
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
            name='dispensingQuantity'
            render={(args) => {
              return (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.setting.quantity',
                  })}
                  format='0.0'
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
    // <GridContainer>
    //   <GridItem xs={6}>
    //     <Card>
    //       <CardHeader color='primary' text>
    //         <CardText color='primary'>
    //           <h5 className={classes.cardTitle}>Prescribing</h5>
    //         </CardText>
    //       </CardHeader>
    //       <CardBody>
    //
    //       </CardBody>
    //     </Card>
    //   </GridItem>
    //   <GridItem xs={6}>
    //     <Card style={{ height: 250 }}>
    //       <CardHeader color='primary' text>
    //         <CardText color='primary'>
    //           <h5 className={classes.cardTitle}>Dispensing</h5>
    //         </CardText>
    //       </CardHeader>
    //       <CardBody>
    //
    //       </CardBody>
    //     </Card>
    //   </GridItem>
    //   <GridItem xs={12}>
    //     <p style={{ textAlign: 'Center' }}>
    //       1 Dispense UOM = <u>1.00</u> Prescribing UOM
    //     </p>
    //   </GridItem>
    //   {showTransfer && (
    //     <GridItem xs={12}>
    //       <Card>
    //         <CardHeader color='primary' text>
    //           <CardText color='primary'>
    //             <h5 className={classes.cardTitle}>Medication Precaution</h5>
    //           </CardText>
    //         </CardHeader>
    //         <CardBody>
    //           <Transfer {...settingProps} />
    //         </CardBody>
    //       </Card>
    //     </GridItem>
    //   )}
    // </GridContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  Setting,
)
