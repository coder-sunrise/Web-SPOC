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
  state = {
    settingGSTEnable: true,
    settingGSTPercentage: 0,
    adjustments: [],
  }

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  static getDerivedStateFromProps (props, state) {
    const { clinicSettings } = props
    const { settings } = clinicSettings

    if (settings) {
      if (
        settings.isEnableGST !== state.settingGSTEnable &&
        settings.GSTPercentageInt !== state.settingGSTPercentage
      )
        return {
          ...state,
          settingGSTEnable: settings.isEnableGST,
          settingGSTPercentage: settings.GSTPercentageInt,
        }
    }
    return null
  }

  componentDidMount () {
    const { rows = [], adjustments = [], config } = this.props
    // console.log(rows, adjustments)
    this.setState({
      ...calculateAmount(rows, adjustments, config),
    })
  }

  onChangeGstToggle = (isCheckboxClicked = false) => {
    // const { settingGSTEnable } = this.state
    // const { setFieldValue, calcPurchaseOrderSummary } = this.props
    // if (!isCheckboxClicked) {
    //   if (!settingGSTEnable) {
    //     setFieldValue(`${poPrefix}.IsGSTInclusive`, false)
    //   }
    // }
    // setTimeout(() => calcPurchaseOrderSummary(), 1)
  }

  addAdjustment = () => {
    const { adjustments, rows, summary } = this.state
    const { totalWithGST } = summary
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
            initialAmout: totalWithGST,
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
      onValueChanged,
    )
  }

  onValueChanged = () => {}

  render () {
    const { theme } = this.props
    const { summary, adjustments } = this.state
    if (!summary) return null
    const { totalWithGST, isEnableGST, gSTPercentage, gst } = summary
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
    console.log('render', this.state)
    return (
      <div>
        <GridContainer style={{ marginBottom: 4 }}>
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
                GST (${`${numeral(gSTPercentage * 100).format('0.00')}`}%):
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
            {isEnableGST ? (
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
                    onChange={() => this.onChangeGstToggle(true)}
                  />
                </Tooltip>
              </GridItem>
            ) : (
              <GridItem xs={10} />
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
