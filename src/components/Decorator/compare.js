import React, { PureComponent } from 'react'
import lodash from 'lodash'

const compare = (...props) => (Component) => {
  // console.log(props)
  return class BasicComponent extends React.Component {
    shouldComponentUpdate (nextProps, nextStates) {
      // console.log(this.props)
      // console.log(nextProps)

      // console.log(this.state)

      // console.log(nextStates)

      // console.log(this.props === nextProps)
      // console.log(this.state === nextStates)
      if (!props.length) {
        props = Object.keys(nextProps)
      }
      for (let i = 0, l = props.length; i < l; i++) {
        if (
          nextProps[props[i]] !== this.props[props[i]] &&
          !lodash.isEqual(nextProps[props[i]], this.props[props[i]])
        ) {
          // console.log(
          //   props[i],
          //   nextProps[props[i]],
          //   this.props[props[i]],
          //   lodash.isEqual(nextProps[props[i]], this.props[props[i]]),
          // )
          return true
        }
      }
      return false
    }

    render () {
      // console.log(props, Component)
      return <Component {...this.props} />
    }
  }
}

export default compare
