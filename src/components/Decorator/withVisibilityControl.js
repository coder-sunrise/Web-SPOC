import React from 'react'
// dva
import { connect } from 'dva'
// utils
import { CLINIC_SPECIALIST } from '@/utils/constants'

const withVisibilityControl = ({
  hiddenFor = CLINIC_SPECIALIST.GP,
  hideWhen = () => false,
}) => (Component) => {
  @connect(({ clinicInfo }) => ({ clinicInfo }))
  class Wrapper extends React.Component {
    render () {
      const { clinicInfo, ...restProps } = this.props
      const { clinicSpecialist = CLINIC_SPECIALIST.GP } = clinicInfo
      const resultOfHideWhen = hideWhen(this.props)
      if (hiddenFor === clinicSpecialist || resultOfHideWhen === true)
        return null

      return <Component {...restProps} />
    }
  }

  return Wrapper
}

export default withVisibilityControl
