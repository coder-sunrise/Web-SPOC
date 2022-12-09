import React, { PureComponent, Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  FastField,
  GridContainer,
  GridItem,
  IconButton,
  CommonModal,
  Tooltip,
  TextField,
  notification,
  Checkbox,
} from '@/components'
import { Button, Tag } from 'antd'
import {
  EditFilled,
  SaveFilled,
  CloseCircleFilled,
  FolderAddFilled,
} from '@ant-design/icons'
import { AttachmentWithThumbnail, Notification } from '@/components/_medisys'
import { FILE_CATEGORY, FILE_STATUS } from '@/utils/constants'
import TextEditor from '../TextEditor'
import DragableList from './DragableList'
import Authorized from '@/utils/Authorized'

class TagList extends Component {
  state = {
    showNewTag: false,
    tagList: [],
    filterValue: '',
    isShowEmptyTags: false,
  }

  debouncedAction = _.debounce(e => {
    this.setState({ filterValue: e.target.value }, () =>
      this.checkToSelectAll(this.props),
    )
  }, 100)

  onShowEmptyTagChange = e => {
    this.setState({ isShowEmptyTags: e.target.value }, () =>
      this.checkToSelectAll(this.props),
    )
  }

  checkToSelectAll = props => {
    const { onSelectionChange, selectedTagFK } = props
    if (selectedTagFK === -99) return
    const {
      tagList = [],
      filterValue = '',
      isShowEmptyTags = true,
    } = this.state
    if (
      !tagList.find(
        f =>
          !f.isDeleted &&
          f.id === selectedTagFK &&
          (f.displayValue || '')
            .toUpperCase()
            .indexOf((filterValue || '').toUpperCase()) >= 0 &&
          (isShowEmptyTags || f.fileCount > 0),
      )
    ) {
      onSelectionChange({ id: -99 })
    }
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { tagList: nextTagList = [] } = nextProps

    const nextList = _.orderBy(
      nextTagList.filter(f => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)
    const currentList = _.orderBy(
      this.state.tagList.filter(f => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)

    const diff = _.differenceWith(nextList, currentList, _.isEqual)

    if (diff.length > 0) {
      this.setState(
        {
          tagList: nextList,
        },
        () => this.checkToSelectAll(nextProps),
      )
    }
  }

  mapPropsToStates = () => {
    const { tagList = [] } = this.props
    const nextList = _.orderBy(
      tagList.filter(f => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)
    this.setState({
      tagList: nextList,
    })
  }

  entityGenerator = n => {
    return {
      id: n.id,
      displayValue: n.displayValue,
      sortOrder: n.sortOrder || 0,
      fileCount: n.fileCount || 0,
      isDeleted: n.isDeleted,
      isEmpty: n.isEmpty,
      createByUserFK: n.createByUserFK,
    }
  }

  refreshTags = () => {
    this.props.dispatch({
      type: 'settingTag/query',
      payload: {
        pagesize: 999,
        sorting: [{ columnName: 'sortOrder', direction: 'asc' }],
      },
    })
  }

  closeNewTagModal = () => {
    this.setState({ showNewTag: false })
  }

  onSaveNewTag = name => {
    const { tagList, dispatch, type } = this.props
    const maxSort = _.maxBy(
      tagList.filter(f => f.id > 0),
      'sortOrder',
    )

    dispatch({
      type: 'settingTag/upsert',
      payload: {
        displayValue: name,
        description: name,
        effectiveStartDate: moment().formatUTC(true),
        effectiveEndDate: moment('2099-12-31').formatUTC(true),
        sortOrder: maxSort ? maxSort.sortOrder + 1 : 1,
        IsUserMaintainable: true,
        category: type,
      },
    }).then(this.refreshTags)

    this.closeNewTagModal()
  }

  onItemClick = item => {
    this.props.onSelectionChange(item)
  }

  handleOnMoving = (dragIndex, hoverIndex) => {
    if (hoverIndex <= 0 || dragIndex <= 0) return

    let { tagList: tagList } = this.state
    let tmp = tagList[dragIndex]
    tagList.splice(dragIndex, 1)
    tagList.splice(hoverIndex, 0, tmp)

    tagList = tagList.map((m, i) => {
      return {
        ...m,
        sortOrder: i,
      }
    })
    this.setState({
      tagList,
    })
  }

  handleOnEndDrag = p => {
    const { tagList: origTag = [] } = this.props
    const { tagList: tagList } = this.state
    const updated = []
    origTag
      .filter(fo => fo.id > 0)
      .map(f => {
        const newTag = tagList.find(o => o.id === f.id)
        if (newTag && newTag.sortOrder !== f.sortOrder)
          updated.push({ ...f, sortOrder: newTag.sortOrder })
      })
    if (updated.length > 0) {
      this.props
        .dispatch({
          type: 'settingTag/upsertList',
          payload: updated,
        })
        .then(this.refreshTags)
    }
  }

  onItemChanged = item => {
    if (item.isDeleted) {
      this.props
        .dispatch({
          type: 'settingTag/checkIfEmpty',
          payload: item.id,
        })
        .then(r => {
          if (r && r.data === true) {
            notification.warning({
              message: `Delete failed, attachment already associated to tag '${item.displayValue}'.`,
            })
            return
          }
          this.updateList(item)
        })
    } else {
      this.updateList(item)
    }
  }
  updateList = item => {
    const { tagList: tagList = [] } = this.state
    let stateItem = tagList.find(i => i.id === item.id)
    stateItem.displayValue = item.displayValue
    stateItem.isDeleted = item.isDeleted
    this.setState({ tagList })
  }

  handleOnSave = () => {
    const { tagList: origTag = [] } = this.props
    const { tagList: tagList } = this.state
    const updated = []
    origTag.map(f => {
      const newTag = tagList.find(o => o.id === f.id)
      if (
        newTag &&
        (newTag.displayValue !== f.displayValue ||
          newTag.isDeleted !== f.isDeleted)
      )
        updated.push({
          ...f,
          displayValue: newTag.displayValue,
          isDeleted: newTag.isDeleted,
        })
    })
    if (updated.length > 0) {
      this.props
        .dispatch({
          type: 'settingTag/upsertList',
          payload: updated,
        })
        .then(this.refreshTags)
    }
  }

  render() {
    const {
      readOnly,
      updateAttachments,
      selectedTagFK = -99,
      modelName,
      isEnableEditTag = true,
      isEnableDeleteTag = true,
      isEnableEditDocument = true,
      isLimitingCurrentUser = () => false,
    } = this.props
    const {
      showNewTag,
      tagList,
      isEditMode,
      isShowEmptyTags = true,
      filterValue,
    } = this.state
    const fittedTagList = tagList.filter(
      f =>
        !f.isDeleted &&
        (f.id === -99 ||
          ((f.displayValue || '')
            .toUpperCase()
            .indexOf((filterValue || '').toUpperCase()) >= 0 &&
            (isShowEmptyTags || f.fileCount > 0))),
    )
    const limitingCurrentUser = isLimitingCurrentUser()
    return (
      <GridContainer style={{ height: 'auto' }}>
        {!readOnly && (
          <GridItem md={12}>
            <div>
              <div style={{ display: 'flex', float: 'left' }}>
                {!limitingCurrentUser && isEnableEditTag && (
                  <Tooltip title='Add New Tag'>
                    <Button
                      type='primary'
                      style={{ marginRight: 8, marginTop: 8 }}
                      onClick={() => {
                        this.setState({ showNewTag: true })
                      }}
                      size='small'
                      icon={<FolderAddFilled />}
                    ></Button>
                  </Tooltip>
                )}
                {isEnableEditDocument && (
                  <div style={{ marginRight: 8 }}>
                    <FastField
                      name={`${modelName}`}
                      render={args => {
                        this.form = args.form
                        return (
                          <AttachmentWithThumbnail
                            attachmentType={`${modelName}`}
                            handleUpdateAttachments={att => {
                              let { added = [] } = att
                              const { selectedTagFK: tagFK } = this.props
                              if (tagFK > 0 && added.length > 0) {
                                added = added.map(ad => {
                                  const { 0: fileDetails } = ad
                                  const retVal = {
                                    ...ad,
                                    ...fileDetails,
                                    [`${modelName}_Tag`]: [{ tagFK }],
                                  }
                                  return retVal
                                })
                              }
                              updateAttachments(args)({ ...att, added })
                            }}
                            attachments={args.field.value}
                            fileCategory={
                              modelName === 'patientAttachment'
                                ? FILE_CATEGORY.PATIENT
                                : FILE_CATEGORY.COPAYER
                            }
                            fileStatus={FILE_STATUS.CONFIRMED}
                            label=''
                            thumbnailSize={{
                              height: 256,
                              width: 256,
                            }}
                          />
                        )
                      }}
                    />
                  </div>
                )}
                <div>
                  <Checkbox
                    label='Show Empty Tags'
                    checked={isShowEmptyTags}
                    onChange={this.onShowEmptyTagChange}
                  />
                </div>
              </div>
              {!limitingCurrentUser && isEnableEditTag && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    float: 'right',
                    marginTop: 8,
                  }}
                >
                  {isEditMode ? (
                    <React.Fragment>
                      <Tooltip title='Save'>
                        <Button
                          type='primary'
                          size='small'
                          onClick={() => {
                            this.handleOnSave()
                            this.setState({ isEditMode: false })
                          }}
                          style={{ marginRight: 8 }}
                          icon={<SaveFilled />}
                        ></Button>
                      </Tooltip>
                      <Tooltip title='Cancel'>
                        <Button
                          type='danger'
                          size='small'
                          onClick={() => {
                            this.mapPropsToStates()
                            this.setState({ isEditMode: false })
                          }}
                          icon={<CloseCircleFilled />}
                        ></Button>
                      </Tooltip>
                    </React.Fragment>
                  ) : (
                    <Button
                      type='primary'
                      size='small'
                      onClick={() => {
                        this.setState({ isEditMode: true })
                      }}
                      icon={<EditFilled />}
                    ></Button>
                  )}
                </div>
              )}
            </div>
          </GridItem>
        )}
        <GridItem md={12}>
          <div>
            <TextField
              inputProps={{ placeholder: 'Key in to filter tags' }}
              onChange={this.debouncedAction}
              value={filterValue}
            />
            <DragableList
              readOnly={readOnly}
              isEditMode={isEditMode}
              tagList={fittedTagList}
              selectedTagFK={selectedTagFK}
              onMoving={this.handleOnMoving}
              onItemClick={this.onItemClick}
              onEndDrag={this.handleOnEndDrag}
              onItemChanged={this.onItemChanged}
              isEnableEditTag={isEnableEditTag}
              isEnableDeleteTag={isEnableDeleteTag}
            />
          </div>
        </GridItem>

        <CommonModal
          open={showNewTag}
          title='New Tag'
          maxWidth='sm'
          onConfirm={this.closeNewTagModal}
          onClose={this.closeNewTagModal}
        >
          <TextEditor
            item={{ label: 'New Tag' }}
            handleSubmit={this.onSaveNewTag}
          />
        </CommonModal>
      </GridContainer>
    )
  }
}

export default TagList
