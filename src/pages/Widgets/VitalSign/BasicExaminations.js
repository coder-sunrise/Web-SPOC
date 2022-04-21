import React, { PureComponent, useState } from 'react'
// formik
import { FastField, Field } from 'formik'
import _ from 'lodash'
import $ from 'jquery'
import { Alert } from 'antd'
// umi
import { formatMessage, FormattedMessage } from 'umi'
// common components
import {
  NumberInput,
  GridContainer,
  GridItem,
  Accordion,
  Checkbox,
  RadioGroup,
} from '@/components'
import { YESNOOPTIUONS, GENDER } from '@/utils/constants'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'

class BasicExaminations extends PureComponent {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state = {
      showWarningMessage: false,
    }
  }
  state = {
    expandedGeneral: false,
    expandedOthers: false,
  }

  expandOthers = () => {
    const { arrayHelpers, fieldName = 'corPatientNoteVitalSign' } = this.props
    const values = arrayHelpers ? arrayHelpers.form.values : this.props.values
    if (
      (values[fieldName] || []).find(
        row =>
          hasValue(row.bodyFatPercentage) ||
          hasValue(row.degreeOfObesity) ||
          hasValue(row.headCircumference) ||
          hasValue(row.chestCircumference) ||
          hasValue(row.waistCircumference) ||
          hasValue(row.isPregnancy) ||
          hasValue(row.hepetitisVaccinationA) ||
          hasValue(row.hepetitisVaccinationB) ||
          hasValue(row.isFasting) ||
          hasValue(row.isSmoking) ||
          hasValue(row.isAlcohol) ||
          hasValue(row.isMensus) ||
          hasValue(row.isChild),
      )
    )
      return true
    return false
  }

  getBasicExaminations = () => {
    const {
      theme,
      handleCalculateBMI = () => {},
      weightOnChange = () => {},
      arrayHelpers,
      fieldName = 'corPatientNoteVitalSign',
      patientInfo,
      calculateStandardWeight,
      calculateBodyFatMass,
      classes,
      isFromConsultation,
    } = this.props
    const setFieldValue = arrayHelpers
      ? arrayHelpers.form.setFieldValue
      : this.props.setFieldValue

    const values = arrayHelpers ? arrayHelpers.form.values : this.props.values
    let isChild
    let isPregnancy
    if ((values[fieldName] || []).length) {
      isChild = values[fieldName][0].isChild
      isPregnancy = values[fieldName][0].isPregnancy
    }

    const clearWaistCircumference = () => {
      setFieldValue(`${fieldName}[0].waistCircumference`, undefined)
    }
    return [
      {
        title: 'General',
        content: (
          <GridContainer>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].temperatureC`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.temperature',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.temperature.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].bpSysMMHG`}
                render={args => (
                  <NumberInput
                    label='Blood Pressure SYS'
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.mmhg',
                    })}
                    precision={0}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].bpDiaMMHG`}
                render={args => (
                  <NumberInput
                    label='Blood Pressure DIA'
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.mmhg',
                    })}
                    precision={0}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].pulseRateBPM`}
                render={args => (
                  <NumberInput
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.heartRate',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.heartRate.suffix',
                    })}
                    precision={0}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].saO2`}
                render={args => (
                  <NumberInput
                    precision={0}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.saO2',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.saO2.suffix',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem
              xs={12}
              sm={4}
              md={3}
              container
              style={{ position: 'relative' }}
            >
              <Field
                name={`${fieldName}[0].weightKG`}
                render={args => (
                  <NumberInput
                    {...args}
                    format='0.0'
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.weight',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.weight.suffix',
                    })}
                    onChange={async e => {
                      setFieldValue(`${fieldName}[0].weightKG`, e.target.value)
                      setTimeout(() => {
                        handleCalculateBMI()
                        calculateBodyFatMass()
                      }, 1)
                      weightOnChange()
                      if (isFromConsultation) {
                        this.setState({ showWarningMessage: true })
                        setTimeout(() => {
                          this.setState({ showWarningMessage: false })
                        }, 3000)
                      }
                    }}
                  />
                )}
              />
              <div style={{ position: 'absolute', top: 42, zIndex: 1 }}>
                {this.state.showWarningMessage && (
                  <Alert
                    message={`Weight changes will only take effect on new medication's instruction setting.`}
                    banner
                    className={classes.alertStyle}
                  />
                )}
              </div>
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].heightCM`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.height',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.height.suffix',
                    })}
                    onChange={e => {
                      setTimeout(() => {
                        handleCalculateBMI()
                        calculateStandardWeight()
                      }, 1)
                    }}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={11} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].bmi`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.bmi',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.bmi.suffix',
                    })}
                    disabled
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        ),
      },
      {
        title: 'Others',
        content: (
          <GridContainer>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].bodyFatPercentage`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.bodyFatPercentage',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.bodyFatPercentage.suffix',
                    })}
                    onChange={async e => {
                      setTimeout(() => {
                        calculateBodyFatMass()
                      }, 1)
                    }}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].degreeOfObesity`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.degreeOfObesity',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.degreeOfObesity.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].headCircumference`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.headCircumference',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.headCircumference.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].chestCircumference`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id:
                        'reception.queue.visitRegistration.chestCircumference',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.chestCircumference.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem
              xs={12}
              sm={4}
              md={3}
              container
              style={{ position: 'relative', paddingRight: 70 }}
            >
              <Field
                name={`${fieldName}[0].waistCircumference`}
                render={args => (
                  <NumberInput
                    {...args}
                    label={formatMessage({
                      id:
                        'reception.queue.visitRegistration.waistCircumference',
                    })}
                    format='0.0'
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.waistCircumference.suffix',
                    })}
                    disabled={isChild || isPregnancy}
                  />
                )}
              />
              <Field
                name={`${fieldName}[0].isChild`}
                render={args => {
                  return (
                    <Checkbox
                      {...args}
                      simple
                      label={formatMessage({
                        id: 'reception.queue.visitRegistration.isChild',
                      })}
                      style={{ position: 'absolute', right: 0, top: 20 }}
                      onChange={e => {
                        if (e.target.value) {
                          clearWaistCircumference()
                        }
                      }}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].isPregnancy`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.isPregnancy',
                    })}
                    options={YESNOOPTIUONS}
                    onChange={e => {
                      if (e.target.value) {
                        clearWaistCircumference()
                      }
                    }}
                    disabled={patientInfo?.genderFK === GENDER.MALE}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].hepetitisVaccinationA`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id:
                        'reception.queue.visitRegistration.hepetitisVaccinationA',
                    })}
                    options={YESNOOPTIUONS}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].hepetitisVaccinationB`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id:
                        'reception.queue.visitRegistration.hepetitisVaccinationB',
                    })}
                    options={YESNOOPTIUONS}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].isFasting`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.isFasting',
                    })}
                    options={YESNOOPTIUONS}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].isSmoking`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.isSmoking',
                    })}
                    options={YESNOOPTIUONS}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].isAlcohol`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.isAlcohol',
                    })}
                    options={YESNOOPTIUONS}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} sm={4} md={3}>
              <Field
                name={`${fieldName}[0].isMensus`}
                render={args => (
                  <RadioGroup
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.isMensus',
                    })}
                    options={YESNOOPTIUONS}
                    disabled={patientInfo?.genderFK === GENDER.MALE}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        ),
      },
    ]
  }

  render() {
    if (!this.state.expandedGeneral) {
      let div = $(this.myRef.current).find('div[aria-expanded]:eq(0)')
      if (div.attr('aria-expanded') === 'false') div.click()
    }

    if (!this.state.expandedOthers && this.expandOthers()) {
      let divOthers = $(this.myRef.current).find('div[aria-expanded]:eq(1)')
      if (divOthers.attr('aria-expanded') === 'false') divOthers.click()
    }

    return (
      <div ref={this.myRef}>
        <Accordion
          mode='multiple'
          collapses={this.getBasicExaminations()}
          activedKeys={[0, 1]}
          onChange={(event, p, expanded) => {
            if (p.key === 0 && expanded && !this.state.expandedGeneral) {
              this.setState({ expandedGeneral: true })
            }
            if (p.key === 1 && expanded && !this.state.expandedOthers) {
              this.setState({ expandedOthers: true })
            }
          }}
        />
      </div>
    )
  }
}

export default BasicExaminations
