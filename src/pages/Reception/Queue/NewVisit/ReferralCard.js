import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { withStyles } from '@material-ui/core'
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

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

class ReferralCard extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <CommonCard size='sm' title='Referral'>
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name={FormField['referral.referralPersonFK']}
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
              name={FormField['referral.referralCompanyFK']}
              render={(args) => <TextField label='Institution' {...args} />}
            />
          </GridItem>
          <GridItem className={classes.verticalSpacing}>
            <Button color='rose' size='sm'>
              <AttachFile />
              Upload
            </Button>
          </GridItem>
          <GridItem className={classes.verticalSpacing}>
            <div>
              <p>
                <a>Attachment001.pdf</a>
              </p>
              <p>
                <a>Attachment002.pdf</a>
              </p>
            </div>
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default withStyles(styles, { name: 'ReferralCard' })(ReferralCard)
