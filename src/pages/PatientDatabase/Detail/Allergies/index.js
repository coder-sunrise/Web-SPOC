import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  Checkbox,
  CodeSelect,
  GridContainer,
  GridItem,
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

  updateValue = (type) => ({ rows, added, changed, deleted }) => {
    let _newRows = rows
    if (type === 'NonAllergy') {
      _newRows = this.isDuplicate({ rows, changed })
    }
    let vals = this.props.values.patientAllergy.filter((o) => o.type === type)
    vals = vals.concat(_newRows)
    this.props.setFieldValue('patientAllergy', vals)
    if (this.isDisableAllergy()) {
      this.props.setFieldValue('patientAllergyMetaData[0].noAllergies', false)
    }
  }

  isDuplicate = ({ rows, changed }) => {
    if (!changed) return rows
    const key = Object.keys(changed)[0]
    const { allergyFK } = changed[key]

    const hasDuplicate = key
      ? rows.filter((r) => !r.isDeleted && r.allergyFK === allergyFK).length >=
        2
      : []
    let _newRows = [
      ...rows,
    ]

    if (hasDuplicate) {
      _newRows = _newRows.map(
        (r) =>
          r.id === parseInt(key, 10) ? { ...r, allergyFK: undefined } : r,
      )
    }

    return _newRows
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
          <GridItem xs={2.5} md={2.5}>
            <Field
              name='patientAllergyMetaData[0].noAllergies'
              render={(args) => {
                return (
                  <Checkbox
                    disabled={allergyDisabled}
                    simple
                    label={"This patient doesn't have any allergy"}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} md={2}>
            <Field
              name='patientAllergyMetaData[0].g6PDFK'
              render={(args) => {
                return (
                  <CodeSelect
                    code='ctg6pd'
                    style={{ top: -25 }}
                    {...args}
                    label='G6PD Deficiency:'
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
