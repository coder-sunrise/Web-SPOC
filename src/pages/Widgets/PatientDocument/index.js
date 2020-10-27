import React, { Component } from 'react'
import { connect } from 'dva'

// material ui
import { withStyles, Slider } from '@material-ui/core'

// styles
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// common components
import {
  GridContainer,
  GridItem,
  CardContainer,
  Button,
  Tooltip,
  Popover,
} from '@/components'
// sub components
import { findGetParameter } from '@/utils/utils'
import {
  List as ListIcon,
  Apps as AppsIcon,
  ZoomIn as ZoomInIcon,
} from '@material-ui/icons'

// models
import model from './models'
import FolderList from './FolderList/index'
import FolderContainer from './FolderContainer/index'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ patientAttachment, folder }) => ({
  patientAttachment,
  folder,
}))
class PatientDocument extends Component {
  state = {
    selectedFolderFK: -99, // all
    viewMode: 'card',
    zoom: 4,
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
    const { viewMode, selectedFolderFK, zoom } = this.state
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
                  {viewMode === 'card' && (
                    <Popover
                      icon={null}
                      placement='bottom'
                      content={
                        <div style={{ width: 150 }}>
                          <Slider
                            // orientation='vertical'
                            // getAriaValueText={valuetext}
                            defaultValue={4}
                            aria-labelledby='vertical-slider'
                            valueLabelDisplay='off'
                            step={1}
                            marks
                            min={1}
                            max={5}
                            onChange={(e, v) => {
                              if (zoom !== v) {
                                this.setState({ zoom: v })
                              }
                            }}
                          />
                        </div>
                      }
                    >
                      <Tooltip title='Zoom'>
                        <Button justIcon color='primary'>
                          <ZoomInIcon />
                        </Button>
                      </Tooltip>
                    </Popover>
                  )}
                  <Tooltip title='List View'>
                    <Button
                      justIcon
                      color='primary'
                      onClick={() => {
                        this.setState({ viewMode: 'list' })
                      }}
                    >
                      <ListIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title='Card View'>
                    <Button
                      justIcon
                      color='primary'
                      onClick={() => {
                        this.setState({ viewMode: 'card' })
                      }}
                    >
                      <AppsIcon />
                    </Button>
                  </Tooltip>
                </div>
              </GridItem>
              <GridItem md={12}>
                <FolderContainer
                  {...this.props}
                  zoom={zoom}
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
