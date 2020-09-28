import React from 'react'
import { withStyles, Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import numeral from 'numeral'
import { GridContainer, GridItem, NumberInput, Tooltip } from '@/components'

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

  subTitle: {
    textAlign: 'right',
    fontWeight: 500,
  },
})

const AmountSummary = ({ classes, theme, invoice = {}, adjustments }) => {
  const getGST = (gstValue = 0, isGstInclusive = false) =>
    `${isGstInclusive ? ' Inclusive ' : ''}GST (${gstValue.toFixed(2)}%):`

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
        <GridItem md={8} xs={8}>
          <div className={classes.subTitle}>
            <span>Sub Total:</span>
          </div>
        </GridItem>
        <GridItem md={4} xs={4}>
          <NumberInput {...amountProps} value={subTotal} />
        </GridItem>
      </GridContainer>

      <GridContainer style={{ marginBottom: 4 }}>
        <GridItem xs={8}>
          {adjustments.length > 0 && (
            <div className={classes.subTitle}>
              <span>
                {formatMessage({
                  id: 'inventory.pr.detail.pod.summary.adjustment',
                })}
              </span>
            </div>
          )}
        </GridItem>
      </GridContainer>

      {adjustments.map((v, i) => {
        if (!v.isDeleted) {
          return (
            <GridContainer md={12} xs={12}>
              <GridItem xs={8}>
                <div
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    display: 'inline-block',
                    textOverflow: 'ellipsis',
                    wordBreak: 'keep-all',
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                  }}
                >
                  <Tooltip title={v.adjRemark}>
                    <span>{v.adjRemark}</span>
                  </Tooltip>
                </div>
              </GridItem>
              <GridItem xs={4}>
                <NumberInput value={v.adjAmount} {...amountProps} />
              </GridItem>
            </GridContainer>
          )
        }
        return null
      })}

      {gstValue ? (
        <GridContainer>
          <GridItem md={8} xs={8}>
            <div className={classes.subTitle}>
              <span>{getGST(gstValue, isGSTInclusive)}</span>
            </div>
          </GridItem>
          <GridItem md={4} xs={4}>
            <NumberInput {...amountProps} value={gst} />
          </GridItem>
        </GridContainer>
      ) : (
        []
      )}
      <Divider style={{ margin: theme.spacing(1) }} />
      <GridContainer>
        <GridItem md={8} xs={8}>
          <div className={classes.subTitle}>
            <span>
              {formatMessage({
                id: 'inventory.pr.detail.pod.summary.total',
              })}
            </span>
          </div>
        </GridItem>
        <GridItem md={4} xs={4}>
          <NumberInput {...amountProps} text value={totalWithGST} />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(AmountSummary)
