import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, notification } from '@/components'

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  width: '100%',
  height: 150,
  padding: 4,
  boxSizing: 'border-box',
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
}

const img = {
  // display: 'block',
  // width: 'auto',
  // height: '100%',
  // borderRadius: 4 /* Rounded border */,
  // padding: 5 /* Some padding */,
  // width: 150 /* Set a small width */,

  width: '100%',
  height: 150,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
}

const container = {
  backgroundColor: '#FAFAFA',
  borderStyle: 'dashed',
  marginTop: 10,
  borderWidth: 3,
  borderColor: '#EEEEEE',
  borderRadius: 10,
}

const description = {
  display: 'block',
  textAlign: 'center',
  lineHeight: 3,
}

const BrowseImage = (props) => {
  const { title } = props

  const [
    files,
    setFiles,
  ] = useState([])

  const [
    headBase64,
    setHeadBase64,
  ] = useState()

  const encodeImageFileAsURL = (element) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      // console.log('RESULT', reader.result)
      setHeadBase64(reader.result)
    }
    reader.readAsDataURL(element)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return notification.error({ message: 'Please select a image file' })
      }

      if (acceptedFiles.length > 1) {
        return notification.error({ message: 'Please select 1 image only' })
      }

      // over 2 MB
      if (acceptedFiles[0].size > 2097152) {
        return notification.error({ message: 'Maximum image upload of 2MB' })
      }

      return setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            base64: encodeImageFileAsURL(file),
          }),
        ),
      )
    },
  })

  const thumbs = files.map((file) => {
    return (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} style={img} alt={file.name} />
        </div>
      </div>
    )
  })

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [
      files,
    ],
  )

  const removeAll = () => {
    setFiles([])
  }

  return (
    <section style={container}>
      <div
        style={{ cursor: 'pointer' }}
        {...getRootProps({ className: 'dropzone' })}
      >
        <input {...getInputProps()} />
        <p style={description}>
          Drag 'n' drop the image here, or click to select image for
          <b> {title}</b>
        </p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
      {files.length > 0 && (
        <Button color='danger' style={{ width: '100%' }} onClick={removeAll}>
          Remove
        </Button>
      )}
    </section>
  )
}

export default BrowseImage
