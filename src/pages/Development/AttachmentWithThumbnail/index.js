import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'dva'
// material ui
import Delete from '@material-ui/icons/Delete'
import PdfIcon from '@material-ui/icons/PictureAsPdf'
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
// sub components
import { getImagePreview, uploadFile } from '@/services/file'
import { convertToBase64 } from '@/utils/utils'
import { FILE_STATUS } from '@/utils/constants'
import image from '@/assets/img/bg-pricing.jpeg'

const styles = (theme) => ({
  imageContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
})

const allowedFiles = '.png, .jpg, .jpeg, .xls, .xlsx, .doc, .docx, .pdf'

const getFileExtension = (filename) => {
  return filename.split('.').pop()
}

const AttachmentWithThumbnail = ({
  classes,
  dispatch,
  handleUpdateAttachments,
  attachments = [],
  allowedMultiple = false,
  attachmentType = '',
}) => {
  const inputEl = useRef(null)

  const [
    uploading,
    setUploading,
  ] = useState(false)

  const simple = true
  const [
    imageData,
    setImageData,
  ] = useState(null)

  const getImage = async () => {
    const { data } = await getImagePreview(367)
    const blobUrl = window.URL.createObjectURL(
      new Blob([
        data,
      ]),
    )
    console.log({ blobUrl, data })
    setImageData(blobUrl)
  }

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

    return { ...uploaded, attachmentType }
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
      // attachments.forEach((o) => {
      //   if (!o.isDeleted) {
      //     totalFilesSize += o.fileSize
      //   }
      // })

      // if (totalFilesSize > maxUploadSize) {
      //   setErrorText('Cannot upload more than 30MB')
      //   setUploading(false)
      //   dispatch({
      //     type: 'global/updateState',
      //     payload: {
      //       disableSave: false,
      //     },
      //   })
      //   return
      // }

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
      console.log({ selectedFiles })
      setUploading(false)
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
      // handleUpdateAttachments({
      //   added: selectedFiles,
      // })
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

  return (
    <CardContainer hideHeader>
      <h4>Attachment with thumbnail</h4>
      <CardContainer
        hideHeader
        // size='sm'
        style={{ width: 150, textAlign: 'center' }}
      >
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
        {!imageData && (
          <Button color='rose' size='sm' onClick={onUploadClick}>
            Upload
          </Button>
        )}
        {imageData && (
          <GridContainer justify='center'>
            {!simple && (
              <React.Fragment>
                <GridItem md={9}>
                  <span>Filename.jpg</span>
                </GridItem>
                <GridItem md={3}>
                  <Button justIcon color='danger' style={{ marginRight: 0 }}>
                    <Delete />
                  </Button>
                </GridItem>
              </React.Fragment>
            )}
            <GridItem md={12} style={{ textAlign: 'center' }}>
              <div className={classes.imageContainer}>
                <img src={imageData} alt='test' />
              </div>
            </GridItem>
            <GridItem md={12} style={{ textAlign: 'center' }}>
              <Button
                size='sm'
                color='primary'
                variant='outlined'
                style={{ marginRight: 0 }}
              >
                Change
              </Button>
            </GridItem>
          </GridContainer>
        )}
      </CardContainer>
    </CardContainer>
  )
}

const Connected = connect()(AttachmentWithThumbnail)

export default withStyles(styles)(Connected)
