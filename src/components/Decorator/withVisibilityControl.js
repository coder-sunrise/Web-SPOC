import React from 'react'
// dva
import { connect } from 'dva'
// utils
import { CLINIC_TYPE } from '@/utils/constants'

const withVisibilityControl = ({
  hiddenFor = CLINIC_TYPE.GP,
  hideWhen = () => false,
}) => (Component) => {
  @connect(({ clinicInfo }) => ({ clinicInfo }))
  class Wrapper extends React.Component {
    render () {
      const { clinicInfo, ...restProps } = this.props
      const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
      const resultOfHideWhen = hideWhen(this.props)
      if (hiddenFor === clinicTypeFK || resultOfHideWhen === true) return null

      return <Component {...restProps} />
    }
  }

  return Wrapper
}

export default withVisibilityControl
