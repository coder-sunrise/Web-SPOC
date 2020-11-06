import React, { Component, useState } from 'react'
import moment from 'moment'
import _ from 'lodash'
import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  Popover,
  Checkbox,
  IconButton,
} from '@/components'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { CreateNewFolder, AddCircle } from '@material-ui/icons'

class SetFolderWithPopover extends Component {
  constructor (props) {
    super(props)
    this.state = { newFolder: '', folderFKs: [] }
  }

  setNewFolder = (name) => {
    this.setState({ newFolder: name })
  }

  setFolderFKs = (folderFKs) => {
    this.setState({ folderFKs })
  }

  componentDidMount = () => {
    const { selectedFolderFKs = [] } = this.props
    this.setFolderFKs(_.sortedUniq(selectedFolderFKs))
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const folderFKs = _.sortedUniq(this.props.selectedFolderFKs)
    const nextFolderFKs = _.sortedUniq(nextProps.selectedFolderFKs)
    if (
      folderFKs.length !== nextFolderFKs.length ||
      nextFolderFKs.join(',') !== folderFKs.join(',')
    ) {
      this.setFolderFKs(nextFolderFKs)
    }
  }

  render () {
    const { folderList = [], onClose, onAddNewFolders, justIcon } = this.props
    const { folderFKs, newFolder } = this.state

    return (
      <Popover
        icon={null}
        content={
          <List dense>
            <div
              style={{
                width: '100%',
                maxHeight: 200,
                overflow: 'scroll',
              }}
            >
              {folderList.filter((f) => f.id > 0).map((item) => {
                return (
                  <ListItem key={item.id} button style={{ paddingLeft: 0 }}>
                    <Checkbox
                      simple
                      label={item.displayValue}
                      checked={folderFKs.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.value) {
                          this.setFolderFKs(
                            _.uniq([
                              ...folderFKs,
                              item.id,
                            ]),
                          )
                        } else {
                          this.setFolderFKs(
                            _.uniq(folderFKs.filter((f) => f !== item.id)),
                          )
                        }
                      }}
                    />
                  </ListItem>
                )
              })}
            </div>

            <div style={{ display: 'flex' }}>
              <TextField
                label='New Folder'
                maxLength={50}
                onChange={(e) => {
                  this.setNewFolder(e.target.value)
                }}
              />
              <div style={{ width: 25, marginLeft: 8, marginRight: 0 }}>
                <Button
                  size='sm'
                  onClick={() => {
                    const maxSort = _.maxBy(
                      folderList.filter((f) => f.id > 0),
                      'sortOrder',
                    )
                    const entity = {
                      code: newFolder,
                      displayValue: newFolder,
                      description: newFolder,
                      sortOrder: maxSort ? maxSort.sortOrder + 1 : 1,
                      effectiveStartDate: moment().formatUTC(true),
                      effectiveEndDate: moment('2099-12-31').formatUTC(true),
                    }
                    onAddNewFolders(entity)
                  }}
                  justIcon
                  round
                  color='primary'
                  style={{ marginTop: 20 }}
                >
                  <AddCircle />
                </Button>
              </div>
            </div>
          </List>
        }
        title='Folder as:'
        trigger='click'
        placement='right'
        onVisibleChange={(e) => {
          if (e === false) {
            onClose(folderFKs)
          }
        }}
      >
        {justIcon ? (
          <IconButton color='primary'>
            <CreateNewFolder style={{ width: 25, height: 25 }} />
          </IconButton>
        ) : (
          <Button color='primary' justIcon>
            <CreateNewFolder />
          </Button>
        )}
      </Popover>
    )
  }
}

export default SetFolderWithPopover
