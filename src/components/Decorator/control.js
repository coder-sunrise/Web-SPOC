import React, { PureComponent } from 'react'
import lodash from 'lodash'
import { FastField, withFormik } from 'formik'
import { confirmBeforeReload } from '@/utils/utils'
import { buttonTypes } from '@/utils/codes'
import Authorized from '@/utils/Authorized'

const control = ({ disabledProps } = {}) => (Component) => {
  class BasicComponent extends React.PureComponent {
    // shouldComponentUpdate (nextProps, nextStates) {
    //   return false
    // }

    // constructor (props) {
    //   super(props)
    // }

    // componentDidMount () {}

    // UNSAFE_componentWillReceiveProps (nextProps) {}

    render () {
      if (this.props.authority === 'none') {
        return <Component {...this.props} />
      }
      // console.log(disabledProps)
      const extraCfg = {}
      if (disabledProps) {
        extraCfg[disabledProps] = true
      }

      // console.log(props, this.props, Component)
      return (
        <Authorized.Context.Consumer>
          {(matches) => {
            // console.log(Component, matches)
            if (matches) {
              return Authorized.generalCheck(
                matches,
                this.props,
                <Component {...this.props} {...extraCfg} />,
              )
            }
            return <Component {...this.props} />
            // return (
            //   <Authorized
            //     authority={[
            //       view,
            //       edit,
            //     ].filter((o) => !!o)}
            //     noMatch={() => {
            //       if (!this.props.hideIfNoEditRights) {
            //         if (buttonTypes.indexOf(Component.displayName) >= 0) {
            //           return null
            //         }
            //         return <Component {...this.props} disabled {...extraCfg} />
            //       }
            //       return null
            //     }}
            //   >
            //     {(m) => {
            //       return Authorized.generalCheck(
            //         m,
            //         this.props,
            //         <Component {...this.props} {...extraCfg} />,
            //       )
            //     }}
            //   </Authorized>
            // )
          }}
        </Authorized.Context.Consumer>
      )
    }
  }

  return BasicComponent
}

export default control
