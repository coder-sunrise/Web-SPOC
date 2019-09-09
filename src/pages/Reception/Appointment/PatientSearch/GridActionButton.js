import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'umi/locale'

import { Create } from '@material-ui/icons'

// custom component
import { Button } from '@/components'

class ViewDetailsBtn extends PureComponent {
  handleClick = () => {
    const { onClick, row } = this.props
    onClick(row.id)
  }

  render () {
    const { btnText = 'Action' } = this.props
    return (
      <Button
        size='sm'
        onClick={this.handleClick}
        color='primary'
        simple
        className='noPadding'
      >
        <Create />
        {btnText}
      </Button>
    )
  }
}

ViewDetailsBtn.propTypes = {
  btnText: PropTypes.string,
  row: PropTypes.object,
  onClick: PropTypes.func.isRequired,
}

export default ViewDetailsBtn
