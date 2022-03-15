import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'umi'
// material ui
import Add from '@material-ui/icons/Add'
// custom component
import { Button } from '@/components'
import Authorized from '@/utils/Authorized'
class ViewDetailsBtn extends PureComponent {
  handleClick = () => {
    const { onClick, row } = this.props
    onClick(row.id)
  }

  render() {
    return (
      <Authorized authority='queue.registervisit'>
        <Button
          style={{ marginRight: 0 }}
          size='sm'
          color='primary'
          onClick={this.handleClick}
        >
          <Add />
          New Visit
        </Button>
      </Authorized>
    )
  }
}

ViewDetailsBtn.propTypes = {
  row: PropTypes.object,
  onClick: PropTypes.func.isRequired,
}

export default ViewDetailsBtn
