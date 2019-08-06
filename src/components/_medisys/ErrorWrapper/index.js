import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Danger } from '@/components'

const styles = () => ({
  container: {
    position: 'relative',
    width: '100%',
  },
  errorContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    '& h3': {
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

const ErrorWrapper = ({
  classes,
  children,
  errorMessage,
  errorState,
  errorKey,
}) => {
  const message = errorState[errorKey] || errorMessage

  const errorContentClass = classnames({
    [classes.errorContent]: true,
    [classes.hide]: message === undefined,
  })
  const mainContentClass = classnames({
    [classes.blur]: message !== undefined,
  })

  return (
    <div className={classes.container}>
      <div className={errorContentClass}>
        <Danger>
          <h3>{message}</h3>
        </Danger>
      </div>

      <div className={mainContentClass}>{children}</div>
    </div>
  )
}

export default withStyles(styles, { name: 'ErrorWrapper' })(ErrorWrapper)
