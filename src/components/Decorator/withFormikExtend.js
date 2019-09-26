import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FastField, withFormik } from 'formik'
import { confirmBeforeReload, commonDataReaderTransform } from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'
import Authorized from '@/utils/Authorized'

window.beforeReloadHandlerAdded = false
const _localFormik = {}
const _localAuthority = {}
const withFormikExtend = (props) => (Component) => {
  const { displayName, authority } = props
  if (displayName) {
    _localAuthority[displayName] = {
      authority,
    }
  }
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
        values,
        str: JSON.stringify(values),
      },
    }
    if (!_.isEqual(_lastFormikUpdate, _localFormik[displayName])) {
      console.log(_localFormik[displayName], _lastFormikUpdate)
      _localFormik[displayName] = _lastFormikUpdate
    } else {
      return
    }
    // console.log(_lastFormikUpdate)
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
      // console.log('commonDataReaderTransform', p, _localAuthority[displayName].disabled)

      return mapPropsToValues({
        ...p,
        disabled: _localAuthority[displayName].disabled,
      })
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
    state = {
      authority,
    }

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
      if (_localAuthority[displayName].component)
        return _localAuthority[displayName].component
      const rights = {}
      if (authority) {
        if (authority.view) {
          rights.view = { name: authority.view, rights: 'enable' }
        }
        if (authority.edit) {
          rights.edit = { name: authority.edit, rights: 'enable' }
        }
      }
      // console.log(authority, this.state.authority)
      return authority ? (
        <Authorized
          authority={[
            rights.view,
            rights.edit,
          ]}
          noMatch={() => {
            console.log('nomatch', this.props)

            return null
          }}
        >
          {(matches) => {
            console.log('matches', matches)
            _localAuthority[displayName].matches = matches
            _localAuthority[
              displayName
            ].component = Authorized.generalCheck(
              matches,
              this.props,
              <AuthorizedContext.Provider value={{ ...rights, matches }}>
                <Component {...this.props} />
              </AuthorizedContext.Provider>,
              () => {
                // _localAuthority[displayName].disabled = true
                return (
                  <AuthorizedContext.Provider
                    value={{ ...rights, disabled: true, matches }}
                  >
                    <Component {...this.props} disabled />
                  </AuthorizedContext.Provider>
                )
              },
            )
            return _localAuthority[displayName].component
          }}
        </Authorized>
      ) : (
        <Component {...this.props} />
      )
    }
  }

  return BasicComponent
}

export default withFormikExtend
