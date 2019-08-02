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
    let vals = this.props.values.patientAllergy.filter(
      (o) => !o.isDeleted && o.type === type,
    )
    vals = vals.concat(rows)
    this.props.setFieldValue('patientAllergy', vals)
  }

  getRows = (type) =>
    this.props.values.patientAllergy.filter((o) => o.type === type)

  render () {
    const { classes, dispatch, values, schema, ...restProps } = this.props
    return (
      <div>
        <GridContainer alignItems='flex-start'>
          <GridItem xs md={6}>
            <Field
              name='patientAllergyMetaData[0].noAllergies'
              render={(args) => {
                return (
                  <Checkbox
                    disabled={
                      values.patientAllergy.filter(
                        (o) => !o.isDeleted && o.type === 'Allergy',
                      ).length > 0
                    }
                    simple
                    label={"This patient doesn't has any allergy"}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs md={6}>
            <FastField
              name='patientAllergyMetaData[0].isG6PDConfirmed'
              render={(args) => (
                <Select
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
