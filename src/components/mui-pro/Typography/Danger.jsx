import React from 'react'
import PropTypes from 'prop-types'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'

import typographyStyle from 'mui-pro-jss/material-dashboard-pro-react/components/typographyStyle.jsx'

function Danger ({ ...props }) {
  const { classes, children, ...restProps } = props
  return (
    <div
      className={classes.defaultFontStyle + ' ' + classes.dangerText}
      {...restProps}
    >
      {children}
    </div>
  )
}

Danger.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(typographyStyle)(Danger)
