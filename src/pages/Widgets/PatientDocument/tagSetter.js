import React, { Component, useState, useEffect } from 'react'

import classNames from 'classnames'
// material ui
import { withStyles, Chip } from '@material-ui/core'
import {
  FastField,
  CommonModal,
  Button,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Tabs,
  CardContainer,
  Popover,
  Tooltip,
} from '@/components'

import TagSetterItem from './tagSetterItem'

class TagSetter extends Component {
  constructor (props) {
    super(props)
    // this.carouselRef = React.createRef()
    this.state = {
      tagList: [],
    }
  }

  componentDidMount = () => {
    // window.addEventListener('resize', this._resize, false)
    // setTimeout(this._resize, 100)

    this.setState({ tagList: this.props.tagList })
  }

  render () {
    const { tagList } = this.state

    return (
      <GridContainer style={{ height: 500 }}>
        {tagList.map((t) => {
          return (
            <GridItem md={2}>
              <TagSetterItem file={t} />
            </GridItem>
          )
        })}
      </GridContainer>
    )
  }
}
export default TagSetter
