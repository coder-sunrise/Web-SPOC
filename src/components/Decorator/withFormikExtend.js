import React, { PureComponent } from 'react'
import lodash from 'lodash'
import { confirmBeforeReload } from '@/utils/utils'
import { FastField, withFormik } from 'formik'
import AuthorizedContext from '@/components/Context/Authorized'

window.beforeReloadHandlerAdded = false
const withFormikExtend = (props) => (Component) => {
  const { displayName, authority } = props

  @withFormik(props)
  class BasicComponent extends React.Component {
    // shouldComponentUpdate (nextProps, nextStates) {
    //   return false
    // }

    // constructor (props) {
    //   super(props)
    // }

    componentDidMount () {
      if (!this.props.values.id) {
        this.props.validateForm()
      }
    }

    componentWillReceiveProps (nextProps) {
      // console.log(nextProps)
      if (!displayName || displayName.indexOf('Filter') > 0) return
      const { errors, dirty } = nextProps
      // console.log(Object.values(errors).length > 0, dirty)
      window.g_app._store.dispatch({
        type: 'formik/updateState',
        payload: {
          [props.displayName]: {
            displayName,
            errors,
            hasError: Object.values(errors).length > 0,
            dirty,
          },
        },
      })
      if (dirty && !window.beforeReloadHandlerAdded) {
        window.beforeReloadHandlerAdded = true
        window.addEventListener('beforeunload', confirmBeforeReload)
      } else if (!dirty && window.beforeReloadHandlerAdded) {
        window.beforeReloadHandlerAdded = false
        window.removeEventListener('beforeunload', confirmBeforeReload)
      }
    }

    render () {
      // console.log(props, this.props, Component)
      const rights = {}
      if (authority.view) {
        rights.view = { name: authority.view, rights: 'enable' }
      }
      if (authority.edit) {
        rights.edit = { name: authority.edit, rights: 'enable' }
      }
      return authority ? (
        <AuthorizedContext.Provider value={rights}>
          <Component {...this.props} />
        </AuthorizedContext.Provider>
      ) : (
        <Component {...this.props} />
      )
    }
  }

  return BasicComponent
}

export default withFormikExtend
