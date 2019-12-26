import React from 'react'
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
  Tooltip,
} from '@/components'
import { DeleteWithPopover } from '@/components/_medisys'
import dummyThumbnail from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'
import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'
import wordIcon from '@/assets/thumbnail-icons/word-icon.png'
import excelIcon from '@/assets/thumbnail-icons/excel-icon.png'
import {
  pdfFileExtensions,
  excelFileExtensions,
  wordFileExtensions,
} from './utils'

const styles = (theme) => ({
  simpleRoot: {
    position: 'relative',
    textAlign: 'center',
    width: 110,
    margin: 8,
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
    top: '16px',
    left: '24px',
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
  size = { width: 64, height: 64 },
}) => {
  const {
    fileIndexFK,
    fileName,
    fileExtension,
    id,
    thumbnailData = dummyThumbnail,
    isbase64 = false,
  } = attachment

  const handleConfirmDelete = () => {
    onConfirmDelete(fileIndexFK, id)
  }

  const handleAttachmentClicked = () => onClickAttachment(attachment)

  let src = thumbnailData
  // if (imageFileExtensions.includes(fileExtension))
  //   if (isbase64) src = thumbnailData

  if (pdfFileExtensions.includes(fileExtension)) src = pdfIcon
  if (wordFileExtensions.includes(fileExtension)) src = wordIcon
  if (excelFileExtensions.includes(fileExtension)) src = excelIcon

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
        <Tooltip title={fileName}>
          <div
            className={classes.imageContainer}
            onClick={handleAttachmentClicked}
          >
            <img src={src} alt='test' width={size.width} height={size.height} />
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
      </div>
    )
  }

  return (
    <div className={thumbnailClass}>
      <GridContainer>
        <GridItem md={9} className={classes.filenameContainer}>
          <Tooltip title={fileName}>
            <span>{fileName}</span>
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
            <img src={src} alt='test' width={size.width} height={size.height} />
          </div>
        </GridItem>
        <GridItem md={12}>
          <SizeContainer size='sm'>
            <FastField
              name={`visitAttachment[${index}].remark`}
              render={(args) => (
                <OutlinedTextField {...args} size='sm' label='Remark' />
              )}
            />
          </SizeContainer>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'Thumbnail' })(Thumbnail)
