import React, { PureComponent } from 'react'
// formik
// umi
import { formatMessage, FormattedMessage } from 'umi'
// common components
import { CommonCard, Tooltip } from '@/components'
import Authorized from '@/utils/Authorized'
import BasicExaminations from '@/pages/Widgets/VitalSign/BasicExaminations'

class VitalSignCard extends PureComponent {
  handleCalculateBMI = () => {
    const { setFieldValue, setFieldTouched, values } = this.props
    const { heightCM, weightKG } = values.visitBasicExaminations[0]
    if (heightCM && weightKG) {
      const heightM = heightCM / 100
      const bmi = weightKG / heightM ** 2
      const bmiInTwoDecimal = Math.round(bmi * 100) / 100
      setFieldValue('visitBasicExaminations[0].bmi', bmiInTwoDecimal)
    } else {
      setFieldValue('visitBasicExaminations[0].bmi', null)
    }
    setFieldTouched('visitBasicExaminations[0].bmi', true)
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
        />
      </CommonCard>
    )
  }
}

export default VitalSignCard
