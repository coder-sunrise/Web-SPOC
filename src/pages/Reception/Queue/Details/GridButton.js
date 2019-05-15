import React, { PureComponent } from 'react'

import { Button } from '@/components'

class GridButton extends PureComponent {
  handleClick = () => {
    const { onClick, row } = this.props
    onClick(row)
  }

  render () {
    const { Icon } = this.props
    return (
      <Button
        size='sm'
        onClick={this.handleClick}
        justIcon
        round
        color='primary'
        // style={{ marginRight: 5 }}
      >
        {Icon}
      </Button>
    )
  }
}

export default GridButton
