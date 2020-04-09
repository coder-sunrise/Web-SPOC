import React, { PureComponent } from 'react'
// formik
// custom components
import { CommonCard, GridContainer, GridItem } from '@/components'
import EyeVisualAcuity from '@/pages/Widgets/EyeVisualAcuity'

class EyeVisualAcuityCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments } = this.props

    return (
      <CommonCard title='Visual Acuity Test'>
        <GridContainer>
          <GridItem>
            <EyeVisualAcuity
              prefix='visitEyeVisualAcuityTest.visitEyeVisualAcuityTestForm'
              attachments={attachments}
              handleUpdateAttachments={handleUpdateAttachments}
              attachmentsFieldName='visitAttachment'
            />
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default EyeVisualAcuityCard
