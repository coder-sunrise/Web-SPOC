import React, { PureComponent } from 'react'
import { withStyles, Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { Add } from '@material-ui/icons'
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
}

const styles = (theme) => ({})

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
      settingGSTEnable: true,
      settingGSTPercentage: 0,
      adjustments: [],
      rows: [],
      ...calculateAmount(rows, adjustments, config),
    }
    if (onValueChanged) {
      onValueChanged(this.state)
    }
  }

  // static getDerivedStateFromProps (props, state) {
  //   const { clinicSettings } = props
  //   const { settings } = clinicSettings

  //   if (settings) {
  //     if (
  //       settings.isEnableGST !== state.settingGSTEnable &&
  //       settings.GSTPercentageInt !== state.settingGSTPercentage
  //     )
  //       return {
  //         ...state,
  //         settingGSTEnable: settings.isEnableGST,
  //         settingGSTPercentage: settings.GSTPercentageInt,
  //       }
  //   }
  //   return null
  // }

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
            initialAmout: total,
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
    const { theme, gstInclusiveConfigrable, showAdjustment } = this.props
    const { summary, adjustments } = this.state
    if (!summary) return null
    const {
      totalWithGST,
      isEnableGST,
      gSTPercentage,
      gst,
      isGSTInclusive,
    } = summary
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
    // const { purchaseOrder } = values
    // const { IsGSTEnabled } = purchaseOrder || false
    return (
      <div>
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

        {isEnableGST ? (
          <GridContainer>
            <GridItem xs={6}>
              <span>
                {`${numeral(gSTPercentage * 100).format('0.00')}`}% GST:
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
              <NumberInput {...amountProps} value={gst} />
            </GridItem>
            {gstInclusiveConfigrable && (
              <GridItem xs={12}>
                <Tooltip
                  title={formatMessage({
                    id: 'inventory.pr.detail.pod.summary.inclusiveGST',
                  })}
                  placement='bottom'
                >
                  <Checkbox
                    label={formatMessage({
                      id: 'inventory.pr.detail.pod.summary.inclusiveGST',
                    })}
                    simple
                    checked={isGSTInclusive}
                    onChange={(e) => {
                      this.onChangeGstToggle(e.target.value)
                    }}
                  />
                </Tooltip>
              </GridItem>
            )}
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
