import React from 'react'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import { formatMessage } from 'umi/locale'
import {
  GridContainer,
  GridItem,
  NumberInput,
  FastField,
  Tooltip,
} from '@/components'
// styling
import styles from './styles'

const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

const Summary = ({ classes, values }) => {
  const getGST = (gstValue = 0, isGstInclusive = false) =>
    `${gstValue.toFixed(2)}% GST${isGstInclusive ? ' inclusive' : ''}:`
  const { invoiceAdjustment = [] } = values

  return (
    <div className={classes.summaryContent}>
      <GridContainer>
        <GridContainer xs={2} md={9} />
        <GridContainer xs={10} md={3}>
          <GridItem md={6} xs={6}>
            <span>Sub Total:</span>
          </GridItem>
          <GridItem md={6} xs={6}>
            <FastField
              name='invoiceTotal'
              render={(args) => {
                return <NumberInput {...amountProps} {...args} />
              }}
            />
          </GridItem>

          <GridItem md={6} xs={6}>
            {invoiceAdjustment.length > 0 && (
              <span>
                {formatMessage({
                  id: 'inventory.pr.detail.pod.summary.adjustment',
                })}
              </span>
            )}
          </GridItem>

          <GridItem md={6} xs={6}>
            {invoiceAdjustment.length > 0 && (
              <NumberInput {...amountProps} disabled />
            )}
          </GridItem>

          <GridContainer md={12} xs={12}>
            {invoiceAdjustment.map((v) => {
              return (
                <GridContainer md={12} xs={12}>
                  <GridItem xs={7}>
                    <div
                      style={{
                        width: '100%',
                        overflow: 'hidden',
                        display: 'inline-block',
                        textOverflow: 'ellipsis',
                        wordBreak: 'keep-all',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Tooltip title={v.adjRemark}>
                        <span>{v.adjRemark}</span>
                      </Tooltip>
                    </div>
                  </GridItem>
                  <GridItem xs={5}>
                    <NumberInput value={v.adjAmount} {...amountProps} />
                  </GridItem>
                </GridContainer>
              )
            })}
          </GridContainer>

          <GridItem md={6} xs={6}>
            {values.gstValue >= 0 && (
              <span>{getGST(values.gstValue, values.isGSTInclusive)}</span>
            )}
          </GridItem>
          <GridItem md={6} xs={6}>
            {values.gstValue >= 0 && (
              <FastField
                name='invoiceGSTAmt'
                render={(args) => {
                  return <NumberInput {...amountProps} {...args} />
                }}
              />
            )}
          </GridItem>
          <GridItem md={12} xs={12} className={classes.divider}>
            <Divider />
          </GridItem>

          <GridItem md={6} xs={6}>
            <span>Total:</span>
          </GridItem>
          <GridItem md={6} xs={6}>
            <FastField
              name='invoiceTotalAftGST'
              render={(args) => {
                return (
                  <NumberInput
                    value={values.invoiceTotalAftGST}
                    {...amountProps}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </GridContainer>
    </div>
  )
}
export default withStyles(styles, { name: 'InvoiceSummary' })(Summary)
