import React from 'react'
import { Link, formatMessage } from 'umi'

import Exception from '@/components/Exception'
import { Button } from '@/components'

export default () => (
  <Exception
    type='500'
    linkElement={Link}
    // redirect='/reception/appointment'
    actions={
      <Button
        color='primary'
        onClick={() => {
          window.location.reload(true)
        }}
      >
        Refresh
      </Button>
    }
    desc={formatMessage({ id: 'app.exception.description.500' })}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
)
