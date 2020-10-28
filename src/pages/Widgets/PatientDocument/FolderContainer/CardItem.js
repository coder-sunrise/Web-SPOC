import React, { Component, useState, useEffect } from 'react'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'

import { NavLink } from 'react-router-dom'
// material ui
import { withStyles, Chip } from '@material-ui/core'
import {
  Delete,
  CreateNewFolder,
  BorderColor,
  Edit,
  Save,
  HighlightOff,
} from '@material-ui/icons'

import {
  FastField,
  CommonModal,
  Button,
  IconButton,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tabs,
  CardContainer,
  Popover,
  Tooltip,
  dateFormatLong,
  Popconfirm,
} from '@/components'
import { LoadingWrapper } from 'medisys-components'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'
import wordIcon from '@/assets/thumbnail-icons/word-icon.png'
import excelIcon from '@/assets/thumbnail-icons/excel-icon.png'
import dummyIcon from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'
import pptIcon from '@/assets/thumbnail-icons/ppt-icon.png'
import SetFolderWithPopover from './SetFolderWithPopover'

const base64Prefix = 'data:image/png;base64,'
const wordExt = [
  'DOC',
  'DOCX',
]
const pptExt = [
  'PPT',
  'PPTX',
]
const excelExt = [
  'XLS',
  'XLSX',
]
const imageExt = [
  'JPG',
  'JPEG',
  'PNG',
  'BMP',
  'GIF',
]
const styles = () => ({
  Toolbar: {
    display: 'none',
  },
  CardContainer: {
    '&:hover': {
      '& $Toolbar': {
        display: 'block',
      },
    },
  },
})

class CardItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      imageData: undefined,
    }
  }

  componentDidMount = () => {
    this.refreshImage(this.props)
  }

  refreshImage = (props) => {
    const { file: { fileExtension, fileIndexFK } } = props

    if (imageExt.includes(fileExtension.toUpperCase())) {
      this.fetchImage(fileIndexFK)
    } else if (wordExt.includes(fileExtension.toUpperCase())) {
      this.setState({ imageData: wordIcon })
    } else if (excelExt.includes(fileExtension.toUpperCase())) {
      this.setState({ imageData: excelIcon })
    } else if (fileExtension.toUpperCase() === 'PDF') {
      this.setState({ imageData: pdfIcon })
    } else if (pptExt.includes(fileExtension.toUpperCase())) {
      this.setState({ imageData: pptIcon })
    } else {
      this.setState({ imageData: dummyIcon })
    }
  }

  fetchImage = (selectedFileId) => {
    this.setState({ loading: true })

    getFileByFileID(selectedFileId).then((response) => {
      if (response) {
        const contentInBase64 =
          base64Prefix + arrayBufferToBase64(response.data)
        this.setState({
          loading: false,
          imageData: contentInBase64,
        })
      }
    })
  }

  render () {
    const {
      classes,
      file,
      folderList,
      onFileUpdated,
      onAddNewFolders,
      dispatch,
      onPreview,
      onEditFileName,
      readOnly,
      width,
      height,
    } = this.props
    const { loading, imageData } = this.state

    return (
      <div className={classes.CardContainer}>
        <LoadingWrapper loading={loading}>
          <GridContainer>
            <GridItem md={6}>
              <span style={{ fontWeight: 600 }}>
                {moment(file.createDate).format(dateFormatLong)}
              </span>
            </GridItem>
            <GridItem md={6} align='Right' style={{ padding: 0, height: 25 }}>
              <div className={classes.Toolbar}>
                <Button
                  color='primary'
                  justIcon
                  disabled={readOnly}
                  onClick={() => {
                    onEditFileName(file)
                  }}
                >
                  <Edit />
                </Button>
                <SetFolderWithPopover
                  key={file.id}
                  folderList={folderList}
                  selectedFolderFKs={file.folderFKs || []}
                  onClose={(selectedFolder) => {
                    const originalFolders = _.sortedUniq(file.folderFKs || [])
                    const newFolders = _.sortedUniq(selectedFolder)

                    if (
                      originalFolders.length !== newFolders.length ||
                      originalFolders.join(',') !== newFolders.join(',')
                    ) {
                      onFileUpdated({
                        ...file,
                        folderFKs: newFolders,
                      })
                    }
                  }}
                  onAddNewFolders={onAddNewFolders}
                />
                <Popconfirm
                  title='Permanently delete this file in all folders?'
                  onConfirm={() => {
                    dispatch({
                      type: 'patientAttachment/removeRow',
                      payload: {
                        id: file.id,
                      },
                    }).then(() => {
                      dispatch({
                        type: 'patientAttachment/query',
                      })
                    })
                  }}
                >
                  <Tooltip title='Delete'>
                    <Button
                      size='sm'
                      color='danger'
                      justIcon
                      disabled={readOnly}
                    >
                      <Delete />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </div>
            </GridItem>
            <GridItem md={12}>
              <Tooltip title={`Created by: ${file.createByUserName}`}>
                <div
                  style={{ textAlign: 'center', marginTop: 5 }}
                  onClick={() => {
                    onPreview(file)
                  }}
                >
                  {imageData && (
                    <img
                      width={width - 80}
                      height={height - 110}
                      src={imageData}
                      alt={file.fileName}
                    />
                  )}
                </div>
              </Tooltip>
            </GridItem>
            <GridItem md={12} style={{ marginTop: 5 }}>
              <Tooltip title={file.fileName}>
                <p
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                  }}
                >
                  <NavLink
                    to={window.location.search}
                    onClick={() => onPreview(file)}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {file.fileName}
                    </span>
                  </NavLink>
                </p>
              </Tooltip>
            </GridItem>
            <GridItem md={12} style={{ overflow: 'auto', height: 29 }}>
              {folderList
                .filter((f) => file.folderFKs.includes(f.id))
                .map((item) => (
                  <Chip
                    style={{ marginBottom: 5, marginRight: 5 }}
                    key={item.id}
                    size='small'
                    variant='outlined'
                    label={item.displayValue}
                    color='primary'
                  />
                ))}
            </GridItem>
          </GridContainer>
        </LoadingWrapper>
      </div>
    )
  }
}

export default withStyles(styles)(CardItem)
