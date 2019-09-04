import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
// assets
import { tooltip } from '@/assets/jss/index'

const STYLES = () => ({ tooltip })

class CommonTooltip extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
  }

  render () {
    const {
      classes,
      title,
      children,
      enterDelay = 500,
      ...restProps
    } = this.props
    return (
      <Tooltip
        title={title}
        enterDelay={enterDelay}
        // classes={{ tooltip: classes.tooltip }}
        {...restProps}
      >
        {children}
      </Tooltip>
    )
  }
}

export default withStyles(STYLES)(CommonTooltip)
