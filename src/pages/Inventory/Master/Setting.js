import React, { useState, useEffect } from 'react'
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
  CardContainer,
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

  const { medicationDetail, vaccinationDetail } = props

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
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <h3>Prescribing</h3>
      <hr />
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

      <h3>Dispensing</h3>
      <hr />
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
        <GridItem xs={3}>
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
      </GridContainer>
      {showTransfer && (
        <React.Fragment>
          <h3>Medication Precaution</h3>
          <hr />

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
