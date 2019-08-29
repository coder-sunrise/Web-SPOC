import React, { PureComponent } from 'react'
// formik
import { Field } from 'formik'
// custom components
import { DatePicker, TextField, GridItem } from '@/components'
import AttachmentWrapper from './AttachmentWrapper'
import FormField from './formField'

class ReferralCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments, isReadOnly } = this.props

    return (
      <AttachmentWrapper
        title='Referral'
        attachmentType='VisitReferral'
        handleUpdateAttachments={handleUpdateAttachments}
        attachments={attachments}
        isReadOnly={isReadOnly}
      >
        <React.Fragment>
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralPersonFK']}
              render={(args) => (
                <TextField
                  {...args}
                  disabled={isReadOnly}
                  label='Referred By'
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralDate']}
              render={(args) => (
                <DatePicker
                  {...args}
                  disabled={isReadOnly}
                  label='Referral Date'
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4} />
          <GridItem xs md={4}>
            <Field
              name={FormField['referral.referralCompanyFK']}
              render={(args) => (
                <TextField
                  label='Institution'
                  disabled={isReadOnly}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={8} />
        </React.Fragment>
      </AttachmentWrapper>
    )
  }
}

export default ReferralCard
