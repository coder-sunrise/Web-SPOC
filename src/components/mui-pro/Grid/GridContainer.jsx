import React from 'react'

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'

const style = {
  row: {
    // margin: "0 -15px",
    // width: "calc(100% + 30px)"
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }

    '& > div:first-child': {
      paddingLeft: 0,
    },
    '& > div:last-child': {
      paddingRight: 0,
    },
  },
  grid: {
    height: '100%',
  },
}

function GridContainer ({ ...props }) {
  const {
    theme,
    classes,
    children,
    className,
    gutter,
    gridLayout,
    ...rest
  } = props

  let newChildren = []
  if (!Array.isArray(children)) {
    newChildren.push(children)
  } else {
    newChildren = children
  }
  // console.log(newChildren)
  return (
    <Grid container {...rest} className={`${classes.grid} ${className}`}>
      {newChildren.map((o, i) => {
        if (o) {
          return React.cloneElement(o, {
            key: i,
            gutter,
            gridLayout,
            ...o.props,
          })
        }
        return null
      })}
    </Grid>
  )
}

export default withStyles(style, { withTheme: true })(GridContainer)
