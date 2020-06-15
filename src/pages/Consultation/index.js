import React from 'react'
import { connect } from 'dva'
import Main from './WebSocketWrapperMain'

@connect(({ consultation }) => ({
  consultation,
}))
class Consultation extends React.Component {
  render () {
    if (!this.props.consultation.entity) return null
    return <Main />
  }
}

export default Consultation
