import React from 'react'
import { connect } from 'dva'
// import { makeStyles } from '@material-ui/styles'
import { withStyles } from '@material-ui/core/styles'

// nodejs library that concatenates classes
import Save from '@material-ui/icons/Save'
import Refresh from '@material-ui/icons/Refresh'

import green from '@material-ui/core/colors/green'
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'

// material-ui components
import RegularButton from './index'

@connect(({ loading, global }) => ({ loading, global }))
class ProgressButton extends React.PureComponent {
  static displayName = 'ProgressButton'

  componentDidMount () {}

  // onClick = () => {
  //   const { props } = this
  //   const { onClick } = props
  //   // console.log(onClick)
  // }

  render () {
    const { props } = this
    const {
      disabled,
      loading,
      global,
      children,
      dispatch,
      color = 'primary',
      icon = <Save />,
      text = 'Save',
      submitKey,
      classes,
      onClick,
      ...rest
    } = props

    const _disabled =
      disabled || loading.global || (global && global.disableSave)
    return (
      <RegularButton
        color={color}
        disabled={_disabled}
        data-button-type='progress'
        {...rest}
        onClick={onClick}
      >
        {loading.effects[submitKey] ? (
          <Refresh className='spin-custom' />
        ) : (
          icon
        )}
        {children || text}
      </RegularButton>
    )
  }
}
// ProgressButton.propTypes = {}

// export default withStyles(styles, { withTheme: true })(ProgressButton)
export default ProgressButton
