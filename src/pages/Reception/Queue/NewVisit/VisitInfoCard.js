import React, { memo } from 'react'
import { withStyles } from '@material-ui/core'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import { TextField, NumberInput, GridItem, CodeSelect } from '@/components'
import AttachmentWrapper from './AttachmentWrapper'
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

const VisitInfoCard = ({
  isReadOnly = false,
  attachments,
  handleUpdateAttachments,
  existingQNo,
}) => {
  const validateQNo = (value) => {
    const qNo = parseFloat(value).toFixed(1)
    if (existingQNo.includes(qNo))
      return 'Queue No. already existed in current queue list'
    return ''
  }

  return (
    <AttachmentWrapper
      title='Visit Information'
      attachmentType='Visit'
      handleUpdateAttachments={handleUpdateAttachments}
      attachments={attachments}
      isReadOnly={isReadOnly}
    >
      <React.Fragment>
        <GridItem xs md={4}>
          <FastField
            name={FormField['visit.visitType']}
            render={(args) => (
              <CodeSelect
                disabled={isReadOnly}
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
                disabled={isReadOnly}
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
            validate={validateQNo}
            render={(args) => (
              <NumberInput
                {...args}
                disabled={isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.queueNo',
                })}
                formatter={(value) => {
                  const isNaN = Number.isNaN(parseFloat(value))
                  return isNaN ? value : parseFloat(value).toFixed(1)
                }}
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
                disabled={isReadOnly}
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

export default memo(
  withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard),
)
