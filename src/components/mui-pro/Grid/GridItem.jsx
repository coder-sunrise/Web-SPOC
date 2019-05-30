import React from 'react'
import cx from 'classnames'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'

const innerStyle = (theme) => ({
  grid: {
    // padding: `0 ${theme.spacing.unit}px`,
  },
  noStartEndPadding: {
    '&:first-child': {
      paddingLeft: '0 !important',
    },
    '&:last-child': {
      paddingRight: '0 !important',
    },
  },
})

function GridItem ({
  classes,
  theme,
  children,
  className,
  gutter = theme.spacing.unit,
  style,
  gridLayout = false,
  ...rest
}) {
  // console.log(classes, theme, children, className, gutter, style, rest)
  const cls = cx({
    [classes.grid]: true,
    [classes.noStartEndPadding]: gridLayout,
  })
  return (
    <Grid
      item
      // justify='flex-end'
      // direction='column'
      {...rest}
      className={`${cls} ${className}`}
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
