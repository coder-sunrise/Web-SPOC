import React from 'react'

import { Zoom } from '@material-ui/core'

export default ({
  show = false,
  timeout = {
    enter: 200,
    exit: 0,
  },
  className,
  children,
  ...props
}) => {
  return (
    <div className={className}>
      <Zoom
        // direction='up'
        in={show}
        // mountOnEnter
        // unmountOnExit
        timeout={timeout}
      >
        <div>{React.cloneElement(children, { props })}</div>
      </Zoom>
    </div>
  )
}
