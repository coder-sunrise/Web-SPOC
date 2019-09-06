import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Skeleton from '@material-ui/lab/Skeleton'
import lodash from 'lodash'

const skeleton = (...props) => (Component) => {
  console.log('skeleton', props)
  @connect(({ loading }) => ({
    loading,
  }))
  class BasicComponent extends React.Component {
    shouldComponentUpdate (nextProps) {
      console.log(props, nextProps, this.props)
      console.log(window.g_app)
      const { loading } = nextProps
      console.log(loading.global)
      return !loading.global
    }

    render () {
      const ary = Array.isArray(props)
        ? props
        : [
            props,
          ]
      const { loading } = this.props
      const { models } = loading
      // for (let i = 0; i < ary.length; i++) {
      //   const namespace = ary[i]
      //   console.log(namespace)
      //   if (namespace && models[namespace]) {
      //     return <Skeleton height={6} width='80%' />
      //   } else if (loading.global) {
      //     return <Skeleton height={6} width='80%' />
      //   }
      // }
      // if (loading.global) {
      //   return <Skeleton height={6} width='80%' />
      // }
      return <Component {...this.props} />

      // // console.log(props, Component)
      // return <Skeleton height={6} width='80%' />
      // // return <Component {...this.props} />
    }
  }

  return BasicComponent
}

export default skeleton
