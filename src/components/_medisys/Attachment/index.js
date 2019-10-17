import React, { useState, useEffect, useRef } from 'react'
import classnames from 'classnames'
// import fetch from 'dva/fetch'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { CircularProgress, Chip, withStyles } from '@material-ui/core'
// custom components
import { Button, Danger, GridContainer, GridItem } from '@/components'
// services
import {
  uploadFile,
  downloadAttachment,
  deleteFileByFileID,
} from '@/services/file'
// utils
import { getCodes } from '@/utils/codes'

const styles = (theme) => ({
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

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = (error) => reject(error)
  })

const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

const Attachment = ({
  classes,
  handleUpdateAttachments,
  attachmentType = '',
  attachments = [],
  isReadOnly,
  label = 'Attachment:',
}) => {
  const [
    uploading,
    setUploading,
  ] = useState(false)
  const [
    fileStatusList,
    setFileStatusList,
  ] = useState([])

  const [
    errorText,
    setErrorText,
  ] = useState('')

  useEffect(() => {
    getCodes('ltfilestatus').then((response) => {
      setFileStatusList([
        ...response,
      ])
    })
  }, [])

  const fileAttachments = attachments.filter(
    (attachment) =>
      attachment.attachmentType === attachmentType && !attachment.isDeleted,
  )

  const inputEl = useRef(null)

  const mapFileToUploadObject = async (file) => {
    // file type and file size validation
    const base64 = await convertToBase64(file)
    const fileStatusFK = fileStatusList.find(
      (item) => item.code.toUpperCase() === 'UPLOADED',
    )

    const uploadObject = {
      fileName: file.name,
      fileSize: file.size,
      fileExtension: getFileExtension(file.name),
      fileCategoryFK: 1,
      content: base64,
      // isConfirmed: false,
      fileStatusFK: fileStatusFK.id,
      attachmentType,
    }
    const uploaded = await uploadFile(uploadObject)

    return { ...uploaded, attachmentType }
  }

  const onUploadClick = () => {
    setErrorText('')
    inputEl.current.click()
  }

  const validateFileSize = (files) => {
    const maxMB = 5242880
    const skippedFiles = Object.keys(files).reduce(
      (skipped, key) =>
        files[key].size > maxMB
          ? [
              ...skipped,
              files[key].name,
            ]
          : [
              ...skipped,
            ],
      [],
    )
    if (skippedFiles.length === 0) return []

    const errTxt = `Skipped ${skippedFiles.join(
      ', ',
    )}. Reason: File(s) is larger than 5mb`
    setErrorText(errTxt)

    return skippedFiles
  }

  const onFileChange = async (event) => {
    try {
      setUploading(true)
      const { files } = event.target
      const numberOfNewFiles = Object.keys(files).length
      if (numberOfNewFiles + attachments.length > 5) {
        setErrorText('Cannot upload more than 5 attachments')
        setUploading(false)
        return
      }
      const skipped = validateFileSize(files)

      const selectedFiles = await Promise.all(
        Object.keys(files)
          .filter((key) => !skipped.includes(files[key].name))
          .map((key) => mapFileToUploadObject(files[key])),
      )
      setUploading(false)
      handleUpdateAttachments({
        added: selectedFiles,
      })
    } catch (error) {
      console.log({ error })
    }
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
    console.log("********* ", attachment)
    downloadAttachment(attachment)
  }
  const labelClass = classnames({
    [classes.verticalSpacing]: true,
    [classes.noPadding]: true,
  })
  return (
    <GridContainer>
      {label && (
        <GridItem className={labelClass}>
          <span className={classes.attachmentLabel}>{label}</span>
          {uploading && <CircularProgress />}
        </GridItem>
      )}
      <GridItem md={10} className={classes.verticalSpacing}>
        <div>
          {fileAttachments.map((attachment) => (
            <Chip
              key={attachment.id}
              size='small'
              variant='outlined'
              label={attachment.fileName}
              color={attachment.id ? 'primary' : ''}
              onClick={() => onClick(attachment)}
              onDelete={
                !isReadOnly ? (
                  () => onDelete(attachment.fileIndexFK, attachment.id)
                ) : null
              }
              className={classes.chip}
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
          ref={inputEl}
          multiple='multiple'
          onChange={onFileChange}
        />
        {!isReadOnly && (
          <Button
            color='rose'
            size='sm'
            onClick={onUploadClick}
            disabled={uploading || fileAttachments.length >= 5}
          >
            <AttachFile />
            Upload
          </Button>
        )}
      </GridItem>
      <GridItem>
        <Danger>
          <span>{errorText}</span>
        </Danger>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'Attachment' })(Attachment)
