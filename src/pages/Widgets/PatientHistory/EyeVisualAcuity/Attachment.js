import React from 'react'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'
// services
import { downloadAttachment } from '@/services/file'

const Attachment = ({ current }) => {
  const handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  const getContent = (list = []) => {
    if (list.length === 0) return null
    return (
      <div style={{ width: '100%' }}>
        {list
          .filter(
            (attachment) =>
              attachment.attachmentType === 'EyeVisualAcuity' &&
              !attachment.isDeleted,
          )
          .map((attachment, index) => {
            let indexInAllAttachments = list.findIndex(
              (item) => item.id === attachment.id,
            )
            if (attachment.fileIndexFK)
              indexInAllAttachments = list.findIndex(
                (item) => item.fileIndexFK === attachment.fileIndexFK,
              )
            return (
              <Thumbnail
                key={`attachment-${index}`}
                attachment={attachment}
                indexInAllAttachments={indexInAllAttachments}
                onClickAttachment={handleClickAttachment}
                fieldName='eyeVisualAcuityTestAttachments'
              />
            )
          })}
      </div>
    )
  }

  let _attachment = (current.eyeVisualAcuityTestAttachments || [])
    .map((o) => o.attachment)

  return (
    <div>
      <AttachmentWithThumbnail
        attachments={_attachment || []}
        buttonOnly
        label='Auto-ref Result'
        attachmentType='EyeVisualAcuity'
        isReadOnly
        renderBody={(list) => {
          return getContent(list)
        }}
      />
    </div>
  )
}

export default Attachment
