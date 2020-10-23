import React, { PureComponent, Component } from 'react'
import _ from 'lodash'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { MenuList } from '@material-ui/core'
import DragableItem from './DragableItem'

class DragableList extends Component {
  render () {
    const { folderList, selectedFolderFK, readOnly, ...restProps } = this.props

    return (
      // MenuList
      <MenuList>
        {folderList &&
          folderList.length > 0 &&
          folderList.map((item, i) => (
            <DragableItem
              key={item.id}
              item={item}
              index={i}
              isSelected={item.id === selectedFolderFK}
              readOnly={readOnly}
              {...restProps}
            />
          ))}
      </MenuList>
    )
  }
}

export default DragDropContext(HTML5Backend)(DragableList)
