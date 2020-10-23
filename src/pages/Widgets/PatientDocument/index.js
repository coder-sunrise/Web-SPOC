import React, { Component } from 'react'
import { connect } from 'dva'

// printjs
import printJS from 'print-js'

// material ui
import { withStyles } from '@material-ui/core'
// styles
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common components
import {
  FastField,
  Carousel,
  CommonModal,
  GridContainer,
  GridItem,
  CardContainer,
  Button,
  IconButton,
} from '@/components'
import { Attachment } from '@/components/_medisys'
// sub components
import { findGetParameter } from '@/utils/utils'
import {
  arrayBufferToBase64,
  BASE64_MARKER,
} from '@/components/_medisys/ReportViewer/utils'
import {
  downloadAttachment,
  getFileByFileID,
  getPDFFile,
} from '@/services/file'
import {
  getPDF,
  getUnsavedPDF,
  exportUnsavedReport,
  exportPdfReport,
  exportExcelReport,
} from '@/services/report'
import {
  CreateNewFolder,
  List as ListIcon,
  Apps as AppsIcon,
} from '@material-ui/icons'

import Filter from './Filter'
// models
import model from './models'
import FolderList from './FolderList/index'
import FolderContainer from './FolderContainer/index'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  ...basicStyle(theme),
})

const imageExt = [
  'JPG',
  'JPEG',
  'PNG',
  'BMP',
  'GIF',
]

@connect(({ patientAttachment, folder }) => ({
  patientAttachment,
  folder,
}))
class PatientDocument extends Component {
  state = {
    selectedFolderFK: -99, // all
    viewMode: 'list',
  }

  componentDidMount () {
    const { dispatch, values } = this.props
    dispatch({
      type: 'folder/query',
      payload: {
        pagesize: 999,
        sorting: [
          { columnName: 'sortOrder', direction: 'asc' },
        ],
      },
    }).then(() => {
      dispatch({
        type: 'patientAttachment/query',
        payload: {
          pagesize: 999,
          'PatientProfileFKNavigation.Id': values.id,
        },
      })
    })
  }

  updateAttachments = (args) => ({ added, deleted }) => {
    const { dispatch, patientAttachment = [] } = this.props
    const { list = [] } = patientAttachment
    const { field } = args

    const getLargestSortOrder = (largestIndex, attachment) =>
      attachment.sortOrder > largestIndex ? attachment.sortOrder : largestIndex

    let updated = [
      ...(field.value || []),
    ]
    if (added) {
      const addedFiles = added.map((file) => {
        const { 0: fileDetails, attachmentType } = file
        return {
          ...fileDetails,
          fileIndexFK: fileDetails.id,
          attachmentType,
        }
      })
      updated = [
        ...updated,
        ...addedFiles,
      ]
      // this.setState({ showTagModal: true, tagList: addedFiles })
    }

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    const sorted = updated.sort((a, b) => {
      if (a.id > b.id) return 1
      if (a.id < b.id) return -1
      return 0
    })
    const startOrder = list.reduce(getLargestSortOrder, 0) + 1

    Promise.all(
      sorted.map((attachment, index) =>
        dispatch({
          type: 'patientAttachment/upsert',
          payload: {
            cfg: { message: 'Uploaded Attachment' },
            patientProfileFK: findGetParameter('pid'),
            sortOrder: startOrder + index,
            fileIndexFK: attachment.fileIndexFK,
            fileName: attachment.fileName,
            patientAttachment_Folder: attachment.patientAttachment_Folder,
          },
        }),
      ),
    )
      .then(() => {
        dispatch({
          type: 'patientAttachment/query',
        })
      })
      .catch((error) => {
        console.error({ error })
      })
  }

  render () {
    const { patient: { entity }, patientAttachment, folder } = this.props
    const { viewMode, selectedFolderFK } = this.state
    const patientIsActive = entity && entity.isActive
    const { list = [] } = patientAttachment

    let folderList = (folder.list || []).map((l) => {
      return {
        ...l,
        fileCount: list.filter((f) => f.folderFKs.includes(l.id)).length,
      }
    })
    folderList = [
      { id: -99, displayValue: 'All', sortOrder: -99, fileCount: list.length },
      ...folderList,
    ]
    return (
      <GridContainer>
        <GridItem md={3}>
          <CardContainer
            hideHeader
            style={{ height: window.innerHeight - 100, overflow: 'scroll' }}
          >
            <FolderList
              readOnly={!patientIsActive}
              folderList={folderList}
              selectedFolderFK={selectedFolderFK}
              updateAttachments={this.updateAttachments}
              onSelectionChange={(f) => {
                this.setState({ selectedFolderFK: f.id })
              }}
              {...this.props}
            />
          </CardContainer>
        </GridItem>
        <GridItem md={9}>
          <CardContainer
            hideHeader
            style={{ height: window.innerHeight - 100, overflow: 'scroll' }}
          >
            <GridContainer style={{ height: 'auto' }}>
              <GridItem md={12} align='Right' style={{ marginBottom: 10 }}>
                <div>
                  <Button
                    justIcon
                    color='primary'
                    onClick={() => {
                      this.setState({ viewMode: 'list' })
                    }}
                  >
                    <ListIcon />
                  </Button>
                  <Button
                    justIcon
                    color='primary'
                    onClick={() => {
                      this.setState({ viewMode: 'card' })
                    }}
                  >
                    <AppsIcon />
                  </Button>
                </div>
              </GridItem>
              <GridItem md={12}>
                <FolderContainer
                  {...this.props}
                  readOnly={!patientIsActive}
                  folderList={folderList}
                  viewMode={viewMode}
                  attachmentList={list}
                  selectedFolderFK={selectedFolderFK}
                />
              </GridItem>
            </GridContainer>
          </CardContainer>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDocument)
