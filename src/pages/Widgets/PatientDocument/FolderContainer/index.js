import React, { useState } from 'react'
import { CommonModal } from '@/components'
import printJS from 'print-js'
import { getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

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

  const [
    cachedImageDatas,
    setCachedImageDatas,
  ] = useState([])

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

  const onAddNewFolders = (newFolder) => {
    const { dispatch } = restProps
    dispatch({
      type: 'folder/upsert',
      payload: newFolder,
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
      displayValue: file.fileName,
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
  const onImageLoaded = (fileIndexFK, imageData) => {
    const cached = cachedImageDatas.find((f) => f.fileIndexFK === fileIndexFK)
    if (cached) {
      cached.imageData = imageData
    } else {
      setCachedImageDatas([
        ...cachedImageDatas,
        { fileIndexFK, imageData },
      ])
    }
  }
  const cfg = {
    attachmentList: attachmentList.map((a) => {
      const cached =
        cachedImageDatas.find((f) => f.fileIndexFK === a.fileIndexFK) || {}
      return { ...a, imageData: cached.imageData }
    }),
    onAddNewFolders,
    onEditFileName,
    onFileUpdated,
    onPreview,
    onImageLoaded,
  }
  return (
    <React.Fragment>
      <div style={{ height: window.innerHeight - 160, overflow: 'scroll' }}>
        {viewMode === 'card' ? (
          <CardView key='cardview' {...restProps} {...cfg} />
        ) : (
          <Grid key='gridview' {...restProps} {...cfg} />
        )}
      </div>
      <CommonModal
        open={showImagePreview}
        title='Patient Document Preview'
        fullScreen
        onClose={() => setShowImagePreview(false)}
      >
        <ImagePreviewer
          {...restProps}
          defaultFileFK={selectedFileId}
          files={cfg.attachmentList.filter((f) =>
            imageExt.includes(f.fileExtension.toUpperCase()),
          )}
          onAddNewFolders={onAddNewFolders}
          onFileUpdated={onFileUpdated}
          onImageLoaded={cfg.onImageLoaded}
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