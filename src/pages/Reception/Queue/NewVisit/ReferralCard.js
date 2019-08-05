import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// custom components
import { DatePicker, TextField, GridItem } from '@/components'
import AttachmentWrapper from './withAttachment'
import FormField from './formField'

class ReferralCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments } = this.props

    return (
      <AttachmentWrapper
        title='Referral'
        attachmentType='VisitReferral'
        handleUpdateAttachments={handleUpdateAttachments}
        attachments={attachments}
      >
        <React.Fragment>
          <GridItem xs md={4}>
            <FastField
              name={FormField['referral.referralPersonFK']}
              render={(args) => <TextField {...args} label='Referred By' />}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name={FormField['referral.referralDate']}
              render={(args) => <DatePicker {...args} label='Referral Date' />}
            />
          </GridItem>
          <GridItem xs md={4} />
          <GridItem xs md={4}>
            <FastField
              name={FormField['referral.referralCompanyFK']}
              render={(args) => <TextField label='Institution' {...args} />}
            />
          </GridItem>
          <GridItem xs md={8} />
        </React.Fragment>
      </AttachmentWrapper>
    )
  }
}

export default ReferralCard
