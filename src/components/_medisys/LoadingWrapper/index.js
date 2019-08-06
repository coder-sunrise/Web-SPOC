import React from 'react'
import classnames from 'classnames'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// common components
import { Primary } from '@/components'

const styles = () => ({
  container: {
    position: 'relative',
  },
  loadingContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    '& h4': {
      fontWeight: 500,
    },
  },
  hide: {
    display: 'none',
  },
  blur: {
    opacity: 0.4,
  },
})

const LoadingWrapper = ({ classes, children, loading = false, text = '' }) => {
  const mainContentClass = classnames({
    [classes.blur]: loading,
  })

  const loadingClass = classnames({
    [classes.loadingContent]: true,
    [classes.hide]: !loading,
  })

  return (
    <div className={classes.container}>
      <div className={loadingClass}>
        <CircularProgress />
        <Primary>
          <h4>{text}</h4>
        </Primary>
      </div>
      <div className={mainContentClass}>{children}</div>
    </div>
  )
}

export default withStyles(styles, { name: 'LoadingWrapper' })(LoadingWrapper)
