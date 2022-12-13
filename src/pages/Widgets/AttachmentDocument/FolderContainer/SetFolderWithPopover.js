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

class SetTagWithPopover extends Component {
  constructor(props) {
    super(props)
    this.state = { newTag: '', tagFKs: [] }
  }

  setNewTag = name => {
    this.setState({ newTag: name })
  }

  setTagFKs = tagFKs => {
    this.setState({ tagFKs })
  }

  componentDidMount = () => {
    const { selectedTagFKs = [] } = this.props
    this.setTagFKs(_.sortedUniq(selectedTagFKs))
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = nextProps => {
    const tagFKs = _.sortedUniq(this.props.selectedTagFKs)
    const nextTagFKs = _.sortedUniq(nextProps.selectedTagFKs)
    if (
      tagFKs.length !== nextTagFKs.length ||
      nextTagFKs.join(',') !== tagFKs.join(',')
    ) {
      this.setTagFKs(nextTagFKs)
    }
  }

  saveAsNewTag = tagName => {
    const { tagList = [], onAddNewTags, type } = this.props
    const maxSort = _.maxBy(
      tagList.filter(f => f.id > 0),
      'sortOrder',
    )
    const entity = {
      displayValue: tagName,
      description: tagName,
      sortOrder: maxSort ? maxSort.sortOrder + 1 : 1,
      effectiveStartDate: moment().formatUTC(true),
      effectiveEndDate: moment('2099-12-31').formatUTC(true),
      IsUserMaintainable: true,
      category: type,
    }
    onAddNewTags(entity)
  }

  render() {
    const {
      tagList = [],
      onClose,
      onAddNewTags,
      justIcon,
      selectedTagFKs,
      isEnableEditTag,
      isEnableEditDocument,
      isLimitingCurrentUser = () => false,
    } = this.props
    const { tagFKs, newTag } = this.state

    return (
      <Popover
        icon={null}
        content={
          <div style={{ width: 500 }}>
            <TagSelect
              isEnableEditTag={isEnableEditTag}
              isEnableEditDocument={isEnableEditDocument}
              saveAsNewTag={this.saveAsNewTag}
              tagList={tagList.filter(f => f.id !== -99)}
              defaultTagIds={selectedTagFKs}
              onChange={e => {
                this.setTagFKs(e)
              }}
              isLimitingCurrentUser={isLimitingCurrentUser}
            />
          </div>
        }
        title='Tag as:'
        trigger='click'
        placement='right'
        onVisibleChange={e => {
          if (e === false) {
            onClose(tagFKs)
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

export default SetTagWithPopover
