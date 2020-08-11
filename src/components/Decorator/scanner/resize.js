import React, { Component } from 'react'
import _ from 'lodash'

import { GridContainer, GridItem, Button, NumberInput } from '@/components'

export default class ResizeImage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      width: undefined,
      height: undefined,
    }
  }

  componentDidMount () {
    this.setState({
      width: this.props.width,
      height: this.props.height,
    })
  }

  handleOnConfirm = () => {
    const { onConfirm } = this.props
    onConfirm(this.state)
  }

  render () {
    return (
      <GridContainer style={{ width: 300 }}>
        <GridItem xs={12} md={12}>
          <div style={{ display: 'flex' }}>
            <NumberInput
              label='Width'
              // disabled={!isScale || (scaleBy !== 'W' && scaleBy !== 'WH')}
              value={this.state.width}
              min={1}
              onChange={(e) => {
                this.setState({ width: e.target.value })
              }}
            />
            <div style={{ width: 60, marginTop: 30, textAlign: 'center' }}>
              x
            </div>
            <NumberInput
              label='Height'
              // disabled={!isScale || (scaleBy !== 'H' && scaleBy !== 'WH')}
              value={this.state.height}
              min={1}
              onChange={(e) => {
                this.setState({ height: e.target.value })
              }}
            />
          </div>
        </GridItem>
        <GridItem xs={12} md={12}>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Button color='danger'>Cancel</Button>
            <Button color='primary' onClick={this.handleOnConfirm}>
              Confirm
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    )
  }
}
