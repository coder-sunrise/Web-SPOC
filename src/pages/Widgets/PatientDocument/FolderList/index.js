import React, { PureComponent, Component } from 'react'

import moment from 'moment'
import _ from 'lodash'
import {
  FastField,
  GridContainer,
  GridItem,
  IconButton,
  Button,
  CommonModal,
  Tooltip,
} from '@/components'
import { Attachment } from '@/components/_medisys'

import { CreateNewFolder, Edit, Save, Cancel } from '@material-ui/icons'
import TextEditor from '../TextEditor'
import DragableList from './DragableList'

class FolderList extends Component {
  state = {
    showNewFolder: false,
    folderList: [],
  }

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { folderList: nextFolderList = [] } = nextProps

    const nextList = _.orderBy(
      nextFolderList.filter((f) => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)
    const currentList = _.orderBy(
      this.state.folderList.filter((f) => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)

    const diff = _.differenceWith(nextList, currentList, _.isEqual)

    if (diff.length > 0) {
      this.setState({
        folderList: nextList,
      })
    }
  }

  mapPropsToStates = () => {
    const { folderList = [] } = this.props
    const nextList = _.orderBy(
      folderList.filter((f) => !f.isDeleted),
      'sortOrder',
    ).map(this.entityGenerator)
    this.setState({
      folderList: nextList,
    })
  }

  entityGenerator = (n) => {
    return {
      id: n.id,
      displayValue: n.displayValue,
      sortOrder: n.sortOrder || 0,
      fileCount: n.fileCount || 0,
      isDeleted: n.isDeleted,
    }
  }

  refreshFolders = () => {
    this.props.dispatch({
      type: 'folder/query',
      payload: {
        pagesize: 999,
        sorting: [
          { columnName: 'sortOrder', direction: 'asc' },
        ],
      },
    })
  }

  closeNewFolderModal = () => {
    this.setState({ showNewFolder: false })
  }

  onSaveNewFolder = (name) => {
    const { folderList, dispatch } = this.props

    dispatch({
      type: 'folder/upsert',
      payload: {
        code: name,
        displayValue: name,
        description: name,
        effectiveStartDate: moment().formatUTC(true),
        effectiveEndDate: moment('2099-12-31').formatUTC(true),
        sortOrder: (_.maxBy(folderList, 'sortOrder').sortOrder || 0) + 1,
      },
    }).then(this.refreshFolders)

    this.closeNewFolderModal()
  }

  onItemClick = (item) => {
    this.props.onSelectionChange(item)
  }

  handleOnMoving = (dragIndex, hoverIndex) => {
    if (hoverIndex <= 0 || dragIndex <= 0) return

    let { folderList } = this.state
    let tmp = folderList[dragIndex]
    folderList.splice(dragIndex, 1)
    folderList.splice(hoverIndex, 0, tmp)

    folderList = folderList.map((m, i) => {
      return {
        ...m,
        sortOrder: i,
      }
    })
    this.setState({
      folderList,
    })
  }

  handleOnEndDrag = (p) => {
    const { folderList: origFolder = [] } = this.props
    const { folderList } = this.state
    const updated = []
    origFolder.filter((fo) => fo.id > 0).map((f) => {
      const newFolder = folderList.find((o) => o.id === f.id)
      if (newFolder && newFolder.sortOrder !== f.sortOrder)
        updated.push({ ...f, sortOrder: newFolder.sortOrder })
    })
    if (updated.length > 0) {
      this.props
        .dispatch({
          type: 'folder/upsertList',
          payload: updated,
        })
        .then(this.refreshFolders)
    }
  }

  onItemChanged = (item) => {
    const { folderList = [] } = this.state
    let stateItem = folderList.find((i) => i.id === item.id)
    stateItem.displayValue = item.displayValue
    stateItem.isDeleted = item.isDeleted

    this.setState({ folderList })
  }

  handleOnSave = () => {
    const { folderList: origFolder = [] } = this.props
    const { folderList } = this.state
    const updated = []
    origFolder.map((f) => {
      const newFolder = folderList.find((o) => o.id === f.id)
      if (
        newFolder &&
        (newFolder.displayValue !== f.displayValue ||
          newFolder.isDeleted !== f.isDeleted)
      )
        updated.push({
          ...f,
          displayValue: newFolder.displayValue,
          isDeleted: newFolder.isDeleted,
        })
    })
    if (updated.length > 0) {
      this.props
        .dispatch({
          type: 'folder/upsertList',
          payload: updated,
        })
        .then(this.refreshFolders)
    }
  }

  render () {
    const { updateAttachments, selectedFolderFK = -99 } = this.props
    const { showNewFolder, folderList, isEditMode } = this.state

    return (
      <GridContainer>
        <GridItem md={12}>
          <div>
            <div style={{ display: 'flex', float: 'left' }}>
              <IconButton
                color='primary'
                style={{ width: 50, marginTop: 5 }}
                onClick={() => {
                  this.setState({ showNewFolder: true })
                }}
              >
                <CreateNewFolder
                  fontSize='inherit'
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
              <FastField
                name='patientAttachment'
                render={(args) => {
                  this.form = args.form
                  return (
                    <Attachment
                      attachmentType='patientAttachment'
                      handleUpdateAttachments={(att) => {
                        let { added = [] } = att
                        const { selectedFolderFK: folderFK } = this.props
                        if (folderFK > 0 && added.length > 0) {
                          added = added.map((ad) => {
                            const { 0: fileDetails } = ad
                            const retVal = {
                              ...ad,
                              0: {
                                ...fileDetails,
                                patientAttachment_Folder: [
                                  { folderFK },
                                ],
                              },
                            }
                            return retVal
                          })
                        }
                        updateAttachments(args)({ ...att, added })
                      }}
                      attachments={args.field.value}
                      label=''
                    />
                  )
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                float: 'right',
                height: 50,
                marginTop: 5,
              }}
            >
              {isEditMode ? (
                <React.Fragment>
                  <Tooltip title='Save'>
                    <Button
                      justIcon
                      color='primary'
                      size='sm'
                      onClick={() => {
                        this.handleOnSave()
                        this.setState({ isEditMode: false })
                      }}
                    >
                      <Save />
                    </Button>
                  </Tooltip>
                  <Tooltip title='Cancel'>
                    <Button
                      justIcon
                      color='danger'
                      size='sm'
                      onClick={() => {
                        this.mapPropsToStates()
                        this.setState({ isEditMode: false })
                      }}
                    >
                      <Cancel />
                    </Button>
                  </Tooltip>
                </React.Fragment>
              ) : (
                <Button
                  justIcon
                  color='primary'
                  size='sm'
                  onClick={() => {
                    this.setState({ isEditMode: true })
                  }}
                >
                  <Edit />
                </Button>
              )}
            </div>
          </div>
        </GridItem>
        <GridItem md={12}>
          <DragableList
            isEditMode={isEditMode}
            folderList={folderList.filter((f) => !f.isDeleted)}
            selectedFolderFK={selectedFolderFK}
            onMoving={this.handleOnMoving}
            onItemClick={this.onItemClick}
            onEndDrag={this.handleOnEndDrag}
            onItemChanged={this.onItemChanged}
          />
        </GridItem>

        <CommonModal
          open={showNewFolder}
          title='New Folder'
          maxWidth='sm'
          onConfirm={this.closeNewFolderModal}
          onClose={this.closeNewFolderModal}
        >
          <TextEditor
            item={{ label: 'New Folder' }}
            handleSubmit={this.onSaveNewFolder}
          />
        </CommonModal>
      </GridContainer>
    )
  }
}

export default FolderList
