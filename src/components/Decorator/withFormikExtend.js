import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FastField, withFormik } from 'formik'
import { confirmBeforeReload, sortAll } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'

window.beforeReloadHandlerAdded = false
let lastFormikUpdate = {}
const withFormikExtend = (props) => (Component) => {
  const { displayName, authority } = props
  const updateDirtyState = (ps) => {
    if (!displayName || displayName.indexOf('Filter') > 0) return
    const { errors, dirty, values } = ps
    // console.log(Object.values(errors).length > 0, dirty)
    const _lastFormikUpdate = {
      [displayName]: {
        displayName,
        errors,
        hasError: Object.values(errors).length > 0,
        dirty,
      },
    }
    if (!_.isEqual(_lastFormikUpdate, lastFormikUpdate)) {
      // console.log(lastFormikUpdate, _lastFormikUpdate)

      lastFormikUpdate = _lastFormikUpdate
    } else {
      return
    }
    window.g_app._store.dispatch({
      type: 'formik/updateState',
      payload: _lastFormikUpdate,
    })
    if (dirty && !window.beforeReloadHandlerAdded) {
      window.beforeReloadHandlerAdded = true
      window.addEventListener('beforeunload', confirmBeforeReload)
    } else if (!dirty && window.beforeReloadHandlerAdded) {
      window.beforeReloadHandlerAdded = false
      window.removeEventListener('beforeunload', confirmBeforeReload)
    }
  }
  @withFormik({
    ...props,
    mapPropsToValues: (p) => {
      // console.log(2, p, props)

      const { mapPropsToValues } = props
      if (!mapPropsToValues) {
        return null
      }
      return sortAll(mapPropsToValues(p))
    },
    // handleSubmit: (values, ps, a, b) => {
    //   const { handleSubmit: orghandleSubmit } = props
    //   orghandleSubmit.call(this, values, ps)
    //   setTimeout(() => {
    //     updateDirtyState({
    //       displayName,
    //       errors: {},
    //       dirty: false,
    //     })
    //   }, 200)
    // },
  })
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
      updateDirtyState(nextProps)
    }

    render () {
      const rights = {}
      if (authority) {
        if (authority.view) {
          rights.view = { name: authority.view, rights: 'enable' }
        }
        if (authority.edit) {
          rights.edit = { name: authority.edit, rights: 'enable' }
        }
      }
      // console.log(this.props)

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
