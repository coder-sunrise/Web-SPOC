import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'umi/locale'
// material ui
import { Tooltip } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// custom component
import { Button } from '@/components'

class ViewDetailsBtn extends PureComponent {
  handleClick = () => {
    const { onClick, row } = this.props
    onClick(row.id)
  }

  render () {
    return (
      <Tooltip title='Register Visit'>
        <Button
          size='sm'
          justIcon
          round
          onClick={this.handleClick}
          color='primary'
          className='noPadding'
        >
          <Add />
        </Button>
      </Tooltip>
    )
  }
}

ViewDetailsBtn.propTypes = {
  row: PropTypes.object,
  onClick: PropTypes.func.isRequired,
}

export default ViewDetailsBtn
