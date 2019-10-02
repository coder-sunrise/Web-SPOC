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
const _localFormik = {}
const _localAuthority = {}
let lastVersion = null
const withFormikExtend = (props) => (Component) => {
  const { displayName, authority } = props
  if (displayName) {
    _localAuthority[displayName] = {}
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
        // values,
        // str: JSON.stringify(values),
      },
    }
    if (!_.isEqual(_lastFormikUpdate, _localFormik[displayName])) {
      // console.log(_localFormik[displayName], _lastFormikUpdate)
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

  return BasicComponent
}

export default withFormikExtend
