import React from 'react'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'

const innerStyle = (theme) => ({
  grid: {
    // padding: `0 ${theme.spacing.unit}px`,
  },
})

function GridItem ({ ...props }) {
  const {
    classes,
    theme,
    children,
    className,
    gutter = theme.spacing.unit,
    style,
    ...rest
  } = props
  return (
    <Grid
      item
      // justify='flex-end'
      // direction='column'
      {...rest}
      className={`${classes.grid} ${className}`}
      style={{
        padding: `0 ${gutter}px`,
        ...style,
      }}
    >
      {children}
    </Grid>
  )
}

export default withStyles(innerStyle, { withTheme: true })(GridItem)
