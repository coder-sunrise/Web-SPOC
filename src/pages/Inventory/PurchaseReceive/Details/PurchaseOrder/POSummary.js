import React, { PureComponent } from 'react'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { Add } from '@material-ui/icons'
import { amountProps } from '../../variables'
import POAdjustment from './POAdjustment'
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

const poPrefix = 'purchaseOrder'

class POSummary extends PureComponent {
  state = {
    settingGSTEnable: true,
    settingGSTPercentage: 0,
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

  onChangeGstToggle = (isCheckboxClicked = false) => {
    const { settingGSTEnable } = this.state
    const { setFieldValue, calcPurchaseOrderSummary } = this.props
    if (!isCheckboxClicked) {
      if (!settingGSTEnable) {
        setFieldValue(`${poPrefix}.IsGSTInclusive`, false)
      }
    }
    setTimeout(() => calcPurchaseOrderSummary(), 1)
  }

  render () {
    const { settingGSTEnable, settingGSTPercentage } = this.state
    const {
      values,
      dispatch,
      calcPurchaseOrderSummary,
      toggleInvoiceAdjustment,
    } = this.props
    const { purchaseOrderAdjustment, purchaseOrder } = values
    const { IsGSTEnabled } = purchaseOrder || false
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
              onClick={toggleInvoiceAdjustment}
            >
              <Add />
            </Button>
          </GridItem>
        </GridContainer>

        <FieldArray
          name='purchaseOrderAdjustment'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!purchaseOrderAdjustment) return null
            return purchaseOrderAdjustment.map((v, i) => {
              if (!v.isDeleted) {
                return (
                  <POAdjustment
                    key={v.id}
                    index={i}
                    dispatch={dispatch}
                    purchaseOrderAdjustment={purchaseOrderAdjustment}
                    calcPurchaseOrderSummary={calcPurchaseOrderSummary}
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
                    disabled={`${poPrefix}.IsGSTInclusive`}
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
            {IsGSTEnabled ? (
              <GridItem xs={10} md={3} style={{ paddingLeft: 28 }}>
                <FastField
                  name={`${poPrefix}.IsGSTInclusive`}
                  render={(args) => {
                    return (
                      <Tooltip
                        title={formatMessage({
                          id: 'app.general.inclusiveGST',
                        })}
                        placement='bottom'
                      >
                        <Checkbox
                          label={formatMessage({
                            id: 'app.general.inclusiveGST',
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

export default POSummary
