import React, { PureComponent } from 'react'
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
          <GridItem xs md={12}>
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

          <GridItem xs md={12}>
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
            <Button color='rose' size='sm'>
              <AttachFile />
              <FormattedMessage id='reception.queue.visitRegistration.attachment' />
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

export default withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard)
