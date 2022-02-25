import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
// assets
// import { tooltip } from '@/assets/jss/index'

const STYLES = () => ({
  tooltip: {
    fontSize: '0.8rem',
  },
  tooltip2: {
    fontSize: '0.8rem',
    maxWidth: 540,
  },
  popper: {
    zIndex: 3000,
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
      enterDelay = 750,
      placement = 'top-start',
      useTooltip2 = false,
      ...restProps
    } = this.props
    return (
      <Tooltip
        classes={{
          tooltip: useTooltip2 ? classes.tooltip2 : classes.tooltip,
          popper: classes.popper,
        }}
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
