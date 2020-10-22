import React, { useState } from 'react'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  CommonModal,
} from '@/components'
import printJS from 'print-js'
import moment from 'moment'
import _ from 'lodash'
import {
  downloadAttachment,
  getFileByFileID,
  getPDFFile,
} from '@/services/file'
import {
  arrayBufferToBase64,
  BASE64_MARKER,
} from '@/components/_medisys/ReportViewer/utils'

import Grid from './Grid'
import CardView from './CardView'
import ImagePreviewer from './ImagePreviewer'
import TextEditor from '../TextEditor'

const FolderContainer = ({ viewMode, attachmentList, ...restProps }) => {
  const [
    showImagePreview,
    setShowImagePreview,
  ] = useState(false)
  const [
    selectedFileId,
    setSelectedFileId,
  ] = useState(undefined)

  const [
    editingFile,
    setEditingFile,
  ] = useState({})

  const imageExt = [
    'JPG',
    'JPEG',
    'PNG',
    'BMP',
    'GIF',
  ]

  const refreshFolders = () => {
    restProps.dispatch({
      type: 'folder/query',
      payload: {
        pagesize: 999,
        sorting: [
          { columnName: 'sortOrder', direction: 'asc' },
        ],
      },
    })
  }

  const onAddNewFolders = (name) => {
    const { folderList = [], dispatch } = restProps
    dispatch({
      type: 'folder/upsert',
      payload: {
        code: name,
        displayValue: name,
        description: name,
        sortOrder: (_.maxBy(folderList, 'sortOrder').sortOrder || 0) + 1,
        effectiveStartDate: moment().formatUTC(true),
        effectiveEndDate: moment('2099-12-31').formatUTC(true),
      },
    }).then(refreshFolders)
  }

  const onPreview = (file) => {
    const fileExtension = (file.fileExtension || '').toUpperCase()

    if (fileExtension === 'PDF') {
      getFileByFileID(file.fileIndexFK).then((response) => {
        const { data } = response
        const base64Result = arrayBufferToBase64(data)
        printJS({ printable: base64Result, type: 'pdf', base64: true })
      })
    } else if (imageExt.includes(fileExtension)) {
      setShowImagePreview(true)
      setSelectedFileId(file.fileIndexFK)
    }
  }

  const onFileUpdated = (file) => {
    const patientAttachment_Folder = file.folderFKs.map((f) => {
      return { folderFK: f, patientAttachmentFK: file.id }
    })
    const payload = {
      ...file,
      patientAttachment_Folder,
    }

    restProps
      .dispatch({
        type: 'patientAttachment/upsert',
        payload,
      })
      .then(() => {
        restProps.dispatch({
          type: 'patientAttachment/query',
        })
      })
  }
  const onEditFileName = (file) => {
    setEditingFile({ ...file, showNameEditor: true })
  }
  const cfg = {
    attachmentList,
    onAddNewFolders,
    onEditFileName,
    onFileUpdated,
    onPreview,
  }
  return (
    <React.Fragment>
      {viewMode === 'card' ? (
        <CardView {...restProps} {...cfg} />
      ) : (
        <Grid {...restProps} {...cfg} />
      )}
      <CommonModal
        open={showImagePreview}
        title='Patient Document Preview'
        fullScreen
        onClose={() => setShowImagePreview(false)}
      >
        <ImagePreviewer
          {...restProps}
          defaultFileFK={selectedFileId}
          files={attachmentList.filter((f) =>
            imageExt.includes(f.fileExtension.toUpperCase()),
          )}
          onAddNewFolders={onAddNewFolders}
          onFileUpdated={onFileUpdated}
        />
      </CommonModal>
      {editingFile && (
        <CommonModal
          open={editingFile.showNameEditor}
          title='Change File Name'
          maxWidth='sm'
          onClose={() => {
            setEditingFile(undefined)
          }}
        >
          <TextEditor
            item={{ label: 'File Name', value: editingFile.fileName }}
            handleSubmit={(name) => {
              onFileUpdated({ ...editingFile, fileName: name })
              setEditingFile(undefined)
            }}
          />
        </CommonModal>
      )}
    </React.Fragment>
  )
}

export default FolderContainer
