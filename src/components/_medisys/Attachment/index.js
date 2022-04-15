import React, { Component, useState, useEffect, useRef } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// import fetch from 'dva/fetch'
// material ui
import { AttachFile, Scanner } from '@material-ui/icons'
import { CircularProgress, Chip, withStyles } from '@material-ui/core'
// custom components
import { Button, Danger, GridContainer, GridItem } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// services
import {
  uploadFile,
  downloadAttachment,
  deleteFileByFileID,
} from '@/services/file'
// utils
import { FILE_CATEGORY, FILE_STATUS } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { convertToBase64 } from '@/utils/utils'
import AttachmentChipWithPopover from './AttachmentChipWithPopover'

const styles = theme => ({
  noPadding: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  attachmentLabel: {
    fontSize: '0.9rem',
    fontWeight: 300,
    marginRight: theme.spacing(1),
  },
  attachmentItem: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  chip: {
    // marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: 2,
    '& > span': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  notUploaded: {
    '& > a': {
      color: '#999',
    },
  },
})

const allowedFiles = '.png, .jpg, .jpeg, .xls, .xlsx, .doc, .docx, .pdf'

const getFileExtension = filename => {
  return filename.split('.').pop()
}

class Attachment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorText: undefined,
      uploading: false,
    }

    this.inputEl = React.createRef()
    this.popperRef = React.createRef()
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  setUploading = val => {
    this.setState({ uploading: val })
  }

  setErrorText = val => {
    this.setState({
      errorText: val,
    })
  }

  onUploadFromScan = async datas => {
    const { attachmentType = '', dispatch } = this.props
    try {
      this.setUploading(true)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: true,
        },
      })

      if (!this.validateFilesTotalSize(datas)) {
        dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
        return
      }

      const selectedFilesDto = await Promise.all(
        datas.map(m =>
          this.generateFileDto(m.name, m.size, attachmentType, m.imgData),
        ),
      )

      // let addedItems = await this.beginUpload(selectedFilesDto)

      this.setUploading(false)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      this.props.handleUpdateAttachments({
        added: selectedFilesDto,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  beginUpload = async uploadObjects => {
    const { attachmentType = '' } = this.props
    const uploaded = await uploadFile(uploadObjects)

    return uploaded.map(m => {
      return {
        0: m,
        attachmentType,
      }
    })
  }

  generateFileDto = async (name, size, attachmentType, base64File) => {
    let fileStatusFK
    let fileCategoryFK
    if (attachmentType === 'patientAttachment') {
      fileStatusFK = FILE_STATUS.CONFIRMED
      fileCategoryFK = FILE_CATEGORY.PATIENT
    } else if (attachmentType === 'coPayerAttachment') {
      fileStatusFK = FILE_STATUS.CONFIRMED
      fileCategoryFK = FILE_CATEGORY.COPAYER
    } else {
      fileStatusFK = FILE_STATUS.UPLOADED
      if (attachmentType === 'VisitReferral' || attachmentType === 'Visit') {
        fileCategoryFK = FILE_CATEGORY.VISITREG
      } else {
        fileCategoryFK = FILE_CATEGORY.CONSULTATION
      }
    }

    const uploadObject = {
      fileName: name,
      fileSize: size,
      fileExtension: getFileExtension(name),
      fileCategoryFK,
      content: base64File,
      // isConfirmed: false,
      fileStatusFK,
      attachmentType,
    }
    const uploaded = await uploadFile([uploadObject])

    return { ...uploaded, attachmentType }

    // console.log(uploadObject)
    // return uploadObject
  }

  mapFileToUploadObject = async file => {
    const { attachmentType = '' } = this.props
    const { name, size } = file
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const dtos = await this.generateFileDto(name, size, attachmentType, base64)
    return dtos
  }

  onUploadClick = () => {
    this.setErrorText('')
    this.inputEl.current.click()
  }

  validateFileSize = files => {
    const maxMB = 31457280
    const skippedFiles = Object.keys(files).reduce(
      (skipped, key) =>
        files[key].size > maxMB ? [...skipped, files[key].name] : [...skipped],
      [],
    )
    if (skippedFiles.length === 0) return []

    const errTxt = `Skipped ${skippedFiles.join(
      ', ',
    )}. Reason: File(s) is larger than 5mb`
    this.setErrorText(errTxt)

    return skippedFiles
  }

  validateFilesTotalSize = filesArray => {
    const { attachments = [] } = this.props

    let totalFilesSize = 0
    const maxUploadSize = 31457280

    filesArray &&
      filesArray.forEach(o => {
        totalFilesSize += o.size
      })
    attachments.forEach(o => {
      if (!o.isDeleted) {
        totalFilesSize += o.fileSize
      }
    })

    if (totalFilesSize > maxUploadSize) {
      this.setErrorText('Cannot upload more than 30MB')
      return false
    }
    return true
  }

  onFileChange = async event => {
    const { dispatch } = this.props
    try {
      this.setUploading(true)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: true,
        },
      })

      const { files } = event.target
      const filesArray = [...files]

      if (!this.validateFilesTotalSize(filesArray)) {
        this.setUploading(false)
        this.props.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
        return
      }
      // const skipped = validateFileSize(files)
      const skipped = []

      const selectedFiles = await Promise.all(
        Object.keys(files)
          .filter(key => !skipped.includes(files[key].name))
          .map(key => this.mapFileToUploadObject(files[key])),
      )

      // let addedItems = await this.beginUpload(selectedFiles)

      this.setUploading(false)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      this.props.handleUpdateAttachments({
        added: selectedFiles,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  onDelete = (fileIndexFK, id) => {
    if (!fileIndexFK && id) {
      deleteFileByFileID(id)
    }

    this.props.handleUpdateAttachments({
      deleted: !fileIndexFK ? id : fileIndexFK,
    })
  }

  clearValue = e => {
    e.target.value = null
  }

  onClick = attachment => {
    downloadAttachment(attachment)
  }

  render() {
    const {
      global,
      classes,
      attachmentType = '',
      filterTypes = [],
      attachments = [],
      isReadOnly,
      listOnly = false,
      label = 'Attachment:',
      disableScanner = false,
      handleOpenScanner,
    } = this.props

    const fileAttachments = attachments.filter(
      attachment =>
        (!attachmentType ||
          attachment.attachmentType === attachmentType ||
          filterTypes.indexOf(attachment.attachmentType) >= 0) &&
        !attachment.isDeleted,
    )

    const labelClass = classnames({
      [classes.verticalSpacing]: true,
      [classes.noPadding]: true,
    })

    // console.log({ fileAttachments })

    return (
      <LoadingWrapper
        className={labelClass}
        loading={this.state.uploading}
        text=''
      >
        {listOnly && (
          <GridContainer>
            <GridItem md={12} className={classes.verticalSpacing}>
              <div>
                {fileAttachments.map(attachment => (
                  <AttachmentChipWithPopover
                    title='Delete Attachment'
                    contentText='Confirm to delete this attachment?'
                    isReadOnly={isReadOnly}
                    classes={classes}
                    attachment={attachment}
                    onConfirmDelete={this.onDelete}
                    onClickAttachment={this.onClick}
                  />
                ))}
              </div>
            </GridItem>
          </GridContainer>
        )}
        {!listOnly && (
          <GridContainer>
            <GridItem md={10} className={classes.verticalSpacing}>
              <div>
                {fileAttachments.map(attachment => (
                  <AttachmentChipWithPopover
                    title='Delete Attachment'
                    contentText='Confirm to delete this attachment?'
                    isReadOnly={isReadOnly}
                    classes={classes}
                    attachment={attachment}
                    onConfirmDelete={this.onDelete}
                    onClickAttachment={this.onClick}
                  />
                ))}
              </div>
            </GridItem>
            <GridItem className={classes.noPadding}>
              <input
                style={{ display: 'none' }}
                type='file'
                accept={allowedFiles}
                id='uploadVisitAttachment'
                ref={this.inputEl}
                multiple='multiple'
                onChange={this.onFileChange}
                onClick={this.clearValue}
              />
              {!isReadOnly && (
                <React.Fragment>
                  <Button
                    color='primary'
                    size='sm'
                    onClick={this.onUploadClick}
                    disabled={this.state.uploading || global.disableSave}
                  >
                    <AttachFile />
                    Upload
                  </Button>
                  {!disableScanner && (
                    <Button
                      color='primary'
                      size='sm'
                      onClick={handleOpenScanner}
                      disabled={
                        isReadOnly || this.state.uploading || global.disableSave
                      }
                      className={
                        fileAttachments.length >= 1 ? classes.uploadBtn : ''
                      }
                    >
                      <Scanner /> Scan
                    </Button>
                  )}
                </React.Fragment>
              )}
            </GridItem>
            <GridItem>
              <Danger>
                <span>{this.state.errorText}</span>
              </Danger>
            </GridItem>
          </GridContainer>
        )}
      </LoadingWrapper>
    )
  }
}

const ConnectAttachment = connect(({ global }) => ({ global }))(Attachment)

export default withWebSocket()(
  withStyles(styles, { name: 'Attachment' })(ConnectAttachment),
)
