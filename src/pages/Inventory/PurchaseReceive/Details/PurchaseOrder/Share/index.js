import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Divider } from '@material-ui/core'
import { formatMessage } from 'umi/locale'
import { Add } from '@material-ui/icons'
import { amountProps } from './variables'
import InvoiceAdjustment from './InvoiceAdjustment'
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
  Field,
} from '@/components'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
class InvoiceSummary extends PureComponent {
  state = {
    settingGSTEnable: false,
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
          settingGSTPercentage: settings.gSTPercentageInt,
        }
    }
    return null
  }

  onChangeGstToggle = (isCheckboxClicked = false, e) => {
    const { settingGSTEnable } = this.state
    const { setFieldValue, prefix, handleCalcInvoiceSummary } = this.props
    if (!isCheckboxClicked) {
      if (!settingGSTEnable) {
        setFieldValue(`${prefix}IsGSTInclusive`, false)
      }
    }else{
      setFieldValue(`${prefix}IsGSTInclusive`, e.target.value)
    }

    setTimeout(() => handleCalcInvoiceSummary(), 1)
  }

  render () {
    const {
      settingGSTEnable,
      settingGSTPercentage,
    } = this.state
    const {
      toggleInvoiceAdjustment,
      handleDeleteInvoiceAdjustment,
      prefix = '',
      adjustmentListName = '',
      adjustmentList = [],
      IsGSTEnabled = false,
      handleCalcInvoiceSummary,
      setFieldValue,
      IsGSTInclusive,
    } = this.props
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
          name='adjustmentList'
          render={(arrayHelpers) => {
            this.arrayHelpers = arrayHelpers
            if (!adjustmentList) return null
            return adjustmentList.map((v, i) => {
              if (!v.adjustmentList && v.isDeleted === false) {
                return (
                  <InvoiceAdjustment
                    key={v.id}
                    index={i}
                    adjustmentList={adjustmentList}
                    handleCalcInvoiceSummary={handleCalcInvoiceSummary}
                    adjustmentListName={adjustmentListName}
                    setFieldValue={setFieldValue}
                    handleDeleteInvoiceAdjustment={
                      handleDeleteInvoiceAdjustment
                    }
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
              <span> {`(${settingGSTPercentage}%) GST: `}</span>
              <Field
                name={`${prefix}IsGSTEnabled`}
                render={(args) => (
                  <Switch
                    label={undefined}
                    fullWidth={false}
                    onChange={() => this.onChangeGstToggle()}
                    disabled={IsGSTInclusive}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={1}>
              <FastField
                name={`${prefix}gstAmount`}
                render={(args) => {
                  return <NumberInput {...amountProps} {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={2} md={9} />
            {IsGSTEnabled ? (
              <GridItem xs={10} md={3} style={{ paddingLeft: 28 }}>
                <FastField
                  name={`${prefix}IsGSTInclusive`}
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
                          onChange={(e) => this.onChangeGstToggle(true, e)}
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
              name={`${prefix}totalAmount`}
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

export default InvoiceSummary
