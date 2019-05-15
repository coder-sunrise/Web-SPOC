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
    return (
      <Button
        size='sm'
        onClick={this.handleClick}
        color='rose'
        simple
        className='noPadding'
      >
        <Create />
        <FormattedMessage id='reception.queue.patientSearch.registerVisit' />
      </Button>
    )
  }
}

ViewDetailsBtn.propTypes = {
  row: PropTypes.object,
  onClick: PropTypes.func.isRequired,
}

export default ViewDetailsBtn
