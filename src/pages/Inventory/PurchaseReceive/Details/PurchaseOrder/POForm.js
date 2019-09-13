import React, { PureComponent } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi/locale'
import { Divider } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  DatePicker,
  OutlinedTextField,
  CodeSelect,
} from '@/components'

export class POForm extends PureComponent {
  render () {
    const prefix = 'purchaseOrder'
    console.log('POForm', this)
    return (
      <div>
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.poNo`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.pono',
                        })}
                        disabled={true}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.status`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.status',
                        })}
                        disabled={true}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.expectedDeliveryDate`}
                  render={(args) => {
                    return (
                      <DatePicker
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.expectedDeliveryDate',
                        })}
                        disabledDate={(d) =>
                          !d || d.isBefore(moment().add('days', -1))}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.invoiceDate`}
                  render={(args) => {
                    return (
                      <DatePicker
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.invoiceDate',
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
                  name={`${prefix}.poDate`}
                  render={(args) => {
                    return (
                      <DatePicker
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.poDate',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.shippingAddress`}
                  render={(args) => {
                    return (
                      <OutlinedTextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.shippingAdd',
                        })}
                        multiline
                        rowsMax={2}
                        rows={2}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.invoiceNo`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.invoiceNo',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>

          <GridItem xs={12} md={11}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.pod.supplierInfo',
              })}
            </h4>
            <Divider />
          </GridItem>

          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.supplier`}
                  render={(args) => {
                    return (
                      <CodeSelect
                        label={formatMessage({
                          id: 'inventory.pr.supplier',
                        })}
                        //code='ctCompany'
                        //max={10}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.contactPerson`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.contactPerson',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.supplierAddress`}
                  render={(args) => {
                    return (
                      <OutlinedTextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.supplierAdd',
                        })}
                        multiline
                        rowsMax={2}
                        rows={2}
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
                  name={`${prefix}.contactNo`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.contactNo',
                        })}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name={`${prefix}.faxNo`}
                  render={(args) => {
                    return (
                      <TextField
                        label={formatMessage({
                          id: 'inventory.pr.detail.pod.faxNo',
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
    )
  }
}

export default POForm
