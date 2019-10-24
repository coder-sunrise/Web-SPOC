import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  Checkbox,
  Select,
  GridContainer,
  GridItem,
  FastField,
  Field,
} from '@/components'

import AllergyGrid from './AllergyGrid'

@connect(({ global }) => ({ global }))
class Allergies extends PureComponent {
  state = {}

  isDisableAllergy = () => {
    return (
      this.props.global.disableSave === true ||
      this.props.values.patientAllergy.filter(
        (o) =>
          !o.isDeleted && (o.type === 'Allergy' || o.type === 'NonAllergy'),
      ).length > 0
    )
  }

  updateValue = (type) => ({ rows }) => {
    let vals = this.props.values.patientAllergy.filter((o) => o.type === type)
    vals = vals.concat(rows)
    this.props.setFieldValue('patientAllergy', vals)
    if (this.isDisableAllergy()) {
      this.props.setFieldValue('patientAllergyMetaData[0].noAllergies', false)
      this.props.setFieldValue(
        'patientAllergyMetaData[0].isG6PDConfirmed',
        undefined,
      )
    }
  }

  getRows = (type) => {
    return this.props.values.patientAllergy.filter((o) => o.type === type)
  }

  render () {
    const { classes, dispatch, values, schema, ...restProps } = this.props
    const allergyDisabled = this.isDisableAllergy()

    return (
      <div>
        <GridContainer alignItems='flex-start'>
          <GridItem xs md={3}>
            <Field
              name='patientAllergyMetaData[0].noAllergies'
              render={(args) => {
                return (
                  <Checkbox
                    disabled={allergyDisabled}
                    simple
                    label={"This patient doesn't has any allergy"}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs md={2}>
            <Field
              name='patientAllergyMetaData[0].isG6PDConfirmed'
              render={(args) => {
                return (
                  <Select
                    style={{ top: -25 }}
                    {...args}
                    options={[
                      { name: 'Yes', value: true },
                      { name: 'No', value: false },
                    ]}
                    label='G6PD Deficiency:'
                    disabled={allergyDisabled}
                  />
                )
              }}
            />
          </GridItem>

          <GridItem xs md={12}>
            <h4 style={{ marginTop: 20 }}>Drug Allergy</h4>
          </GridItem>
          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              rows={this.getRows('Allergy')}
              type='Allergy'
              title='Allergy'
              isEditable={
                !values.patientAllergyMetaData[0] ||
                (values.patientAllergyMetaData[0].noAllergies || false) ===
                  false
              }
              setArrayValue={this.updateValue('NonAllergy')}
              schema={schema.patientAllergy._subType}
              {...restProps}
            />
          </GridItem>

          <GridItem xs md={12}>
            <h4 style={{ marginTop: 20 }}>Non-Drug Allergy</h4>
          </GridItem>

          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <AllergyGrid
              rows={this.getRows('NonAllergy')}
              type='NonAllergy'
              title='Medical Alert'
              isEditable={
                !values.patientAllergyMetaData[0] ||
                (values.patientAllergyMetaData[0].noAllergies || false) ===
                  false
              }
              setArrayValue={this.updateValue('Allergy')}
              schema={schema.patientAllergy._subType}
              {...restProps}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Allergies
