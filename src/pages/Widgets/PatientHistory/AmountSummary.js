import React from 'react'
import { withStyles, Divider } from '@material-ui/core'
import { formatMessage } from 'umi'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import { GridContainer, GridItem, NumberInput, Tooltip } from '@/components'
const showMoney = (v = 0) => {
  if (v < 0)
    return (
      <span
        style={{ fontWeight: 500, color: 'red' }}
      >{`(${currencySymbol}${numeral(v * -1.0).format('0.00')})`}</span>
    )
  return (
    <span
      style={{ fontWeight: 500, color: 'darkblue' }}
    >{`${currencySymbol}${numeral(v).format('0.00')}`}</span>
  )
}
const amountProps = {
  showZero: true,
  noUnderline: true,
  currency: true,
  rightAlign: true,
  text: true,
  fullWidth: true,
}

const styles = theme => ({
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
    <div>
      <GridContainer style={{ marginBottom: 4 }}>
        <GridItem md={8} xs={8}>
          <div className={classes.subTitle}>
            <span>Sub Total:</span>
          </div>
        </GridItem>
        <GridItem md={4} xs={4}>
          <div style={{ textAlign: 'right' }}>{showMoney(subTotal)}</div>
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
                <div style={{ textAlign: 'right' }}>
                  {showMoney(v.adjAmount)}
                </div>
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
            <div style={{ textAlign: 'right' }}>{showMoney(gst)}</div>
          </GridItem>
        </GridContainer>
      ) : (
        []
      )}
      <Divider style={{ margin: '4px 8px' }} />
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
          <div style={{ textAlign: 'right' }}>{showMoney(totalWithGST)}</div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(AmountSummary)
