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
  TextField,
} from '@/components'
// sub components
import { findGetParameter } from '@/utils/utils'
import {
  List as ListIcon,
  Apps as AppsIcon,
  ZoomIn as ZoomInIcon,
} from '@material-ui/icons'
import TagList from './FolderList/index'
import TagContainer from './FolderContainer/index'
import { CLINICAL_ROLE, TAG_TYPE } from '@/utils/constants'

const styles = theme => ({
  ...basicStyle(theme),
})

@connect(({ patientAttachment, settingTag, coPayerAttachment, user }) => ({
  patientAttachment,
  settingTag,
  coPayerAttachment,
  user,
}))
class AttachmentDocument extends Component {
  state = {
    selectedTagFK: -99, // all
    viewMode: 'card',
    zoom: 1,
    fileFilters: [],
  }

  componentDidMount() {
    const { dispatch, values, type } = this.props
    dispatch({
      type: 'settingTag/query',
      payload: {
        pagesize: 9999,
        sorting: [{ columnName: 'sortOrder', direction: 'asc' }],
        eql_category: type,
      },
    }).then(this.refreshDocuments)
  }

  refreshDocuments = () => {
    const { dispatch, values, type, modelName } = this.props
    if (type === TAG_TYPE.PATIENT) {
      dispatch({
        type: `${modelName}/query`,
        payload: {
          pagesize: 9999,
          'PatientProfileFKNavigation.Id': values.id,
        },
      })
    } else if (type === TAG_TYPE.COPAYER) {
      dispatch({
        type: `${modelName}/query`,
        payload: {
          pagesize: 9999,
          'CoPayerFKNavigation.Id': values.id,
        },
      })
    }
  }

  updateAttachments = args => ({ added, deleted }) => {
    const { dispatch, modelName, type, coPayerFK } = this.props
    const { list = [] } = this.props[modelName]
    const { field } = args

    const getLargestSortOrder = (largestIndex, attachment) =>
      attachment.sortOrder > largestIndex ? attachment.sortOrder : largestIndex

    let updated = [...(field.value || [])]
    if (added) {
      const addedFiles = added.map(file => {
        const { id, ...otherValue } = file
        return {
          ...otherValue,
          fileIndexFK: id,
        }
      })
      updated = [...updated, ...addedFiles]
    }
    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [...attachments, { ...item, isDeleted: true }]

        return [...attachments, { ...item }]
      }, [])
    const sorted = updated.sort((a, b) => {
      if (a.id > b.id) return 1
      if (a.id < b.id) return -1
      return 0
    })
    const startOrder = list.reduce(getLargestSortOrder, 0) + 1
    Promise.all(
      sorted.map((attachment, index) => {
        let payload = {
          cfg: { message: 'Uploaded Attachment' },
          sortOrder: startOrder + index,
          fileIndexFK: attachment.fileIndexFK,
          displayValue: attachment.fileName,
          [`${modelName}_Tag`]: attachment[`${modelName}_Tag`],
        }
        if (type === TAG_TYPE.PATIENT) {
          payload = { ...payload, patientProfileFK: findGetParameter('pid') }
        } else {
          payload = { ...payload, coPayerFK: coPayerFK }
        }
        dispatch({
          type: `${modelName}/upsert`,
          payload,
        })
      }),
    )
      .then(this.refreshDocuments)
      .catch(error => {})
  }

  filterDocumentCount = () => {
    const { selectedTagFK, fileFilters } = this.state
    const { modelName } = this.props
    const { list = [] } = this.props[modelName]
    const filterDocumentValue =
      (fileFilters.find(f => f.id === selectedTagFK) || {})
        .filterDocumentValue || ''

    const filterItems = list.filter(
      f =>
        (f.fileName || '')
          .toUpperCase()
          .indexOf(filterDocumentValue.toUpperCase()) >= 0 &&
        (f.tagFKs.includes(selectedTagFK) || selectedTagFK === -99),
    )

    return filterItems.length
  }

  debouncedAction = _.debounce(e => {
    const { fileFilters, selectedTagFK } = this.state
    var newFilters = [...fileFilters]
    var selectedFilter = newFilters.find(f => f.id === selectedTagFK)
    if (selectedFilter) {
      selectedFilter.filterDocumentValue = e.target.value
    } else {
      newFilters.push({
        id: selectedTagFK,
        filterDocumentValue: e.target.value,
      })
    }
    this.setState({ fileFilters: [...newFilters] })
  }, 100)

  render() {
    const {
      settingTag,
      readOnly = false,
      coPayerAttachment,
      type,
      modelName,
      user: {
        data: {
          clinicianProfile: { userProfile },
        },
      },
    } = this.props

    const isLimitingCurrentUser = createByUserFK => {
      return (
        userProfile.role.clinicRoleFK === CLINICAL_ROLE.STUDENT &&
        (!createByUserFK || userProfile.id != createByUserFK)
      )
    }

    const { viewMode, selectedTagFK, zoom, fileFilters } = this.state
    const { list = [] } = this.props[modelName]

    let tagList = (settingTag.list || []).map(l => {
      return {
        ...l,
        fileCount: list.filter(f => f.tagFKs.includes(l.id)).length,
      }
    })
    tagList = [
      { id: -99, displayValue: 'All', sortOrder: -99, fileCount: list.length },
      ...tagList,
    ]
    const filterDocumentValue = (
      fileFilters.find(f => f.id === selectedTagFK) || {}
    ).filterDocumentValue
    return (
      <GridContainer>
        <GridItem md={3}>
          <CardContainer
            hideHeader
            style={{ height: window.innerHeight - 150, overflow: 'scroll' }}
          >
            <TagList
              readOnly={readOnly}
              tagList={tagList}
              selectedTagFK={selectedTagFK}
              updateAttachments={this.updateAttachments}
              onSelectionChange={f => {
                this.setState({ selectedTagFK: f.id })
              }}
              isLimitingCurrentUser={isLimitingCurrentUser}
              {...this.props}
            />
          </CardContainer>
        </GridItem>
        <GridItem md={9}>
          <CardContainer
            hideHeader
            style={{ height: window.innerHeight - 150, overflow: 'scroll' }}
          >
            <GridContainer style={{ height: 'auto' }}>
              <GridItem
                md={6}
                style={{
                  marginBottom: 10,
                  paddingRight: 130,
                  position: 'relative',
                }}
                container
              >
                <TextField
                  inputProps={{ placeholder: 'Key in to filter documents' }}
                  onChange={this.debouncedAction}
                  value={filterDocumentValue}
                />
                <div style={{ position: 'absolute', right: 0, top: 16 }}>
                  {`${this.filterDocumentCount()} items filtered`}
                </div>
              </GridItem>
              <GridItem md={6} align='Right' style={{ marginBottom: 10 }}>
                <div style={{ marginTop: 8 }}>
                  {viewMode === 'card' && (
                    <Popover
                      icon={null}
                      placement='bottom'
                      content={
                        <div style={{ width: 150 }}>
                          <Slider
                            // orientation='vertical'
                            // getAriaValueText={valuetext}
                            defaultValue={1}
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
                <TagContainer
                  {...this.props}
                  zoom={zoom}
                  readOnly={readOnly}
                  tagList={tagList}
                  viewMode={viewMode}
                  attachmentList={list}
                  selectedTagFK={selectedTagFK}
                  filterDocumentValue={filterDocumentValue}
                  isLimitingCurrentUser={isLimitingCurrentUser}
                />
              </GridItem>
            </GridContainer>
          </CardContainer>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AttachmentDocument)
