/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import lodash from 'lodash'
import { FastField, withFormik } from 'formik'

// const compare = (ary, a, b, c) => {
//   console.log(this)
//   console.log(ary, a, b, c)
//   return class extends React.Component {
//     shouldComponentUpdate (nextProps, nextStates) {
//       console.log(this.props)
//       console.log(nextProps)

//       console.log(this.state)

//       console.log(nextStates)

//       console.log(this.props === nextProps)
//       console.log(this.state === nextStates)

//       return true
//     }

//     render () {
//       return <React.Fragment {...this.props} />
//     }
//   }
// }
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

// const withFormikExtend = (props) => (Component) => {
//   @withFormik(props)
//   class BasicComponent extends React.Component {
//     shouldComponentUpdate (nextProps, nextStates) {
//       return false
//     }

//     render () {
//       console.log(props, Component)
//       return <Component {...this.props} />
//     }
//   }

//   return BasicComponent
// }

// function withFormikExtend (_a) {
//   var _b = _a.mapPropsToValues,
//     mapPropsToValues =
//       _b === void 0
//         ? function (vanillaProps) {
//             var val = {}

//             for (var k in vanillaProps) {
//               if (
//                 vanillaProps.hasOwnProperty(k) &&
//                 typeof vanillaProps[k] !== 'function'
//               ) {
//                 val[k] = vanillaProps[k]
//               }
//             }

//             return val
//           }
//         : _b,
//     config = __rest(_a, [
//       'mapPropsToValues',
//     ])

//   return function createFormik (Component) {
//     var componentDisplayName =
//       Component.displayName ||
//       Component.name ||
//       (Component.constructor && Component.constructor.name) ||
//       'Component'

//     var C = (function (_super) {
//       __extends(C, _super)

//       function C () {
//         var _this = (_super !== null && _super.apply(this, arguments)) || this

//         _this.validate = function (values) {
//           return config.validate(values, _this.props)
//         }

//         _this.validationSchema = function () {
//           return isFunction$1(config.validationSchema)
//             ? config.validationSchema(_this.props)
//             : config.validationSchema
//         }

//         _this.handleSubmit = function (values, actions) {
//           return config.handleSubmit(
//             values,
//             __assign({}, actions, {
//               props: _this.props,
//             }),
//           )
//         }

//         _this.renderFormComponent = function (formikProps) {
//           return React.createElement(
//             Component,
//             __assign({}, _this.props, formikProps),
//           )
//         }

//         return _this
//       }

//       C.prototype.render = function () {
//         var _a = this.props,
//           children = _a.children,
//           props = __rest(_a, [
//             'children',
//           ])

//         return React.createElement(
//           Formik,
//           __assign({}, props, config, {
//             validate: config.validate && this.validate,
//             validationSchema: config.validationSchema && this.validationSchema,
//             initialValues: mapPropsToValues(this.props),
//             initialStatus:
//               config.mapPropsToStatus && config.mapPropsToStatus(this.props),
//             onSubmit: this.handleSubmit,
//             render: this.renderFormComponent,
//           }),
//         )
//       }

//       C.displayName = 'WithFormik(' + componentDisplayName + ')'
//       return C
//     })(React.Component)

//     return hoistNonReactStatics_cjs(C, Component)
//   }
// }

module.exports = {
  // withFormikExtend,
  compare,
  ...module.exports,
}
