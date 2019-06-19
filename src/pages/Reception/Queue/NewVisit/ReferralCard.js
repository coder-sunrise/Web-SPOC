import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
// umi
import { FormattedMessage } from 'umi/locale'
// custom components
import {
  Button,
  DatePicker,
  TextField,
  CommonCard,
  GridContainer,
  GridItem,
} from '@/components'
import FormField from './formField'

class ReferralCard extends PureComponent {
  render () {
    return (
      <CommonCard size='sm' title='Referral'>
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name={FormField['referral.referredBy']}
              render={(args) => <TextField {...args} label='Referred By' />}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name={FormField['referral.referralDate']}
              render={(args) => <DatePicker {...args} label='Referral Date' />}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name={FormField['referral.institution']}
              render={(args) => <TextField label='Institution' {...args} />}
            />
          </GridItem>
          <GridItem xs md={12}>
            <Button color='rose'>
              <AttachFile />
              <FormattedMessage id='reception.queue.visitRegistration.attachment' />
            </Button>
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default ReferralCard
