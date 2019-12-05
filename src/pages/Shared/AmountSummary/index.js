import React, { PureComponent } from 'react'
import { withStyles, Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import Add from '@material-ui/icons/Add'

import { connect } from 'dva'
import numeral from 'numeral'

import Adjustment from './Adjustment'
import {
  GridContainer,
  GridItem,
  NumberInput,
  Switch,
  Tooltip,
  Checkbox,
  Button,
  FieldArray,
  FastField,
} from '@/components'

import { calculateAmount } from '@/utils/utils'

const amountProps = {
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

@connect(({ clinicSettings, global }) => ({
  clinicSettings,
  global,
}))
class AmountSummary extends PureComponent {
  constructor (props) {
    super(props)
    const { rows = [], adjustments = [], config, onValueChanged } = this.props
    // console.log(rows, adjustments)
    this.state = {
      adjustments: [],
      rows: [],
      ...calculateAmount(rows, adjustments, config),
    }
    if (onValueChanged) {
      onValueChanged(this.state)
    }
  }

  componentDidMount () {}

  // eslint-disable-next-line camelcase
  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { rows = [], adjustments = [], config, onValueChanged } = nextProps

    this.setState((prevState) => {
      const newState = calculateAmount(rows, adjustments, config)

      if (prevState.summary.totalWithGST !== newState.summary.totalWithGST) {
        onValueChanged(newState)
      }
      return newState
    })
  }

  onChangeGstToggle = (isCheckboxClicked = false, fromGstInclusive) => {
    const { adjustments, rows, summary } = this.state
    const { config, onValueChanged } = this.props
    if (!fromGstInclusive) {
      config.isGSTEnabled = isCheckboxClicked
      config.isGSTInclusive = false
    } else {
      config.isGSTInclusive = isCheckboxClicked
    }
    this.setState(
      {
        ...calculateAmount(rows, adjustments, config),
      },
      () => onValueChanged(this.state),
    )
  }

  addAdjustment = () => {
    const { adjustments, rows, summary } = this.state
    const { total } = summary
    const { config, onValueChanged } = this.props

    let lastAdjustmentAmount = 0
    const filterDeletedAdjustments = [
      ...adjustments.filter((item) => !item.isDeleted),
    ]
    if (filterDeletedAdjustments.length > 0) {
      const lastAdjustment = {
        ...filterDeletedAdjustments[filterDeletedAdjustments.length - 1],
      }
      lastAdjustmentAmount = lastAdjustment.adjAmount
    }

    const nextInitialAmount = total + lastAdjustmentAmount

    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackMethod: (v) => {
            adjustments.push({
              index: adjustments.length,
              ...v,
            })
            this.setState(
              {
                ...calculateAmount(rows, adjustments, config),
              },
              () => onValueChanged(this.state),
            )
          },
          showRemark: true,
          showAmountPreview: false,
          defaultValues: {
            // ...this.props.orders.entity,
            initialAmout: nextInitialAmount,
          },
        },
      },
    })
  }

  deleteAdjustment = (index) => {
    const { adjustments, rows } = this.state
    const { config, onValueChanged } = this.props
    const newAdjustments = adjustments.map((o) => {
      if (o.index === index) o.isDeleted = true
      return o
    })
    this.setState(
      {
        ...calculateAmount(rows, newAdjustments, config),
      },
      (v) => {
        onValueChanged(this.state)
      },
    )
  }

  render () {
    const { theme, showAdjustment, classes, config } = this.props
    const { summary, adjustments } = this.state
    if (!summary) return null
    const { subTotal, totalWithGST, gst, isGSTInclusive } = summary
    const {
      settings = {
        totalField: 'totalAfterItemAdjustment',
        adjustedField: 'totalAfterOverallAdjustment',
      },
      values,
      dispatch,
      // calcPurchaseOrderSummary,
      toggleInvoiceAdjustment,
    } = this.props
    const { gstValue } = config
    // const { purchaseOrder } = values
    // const { IsGSTEnabled } = purchaseOrder || false
    // console.log({ props: this.props, summary })
    const showGSTInclusive = () => {
      if (fromPO && isEnableGST) return true
      if (!fromPO && gstInclusiveConfigrable) return true
      return false
    }
    return (
      <div className={classes.cls01}>
        <GridContainer style={{ marginBottom: 4 }}>
          <GridItem xs={6}>
            <span>Sub Total:</span>
            {/* <FastField
          name={`${poPrefix}.IsGSTEnabled`}
          render={(args) => (
            <Switch
              label={undefined}
              fullWidth={false}
              onChange={() => this.onChangeGstToggle()}
              {...args}
            />
          )}
        /> */}
          </GridItem>
          <GridItem xs={6}>
            <NumberInput {...amountProps} value={subTotal} />
          </GridItem>
        </GridContainer>
        <GridContainer style={{ marginBottom: 4 }}>
          {showAdjustment === false ? (
            ''
          ) : (
            <GridItem xs={12}>
              <span>
                {formatMessage({
                  id: 'inventory.pr.detail.pod.summary.adjustment',
                })}
              </span>
              <Button
                color='primary'
                size='sm'
                justIcon
                key='addAdjustment'
                onClick={this.addAdjustment}
              >
                <Add />
              </Button>
            </GridItem>
          )}
        </GridContainer>
        {adjustments.map((v, i) => {
          if (!v.isDeleted) {
            return (
              <Adjustment
                key={v.id || i}
                index={i}
                dispatch={dispatch}
                onDelete={this.deleteAdjustment}
                amountProps={amountProps}
                // calcPurchaseOrderSummary={calcPurchaseOrderSummary}
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
              {/* <FastField
                name={`${poPrefix}.IsGSTEnabled`}
                render={(args) => (
                  <Switch
                    label={undefined}
                    fullWidth={false}
                    onChange={() => this.onChangeGstToggle()}
                    {...args}
                  />
                )}
              /> */}
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
                onChange={(e) => {
                  this.onChangeGstToggle(e.target.value)
                }}
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

            {/* <FastField
                name={`${poPrefix}.IsGSTEnabled`}
                render={(args) => (
                  <Switch
                    label={undefined}
                    fullWidth={false}
                    onChange={() => this.onChangeGstToggle()}
                    {...args}
                  />
                )}
              /> */}
          </GridItem>
          <GridItem xs={6}>
            <NumberInput {...amountProps} value={totalWithGST} />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AmountSummary)
