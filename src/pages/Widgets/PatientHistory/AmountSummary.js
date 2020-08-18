import React from 'react'
import { withStyles, Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import numeral from 'numeral'

import { GridContainer, GridItem, NumberInput, Checkbox } from '@/components'
import Adjustment from '@/pages/Shared/AmountSummary/Adjustment'

const amountProps = {
  showZero: true,
  noUnderline: true,
  currency: true,
  rightAlign: true,
  text: true,
  fullWidth: true,
}

const styles = (theme) => ({
  cls01: {
    '& .MuiGrid-item': {
      lineHeight: `${theme.spacing(3)}px`,
    },
  },
})

const AmountSummary = ({
  dispatch,
  classes,
  theme,
  invoice = {},
  adjustments,
}) => {
  const {
    invoiceTotal: subTotal,
    invoiceTotalAftGST: totalWithGST,
    invoiceGSTAmt: gst,
    isGSTInclusive,
    gstValue,
  } = invoice
  return (
    <div className={classes.cls01}>
      <GridContainer style={{ marginBottom: 4 }}>
        <GridItem xs={6}>
          <span>Sub Total:</span>
        </GridItem>
        <GridItem xs={6}>
          <NumberInput {...amountProps} value={subTotal} />
        </GridItem>
      </GridContainer>

      <GridContainer style={{ marginBottom: 4 }}>
        <GridItem xs={12}>
          <span>
            {formatMessage({
              id: 'inventory.pr.detail.pod.summary.adjustment',
            })}
          </span>
        </GridItem>
      </GridContainer>

      {adjustments.map((v, i) => {
        if (!v.isDeleted) {
          return (
            <Adjustment
              hiddenDelete
              key={v.id || i}
              index={i}
              type={v.adjType}
              dispatch={dispatch}
              amountProps={amountProps}
              {...v}
            />
          )
        }
        return null
      })}

      {gstValue ? (
        <GridContainer>
          <GridItem xs={6}>
            <span>{`${numeral(gstValue).format('0.00')}`}% GST:</span>
          </GridItem>
          <GridItem xs={6}>
            <NumberInput {...amountProps} value={gst} />
          </GridItem>

          <GridItem xs={12}>
            <Checkbox
              style={{ top: 1 }}
              label={formatMessage({
                id: 'app.general.inclusiveGST',
              })}
              simple
              checked={isGSTInclusive}
              disabled
            />
          </GridItem>
        </GridContainer>
      ) : (
        []
      )}
      <Divider style={{ margin: theme.spacing(1) }} />
      <GridContainer>
        <GridItem xs={6}>
          <span>
            {formatMessage({
              id: 'inventory.pr.detail.pod.summary.total',
            })}
          </span>
        </GridItem>
        <GridItem xs={6}>
          <NumberInput {...amountProps} text value={totalWithGST} />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(AmountSummary)
