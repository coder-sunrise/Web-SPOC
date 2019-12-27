import React from 'react'
// formik
import { FastField } from 'formik'
import classnames from 'classnames'

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
    textAlign: 'center',
    width: 110,
    margin: 8,
    '& button': {
      marginRight: 0,
      padding: '0px !important',
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
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '4px',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
      cursor: 'pointer',
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
  containerClass,
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

  if (simple) {
    return (
      <div
        className={classnames({
          [classes.simpleRoot]: true,
        })}
      >
        <Tooltip title={fileName}>
          <div
            className={classes.imageContainer}
            onClick={handleAttachmentClicked}
          >
            <img
              src={src}
              alt='Attachment'
              width={size.width}
              height={size.height}
            />
          </div>
        </Tooltip>
        <Tooltip title='Change'>
          <Button simple justIcon color='primary' size='sm'>
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title='Delete'>
          <Button simple justIcon color='danger' size='sm'>
            <Delete />
          </Button>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className={classes.root}>
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
