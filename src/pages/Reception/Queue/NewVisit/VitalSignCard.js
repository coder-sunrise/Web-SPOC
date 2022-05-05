import React, { PureComponent } from 'react'
// formik
import _ from 'lodash'
// umi
import { formatMessage, FormattedMessage } from 'umi'
// common components
import { CommonCard, Tooltip } from '@/components'
import Authorized from '@/utils/Authorized'
import BasicExaminations from '@/pages/Widgets/VitalSign/BasicExaminations'
import { calculateAgeType } from '@/utils/dateUtils'
import { AGETYPE } from '@/utils/constants'

class VitalSignCard extends PureComponent {
  handleCalculateBMI = () => {
    const {
      setFieldValue,
      setFieldTouched,
      values,
      patientInfo = {},
    } = this.props
    const { heightCM, weightKG } = values.visitBasicExaminations[0]
    if (heightCM && weightKG) {
      const getAgeType = calculateAgeType(patientInfo.dob)
      if (getAgeType === AGETYPE.ADULT) {
        const heightM = heightCM / 100
        const bmi = weightKG / heightM ** 2
        setFieldValue('visitBasicExaminations[0].bmi', _.round(bmi, 1))
      } else if (getAgeType === AGETYPE.YOUTH) {
        const rohrer = (weightKG / heightCM ** 3) * 10 ** 7
        setFieldValue('visitBasicExaminations[0].rohrer', _.round(rohrer, 1))
      } else if (getAgeType === AGETYPE.CHILD) {
        const kaup = (weightKG / heightCM ** 2) * 10 ** 2
        setFieldValue('visitBasicExaminations[0].kaup', _.round(kaup, 1))
      }
    } else {
      setFieldValue('visitBasicExaminations[0].bmi', undefined)
      setFieldValue('visitBasicExaminations[0].rohrer', undefined)
      setFieldValue('visitBasicExaminations[0].kaup', undefined)
    }
    setFieldTouched('visitBasicExaminations[0].bmi', true)
  }

  calculateStandardWeight = () => {
    const { setFieldValue, values, patientInfo = {} } = this.props
    const getAgeType = calculateAgeType(patientInfo.dob)
    if (getAgeType !== AGETYPE.ADULT) {
      return
    }
    const { heightCM } = values.visitBasicExaminations[0]
    if (heightCM) {
      const heightM = heightCM / 100
      const standardWeight = heightM ** 2 * 22
      setFieldValue(
        `visitBasicExaminations[0].standardWeight`,
        _.round(standardWeight, 1),
      )
    } else {
      setFieldValue(`visitBasicExaminations[0].standardWeight`, undefined)
    }
  }

  calculateBodyFatMass = () => {
    const { setFieldValue, values } = this.props
    const { weightKG, bodyFatPercentage } = values.visitBasicExaminations[0]
    if (weightKG && bodyFatPercentage) {
      const bodyFatMass = weightKG * (bodyFatPercentage / 100)
      setFieldValue(
        `visitBasicExaminations[0].bodyFatMass`,
        _.round(bodyFatMass, 1),
      )
    } else {
      setFieldValue(`visitBasicExaminations[0].bodyFatMass`, undefined)
    }
  }

  render() {
    const accessRight = Authorized.check('queue.registervisit.vitalsign')

    if (!accessRight || (accessRight && accessRight.rights === 'hidden'))
      return null
    const { disabled = false, values } = this.props
    return (
      <CommonCard
        title={
          <FormattedMessage id='reception.queue.visitRegistration.vitalSign' />
        }
        tooltip={
          disabled
            ? 'Edit order or edit consultation to update the basic examinations'
            : ''
        }
      >
        <BasicExaminations
          {...this.props}
          fieldName={
            (values.corBasicExaminations || []).length
              ? 'corBasicExaminations'
              : 'visitBasicExaminations'
          }
          handleCalculateBMI={this.handleCalculateBMI}
          calculateStandardWeight={this.calculateStandardWeight}
          calculateBodyFatMass={this.calculateBodyFatMass}
        />
      </CommonCard>
    )
  }
}

export default VitalSignCard
