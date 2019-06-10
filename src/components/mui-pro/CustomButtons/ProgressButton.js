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

@connect(({ loading }) => ({ loading }))
class ProgressButton extends React.Component {
  render () {
    const { props } = this
    // console.log(props)
    const {
      disabled,
      loading,
      children,
      dispatch,
      color = 'primary',
      icon = <Save />,
      text = 'Save',
      submitKey,
      classes,
      ...rest
    } = props
    return (
      <RegularButton
        color={color}
        disabled={disabled || loading.global}
        data-button-type={'progress'}
        {...rest}
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
ProgressButton.propTypes = {}

// export default withStyles(styles, { withTheme: true })(ProgressButton)
export default ProgressButton
