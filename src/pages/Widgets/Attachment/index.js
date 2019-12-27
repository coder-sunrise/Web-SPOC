import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { FastField } from 'formik'
// common components
import { CardContainer } from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'
// services
import { downloadAttachment } from '@/services/file'

@connect()
class Attachment extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visitAttachment: [],
      referralAttachment: [],
      clinicalNotesAttachment: [],
    }
  }

  componentDidMount () {
    const { parentProps } = this.props
    const { consultation } = parentProps
    const { corAttachment = [] } = consultation.entity || consultation.default

    this.mapAttachments(corAttachment)
  }

  mapAttachments = (attachments) => {
    const visitAttachment = attachments.filter(
      (attachment) => attachment.attachmentType === 'Visit',
    )

    const referralAttachment = attachments.filter(
      (attachment) => attachment.attachmentType === 'VisitReferral',
    )

    const clinicalNotesAttachment = attachments.filter(
      (attachment) => attachment.attachmentType === 'ClinicalNotes',
    )
    this.setState({
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    })
  }

  handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  handleUpdateAttachments = (args) => ({ added, deleted }) => {
    // console.log({ added, deleted }, args)
    const { form, field } = args

    let updated = [
      ...(field.value || []),
    ]
    if (added)
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

    form.setFieldValue('corAttachment', updated)
    console.log({ updated })
    this.mapAttachments(updated)
  }

  render () {
    const { parentProps } = this.props
    const {
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    } = this.state

    const commonProps = {
      isReadOnly: true,
      onConfirmDelete: () => {},
      onClickAttachment: this.handleClickAttachment,
    }
    const { consultation, values } = parentProps
    const { corAttachment = [] } = consultation.entity || consultation.default
    console.log({ values, state: this.state })
    return (
      <div>
        <FastField
          name='corAttachment'
          render={(args) => (
            <AttachmentWithThumbnail
              attachments={corAttachment}
              buttonOnly
              attachmentType='ClinicalNotes'
              handleUpdateAttachments={this.handleUpdateAttachments(args)}
            />
          )}
        />

        <CardContainer hideHeader>
          <h5>Visit Attachment</h5>
          {visitAttachment.map((attachment) => (
            <Thumbnail attachment={attachment} {...commonProps} />
          ))}
        </CardContainer>

        <CardContainer hideHeader>
          <h5>Referral Attachment</h5>
          {referralAttachment.map((attachment) => (
            <Thumbnail attachment={attachment} {...commonProps} />
          ))}
        </CardContainer>

        <CardContainer hideHeader>
          <h5>Clinical Notes Attachment</h5>
          {clinicalNotesAttachment.map((attachment) => (
            <Thumbnail attachment={attachment} {...commonProps} />
          ))}
        </CardContainer>
      </div>
    )
  }
}

export default Attachment
