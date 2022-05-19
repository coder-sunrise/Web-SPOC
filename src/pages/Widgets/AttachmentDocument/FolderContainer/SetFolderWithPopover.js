import React, { Component, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  GridContainer,
  GridItem,
  TextField,
  Popover,
  Checkbox,
  IconButton,
  Tooltip,
} from '@/components'
import { Button } from 'antd'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { TagOutlined, TagFilled, PlusCircleFilled } from '@ant-design/icons'
import TagSelect from './TagSelect'

class SetFolderWithPopover extends Component {
  constructor(props) {
    super(props)
    this.state = { newFolder: '', folderFKs: [] }
  }

  setNewFolder = name => {
    this.setState({ newFolder: name })
  }

  setFolderFKs = folderFKs => {
    this.setState({ folderFKs })
  }

  componentDidMount = () => {
    const { selectedFolderFKs = [] } = this.props
    this.setFolderFKs(_.sortedUniq(selectedFolderFKs))
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = nextProps => {
    const folderFKs = _.sortedUniq(this.props.selectedFolderFKs)
    const nextFolderFKs = _.sortedUniq(nextProps.selectedFolderFKs)
    if (
      folderFKs.length !== nextFolderFKs.length ||
      nextFolderFKs.join(',') !== folderFKs.join(',')
    ) {
      this.setFolderFKs(nextFolderFKs)
    }
  }

  saveAsNewTag = tagName => {
    const { folderList = [], onAddNewFolders } = this.props
    const maxSort = _.maxBy(
      folderList.filter(f => f.id > 0),
      'sortOrder',
    )
    const entity = {
      code: tagName,
      displayValue: tagName,
      description: tagName,
      sortOrder: maxSort ? maxSort.sortOrder + 1 : 1,
      effectiveStartDate: moment().formatUTC(true),
      effectiveEndDate: moment('2099-12-31').formatUTC(true),
      type: this.props.type,
    }
    onAddNewFolders(entity)
  }

  render() {
    const {
      folderList = [],
      onClose,
      onAddNewFolders,
      justIcon,
      selectedFolderFKs,
      isEnableEditFolder,
      isEnableEditDocument,
    } = this.props
    const { folderFKs, newFolder } = this.state

    return (
      <Popover
        icon={null}
        content={
          <div style={{ width: 500 }}>
            <TagSelect
              isEnableEditFolder={isEnableEditFolder}
              isEnableEditDocument={isEnableEditDocument}
              saveAsNewTag={this.saveAsNewTag}
              tagList={folderList.filter(f => f.id !== -99)}
              defaultTagIds={selectedFolderFKs}
              onChange={e => {
                this.setFolderFKs(e)
              }}
            />
          </div>
        }
        title='Tag as:'
        trigger='click'
        placement='right'
        onVisibleChange={e => {
          if (e === false) {
            onClose(folderFKs)
          }
        }}
      >
        {justIcon ? (
          <Tooltip title='Tags'>
            <IconButton color='primary'>
              <TagOutlined />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Tags'>
            <Button
              size='small'
              style={{ marginRight: 8 }}
              type='primary'
              icon={<TagFilled />}
            ></Button>
          </Tooltip>
        )}
      </Popover>
    )
  }
}

export default SetFolderWithPopover
