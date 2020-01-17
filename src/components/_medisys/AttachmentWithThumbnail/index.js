import React, { useRef, useState } from 'react'
import { connect } from 'dva'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, Danger, GridContainer } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// sub components
import Thumbnail from './Thumbnail'
import {
  downloadAttachment,
  uploadFile,
  deleteFileByFileID,
} from '@/services/file'
import { convertToBase64 } from '@/utils/utils'
import { FILE_STATUS, FILE_CATEGORY } from '@/utils/constants'
import { getThumbnail } from './utils'
import styles from './styles'

const allowedFiles = '.png, .jpg, .jpeg, .xls, .xlsx, .doc, .docx, .pdf'

const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

const AttachmentWithThumbnail = ({
  classes,
  cardStyles,
  dispatch,
  label,
  handleUpdateAttachments,
  isReadOnly,
  buttonOnly = false,
  attachments = [],
  filterTypes = [],
  allowedMultiple = true,
  simple = false,
  local = false,
  attachmentType = '',
  thumbnailSize = {
    height: 64,
    width: 64,
  },
  renderBody = undefined,
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

  const [
    downloading,
    setDownlaoding,
  ] = useState(false)

  const mapFileToUploadObject = async (file) => {
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const fileStatusFK = FILE_STATUS.UPLOADED
    const fileExtension = getFileExtension(file.name)

    let thumbnailData
    if (
      [
        'jpg',
        'jpeg',
        'png',
      ].includes(fileExtension)
    ) {
      const imgEle = document.createElement('img')
      imgEle.src = `data:image/${fileExtension};base64,${base64}`
      await setTimeout(() => {
        // wait for 1 milli second for img to set src successfully
      }, 100)
      const thumbnail = getThumbnail(imgEle, thumbnailSize)
      thumbnailData = thumbnail.toDataURL(`image/png`)
    }

    const uploadObject = {
      fileName: file.name,
      fileSize: file.size,
      fileCategoryFK: FILE_CATEGORY.VISITREG,
      content: base64,
      fileExtension,
      thumbnailData,
      fileStatusFK,
      attachmentType,
    }
    const uploaded = local ? {} : await uploadFile(uploadObject)

    return {
      ...uploaded,
      attachmentType,
      content: base64,
      thumbnailData,
      isbase64: true,
    }
  }

  const mapToFileDto = async (file) => {
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const fileStatusFK = FILE_STATUS.UPLOADED
    const fileExtension = getFileExtension(file.name)
    let _thumbnailDto
    if (
      [
        'jpg',
        'jpeg',
        'png',
      ].includes(fileExtension)
    ) {
      const imgEle = document.createElement('img')
      imgEle.src = `data:image/${fileExtension};base64,${base64}`
      await setTimeout(() => {
        // wait for 1 milli second for img to set src successfully
      }, 100)
      const thumbnail = getThumbnail(imgEle, thumbnailSize)
      let [
        base64Prefix,
        thumbnailData,
      ] = thumbnail.toDataURL(`image/png`).split(',')

      _thumbnailDto = {
        fileExtension: '.png',
        fileSize: 0,
        content: thumbnailData,
        isDeleted: false,
      }
    }

    const originalFile = {
      fileName: file.name,
      fileSize: file.size,
      fileCategoryFK: FILE_CATEGORY.VISITREG,
      content: base64,
      thumbnail: _thumbnailDto,
      fileExtension,
      fileStatusFK,
      attachmentType,
    }

    return originalFile
  }

  const mapUploadResponseToAttachmentDto = (files, response) => {
    return response.map((item, index) => {
      const { thumbnail, ...rest } = item
      const file = files[index]
      return {
        ...rest,
        ...file,
        thumbnail: {
          ...thumbnail,
          content: file.thumbnail ? file.thumbnail.content : null,
        },
        content: file.content,
      }
    })
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

      const selectedFiles = await Promise.all(
        Object.keys(files).map((key) => mapToFileDto(files[key])),
      )

      const uploadResponse = await uploadFile(selectedFiles)

      let uploadedAttachment = []
      if (uploadResponse) {
        uploadedAttachment = mapUploadResponseToAttachmentDto(
          selectedFiles,
          uploadResponse,
        )
      }

      setUploading(false)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      handleUpdateAttachments({
        added: uploadedAttachment,
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

  const onClick = async (attachment) => {
    setDownlaoding(true)
    await downloadAttachment(attachment)
    setDownlaoding(false)
  }

  let UploadButton = (
    <Button
      color='rose'
      size='sm'
      onClick={onUploadClick}
      disabled={uploading || global.disableSave}
      className={classes.uploadBtn}
    >
      <AttachFile /> Upload
    </Button>
  )

  if (!allowedMultiple && fileAttachments.length >= 1) UploadButton = null

  const commonProps = {
    isReadOnly,
    simple,
    size: thumbnailSize,
    onConfirmDelete: onDelete,
    onClickAttachment: onClick,
    noBorder: simple && !allowedMultiple,
  }

  let Body =
    fileAttachments.length > 0 ? (
      <CardContainer hideHeader styles={cardStyles}>
        <GridContainer>
          {fileAttachments.map((attachment, index) => {
            return (
              <Thumbnail
                index={index}
                attachment={attachment}
                {...commonProps}
              />
            )
          })}
        </GridContainer>
      </CardContainer>
    ) : null

  if (simple && !allowedMultiple)
    Body = fileAttachments.map((attachment, index) => {
      return (
        <Thumbnail index={index} attachment={attachment} {...commonProps} />
      )
    })

  if (buttonOnly) Body = null
  let loadingPrefix = 'Uploading'

  if (downloading) loadingPrefix = 'Downloading'

  if (renderBody) {
    Body = renderBody(attachments)
  }
  return (
    <div className={classes.root}>
      {label && <span className={classes.attachmentLabel}>{label}</span>}
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
      {errorText && (
        <Danger style={{ display: 'inline-block' }}>
          <span style={{ fontWeight: 500 }}>{errorText}</span>
        </Danger>
      )}
      <LoadingWrapper
        loading={uploading || downloading}
        text={`${loadingPrefix} attachment...`}
      >
        {Body}
      </LoadingWrapper>
    </div>
  )
}

const Connected = connect(({ global }) => ({ global }))(AttachmentWithThumbnail)

export default withStyles(styles)(Connected)
