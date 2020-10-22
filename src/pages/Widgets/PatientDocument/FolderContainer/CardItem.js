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
import SetFolderWithPopover from './SetFolderWithPopover'

const base64Prefix = 'data:image/png;base64,'
const wordExt = [
  'DOC',
  'DOCX',
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

class CardItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      imageData: undefined,
      isEditMode: false,
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
          selectedFileId,
        })
      }
    })
  }

  render () {
    const {
      file,
      folderList,
      onFileUpdated,
      onAddNewFolders,
      dispatch,
      onPreview,
      onEditFileName,
      patient: { entity },
    } = this.props
    const { loading, imageData } = this.state
    const patientIsActive = entity && entity.isActive

    return (
      <LoadingWrapper loading={loading}>
        <GridContainer>
          <GridItem md={8}>
            <TextField
              value={moment(file.createDate).format(dateFormatLong)}
              text
            />
          </GridItem>
          <GridItem md={4} align='Right' style={{ padding: 0 }}>
            <div>
              <Button
                color='primary'
                justIcon
                onClick={() => {
                  onEditFileName(file)
                }}
              >
                <Edit />
              </Button>
              <Popconfirm
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
                    disabled={!patientIsActive}
                    color='danger'
                    justIcon
                  >
                    <Delete />
                  </Button>
                </Tooltip>
              </Popconfirm>
            </div>
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
                  <span>{file.fileName}</span>
                </NavLink>
              </p>
            </Tooltip>
          </GridItem>
          <GridItem md={12}>
            <GridContainer>
              <GridItem md={3} align='left'>
                <div
                  onClick={() => {
                    onPreview(file)
                  }}
                >
                  <img
                    width={40}
                    height={40}
                    src={imageData}
                    alt={file.fileName}
                  />
                </div>
              </GridItem>
              <GridItem md={9}>
                <div>
                  <div>{file.createByUserName}</div>
                  <div>
                    Folder as:
                    <SetFolderWithPopover
                      justIcon
                      key={file.id}
                      folderList={folderList}
                      selectedFolderFKs={file.folderFKs || []}
                      onClose={(selectedFolder) => {
                        const originalFolders = _.sortedUniq(
                          file.folderFKs || [],
                        )
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
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem md={12} style={{ overflow: 'auto', height: 65 }}>
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
    )
  }
}

export default CardItem
