import React, { Component, useState, useEffect } from 'react'

import classNames from 'classnames'
// material ui
import { withStyles, Chip } from '@material-ui/core'
import {
  FastField,
  CommonModal,
  Button,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tabs,
  CardContainer,
  Popover,
  Tooltip,
} from '@/components'
import { LoadingWrapper } from 'medisys-components'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { downloadAttachment, getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AddCircle from '@material-ui/icons/AddCircle'
import pdfIcon from '@/assets/thumbnail-icons/pdf-icon.png'
import wordIcon from '@/assets/thumbnail-icons/word-icon.png'
import excelIcon from '@/assets/thumbnail-icons/excel-icon.png'

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

class TagSetterItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTags: [],
      loading: false,
      imageData: undefined,
    }
  }

  componentDidMount = () => {
    const { file: { fileExtension, fileIndexFK } } = this.props

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
        this.setState({ loading: false, imageData: contentInBase64 })
      }
    })
  }

  addNewTag = (item) => {
    const tags = this.state.selectedTags || []
    tags.push(item.name)
    this.setState({ selectedTags: tags })
  }

  render () {
    const { file } = this.props
    const { selectedTags, loading, imageData } = this.state

    return (
      <LoadingWrapper loading={loading}>
        <CardContainer hideHeader style={{ height: 260 }}>
          <GridContainer>
            <GridItem
              md={10}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <TextField value={file.fileName} />
            </GridItem>
            <GridItem md={2}>
              <Popover
                icon={null}
                content={
                  <List
                    dense
                    style={{
                      width: '100%',
                      overflow: 'auto',
                    }}
                  >
                    {[
                      { name: 'cate', value: 1 },
                      { name: 'sights', value: 3 },
                      { name: 'animal', value: 3 },
                      { name: '美图', value: 4 },
                      { name: '神奇', value: 5 },
                      { name: '老司机', value: 6 },
                    ].map((item) => {
                      return (
                        <ListItem
                          key={item.medicationPrecautionFK}
                          // disabled={limit && limit === removedList.length}
                          button
                          onClick={() => {
                            this.addNewTag(item)
                          }}
                        >
                          <ListItemText primary={`${item.name}`} />
                          <ListItemSecondaryAction>
                            <Button
                              size='sm'
                              onClick={() => {
                                this.addNewTag(item)
                              }}
                              justIcon
                              round
                              color='primary'
                            >
                              <AddCircle />
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    })}
                  </List>
                }
                title='Tags'
                trigger='click'
                placement='right'
                visible={this.state.openTaglist}
                onVisibleChange={(e) => {
                  this.setState({ openTaglist: e })
                }}
              >
                <Tooltip title='Add tag'>
                  <Button justIcon color='primary'>
                    <LocalOfferIcon />
                  </Button>
                </Tooltip>
              </Popover>
            </GridItem>
            <GridItem md={12} align='center'>
              <img
                width={100}
                height={100}
                src={imageData}
                alt={file.fileName}
              />
            </GridItem>
            {/* <GridItem md={10}>{file.fileName}</GridItem> */}

            <GridItem md={12} style={{ maxHeight: 100, overflow: 'auto' }}>
              {selectedTags.map((item) => (
                <Chip
                  style={{ margin: 3 }}
                  key={item}
                  size='small'
                  variant='outlined'
                  label={item}
                  color='primary'
                  onDelete={() => {
                    this.setState({
                      selectedTags: selectedTags.filter((f) => f !== item),
                    })
                  }}
                />
              ))}
            </GridItem>
          </GridContainer>
        </CardContainer>
      </LoadingWrapper>
    )
  }
}

export default TagSetterItem
