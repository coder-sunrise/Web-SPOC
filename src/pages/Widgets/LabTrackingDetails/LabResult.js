import React from 'react'
import { Field } from 'formik'
import { CardContainer, CodeSelect, CommonTableGrid, FastField, GridContainer, GridItem, TextField } from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'

export default ({ classes, current, fieldName = '' , updateAttachments, isReadOnly = false, attachment }) => {

  return (
    <CardContainer
      hideHeader
      size='sm'
      style={{ margin:0, width: '100%' }}
    >
      <Field
        name='remarks'
        render={(args) =>(
          <TextField
            {...args}
            multiline
            rowsMax={3}
            label='Remarks'
          />
          )}
      />
      <AttachmentWithThumbnail
        label='Attachment'
        attachmentType='labTrackingResults'
        handleUpdateAttachments={updateAttachments}
        attachments={attachment}
        isReadOnly={isReadOnly}
        fieldName='labTrackingResults'
      />
    </CardContainer>
  )
}
