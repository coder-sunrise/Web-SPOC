import React, { PureComponent } from 'react'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { Add } from '@material-ui/icons'
import { connect } from 'dva'

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

const poPrefix = 'purchaseOrder'
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
    setTimeout(() => {
      const { rows = [], adjustments = [], config } = this.props
      const initialAmount = calculateAmount(rows, adjustments, config)
      console.log(initialAmount)
    }, 1000)
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
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          callbackConfig: {
            model: 'orders',
            reducer: 'addFinalAdjustment',
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

  render () {
    const { settingGSTEnable, settingGSTPercentage } = this.state
    const {
      settings = {
        totalField: 'totalAfterItemAdjustment',
        adjustedField: 'totalAfterOverallAdjustment',
      },
      adjustments = [],
      rows = [],
      values,
      dispatch,
      // calcPurchaseOrderSummary,
      toggleInvoiceAdjustment,
    } = this.props
    // const { purchaseOrder } = values
    // const { IsGSTEnabled } = purchaseOrder || false
    return (
      <div style={{ paddingRight: 98, paddingTop: 20 }}>
        <GridContainer style={{ paddingBottom: 8 }}>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3} container>
            <p>
              {formatMessage({
                id: 'inventory.pr.detail.pod.summary.adjustment',
              })}
            </p>
            &nbsp;&nbsp;&nbsp;
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

        <FieldArray
          name='adjustments'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!adjustments) return null
            return adjustments.map((v, i) => {
              if (!v.isDeleted) {
                return (
                  <Adjustment
                    key={v.id}
                    index={i}
                    dispatch={dispatch}
                    adjustments={adjustments}
                    // calcPurchaseOrderSummary={calcPurchaseOrderSummary}
                    {...amountProps}
                  />
                )
              }
              return null
            })
          }}
        />

        {settingGSTEnable ? (
          <GridContainer>
            <GridItem xs={2} md={9} />
            <GridItem xs={4} md={2}>
              <span> {`GST (${settingGSTPercentage}%): `}</span>
              <FastField
                name={`${poPrefix}.IsGSTEnabled`}
                render={(args) => (
                  <Switch
                    label={undefined}
                    fullWidth={false}
                    onChange={() => this.onChangeGstToggle()}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={1}>
              <FastField
                name={`${poPrefix}.gstAmount`}
                render={(args) => {
                  return <NumberInput {...amountProps} {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2} md={9} />
            {this.state.settingGSTEnable ? (
              <GridItem xs={10} md={3} style={{ paddingLeft: 28 }}>
                <FastField
                  name={`${poPrefix}.IsGSTInclusive`}
                  render={(args) => {
                    return (
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
                          onChange={() => this.onChangeGstToggle(true)}
                          {...args}
                        />
                      </Tooltip>
                    )
                  }}
                />
              </GridItem>
            ) : (
              <GridItem xs={10} md={3} />
            )}
          </GridContainer>
        ) : (
          []
        )}

        <GridContainer>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <Divider />
          </GridItem>
          <GridItem xs={2} md={9} />
          <GridItem xs={10} md={3}>
            <FastField
              name={`${poPrefix}.totalAmount`}
              render={(args) => {
                return (
                  <NumberInput
                    prefix={formatMessage({
                      id: 'inventory.pr.detail.pod.summary.total',
                    })}
                    {...amountProps}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default AmountSummary
