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

  onChangeGstToggle = (isCheckboxClicked = false) => {
    const { adjustments, rows, summary } = this.state
    const { config, onValueChanged } = this.props
    config.isGSTInclusive = isCheckboxClicked
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
    const {
      theme,
      showAddAdjustment = true,
      classes,
      config = {},
      showAdjustment = true,
      global,
    } = this.props
    const { summary, adjustments } = this.state
    if (!summary) return null
    // console.log(summary, config)
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
    const { gstValue, visitPurposeFK } = config
    // const { purchaseOrder } = values
    // const { IsGSTEnabled } = purchaseOrder || false
    // console.log({ props: this.props, summary })
    return (
      <div className={classes.cls01}>
        <GridContainer style={{ marginBottom: 4 }}>
          <GridItem xs={7}>
            <div
              style={{
                textAlign: 'right',
                fontWeight: 500,
                marginRight: theme.spacing(-2),
              }}
            >
              <span>Sub Total</span>
            </div>
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
          <GridItem xs={1} />
          <GridItem xs={4}>
            <NumberInput {...amountProps} value={subTotal} />
          </GridItem>
        </GridContainer>
        {(gstValue >= 0 || showAdjustment) && (
          <Divider style={{ margin: theme.spacing(1) }} />
        )}
        {showAdjustment && (
          <GridContainer style={{ marginBottom: 4 }}>
            <GridItem xs={7}>
              <div
                style={{
                  textAlign: 'right',
                  fontWeight: 500,
                  marginRight: theme.spacing(-2),
                }}
              >
                <span>Invoice Adjustment</span>
              </div>
            </GridItem>
            <GridItem xs={1}>
              {showAddAdjustment && (
                <Button
                  color='primary'
                  size='sm'
                  justIcon
                  key='addAdjustment'
                  onClick={this.addAdjustment}
                  style={{ marginLeft: theme.spacing(2) }}
                  disabled={global.disableSave}
                >
                  <Add />
                </Button>
              )}
            </GridItem>
          </GridContainer>
        )}
        {adjustments.map((v, i) => {
          if (!v.isDeleted) {
            return (
              <Adjustment
                key={v.id || i}
                index={i}
                type={v.adjType}
                dispatch={dispatch}
                onDelete={this.deleteAdjustment}
                amountProps={amountProps}
                // calcPurchaseOrderSummary={calcPurchaseOrderSummary}
                {...v}
                theme={theme}
              />
            )
          }
          return null
        })}

        {gstValue >= 0 ? (
          <GridContainer>
            <GridItem xs={7}>
              <div
                style={{
                  textAlign: 'right',
                  marginRight: theme.spacing(-4),
                }}
              >
                <Checkbox
                  style={{ top: -1 }}
                  controlStyle={{ fontWeight: 500 }}
                  label={`Inclusive GST (${numeral(gstValue).format('0.00')}%)`}
                  simple
                  checked={isGSTInclusive}
                  onChange={(e) => {
                    this.onChangeGstToggle(e.target.value)
                  }}
                />
              </div>
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
            <GridItem xs={1} />
            <GridItem xs={4}>
              <NumberInput {...amountProps} value={gst} />
            </GridItem>
          </GridContainer>
        ) : (
          []
        )}
        {(gstValue >= 0 || showAdjustment) && (
          <Divider style={{ margin: theme.spacing(1) }} />
        )}
        <GridContainer>
          <GridItem xs={7}>
            <div
              style={{
                textAlign: 'right',
                fontWeight: 500,
                marginRight: theme.spacing(-2),
              }}
            >
              <span>Total</span>
            </div>

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
          <GridItem xs={1} />
          <GridItem xs={4}>
            <NumberInput {...amountProps} value={totalWithGST} />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AmountSummary)
