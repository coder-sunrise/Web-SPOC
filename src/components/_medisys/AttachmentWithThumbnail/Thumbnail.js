import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  OutlinedTextField,
  SizeContainer,
  TextField,
  Tooltip,
} from '@/components'
import { DeleteWithPopover, LoadingWrapper } from '@/components/_medisys'
// utils
import {
  pdfFileExtensions,
  excelFileExtensions,
  wordFileExtensions,
} from './utils'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
// services
import { getFileByFileID } from '@/services/file'
// assets
import dummyThumbnail from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'
import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'
import wordIcon from '@/assets/thumbnail-icons/word-icon.png'
import excelIcon from '@/assets/thumbnail-icons/excel-icon.png'

const styles = (theme) => ({
  simpleRoot: {
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 64,
    // margin: 8,
    '& button': {
      marginRight: 0,
      padding: '0px !important',
    },
    '&:hover': {
      '& img': {
        opacity: 0.4,
        background: 'darkgrey',
      },
    },
  },
  root: {
    display: 'inline-block',
    textAlign: 'left',
    width: 140,
    margin: 8,
  },
  filenameContainer: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
      cursor: 'pointer',
    },
  },
  imageBorder: {
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  imageSpacing: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  simpleButtonGroup: {
    position: 'absolute',
    top: 0,
    // left: '24px',
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(1),
    opacity: 0,
    '&:hover': {
      opacity: 1,
      '-webkit-animation': 'fadeInFromNone 0.5s ease-out',
      animation: 'fadeInFromNone 0.5s ease-out',
    },
    '& button': {
      margin: 4,
      padding: '0px !important',
    },
  },
})

const Thumbnail = ({
  classes,
  index,
  isReadOnly = false,
  simple,
  attachment,
  onConfirmDelete,
  onClickAttachment,
  noBorder,
  fieldName = 'visitAttachment',
  size = { width: 64, height: 64 },
}) => {
  const {
    fileIndexFK,
    fileName,
    fileExtension,
    id,
    thumbnailIndexFK,
    thumbnail = { id: undefined },
  } = attachment

  const [
    imgSrc,
    setImgSrc,
  ] = useState(dummyThumbnail)

  const [
    loadingThumbnail,
    setLoadingThumbnail,
  ] = useState(true)

  const doFetch = async () => {
    try {
      let src
      const thumbnailId = thumbnailIndexFK || thumbnail.id

      if (thumbnailId) {
        const response = await getFileByFileID(thumbnailId)
        if (response && response.status === 200) {
          const { data } = response
          const thumbnailDataInBase64 = arrayBufferToBase64(data)
          const base64Prefix = 'data:image/png;base64,'
          src = `${base64Prefix}${thumbnailDataInBase64}`
        }
      } else {
        if (pdfFileExtensions.includes(fileExtension)) src = pdfIcon
        if (wordFileExtensions.includes(fileExtension)) src = wordIcon
        if (excelFileExtensions.includes(fileExtension)) src = excelIcon
      }
      setImgSrc(src)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingThumbnail(false)
    }
  }

  const getThumbnail = () => {
    doFetch()
  }

  useEffect(getThumbnail, [
    attachment,
  ])

  const handleConfirmDelete = () => {
    onConfirmDelete(fileIndexFK, id)
  }

  const handleAttachmentClicked = () => onClickAttachment(attachment)

  const simpleThumbnailClass = classnames({
    [classes.simpleRoot]: true,
    [classes.imageBorder]: !noBorder,
    [classes.imageSpacing]: !noBorder,
  })
  const thumbnailClass = classnames({
    [classes.root]: true,
    [classes.imageBorder]: !noBorder,
    [classes.imageSpacing]: !noBorder,
  })

  if (simple) {
    return (
      <div className={simpleThumbnailClass}>
        <LoadingWrapper loading={loadingThumbnail}>
          <React.Fragment>
            <Tooltip title={fileName}>
              <div
                className={classes.imageContainer}
                onClick={handleAttachmentClicked}
              >
                <img
                  src={imgSrc}
                  alt='test'
                  width={size.width}
                  height={size.height}
                />
              </div>
            </Tooltip>
            <div className={classes.simpleButtonGroup}>
              <Tooltip title='Change'>
                <Button justIcon color='primary' size='sm'>
                  <Edit />
                </Button>
              </Tooltip>
              <Tooltip title='Delete'>
                <Button justIcon color='danger' size='sm'>
                  <Delete />
                </Button>
              </Tooltip>
            </div>
          </React.Fragment>
        </LoadingWrapper>
      </div>
    )
  }

  return (
    <div className={thumbnailClass}>
      <LoadingWrapper loading={loadingThumbnail}>
        <GridContainer>
          <GridItem md={9} className={classes.filenameContainer}>
            <Tooltip title={fileName}>
              <span style={{ fontSize: '0.75rem' }}>{fileName}</span>
            </Tooltip>
          </GridItem>
          <GridItem md={3}>
            <DeleteWithPopover
              disabled={isReadOnly}
              onConfirmDelete={handleConfirmDelete}
            />
          </GridItem>
          <GridItem md={12} style={{ cursor: 'pointer' }}>
            <div
              className={classes.imageContainer}
              onClick={handleAttachmentClicked}
            >
              <img
                src={imgSrc}
                alt={fileName}
                width={size.width}
                height={size.height}
              />
            </div>
          </GridItem>
          <GridItem md={12}>
            <SizeContainer size='sm'>
              <FastField
                name={`${fieldName}[${index}].remark`}
                render={(args) => (
                  <TextField
                    {...args}
                    size='sm'
                    label='Remark'
                    disabled={isReadOnly}
                  />
                )}
              />
            </SizeContainer>
          </GridItem>
        </GridContainer>
      </LoadingWrapper>
    </div>
  )
}

export default withStyles(styles, { name: 'Thumbnail' })(Thumbnail)
