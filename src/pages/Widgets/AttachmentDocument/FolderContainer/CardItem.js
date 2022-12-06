import React, { Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
// material ui
import { withStyles } from '@material-ui/core'
import { scaleImage } from '@/utils/image'

import {
  GridContainer,
  GridItem,
  Tooltip,
  dateFormatLong,
  Popconfirm,
} from '@/components'
import { Button, Tag } from 'antd'
import { EditFilled, DeleteFilled } from '@ant-design/icons'
import { LoadingWrapper } from 'medisys-components'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'
import wordIcon from '@/assets/thumbnail-icons/word-icon.png'
import excelIcon from '@/assets/thumbnail-icons/excel-icon.png'
import dummyIcon from '@/assets/thumbnail-icons/dummy-thumbnail-icon.png'
import pptIcon from '@/assets/thumbnail-icons/ppt-icon.png'
import { InView } from 'react-intersection-observer'
import SetFolderWithPopover from './SetFolderWithPopover'

const base64Prefix = 'data:image/png;base64,'
const wordExt = ['DOC', 'DOCX']
const pptExt = ['PPT', 'PPTX']
const excelExt = ['XLS', 'XLSX']
const imageExt = ['JPG', 'JPEG', 'PNG', 'BMP', 'GIF']
const styles = () => ({
  // Toolbar: {
  //   display: 'none',
  // },
  // CardContainer: {
  //   '&:hover': {
  //     '& $Toolbar': {
  //       display: 'block',
  //     },
  //   },
  // },
})

class CardItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      thumbnail: undefined,
      originalImageSize: {},
    }
    this.imgRef = React.createRef()
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { width, height } = this.props
    const { width: nextWidth, height: nextHeight } = nextProps

    if (width !== nextWidth || height !== nextHeight) {
      this.resize(nextProps)
    }
  }

  refreshImage = () => {
    const {
      file: { fileExtension, fileIndexFK, thumbnailFK },
      attachmentList = [],
    } = this.props

    const thumbnail = attachmentList.find(
      att => att.fileIndexFK === fileIndexFK,
    )?.thumbnail

    if (imageExt.includes(fileExtension.toUpperCase())) {
      if (!thumbnail) {
        if (!thumbnailFK) {
          this.setState({ thumbnail: dummyIcon })
        } else {
          this.fetchImage(fileIndexFK, thumbnailFK)
        }
      } else this.setState({ thumbnail })
    } else if (wordExt.includes(fileExtension.toUpperCase())) {
      this.setState({ thumbnail: wordIcon })
    } else if (excelExt.includes(fileExtension.toUpperCase())) {
      this.setState({ thumbnail: excelIcon })
    } else if (fileExtension.toUpperCase() === 'PDF') {
      this.setState({ thumbnail: pdfIcon })
    } else if (pptExt.includes(fileExtension.toUpperCase())) {
      this.setState({ thumbnail: pptIcon })
    } else {
      this.setState({ thumbnail: dummyIcon })
    }
  }

  fetchImage = (selectedFileId, selectedThumbnailFK) => {
    this.setState({ loading: true })

    getFileByFileID(selectedThumbnailFK).then(response => {
      if (response) {
        const contentInBase64 =
          base64Prefix + arrayBufferToBase64(response.data)
        this.setState({
          loading: false,
          thumbnail: contentInBase64,
        })
        this.props.onThumbnailLoaded(selectedFileId, contentInBase64)
      }
    })
  }

  handleInViewChanged = (inView, entry) => {
    if (inView) {
      this.refreshImage()
    }
  }

  handleImageLoaded = e => {
    const { width, height } = this.props
    this.setState({
      originalImageSize: { width: e.target.width, height: e.target.height },
    })

    const scaleWH = scaleImage(e.target, width - 50, height - 120)
    e.target.width = scaleWH.width
    e.target.height = scaleWH.height
  }

  resize = ({ width, height }) => {
    if (this.imgRef.current) {
      const { originalImageSize } = this.state

      this.imgRef.current.width = originalImageSize.width
      this.imgRef.current.height = originalImageSize.height
      const scaleWH = scaleImage(this.imgRef.current, width - 50, height - 120)
      this.imgRef.current.width = scaleWH.width
      this.imgRef.current.height = scaleWH.height
    }
  }

  render() {
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
      modelName,
      isEnableDeleteDocument = true,
      isEnableEditDocument = true,
      isEnableEditFolder = true,
      isLimitingCurrentUser = () => false,
    } = this.props
    const { loading, thumbnail } = this.state
    return (
      <InView as='div' onChange={this.handleInViewChanged}>
        <div className={classes.CardContainer}>
          <LoadingWrapper loading={loading}>
            <GridContainer>
              <GridItem md={6}>
                <span style={{ fontWeight: 600 }}>
                  {moment(file.createDate).format(dateFormatLong)}
                </span>
              </GridItem>
              <GridItem md={6} align='Right' style={{ padding: 0, height: 20 }}>
                {!isLimitingCurrentUser(file.createByUserFK) && (
                  <div className={classes.Toolbar}>
                    {isEnableEditDocument && (
                      <Tooltip title='Edit'>
                        <Button
                          type='primary'
                          size='small'
                          disabled={readOnly}
                          onClick={() => {
                            onEditFileName(file)
                          }}
                          style={{ marginRight: 8 }}
                          icon={<EditFilled />}
                        ></Button>
                      </Tooltip>
                    )}
                    {isEnableEditDocument && (
                      <SetFolderWithPopover
                        key={file.id}
                        disabled={readOnly}
                        folderList={folderList}
                        isEnableEditFolder={isEnableEditFolder}
                        selectedFolderFKs={file.folderFKs || []}
                        onClose={selectedFolder => {
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
                        type={this.props.type}
                      />
                    )}
                    {isEnableDeleteDocument && (
                      <Popconfirm
                        title='Permanently delete this document in all tags?'
                        onConfirm={() => {
                          dispatch({
                            type: `${modelName}/removeRow`,
                            payload: {
                              id: file.id,
                            },
                          }).then(() => {
                            dispatch({
                              type: `${modelName}/query`,
                            })
                          })
                        }}
                      >
                        <Tooltip title='Delete'>
                          <Button
                            size='small'
                            type='danger'
                            icon={<DeleteFilled />}
                            disabled={readOnly}
                            style={{ marginRight: 8 }}
                          ></Button>
                        </Tooltip>
                      </Popconfirm>
                    )}
                  </div>
                )}
              </GridItem>
              <GridItem md={12}>
                <Tooltip title={`Created by: ${file.createByUserName}`}>
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'table-cell',
                        textAlign: 'center',
                        width,
                        height: height - 120,
                        verticalAlign: 'middle',
                      }}
                      onClick={() => {
                        onPreview(file)
                      }}
                    >
                      {thumbnail && (
                        <img
                          ref={this.imgRef}
                          src={thumbnail}
                          alt={file.fileName}
                          onLoad={this.handleImageLoaded.bind(this)}
                        />
                      )}
                    </div>
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
              <GridItem md={12} style={{ overflow: 'auto', height: 28 }}>
                {folderList
                  .filter(f => file.folderFKs.includes(f.id))
                  .map(item => (
                    <Tag style={{ margin: '2px 5px 2px 0px' }}>
                      {item.displayValue}
                    </Tag>
                  ))}
              </GridItem>
            </GridContainer>
          </LoadingWrapper>
        </div>
      </InView>
    )
  }
}

export default withStyles(styles)(CardItem)
