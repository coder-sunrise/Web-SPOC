import React from 'react'
import withWebSocket from '@/components/Decorator/withWebSocket'
import Main from './Main'

const WebSocketWrapper = ({ handlePrint, ...restProps }) => {
  return <Main handlePrint={handlePrint} {...restProps} />
}
export default withWebSocket()(WebSocketWrapper)
