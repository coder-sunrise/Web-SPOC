import React, { PureComponent } from 'react'
import { formatMessage, Link } from 'umi'

import Exception from '@/components/Exception'
import { Button } from '@/components'
import { connect } from 'dva'

class Exception403 extends PureComponent {
  render() {
    return (
      <Exception
        type='403'
        desc={formatMessage({ id: 'app.exception.description.403' })}
        linkElement={Link}
        backText={formatMessage({ id: 'app.exception.back' })}
        actions={
          <Button
            color='primary'
            onClick={() => {
              this.props.history.push('/')
            }}
          >
            back to queue
          </Button>
        }
      />
    )
  }
}

export default Exception403
