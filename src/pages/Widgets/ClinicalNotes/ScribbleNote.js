import React, { PureComponent } from 'react'

import { Scribble } from '@/components'

class ScribbleNote extends PureComponent {
  render () {
    const {
      toggleScribbleModal,
    } = this.props
    return (
      <div>
        <Scribble toggleScribbleModal={toggleScribbleModal} />
      </div>
    )
  }
}

export default ScribbleNote
