import React, { useRef } from 'react'
import classnames from 'classnames'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
import { Chip, withStyles } from '@material-ui/core'
// custom components
import { Button, CommonCard, GridContainer, GridItem } from '@/components'
import { getUniqueGUID } from '@/utils/cdrss'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  attachmentLabel: {
    fontSize: '0.9rem',
    fontWeight: 300,
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

const withAttachment = ({
  classes,
  children,
  handleUpdateAttachments,
  attachmentType = '',
  attachments = [],
  title = '',
}) => {
  const fileAttachments = attachments.filter(
    (attachment) =>
      attachment.attachmentType === attachmentType && !attachment.isDeleted,
  )

  const inputEl = useRef(null)

  const mapFileToUploadObject = async (file) => {
    const base64 = await convertToBase64(file)
    return {
      _tempID: getUniqueGUID(),
      fileName: file.name,
      fileSize: file.size,
      fileExtension: getFileExtension(file.name),
      fileCategoryFK: 1,
      content: base64,
      isConfirmed: false,
      attachmentType,
    }
  }

  const onUploadClick = () => {
    inputEl.current.click()
    // this.refs.visitAttachment && this.refs.visitAttachment.click()
  }

  const onFileChange = async (event) => {
    try {
      const { files } = event.target
      const selectedFiles = await Promise.all(
        Object.keys(files).map((key) => mapFileToUploadObject(files[key])),
      )

      handleUpdateAttachments({
        added: selectedFiles,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  const onDelete = (id) => {
    handleUpdateAttachments({
      deleted: id,
    })
  }

  return (
    <CommonCard size='sm' title={title}>
      <GridContainer>
        {children}
        <GridItem className={classes.verticalSpacing}>
          <span className={classes.attachmentLabel}>Attachment:</span>
        </GridItem>
        <GridItem md={10} className={classes.verticalSpacing}>
          <div>
            {fileAttachments.map((attachment, index) => (
              <Chip
                key={`${attachment.fileName}-${index}`}
                size='small'
                variant='outlined'
                label={attachment.fileName}
                color={attachment.id ? 'primary' : ''}
                onClick={(event) => {
                  console.log({ target: event.currentTarget })
                }}
                onDelete={() =>
                  onDelete(attachment.id ? attachment.id : attachment._tempID)}
                className={classes.chip}
              />
              // <span
              //   key={`${attachment.fileName}-${index}`}
              //   className={classnames({
              //     [classes.attachmentItem]: true,
              //     [classes.attachmentLabel]: true,
              //     [classes.notUploaded]: attachment.id === undefined,
              //   })}
              // >
              //   <a></a>
              // </span>
            ))}
          </div>
        </GridItem>
        <GridItem>
          <input
            style={{ display: 'none' }}
            type='file'
            id='uploadVisitAttachment'
            ref={inputEl}
            multiple='multiple'
            onChange={onFileChange}
          />
          <Button color='rose' size='sm' onClick={onUploadClick}>
            <AttachFile />
            Upload
          </Button>
        </GridItem>
      </GridContainer>
    </CommonCard>
  )
  // return <div>{children}</div>
}

export default withStyles(styles, { name: 'withAttachmentForm' })(
  withAttachment,
)
