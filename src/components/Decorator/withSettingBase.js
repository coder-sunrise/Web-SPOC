import React from 'react'

const withSettingBase = ({ modelName = '' }) => (Component) => {
  class SettingBase extends React.Component {
    componentWillUnmount () {
      this.props.dispatch({
        type: `${modelName}/updateState`,
        payload: {
          list: [],
          filter: {},
        },
      })
    }

    render () {
      return <Component {...this.props} />
    }
  }

  return SettingBase
}

export default withSettingBase
// @withSettingBase({ modelName: '' })
