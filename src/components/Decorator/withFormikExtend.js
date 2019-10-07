import React, { PureComponent } from 'react'
import _ from 'lodash'
import { FastField, withFormik } from 'formik'
import {
  confirmBeforeReload,
  commonDataReaderTransform,
  findGetParameter,
} from '@/utils/utils'
import AuthorizedContext from '@/components/Context/Authorized'
import Authorized from '@/utils/Authorized'
import Exception403 from '@/pages/Exception/403'

window.beforeReloadHandlerAdded = false
window.dirtyForms = []
// window._localFormik = {}
const _localAuthority = {}
let lastVersion = null
const withFormikExtend = (props) => (Component) => {
  const { displayName, authority, notDirtyDuration = 3 } = props
  let startDirtyChecking = false
  if (displayName) {
    _localAuthority[displayName] = {}
  }
  const updateDirtyState = (ps) => {
    if (!displayName || displayName.indexOf('Filter') > 0) return

    const { errors, dirty, values } = ps
    // console.log(Object.values(errors).length > 0, dirty)
    const _lastFormikUpdate = {
      displayName,
      errors,
      hasError: Object.values(errors).length > 0,
      dirty,
      // values,
      // str: JSON.stringify(values),
    }
    const ob = window.g_app._store.getState().formik[displayName]
    if (_.isEqual(_lastFormikUpdate, ob)) {
      return
    }
    // console.log(window._localFormik[displayName], _lastFormikUpdate)

    // console.log(_lastFormikUpdate)
    window.g_app._store.dispatch({
      type: 'formik/updateState',
      payload: {
        [displayName]: _lastFormikUpdate,
      },
    })
    if (dirty && !window.beforeReloadHandlerAdded) {
      window.beforeReloadHandlerAdded = true
      window.dirtyForms.push(displayName)
      window.addEventListener('beforeunload', confirmBeforeReload)
    } else if (!dirty && window.beforeReloadHandlerAdded) {
      window.beforeReloadHandlerAdded = false
      window.removeEventListener('beforeunload', confirmBeforeReload)
      window.dirtyForms = _.reject(window.dirtyForms, (v) => v === displayName)
    }
  }

  const _updateDirtyState = _.debounce(updateDirtyState, 250, { maxWait: 1000 })

  // const { mapPropsToValues } = props
  // console.log(props, lastVersion)
  @withFormik({
    // enableReinitialize: lastVersion !== findGetParameter('v'),
    ...props,
    // mapPropsToValues: (p) => {
    //   // console.log(2, p, props)

    //   const { mapPropsToValues } = props
    //   if (!mapPropsToValues) {
    //     return null
    //   }
    //   // console.log('commonDataReaderTransform', p, _localAuthority[displayName].disabled)

    //   return mapPropsToValues({
    //     ...p,
    //     disabled: _localAuthority[displayName].disabled,
    //   })
    // },
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
  class FormComponet extends React.Component {
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
      startDirtyChecking = false
      setTimeout(() => {
        startDirtyChecking = true
      }, notDirtyDuration * 1000)
    }

    componentWillReceiveProps (nextProps) {
      // console.log(nextProps)
      if (startDirtyChecking) _updateDirtyState(nextProps)
    }

    componentWillUnmount () {
      startDirtyChecking = false
    }

    render () {
      if (!displayName) return <Component {...this.props} />
      // lastVersion = findGetParameter('v')

      const rights = {}
      if (authority) {
        if (authority.view) {
          rights.view = { name: authority.view, rights: 'enable' }
        }
        if (authority.edit) {
          rights.edit = { name: authority.edit, rights: 'enable' }
        }
      }
      if (_localAuthority[displayName].matches)
        return (
          <AuthorizedContext.Provider
            value={{ ...rights, matches: _localAuthority[displayName].matches }}
          >
            <Component {...this.props} />
          </AuthorizedContext.Provider>
        )

      return authority ? (
        <Authorized
          authority={[
            rights.view,
            rights.edit,
          ]}
          noMatch={() => {
            console.log('nomatch', this.props)

            return <Exception403 />
          }}
        >
          {(matches) => {
            window.g_app._store.dispatch({
              type: 'components/updateState',
              payload: {
                [displayName]: {
                  matches,
                  view: !!matches.find((o) => o.name.indexOf('.view') >= 0),
                  edit: !!matches.find((o) => o.name.indexOf('.edit') >= 0),
                },
              },
            })
            _localAuthority[displayName].matches = matches
            return Authorized.generalCheck(
              matches,
              this.props,
              <AuthorizedContext.Provider value={{ ...rights, matches }}>
                <Component {...this.props} />
              </AuthorizedContext.Provider>,
            )
          }}
        </Authorized>
      ) : (
        <Component {...this.props} />
      )
    }
  }

  return FormComponet
}

export default withFormikExtend
