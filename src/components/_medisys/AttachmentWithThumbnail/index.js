import React, { useRef, useState, Fragment } from 'react'
import { connect } from 'dva'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import {
  withStyles,
  MenuList,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  MenuItem,
} from '@material-ui/core'
// common components
import { Button, CardContainer, Danger, GridContainer } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// sub components
import {
  downloadAttachment,
  uploadFile,
  deleteFileByFileID,
} from '@/services/file'
import { convertToBase64 } from '@/utils/utils'
import { FILE_STATUS, FILE_CATEGORY, ATTACHMENT_TYPE } from '@/utils/constants'
import { corAttchementTypes } from '@/utils/codes'
import Authorized from '@/utils/Authorized'
import { getThumbnail } from './utils'
import styles from './styles'
import Thumbnail from './Thumbnail'

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
  disableUpload,
  buttonOnly = false,
  attachments = [],
  filterTypes = [],
  allowedMultiple = true,
  simple = false,
  local = false,
  attachmentType = '',
  fieldName,
  thumbnailSize = {
    height: 64,
    width: 64,
  },
  renderBody = undefined,
  maxFilesAllowUpload,
  restrictFileTypes = [],
  fileCategory,
  withDropDown,
  handleSelectedAttachmentType,
  hideRemarks = false,
}) => {
  const [
    showPopper,
    setShowPopper,
  ] = useState(false)
  let popperRef = useRef(null)

  const type = corAttchementTypes.find((o) => o.type === attachmentType) || {}

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

  const stopUploading = (reason) => {
    setErrorText(reason)
    setUploading(false)
    dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
  }

  const mapToFileDto = async (file) => {
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const fileStatusFK = FILE_STATUS.UPLOADED
    const fileExtension = getFileExtension(file.name).toLowerCase()
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
      fileCategoryFK: fileCategory || FILE_CATEGORY.VISITREG,
      content: base64,
      thumbnail: _thumbnailDto,
      fileExtension,
      fileStatusFK,
      attachmentType,
      attachmentTypeFK: type.id,
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

      const currentFilesLength = filesArray.length + attachments.length

      if (maxFilesAllowUpload && currentFilesLength > maxFilesAllowUpload) {
        stopUploading(`Cannot upload more than ${maxFilesAllowUpload} files`)
        return
      }

      if (restrictFileTypes.length > 0) {
        const invalidFileExist = filesArray.some(
          (file) => !restrictFileTypes.includes(file.type),
        )

        if (invalidFileExist) {
          stopUploading(
            `Only the file types (${restrictFileTypes.toString()}) are allowed`,
          )
          return
        }
      }

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
        stopUploading('Cannot upload more than 30MB')
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

  const handlePopper = () => {
    setShowPopper(!showPopper)
  }

  const onDropDownClick = (selectedAttachmentType) => {
    handleSelectedAttachmentType(selectedAttachmentType)
    onUploadClick()
  }

  let UploadButton = (
    <Fragment>
      {withDropDown ? (
        <Fragment>
          <Button
            color='rose'
            size='sm'
            onClick={handlePopper}
            disabled={isReadOnly || uploading || global.disableSave}
            className={fileAttachments.length >= 1 ? classes.uploadBtn : ''}
            buttonRef={(node) => {
              popperRef = node
            }}
          >
            <AttachFile /> Upload
          </Button>
          <Popper
            open={showPopper}
            anchorEl={popperRef}
            transition
            disablePortal
            placement='bottom-end'
            style={{
              zIndex: 999,
              marginTop: 65,
              marginLeft: 8,
              fontSize: '1em',
            }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id='menu-list'
                style={{ transformOrigin: '0 0 -30' }}
              >
                <Paper className={classes.dropdown}>
                  <ClickAwayListener onClickAway={handlePopper}>
                    <MenuList role='menu'>
                      <MenuItem
                        onClick={() =>
                          onDropDownClick(ATTACHMENT_TYPE.CLINICALNOTES)}
                      >
                        Consultation Attachment
                      </MenuItem>
                      <Authorized authority='queue.consultation.widgets.eyevisualacuity'>
                        <MenuItem
                          onClick={() =>
                            onDropDownClick(ATTACHMENT_TYPE.EYEVISUALACUITY)}
                        >
                          Visual Acuity Test
                        </MenuItem>
                      </Authorized>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Fragment>
      ) : (
        <Button
          color='rose'
          size='sm'
          onClick={onUploadClick}
          disabled={isReadOnly || uploading || global.disableSave}
          className={fileAttachments.length >= 1 ? classes.uploadBtn : ''}
        >
          <AttachFile /> Upload
        </Button>
      )}
    </Fragment>
  )

  if (!allowedMultiple && fileAttachments.length >= 1) UploadButton = null

  const commonProps = {
    dispatch,
    isReadOnly,
    simple,
    size: thumbnailSize,
    onConfirmDelete: onDelete,
    onClickAttachment: onClick,
    noBorder: simple && !allowedMultiple,
    fieldName,
    hideRemarks,
  }

  let Body =
    fileAttachments.length > 0 ? (
      <CardContainer hideHeader styles={cardStyles}>
        <GridContainer>
          {fileAttachments.map((attachment, index) => {
            let indexInAllAttachments = attachments.findIndex(
              (item) => item.id === attachment.id,
            )
            if (attachment.fileIndexFK)
              indexInAllAttachments = attachments.findIndex(
                (item) => item.fileIndexFK === attachment.fileIndexFK,
              )
            return (
              <Thumbnail
                index={index}
                indexInAllAttachments={indexInAllAttachments}
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
      {!isReadOnly && UploadButton}
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
