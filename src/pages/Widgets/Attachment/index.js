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
    runOnce: false,
    showScribbleModal: false,
    selectedScribbleNoteData: undefined,
    activedKeys: [],
    corAttachment: [],
  }

  componentDidMount () {
    const { parentProps } = this.props
    const { consultation } = parentProps
    const { corAttachment = [], corScribbleNotes = [] } =
      consultation.entity || consultation.default
    const {
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    } = this.mapAttachments(corAttachment, corScribbleNotes)

    const defaultActive = this.getDefaultActivePanels({
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    })
    this.setState({ activedKeys: defaultActive })
  }

  mapAttachments = (attachments) => {
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

    return { visitAttachment, referralAttachment, clinicalNotesAttachment }
  }

  handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  handleUpdateAttachments = ({ added, deleted }) => {
    const { form, field } = this

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

    // set local state
    const {
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    } = this.mapAttachments(updated)

    const defaultActive = this.getDefaultActivePanels({
      visitAttachment,
      referralAttachment,
      clinicalNotesAttachment,
    })

    this.setState({
      corAttachment: updated,
      activedKeys: defaultActive,
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

  getDefaultActivePanels = ({
    visitAttachment = [],
    referralAttachment = [],
    clinicalNotesAttachment = [],
  }) => {
    let defaultActive = []
    if (clinicalNotesAttachment.length > 0) defaultActive.push(0)
    if (visitAttachment.length > 0) defaultActive.push(1)
    if (referralAttachment.length > 0) defaultActive.push(2)
    return defaultActive
  }

  onAccordionChange = (event, p, expanded) => {
    this.setState((prevState) => {
      let keys = prevState.activedKeys
      if (expanded) {
        keys.push(p.key)
      } else {
        keys = keys.filter((o) => o !== p.key)
      }
      return {
        activedKeys: keys,
      }
    })
  }

  render () {
    const {
      showScribbleModal,
      selectedScribbleNoteData,
      corAttachment,
    } = this.state
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
            // these lines are to bind the form and field value to {this}
            // and initialize corAttachment to keep a local state,
            // its value is the same as in the form.values
            const { form, field } = args
            this.form = form
            this.field = field
            if (!this.state.runOnce) {
              this.setState({
                runOnce: true,
                corAttachment: form.values.corAttachment,
              })
            }
            return null
          }}
        />
        <AttachmentWithThumbnail
          attachments={corAttachment}
          buttonOnly
          attachmentType='ClinicalNotes'
          handleUpdateAttachments={this.handleUpdateAttachments}
          renderBody={(attachments) => {
            const {
              visitAttachment,
              referralAttachment,
              clinicalNotesAttachment,
            } = this.mapAttachments(attachments)
            const onDeleteClick = this.handleDeleteAttachment
            const defaultActive = this.getDefaultActivePanels({
              visitAttachment,
              referralAttachment,
              clinicalNotesAttachment,
            })
            return (
              <Accordion
                leftIcon
                expandIcon={<SolidExpandMore fontSize='large' />}
                mode='multiple'
                defaultActive={defaultActive}
                activedKeys={this.state.activedKeys}
                onChange={this.onAccordionChange}
                collapses={[
                  {
                    title: 'Consultation Attachment',
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
                                  onClick={this.handleScribbleThumbnailClick}
                                  onInsertClick={this.handleInsertClick}
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
                    title: 'Visit Attachment',
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
                    title: 'Referral Attachment',
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
