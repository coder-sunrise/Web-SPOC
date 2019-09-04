import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import {
  CardContainer,
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  Select,
  NumberInput,
} from '@/components'

@withFormikExtend({ displayName: 'receivingItemDetails' })
export class DeliveryOrderDetails extends PureComponent {
  render () {
    const { props } = this
    const { footer, theme } = props

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer gutter={0}>
            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <FastField
                    name='code'
                    render={(args) => {
                      return (
                        <Select
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.receivingItem.code',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='name'
                    render={(args) => {
                      return (
                        <Select
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.receivingItem.name',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='orderQty'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.orderQty',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='bonusQty'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.bonusQty',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='totalQty'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.totalQty',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <h4 style={{ marginTop: 20 }}>
                    {formatMessage({
                      id: 'inventory.pr.detail.dod.receivingItem.orderUOM',
                    })}
                  </h4>
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='qtyAlreadyReceived'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.qtyAlreadyReceived',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='qtyBonusAlreadyReceived'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.qtyBonusAlreadyReceived',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>

            <GridItem xs={12} md={1} />

            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <FastField
                    name='receivingOrderQty'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.receivingOrderQty',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='receivingBonusQty'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.receivingBonusQty',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <h4 style={{ marginTop: 20 }}>
                    {formatMessage({
                      id: 'inventory.pr.detail.dod.receivingItem.receivingUOM',
                    })}
                  </h4>
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='batchNo'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id:
                              'inventory.pr.detail.dod.receivingItem.batchNo',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='expiryDate'
                    render={(args) => {
                      return (
                        <Select
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.receivingItem.expiryDate',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default DeliveryOrderDetails
