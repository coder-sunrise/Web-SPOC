import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import _ from 'lodash'
import { FastField } from 'formik'
// material ui
// common components
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'
// services
import { deleteFileByFileID, downloadAttachment } from '@/services/file'

@connect(({ consultation }) => ({
  consultation,
}))
class Attachment extends Component {
  state = {
    runOnce: false,
  }

  handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  handleUpdateAttachments = ({ added, deleted }) => {
    const { form, field } = this
    let updated = [
      ...(field.value || []),
    ]

    if (added) {
      updated = [
        ...updated,
        ...added.map((o) => {
          const { id, ...resetProps } = o
          return {
            ...resetProps,
            fileIndexFK: o.id,
          }
        }),
      ]
    }

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    updated = updated.map((item, index) => ({ ...item, sortOrder: index + 1 }))

    const { handleUpdateAttachments } = this.props
    if (handleUpdateAttachments)
      handleUpdateAttachments({
        ...this.props,
        updated,
        form,
        added,
        deleted,
      })
  }

  handleDeleteAttachment = (fileIndexFK, id) => {
    if (!fileIndexFK && id) {
      deleteFileByFileID(id)
    }

    this.handleUpdateAttachments({
      deleted: !fileIndexFK ? id : fileIndexFK,
    })
  }

  getContent = (list = []) => {
    const onDeleteClick = this.handleDeleteAttachment
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
                onConfirmDelete={onDeleteClick}
                indexInAllAttachments={indexInAllAttachments}
                onClickAttachment={this.handleClickAttachment}
                fieldName={this.props.attachmentsFieldName}
              />
            )
          })}
      </div>
    )
  }

  render () {
    const {
      consultation = {},
      attachments,
      attachmentsFieldName,
      fromPatientHistory,
      values,
    } = this.props
    // console.log(attachments)
    const { entity } = consultation
    let _attachment = attachments
    if (!_attachment && entity) {
      _attachment = entity.corAttachment
    }

    if (fromPatientHistory) {
      _attachment = values.eyeVisualAcuityTestAttachments.map(
        (o) => o.attachment,
      )
    }

    return (
      <div>
        <FastField
          name={attachmentsFieldName}
          render={(args) => {
            const { form, field } = args
            // console.log(form, field)
            this.form = form
            this.field = field
            if (!this.state.runOnce) {
              this.setState({
                runOnce: true,
              })
            }
            return null
          }}
        />

        <AttachmentWithThumbnail
          attachments={_attachment || []}
          buttonOnly
          attachmentType='EyeVisualAcuity'
          handleUpdateAttachments={this.handleUpdateAttachments}
          renderBody={(list) => {
            // console.log(list)
            return this.getContent(list)
          }}
        />
      </div>
    )
  }
}

export default Attachment
