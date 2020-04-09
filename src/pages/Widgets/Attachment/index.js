import React, { Component } from 'react'
import { connect } from 'dva'
// formik
import _ from 'lodash'
import { FastField } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion, CommonModal } from '@/components'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Thumbnail from '@/components/_medisys/AttachmentWithThumbnail/Thumbnail'
import ScribbleNote from '@/pages/Shared/ScribbleNote/ScribbleNote'
import ScribbleThumbnail from './ScribbleThumbnail'
import EmptyList from './EmptyList'
// services
import { deleteFileByFileID, downloadAttachment } from '@/services/file'
import { navigateDirtyCheck } from '@/utils/utils'
import { corAttchementTypes } from '@/utils/codes'
import Authorized from '@/utils/Authorized'

@connect(({ consultation }) => ({
  consultation,
}))
class Attachment extends Component {
  state = {
    runOnce: false,
    showScribbleModal: false,
    activedKeys: undefined,
    selectedAttachmentType: 'ClinicalNotes',
    types: corAttchementTypes.filter(
      (o) => !o.accessRight || Authorized.check(o.accessRight),
    ),
  }

  handleClickAttachment = (attachment) => {
    downloadAttachment(attachment)
  }

  handleUpdateAttachments = ({ added, deleted }) => {
    const { consultation } = this.props
    const { entity } = consultation
    const { form, field } = this
    const { types, activedKeys, selectedAttachmentType } = this.state
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

      if (selectedAttachmentType) {
        // default open panel if it was closed
        const targetIndex = types.indexOf(
          types.find((o) => o.type === selectedAttachmentType),
        )
        if (
          targetIndex >= 0 &&
          added.find((o) => o.attachmentType === selectedAttachmentType) &&
          !(activedKeys || []).includes(targetIndex)
        ) {
          this.setState((preState) => ({
            activedKeys: (preState.activedKeys || []).concat([
              targetIndex,
            ]),
          }))
        }
      }
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

    form.setFieldValue(
      'corAttachment',
      updated.map((item, index) => ({ ...item, sortOrder: index + 1 })),
    )

    entity.corAttachment = updated
    this.props.dispatch({
      type: 'consultation/updateState',
      payload: {
        entity,
      },
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

  getContent = (list = [], attachments) => {
    const commonProps = {
      fieldName: 'corAttachment',
      onClickAttachment: this.handleClickAttachment,
    }
    const onDeleteClick = this.handleDeleteAttachment

    return (
      <div style={{ width: '100%' }}>
        {list.filter((attachment) => !attachment.isDeleted).length === 0 ? (
          <EmptyList />
        ) : (
          list
            .filter((attachment) => !attachment.isDeleted)
            .map((attachment, index) => {
              let indexInAllAttachments = attachments.findIndex(
                (item) => item.id === attachment.id,
              )
              if (attachment.fileIndexFK)
                indexInAllAttachments = attachments.findIndex(
                  (item) => item.fileIndexFK === attachment.fileIndexFK,
                )
              return (
                <Thumbnail
                  key={`attachment-${index}`}
                  attachment={attachment}
                  onConfirmDelete={onDeleteClick}
                  indexInAllAttachments={indexInAllAttachments}
                  {...commonProps}
                />
              )
            })
        )}
      </div>
    )
  }

  onAccordionChange = (keys) => {
    this.setState({
      activedKeys: keys,
    })
  }

  handleSelectedAttachmentType = (selectedType) => {
    this.setState(() => {
      return {
        selectedAttachmentType: selectedType,
      }
    })
  }

  render () {
    const { types, selectedAttachmentType } = this.state
    const { consultation } = this.props
    const { entity } = consultation
    const { corAttachment } = entity
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
              })
            }
            return null
          }}
        />

        {corAttachment && (
          <AttachmentWithThumbnail
            attachments={corAttachment}
            buttonOnly
            attachmentType={selectedAttachmentType}
            withDropDown
            handleUpdateAttachments={this.handleUpdateAttachments}
            handleSelectedAttachmentType={this.handleSelectedAttachmentType}
            renderBody={(attachments) => {
              return (
                <Accordion
                  leftIcon
                  expandIcon={<SolidExpandMore fontSize='large' />}
                  mode='multiple'
                  activedKeys={this.state.activedKeys}
                  onExpend={this.onAccordionChange}
                  defaultActive={types.reduce((result, tp, index) => {
                    if (
                      corAttachment.filter((m) => m.attachmentType === tp.type)
                        .length > 0
                    ) {
                      return [
                        ...result,
                        index,
                      ]
                    }
                    return result
                  }, [])}
                  collapses={types.map((o) => {
                    return {
                      title: o.name,
                      content: this.getContent(
                        corAttachment.filter(
                          (m) => m.attachmentType === o.type,
                        ),
                        attachments,
                      ),
                    }
                  })}
                />
              )
            }}
          />
        )}

        {/* <CommonModal
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
        </CommonModal> */}
      </div>
    )
  }
}

export default Attachment
