import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
// common components
import { Button, GridContainer, GridItem, Tooltip } from '@/components'
import { DeleteWithPopover } from '@/components/_medisys'
import dummyThumbnail from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'
import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'

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
    textAlign: 'center',
    width: 110,
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

const imageFileExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
]

const pdfFileExtensions = [
  '.pdf',
]

const Thumbnail = ({
  classes,
  isReadOnly = false,
  simple,
  attachment,
  onConfirmDelete,
  onClickAttachment,
  size = { width: 65, height: 65 },
}) => {
  const {
    fileIndexFK,
    fileName,
    fileExtension,
    id,
    content = dummyThumbnail,
    isbase64 = false,
  } = attachment

  const handleConfirmDelete = () => {
    onConfirmDelete(fileIndexFK, id)
  }

  const handleAttachmentClicked = () => onClickAttachment(attachment)

  let src = content
  if (imageFileExtensions.includes(fileExtension))
    if (isbase64) src = `data:image/png;base64,${content}`

  if (pdfFileExtensions.includes(fileExtension)) src = pdfIcon

  if (simple) {
    return (
      <div className={classes.simpleRoot}>
        <Tooltip title={fileName}>
          <div
            className={classes.imageContainer}
            onClick={handleAttachmentClicked}
          >
            <img src={src} alt='test' width={size.width} height={size.height} />
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
        <GridItem md={12}>
          <div
            className={classes.imageContainer}
            onClick={handleAttachmentClicked}
          >
            <img src={src} alt='test' width={size.width} height={size.height} />
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'Thumbnail' })(Thumbnail)
