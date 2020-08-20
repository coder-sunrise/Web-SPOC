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
  showZero: true,
  text: true,
  fullWidth: true,
}

const Summary = ({ classes, values }) => {
  const getGST = (gstValue = 0, isGstInclusive = false) =>
    `${isGstInclusive ? ' Inclusive ' : ''}GST (${gstValue.toFixed(2)}%):`
  const { invoiceAdjustment = [] } = values

  return (
    <div className={classes.summaryContent}>
      <GridContainer>
        <GridContainer xs={2} md={9} />
        <GridContainer xs={10} md={3}>
          <GridItem md={8} xs={8}>
            <div
              style={{
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              <span>Sub Total:</span>
            </div>
          </GridItem>
          <GridItem md={4} xs={4}>
            <FastField
              name='invoiceTotal'
              render={(args) => {
                return <NumberInput {...amountProps} {...args} />
              }}
            />
          </GridItem>
          <GridItem md={12} xs={12} className={classes.divider}>
            <Divider />
          </GridItem>

          <GridItem md={8} xs={8}>
            {invoiceAdjustment.length > 0 && (
              <div
                style={{
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                <span>
                  {formatMessage({
                    id: 'inventory.pr.detail.pod.summary.adjustment',
                  })}
                </span>
              </div>
            )}
          </GridItem>

          <GridContainer md={12} xs={12}>
            {invoiceAdjustment.map((v) => {
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
                        // marginLeft: 20,
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
            })}
          </GridContainer>

          <GridItem md={8} xs={8}>
            {values.gstValue >= 0 && (
              <div
                style={{
                  textAlign: 'right',
                  fontWeight: 500,
                }}
              >
                <span>{getGST(values.gstValue, values.isGSTInclusive)}</span>
              </div>
            )}
          </GridItem>
          <GridItem md={4} xs={4}>
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

          <GridItem md={8} xs={8}>
            <div
              style={{
                textAlign: 'right',
                fontWeight: 500,
              }}
            >
              <span>Total:</span>
            </div>
          </GridItem>
          <GridItem md={4} xs={4}>
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
