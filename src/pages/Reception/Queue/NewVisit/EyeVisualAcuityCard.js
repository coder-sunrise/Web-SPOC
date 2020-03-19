import React, { PureComponent } from 'react'
// formik
// custom components
import { CommonCard } from '@/components'
import EyeVisualAcuity from '@/pages/Widgets/EyeVisualAcuity'

class ReferralCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments, isReadOnly } = this.props

    return (
      <CommonCard title='Eye Visual Acuity Test'>
        <EyeVisualAcuity
          prefix='visitEyeVisualAcuityTest.visitEyeVisualAcuityTestForm'
          attachments={attachments}
          handleUpdateAttachments={handleUpdateAttachments}
        />
      </CommonCard>
    )
  }
}

export default ReferralCard
