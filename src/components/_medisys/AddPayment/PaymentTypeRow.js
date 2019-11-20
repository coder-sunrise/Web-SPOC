import React from 'react'
import color from 'color'
// material ui
import { Paper, withStyles } from '@material-ui/core'
import { Button, GridContainer, GridItem } from '@/components'

const styles = (theme) => ({
  button: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: 0,
    textAlign: 'left',
    textTransform: 'none !important',
    '& p': {
      marginBottom: 0,
    },
  },
  hotkey: {
    textAlign: 'right',
  },
})

const PaymentTypeRow = ({ classes, mode, onPaymentModeClick }) => {
  const handleClick = () => onPaymentModeClick(mode)
  return (
    <Button
      block
      color='primary'
      className={classes.button}
      onClick={handleClick}
    >
      <GridContainer alignItems='center'>
        <GridItem md={8}>
          <p style={{ textDecoration: 'none' }}>{mode.displayValue}</p>
        </GridItem>
        <GridItem md={4} className={classes.hotkey}>
          <p>{mode.hotkey || '(F1)'}</p>
        </GridItem>
      </GridContainer>
    </Button>
  )
}

export default withStyles(styles, { name: 'PaymentTypeRowComponent' })(
  PaymentTypeRow,
)
