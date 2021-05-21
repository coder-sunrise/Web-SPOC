import React, { Component } from 'react'
import { connect } from 'dva'

// printjs
import printJS from 'print-js'

// material ui
import { withStyles } from '@material-ui/core'
// styles
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common components
import { FastField, Carousel, CommonModal } from '@/components'
import { Attachment } from '@/components/_medisys'
// sub components
import { findGetParameter } from '@/utils/utils'
import {
  arrayBufferToBase64,
  BASE64_MARKER,
} from '@/components/_medisys/ReportViewer/utils'
import {
  downloadAttachment,
  getFileByFileID,
  getPDFFile,
} from '@/services/file'
import {
  getPDF,
  getUnsavedPDF,
  exportUnsavedReport,
  exportPdfReport,
  exportExcelReport,
} from '@/services/report'
import Filter from './Filter'
import Grid from './Grid'
// models
// import model from './models'
import ImagePreviewer from './ImagePreviewer'
import TagSetter from './tagSetter'

// window.g_app.replaceModel(model)

const styles = theme => ({
  ...basicStyle(theme),
})

const imageExt = ['JPG', 'JPEG', 'PNG', 'BMP', 'GIF']

const getLargestSortOrder = (largestIndex, attachment) =>
  attachment.sortOrder > largestIndex ? attachment.sortOrder : largestIndex

@connect(({ patientAttachment }) => ({
  patientAttachment,
}))
class PatientDocument extends Component {
  state = {
    showImagePreview: false,
  }

  componentDidMount() {
    const { dispatch, values } = this.props
    dispatch({
      type: 'patientAttachment/query',
      payload: {
        'PatientProfileFKNavigation.Id': values.id,
      },
    })
  }

  updateAttachments = args => ({ added, deleted }) => {
    const { dispatch, patientAttachment = [] } = this.props
    const { list = [] } = patientAttachment
    const { field } = args

    let updated = [...(field.value || [])]
    if (added) {
      const addedFiles = added.map(file => {
        const { 0: fileDetails, attachmentType } = file
        return {
          ...fileDetails,
          fileIndexFK: fileDetails.id,
          attachmentType,
        }
      })
      updated = [...updated, ...addedFiles]
      this.setState({ showTagModal: true, tagList: addedFiles })
    }

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [...attachments, { ...item, isDeleted: true }]

        return [...attachments, { ...item }]
      }, [])
    const sorted = updated.sort((a, b) => {
      if (a.id > b.id) return 1
      if (a.id < b.id) return -1
      return 0
    })
    const startOrder = list.reduce(getLargestSortOrder, 0) + 1

    Promise.all(
      sorted.map((attachment, index) =>
        dispatch({
          type: 'patientAttachment/upsert',
          payload: {
            cfg: { message: 'Uploaded Attachment' },
            patientProfileFK: findGetParameter('pid'),
            sortOrder: startOrder + index,
            fileIndexFK: attachment.fileIndexFK,
          },
        }),
      ),
    )
      .then(() => {
        dispatch({
          type: 'patientAttachment/query',
        })
      })
      .catch(error => {
        console.error({ error })
      })
  }

  onPreview = file => {
    const fileExtension = (file.fileExtension || '').toUpperCase()

    // this.setState({
    //   showTagModal: true,
    //   tagList: [
    //     file,
    //   ],
    // })
    // return

    if (fileExtension === 'PDF') {
      getFileByFileID(file.fileIndexFK).then(response => {
        const { data } = response
        const base64Result = arrayBufferToBase64(data)
        printJS({ printable: base64Result, type: 'pdf', base64: true })
      })
    } else if (imageExt.includes(fileExtension)) {
      this.setState({
        showImagePreview: true,
        selectedFileId: file.fileIndexFK,
      })
    }
  }

  render() {
    const {
      patient: { entity },
      patientAttachment,
    } = this.props
    const {
      showImagePreview,
      selectedFileId,
      showTagModal,
      tagList,
    } = this.state
    const patientIsActive = entity && entity.isActive

    const { list = [] } = patientAttachment

    return (
      <div>
        <Filter {...this.props} />
        <Grid {...this.props} onPreview={this.onPreview} />
        {patientIsActive && (
          <div style={{ float: 'left' }}>
            <FastField
              name='patientAttachment'
              render={args => {
                this.form = args.form

                return (
                  <Attachment
                    attachmentType='patientAttachment'
                    handleUpdateAttachments={this.updateAttachments(args)}
                    attachments={args.field.value}
                    label=''
                    // isReadOnly
                  />
                )
              }}
            />
          </div>
        )}
        <CommonModal
          open={showImagePreview}
          title='Patient Document Preview'
          maxWidth='lg'
          onClose={() => this.setState({ showImagePreview: false })}
        >
          <ImagePreviewer
            selectedFileId={selectedFileId}
            files={list.filter(f =>
              imageExt.includes(f.fileExtension.toUpperCase()),
            )}
          />
        </CommonModal>
        <CommonModal
          open={showTagModal}
          title='Set Tag'
          maxWidth='lg'
          minHeight={500}
          onClose={() => this.setState({ showTagModal: false })}
        >
          <TagSetter tagList={tagList} />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDocument)
