import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget, useDrag, useDrop } from 'react-dnd'
import { MenuItem, ListItemText, ListItemIcon } from '@material-ui/core'
import _ from 'lodash'
import { IconButton, Button, Badge, TextField } from '@/components'
import { DragIndicator, Delete } from '@material-ui/icons'

const Types = {
  Folder: 'Folder',
}
const ItemSource = {
  canDrag (props, monitor, component) {
    const { item } = props
    return item.id > 0
  },
  beginDrag (props, monitor, component) {
    return {
      index: props.index,
    }
  },
  endDrag (props, monitor, component) {
    props.onEndDrag && props.onEndDrag(props)
  },
}
const ItemTarget = {
  canDrop (props, monitor) {
    return props.index > 0
  },
  hover (props, monitor, component) {
    if (!component) {
      return null
    }
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    if (dragIndex === props.lastIndex || hoverIndex === props.lastIndex) {
      return null
    }
    if (dragIndex === hoverIndex) {
      return null
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return null
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return null
    }
    props.onMoving && props.onMoving(dragIndex, hoverIndex)
    monitor.getItem().index = hoverIndex
  },
}
function dropCollect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  }
}
function dragCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

class DragableItem extends Component {
  render () {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      connectDragPreview,
      item,
      isSelected,
      onItemClick,
      onItemChanged,
      isEditMode,
    } = this.props

    let opacity = isDragging ? 0.4 : 1
    const isItemAll = item.id === -99
    return connectDropTarget(
      <div>
        {connectDragPreview(
          <div
            style={{
              opacity,
              marginRight: 25,
              border: isDragging ? '1px dashed gray' : '0px',
            }}
          >
            {isEditMode && !isItemAll ? (
              <TextField
                style={{ float: 'left', paddingLeft: 10 }}
                value={item.displayValue}
                onChange={(e) => {
                  onItemChanged({ ...item, displayValue: e.target.value })
                }}
              />
            ) : (
              <MenuItem
                key={item.id}
                selected={isSelected}
                onClick={(e) => {
                  onItemClick(item)
                }}
                style={{ float: 'left', width: '100%', paddingRight: 0 }}
              >
                <ListItemText primary={<span>{item.displayValue}</span>} />
              </MenuItem>
            )}

            <div
              style={{
                float: 'right',
                width: 80,
                height: '100%',
                marginRight: -80,
                marginTop: 10,
              }}
            >
              {isEditMode ? (
                item.fileCount === 0 && (
                  <Button
                    color='danger'
                    justIcon
                    style={{ marginRight: 10, marginLeft: 10 }}
                    onClick={(e) => {
                      onItemChanged({ ...item, isDeleted: true })
                    }}
                  >
                    <Delete />
                  </Button>
                )
              ) : (
                connectDragSource(
                  <div style={{ cursor: !isItemAll ? 'move' : 'pointer' }}>
                    <Badge
                      badgeContent={item.fileCount}
                      color='primary'
                      overlap='circle'
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {isItemAll ? (
                        <div style={{ marginRight: 10, width: 18 }} />
                      ) : (
                        <DragIndicator
                          style={{ marginRight: 10 }}
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        />
                      )}
                    </Badge>
                  </div>,
                )
              )}
            </div>

            <div style={{ clear: 'both' }} />
          </div>,
        )}
      </div>,
    )
  }
}

export default _.flow(
  DropTarget(Types.Folder, ItemTarget, dropCollect),
  DragSource(Types.Folder, ItemSource, dragCollect),
)(DragableItem)
