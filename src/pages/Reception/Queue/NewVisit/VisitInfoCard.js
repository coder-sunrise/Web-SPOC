import React, { PureComponent } from 'react'
import classnames from 'classnames'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { withStyles } from '@material-ui/core'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// custom components
import {
  Button,
  TextField,
  NumberInput,
  CommonCard,
  GridContainer,
  GridItem,
  Select,
  CodeSelect,
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

class VisitInfoCard extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <CommonCard
        size='sm'
        title={
          <FormattedMessage id='reception.queue.visitRegistration.visitInformation' />
        }
      >
        <GridContainer>
          <GridItem xs md={4}>
            <FastField
              name={FormField['visit.visitType']}
              render={(args) => (
                <CodeSelect
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitType',
                  })}
                  code='ctvisitpurpose'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name={FormField['visit.doctorProfileFk']}
              render={(args) => (
                <CodeSelect
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.doctor',
                  })}
                  tenantCode='doctorprofile'
                  // code='ctgender'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4}>
            <FastField
              name={FormField['visit.queueNo']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.queueNo',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name={FormField['visit.visitRemarks']}
              render={(args) => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={3}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitRemarks',
                  })}
                />
              )}
            />
          </GridItem>
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

export default withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard)
