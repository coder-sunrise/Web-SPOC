import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import { FastField } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CommonModal } from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'
import ScribbleNote from '@/pages/Shared/ScribbleNote/ScribbleNote'
import ScribbleThumbnail from './ScribbleThumbnail'
// services
import { deleteFileByFileID, downloadAttachment } from '@/services/file'
import { navigateDirtyCheck } from '@/utils/utils'

@connect()
class Attachment extends Component {
  state = {
    showScribbleModal: false,
    selectedScribbleNoteData: undefined,
  }

  componentDidMount () {
    const { parentProps } = this.props
    const { consultation } = parentProps
    const { corAttachment = [], corScribbleNotes = [] } =
      consultation.entity || consultation.default

    this.mapAttachments(corAttachment, corScribbleNotes)
  }

  mapAttachments = (attachments, scribbleNotes = []) => {
    let {
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    } = attachments.reduce(
      (result, attachment, index) => {
        if (attachment.attachmentType === 'Visit') {
          return {
            ...result,
            visitAttachment: [
              ...result.visitAttachment,
              { ...attachment, index },
            ],
          }
        }
        if (attachment.attachmentType === 'VisitReferral') {
          return {
            ...result,
            referralAttachment: [
              ...result.referralAttachment,
              { ...attachment, index },
            ],
          }
        }
        if (attachment.attachmentType === 'ClinicalNotes') {
          return {
            ...result,
            clinicalNotesAttachment: [
              ...result.clinicalNotesAttachment,
              { ...attachment, index },
            ],
          }
        }
        return { ...result }
      },
      {
        visitAttachment: [],
        referralAttachment: [],
        clinicalNotesAttachment: [],
      },
    )
    // clinicalNotesAttachment = [
    //   ...clinicalNotesAttachment,
    //   ...scribbleNotes.map((sn) => ({ ...sn, isScribbleNote: true })),
    // ]
    return { visitAttachment, referralAttachment, clinicalNotesAttachment }
  }

  handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  handleUpdateAttachments = (args) => ({ added, deleted }) => {
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
  }

  handleDeleteAttachment = (args) => (fileIndexFK, id) => {
    if (!fileIndexFK && id) {
      deleteFileByFileID(id)
    }

    this.handleUpdateAttachments(args)({
      deleted: !fileIndexFK ? id : fileIndexFK,
    })
  }

  closeScribbleNote = () => {
    navigateDirtyCheck({
      onProceed: this.toggleScribbleModal(),
    })
  }

  handleScribbleThumbnailClick = (data) => {
    this.setState({
      selectedScribbleNoteData: data,
      showScribbleModal: true,
    })
    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        selectedScribbleNoteData: data,
      },
    })
  }

  toggleScribbleModal = () => {
    this.setState((preState) => ({
      showScribbleModal: !preState.showScribbleModal,
    }))
  }

  render () {
    const { showScribbleModal, selectedScribbleNoteData } = this.state
    const { dispatch } = this.props
    const commonProps = {
      fieldName: 'corAttachment',
      onClickAttachment: this.handleClickAttachment,
    }
    return (
      <div>
        <FastField
          name='corAttachment'
          render={(args) => {
            const { form } = args
            this.form = form
            const { values } = form
            const { corAttachment = [], corScribbleNotes = [] } = values

            return (
              <AttachmentWithThumbnail
                attachments={corAttachment}
                buttonOnly
                attachmentType='ClinicalNotes'
                handleUpdateAttachments={this.handleUpdateAttachments(args)}
                renderBody={(attachments) => {
                  const {
                    visitAttachment,
                    referralAttachment,
                    clinicalNotesAttachment,
                  } = this.mapAttachments(attachments, corScribbleNotes)
                  const onDeleteClick = this.handleDeleteAttachment(args)
                  return (
                    <Accordion
                      leftIcon
                      expandIcon={<SolidExpandMore fontSize='large' />}
                      mode='multiple'
                      defaultActive={[
                        0,
                        1,
                        2,
                      ]}
                      collapses={[
                        {
                          title: (
                            <h5 style={{ paddingLeft: 8 }}>
                              Consultation Attachment
                            </h5>
                          ),
                          content: (
                            <div>
                              {clinicalNotesAttachment
                                .filter((attachment) => !attachment.isDeleted)
                                .map(
                                  (attachment, index) =>
                                    attachment.isScribbleNote ? (
                                      <ScribbleThumbnail
                                        key={`attachment-${index}`}
                                        attachment={attachment}
                                        dispatch={dispatch}
                                        onClick={
                                          this.handleScribbleThumbnailClick
                                        }
                                        onInsertClick={this.handleInsertClick}
                                        // onConfirmDelete={onDeleteClick}
                                        // index={attachment.index}
                                        // {...commonProps}
                                      />
                                    ) : (
                                      <Thumbnail
                                        key={`attachment-${index}`}
                                        attachment={attachment}
                                        onConfirmDelete={onDeleteClick}
                                        index={attachment.index}
                                        {...commonProps}
                                      />
                                    ),
                                )}
                            </div>
                          ),
                        },
                        {
                          title: (
                            <h5 style={{ paddingLeft: 8 }}>Visit Attachment</h5>
                          ),
                          content: (
                            <div>
                              {visitAttachment
                                .filter((attachment) => !attachment.isDeleted)
                                .map((attachment, index) => (
                                  <Thumbnail
                                    key={`attachment-${index}`}
                                    attachment={attachment}
                                    onConfirmDelete={onDeleteClick}
                                    {...commonProps}
                                  />
                                ))}
                            </div>
                          ),
                        },
                        {
                          title: (
                            <h5 style={{ paddingLeft: 8 }}>
                              Referral Attachment
                            </h5>
                          ),
                          content: (
                            <div>
                              {referralAttachment
                                .filter((attachment) => !attachment.isDeleted)
                                .map((attachment, index) => (
                                  <Thumbnail
                                    key={`attachment-${index}`}
                                    attachment={attachment}
                                    onConfirmDelete={onDeleteClick}
                                    {...commonProps}
                                  />
                                ))}
                            </div>
                          ),
                        },
                      ]}
                    />
                  )
                }}
              />
            )
          }}
        />
        <CommonModal
          open={showScribbleModal}
          title='Scribble'
          fullScreen
          bodyNoPadding
          observe='ScribbleNotePage'
          onClose={this.closeScribbleNote}
        >
          <ScribbleNote
            {...this.props}
            // addScribble={this.scribbleNoteDrawing}
            toggleScribbleModal={this.toggleScribbleModal}
            scribbleData={selectedScribbleNoteData}
            deleteScribbleNote={this.deleteScribbleNote}
          />
        </CommonModal>
      </div>
    )
  }
}

export default Attachment
