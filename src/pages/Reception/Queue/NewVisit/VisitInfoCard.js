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
  CodeSelect,
} from '@/components'
import AttachmentWrapper from './withAttachment'
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
  notUploaded: {
    '& > a': {
      color: '#999',
    },
  },
})

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
  })

const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

class VisitInfoCard extends PureComponent {
  render () {
    const { attachments, handleUpdateAttachments } = this.props

    return (
      <AttachmentWrapper
        title='Visit Information'
        attachmentType='Visit'
        handleUpdateAttachments={handleUpdateAttachments}
        attachments={attachments}
      >
        <React.Fragment>
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
        </React.Fragment>
      </AttachmentWrapper>
    )
  }
}

export default withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard)
