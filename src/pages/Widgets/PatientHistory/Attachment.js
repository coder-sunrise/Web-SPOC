import React from 'react'
// sub components
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'

class Attachment extends React.Component {
  render () {
    const { current } = this.props
    const { attachments = [] } = current

    const commonProps = {
      isReadOnly: true,
      onConfirmDelete: () => {},
      onClickAttachment: this.handleClickAttachment,
    }

    return (
      <div>
        {attachments.map((attachment, index) => (
          <Thumbnail
            key={`attachment-${index}`}
            attachment={attachment}
            {...commonProps}
          />
        ))}
      </div>
    )
  }
}

export default Attachment
