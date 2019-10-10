import React, { PureComponent } from 'react'
import {
  Checkbox,
  Select,
  GridContainer,
  GridItem,
  FastField,
  Field,
} from '@/components'

import AllergyGrid from './AllergyGrid'

class Allergies extends PureComponent {
  state = {}

  updateValue = (type) => ({ rows }) => {
    console.log(type, rows)
    let vals = this.props.values.patientAllergy.filter((o) => o.type === type)
    vals = vals.concat(rows)
    this.props.setFieldValue('patientAllergy', vals)
    if (vals.filter((o) => !o.isDeleted && o.type === 'Allergy').length > 0) {
      this.props.setFieldValue('patientAllergyMetaData[0].noAllergies', false)
    }
  }

  getRows = (type) => {
    return this.props.values.patientAllergy.filter((o) => o.type === type)
  }

  render () {
    const { classes, dispatch, values, schema, ...restProps } = this.props
    const allergyDisabled =
      values.patientAllergy.filter((o) => !o.isDeleted && o.type === 'Allergy')
        .length > 0

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
            <FastField
              name='patientAllergyMetaData[0].isG6PDConfirmed'
              render={(args) => (
                <Select
                  style={{ top: -6 }}
                  {...args}
                  options={[
                    { name: 'Yes', value: true },
                    { name: 'No', value: false },
                  ]}
                  prefix='G6PD Deficiency: '
                />
              )}
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
                values.patientAllergyMetaData[0].noAllergies === false
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
              isEditable
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
