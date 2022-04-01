import React, { useState } from 'react'
import { Popover } from 'antd'

// This component is for display visit order template details.
// Has 2 kinds of data source, one is from order cart, one is from persisted VisitOrderTemplateDetails in visit table(need to extract the information first)
const VisitOrderTemplateIndicateString = props => {
  const { visitOrderTemplateDetails, oneline } = props
  let indicate = {}
  if (visitOrderTemplateDetails) {
    const temp = JSON.parse(visitOrderTemplateDetails)
    indicate = {
      indicateString: temp.visitPurpose,
      removedItemString: (temp.removedItems || []).join(' - '),
      newItemString: (temp.addedItems || []).join(' + '),
    }
  }
  const indicateStringContent = (
    <span className={oneline ? '' : 'threeline_textblock'}>
      {indicate?.indicateString ? (
        <span>{indicate.indicateString}</span>
      ) : (
        <span></span>
      )}
      {indicate?.removedItemString ? (
        <span style={{ color: '#FF0000' }}>
          {` - ${indicate.removedItemString}`}
        </span>
      ) : (
        <span></span>
      )}
      {indicate?.newItemString ? (
        <span
          style={{ color: '#389e0d' }}
        >{` + ${indicate.newItemString}`}</span>
      ) : (
        <span></span>
      )}
    </span>
  )
  const indicateStringContent_Full = (
    <span>
      {indicate?.indicateString ? (
        <span>{indicate.indicateString}</span>
      ) : (
        <span></span>
      )}
      {indicate?.removedItemString ? (
        <span style={{ color: '#FF0000' }}>
          {` - ${indicate.removedItemString}`}
        </span>
      ) : (
        <span></span>
      )}
      {indicate?.newItemString ? (
        <span style={{ color: '#389e0d' }}>
          {` + ${indicate.newItemString}`}
        </span>
      ) : (
        <span></span>
      )}
    </span>
  )
  return (
    <Popover
      style={{ width: 500 }}
      placement='topLeft'
      overlayStyle={{ width: 500 }}
      content={indicateStringContent_Full}
      title='Visit Purpose Details'
      trigger='hover'
    >
      {indicateStringContent}
    </Popover>
  )
}

export default VisitOrderTemplateIndicateString
