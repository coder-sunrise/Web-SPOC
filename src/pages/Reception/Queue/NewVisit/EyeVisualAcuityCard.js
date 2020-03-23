import React, { PureComponent } from 'react'
// formik
// custom components
import { CommonCard } from '@/components'
import EyeVisualAcuity from '@/pages/Widgets/EyeVisualAcuity'

class EyeVisualAcuityCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments } = this.props

    return (
      <CommonCard title='Eye Visual Acuity Test'>
        <EyeVisualAcuity
          prefix='visitEyeVisualAcuityTest.visitEyeVisualAcuityTestForm'
          attachments={attachments}
          handleUpdateAttachments={handleUpdateAttachments}
          attachmentsFieldName='visitAttachment'
        />
      </CommonCard>
    )
  }
}

export default EyeVisualAcuityCard
