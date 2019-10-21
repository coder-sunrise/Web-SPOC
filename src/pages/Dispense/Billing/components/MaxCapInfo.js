import React, { useState } from 'react'
// material ui
import { Popover, withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/Info'
import { convertAmountToPercentOrCurrency } from '../utils'
import { INVOICE_ITEM_TYPE } from '@/utils/constants'

const styles = (theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  blueText: {
    color: 'darkblue',
    fontWeight: 500,
  },
  container: {
    padding: theme.spacing(1),
  },
})

const parseToPercentOrDollar = (type, value) => {
  if (type === 'ExactAmount') return `$${value}`

  return `${value}%`
}

const MaxCapInfo = ({
  classes,
  claimableSchemes = [],
  coPaymentByCategory = [],
  copaymentSchemeFK,
}) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)

  const handlePopoverClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)

  const scheme = claimableSchemes.find((item) => item.id === copaymentSchemeFK)

  let patientMinPayable
  let overallCoverage

  if (scheme) {
    const {
      overAllCoPaymentValue,
      overAllCoPaymentValueType,
      patientMinCoPaymentAmount,
      patientMinCoPaymentAmountType,
    } = scheme
    overallCoverage = parseToPercentOrDollar(
      overAllCoPaymentValueType,
      overAllCoPaymentValue,
    )
    patientMinPayable = parseToPercentOrDollar(
      patientMinCoPaymentAmountType,
      patientMinCoPaymentAmount,
    )
  }

  return (
    <div>
      <Info
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id='max-cap-info'
        disableRestoreFocus
        className={classes.popover}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={classes.container}>
          <p>
            Patient Minimum Payable Amount:{' '}
            <span className={classes.blueText}>{patientMinPayable}</span>
          </p>
          {coPaymentByCategory.map((itemCategory) => (
            <p>
              {INVOICE_ITEM_TYPE[itemCategory.itemTypeFk]}:{' '}
              <span className={classes.blueText}>
                {convertAmountToPercentOrCurrency(
                  itemCategory.groupValueType,
                  itemCategory.itemGroupValue,
                )}
              </span>
            </p>
          ))}
        </div>
      </Popover>
    </div>
  )
}

export default withStyles(styles, { name: 'MaxCapInfo' })(MaxCapInfo)
