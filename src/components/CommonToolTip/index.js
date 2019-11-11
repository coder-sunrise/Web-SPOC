import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
// assets
// import { tooltip } from '@/assets/jss/index'

const STYLES = () => ({
  tooltip: {
    // padding: '5px 7px',
    // minWidth: '130px',
    // color: '#FFFFFF',
    // lineHeight: '1.2em',
    // background: 'rgba(85,85,85,0.9)',
    // border: 'none',
    // borderRadius: '3px',
    // opacity: '1!important',
    // boxShadow:
    //   '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2)',
    // textAlign: 'center',
    // // maxWidth: '200px',
    // // fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    // fontSize: '0.75rem',
    // fontStyle: 'normal',
    // fontWeight: '400',
    // textShadow: 'none',
    // textTransform: 'none',
    // letterSpacing: 'normal',
    // wordBreak: 'normal',
    // wordSpacing: 'normal',
    // wordWrap: 'normal',
    // whiteSpace: 'normal',
    // lineBreak: 'auto',
  },
})

class CommonTooltip extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.object.isRequired,
  }

  static defaultProps = {
    title: '',
  }

  render () {
    const {
      classes,
      title,
      children,
      enterDelay = 150,
      placement = 'top',
      ...restProps
    } = this.props

    return (
      <Tooltip
        classes={{ tooltip: classes.tooltip }}
        title={title}
        enterDelay={enterDelay}
        placement={placement}
        {...restProps}
      >
        {children}
      </Tooltip>
    )
  }
}

export default withStyles(STYLES)(CommonTooltip)
