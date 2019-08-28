import React, { useState, useEffect, useRef } from 'react'
// import fetch from 'dva/fetch'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { CircularProgress, Chip, withStyles } from '@material-ui/core'
// custom components
import {
  Button,
  CommonCard,
  Danger,
  GridContainer,
  GridItem,
} from '@/components'
// services
import {
  uploadFile,
  downloadAttachment,
  deleteFileByFileID,
} from '@/services/file'
// utils
import { getCodes } from '@/utils/codes'

const styles = (theme) => ({
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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

const AttachmentWrapper = ({
  classes,
  children,
  handleUpdateAttachments,
  attachmentType = '',
  attachments = [],
  title = '',
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
    downloadAttachment(attachment)
  }

  return (
    <CommonCard size='sm' title={title}>
      <GridContainer alignItems='center'>
        {children}
        <GridItem className={classes.verticalSpacing}>
          <span className={classes.attachmentLabel}>Attachment:</span>
          {uploading && <CircularProgress />}
        </GridItem>
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
                onDelete={() => onDelete(attachment.fileIndexFK, attachment.id)}
                className={classes.chip}
              />
            ))}
          </div>
        </GridItem>
        <GridItem>
          <input
            style={{ display: 'none' }}
            type='file'
            accept={allowedFiles}
            id='uploadVisitAttachment'
            ref={inputEl}
            multiple='multiple'
            onChange={onFileChange}
          />
          <Button
            color='rose'
            size='sm'
            onClick={onUploadClick}
            disabled={uploading || attachments.length >= 5}
          >
            <AttachFile />
            Upload
          </Button>
        </GridItem>
        <GridItem>
          <Danger>
            <span>{errorText}</span>
          </Danger>
        </GridItem>
      </GridContainer>
    </CommonCard>
  )
  // return <div>{children}</div>
}

export default withStyles(styles, { name: 'withAttachmentForm' })(
  AttachmentWrapper,
)
