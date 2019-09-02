import React from 'react'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { amber } from '@material-ui/core/colors'

const WarningSnackbar = (props) => {
  const variantIcon = {
    warning: WarningIcon,
  }

  const useStyles1 = makeStyles((theme) => ({
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }))

  const classes1 = useStyles1()
  const { className, message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={clsx(classes1[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes1.message}>
          <Icon className={clsx(classes1.icon, classes1.iconVariant)} />
          {message}
        </span>
      }
    />
  )
}

export default WarningSnackbar
