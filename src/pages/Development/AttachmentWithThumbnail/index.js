import React, { useRef, useState } from 'react'
import { connect } from 'dva'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, GridContainer } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// sub components
import Thumbnail from './Thumbnail'
import {
  downloadAttachment,
  uploadFile,
  deleteFileByFileID,
} from '@/services/file'
import { convertToBase64 } from '@/utils/utils'
import { FILE_STATUS } from '@/utils/constants'
import styles from './styles'

const allowedFiles = '.png, .jpg, .jpeg, .xls, .xlsx, .doc, .docx, .pdf'

const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

const AttachmentWithThumbnail = ({
  classes,
  dispatch,
  title = 'Attachment',
  handleUpdateAttachments,
  isReadOnly,
  attachments = [],
  filterTypes = [],
  allowedMultiple = true,
  simple = false,
  attachmentType = '',
  thumbnailSize = {
    height: 65,
    width: 65,
  },
}) => {
  const fileAttachments = attachments.filter(
    (attachment) =>
      (!attachmentType ||
        attachment.attachmentType === attachmentType ||
        filterTypes.indexOf(attachment.attachmentType) >= 0) &&
      !attachment.isDeleted,
  )

  const inputEl = useRef(null)

  const [
    errorText,
    setErrorText,
  ] = useState('')

  const [
    uploading,
    setUploading,
  ] = useState(false)

  const mapFileToUploadObject = async (file) => {
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const fileStatusFK = FILE_STATUS.UPLOADED

    const uploadObject = {
      fileName: file.name,
      fileSize: file.size,
      fileExtension: getFileExtension(file.name),
      fileCategoryFK: 1,
      content: base64,
      // isConfirmed: false,
      fileStatusFK,
      attachmentType,
    }
    const uploaded = await uploadFile(uploadObject)

    return { ...uploaded, attachmentType, content: base64, isbase64: true }
  }

  const onFileChange = async (event) => {
    try {
      setUploading(true)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: true,
        },
      })

      const { files } = event.target

      // const numberOfNewFiles = Object.keys(files).length
      let totalFilesSize = 0
      const maxUploadSize = 31457280
      const filesArray = [
        ...files,
      ]

      filesArray &&
        filesArray.forEach((o) => {
          totalFilesSize += o.size
        })
      attachments.forEach((o) => {
        if (!o.isDeleted) {
          totalFilesSize += o.fileSize
        }
      })

      if (totalFilesSize > maxUploadSize) {
        setErrorText('Cannot upload more than 30MB')
        setUploading(false)
        dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
        return
      }

      // if (numberOfNewFiles + attachments.length > 5) {
      //   setErrorText('Cannot upload more than 5 attachments')
      //   setUploading(false)
      //   return
      // }
      // const skipped = validateFileSize(files)
      const skipped = []

      const selectedFiles = await Promise.all(
        Object.keys(files)
          .filter((key) => !skipped.includes(files[key].name))
          .map((key) => mapFileToUploadObject(files[key])),
      )

      setUploading(false)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      handleUpdateAttachments({
        added: selectedFiles,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  const clearValue = (e) => {
    e.target.value = null
  }

  const onUploadClick = () => {
    inputEl.current.click()
  }

  const onDelete = (fileIndexFK, id) => {
    if (!fileIndexFK && id) {
      deleteFileByFileID(id)
    }

    handleUpdateAttachments({
      deleted: !fileIndexFK ? id : fileIndexFK,
    })
  }

  const onClick = (attachment) => {
    downloadAttachment(attachment)
  }

  let UploadButton = (
    <Button
      color='rose'
      size='sm'
      onClick={onUploadClick}
      disabled={uploading || global.disableSave}
    >
      <AttachFile /> Upload
    </Button>
  )

  if (!allowedMultiple && fileAttachments.length >= 1) UploadButton = null

  return (
    <div className={classes.root}>
      <span className={classes.attachmentLabel}>{title}</span>

      <input
        style={{ display: 'none' }}
        type='file'
        accept={allowedFiles}
        id='uploadVisitAttachment'
        ref={inputEl}
        multiple={allowedMultiple}
        onChange={onFileChange}
        onClick={clearValue}
      />
      {UploadButton}
      <LoadingWrapper loading={uploading} text='Uploading attachment...'>
        <CardContainer hideHeader>
          <GridContainer>
            {fileAttachments.map((attachment) => {
              return (
                <Thumbnail
                  simple={simple}
                  size={thumbnailSize}
                  attachment={attachment}
                  isReadOnly={isReadOnly}
                  onConfirmDelete={onDelete}
                  onClickAttachment={onClick}
                />
              )
            })}
          </GridContainer>
        </CardContainer>
      </LoadingWrapper>
    </div>
  )
}

const Connected = connect(({ global }) => ({ global }))(AttachmentWithThumbnail)

export default withStyles(styles)(Connected)
