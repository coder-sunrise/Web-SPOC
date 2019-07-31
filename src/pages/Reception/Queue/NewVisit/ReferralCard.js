import React, { PureComponent } from 'react'
import classnames from 'classnames'
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
  attachmentLabel: {
    fontSize: '0.9rem',
    fontWeight: 300,
  },
  attachmentItem: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
})

class ReferralCard extends PureComponent {
  render () {
    const { classes } = this.props

    return (
      <CommonCard size='sm' title='Referral'>
        <GridContainer>
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
          <GridItem className={classes.verticalSpacing}>
            <span className={classes.attachmentLabel}>Attachment:</span>
          </GridItem>
          <GridItem md={10} className={classes.verticalSpacing}>
            <div>
              <span
                className={classnames([
                  classes.attachmentItem,
                  classes.attachmentLabel,
                ])}
              >
                <a>Attachment001.pdf</a>
              </span>
              <span
                className={classnames([
                  classes.attachmentItem,
                  classes.attachmentLabel,
                ])}
              >
                <a>Attachment002.pdf</a>
              </span>
            </div>
          </GridItem>
          <GridItem>
            <Button color='rose' size='sm'>
              <AttachFile />
              Upload
            </Button>
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default withStyles(styles, { name: 'ReferralCard' })(ReferralCard)
