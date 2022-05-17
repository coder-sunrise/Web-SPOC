import React, { useState } from 'react'
import { Switch } from '@/components'
export default function ConsReadySwitch(props) {
  const {
    className,
    onQueueListing,
    disable,
    row: { consReady },
  } = props

  let [state, setState] = useState(consReady)
  const changeState = () => {
    setState(consReady)
  }
  return (
    <React.Fragment>
      <Switch
        checked={state}
        disable={disable}
        className={className}
        onClick={checked => {
          setState(!state)
          onQueueListing({
            ...props.row,
            consReady: checked,
            changeState,
          })
        }}
        {...props}
      />
    </React.Fragment>
  )
}
