import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

function CircularIndeterminate (props) {
  const { classes, style } = props
  return (
    <div style={{ paddingTop: 100, textAlign: 'center', ...style }}>
      <CircularProgress className={classes.progress} />
      {/* <CircularProgress className={classes.progress} color="secondary" /> */}
    </div>
  )
}

// export default () => (
//   <div style={{ paddingTop: 100, textAlign: 'center' }}>
//     <CircularProgress />
//   </div>
// )

export default withStyles(styles)(CircularIndeterminate)
