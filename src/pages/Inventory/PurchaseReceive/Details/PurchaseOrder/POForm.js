import React, { useState, useEffect } from 'react'
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
  Field,
} from '@/components'

const prefix = 'purchaseOrder'

const POForm = ({ setFieldValue, isReadOnly = false }) => {
  const setSupplierDetails = (opts) => {
    let conPerson
    let faxNo
    let contactNo
    let address

    if (opts) {
      const { contactPerson, contact } = opts
      const { faxContactNumber, mobileContactNumber, contactAddress } = contact
      const { street } = contactAddress[0]
      conPerson = contactPerson
      faxNo = faxContactNumber.number
      contactNo = mobileContactNumber.number
      address = street
    }

    setFieldValue(`${prefix}.contactPerson`, conPerson)
    setFieldValue(`${prefix}.faxNo`, faxNo)
    setFieldValue(`${prefix}.contactNo`, contactNo)
    setFieldValue(`${prefix}.supplierAddress`, address)
  }
  return (
    <div>
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.purchaseOrderNo`}
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.pr.pono',
                      })}
                      disabled
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.purchaseOrderStatusFK`}
                render={(args) => {
                  return (
                    // <TextField
                    //   label={formatMessage({
                    //     id: 'inventory.pr.status',
                    //   })}
                    //   disabled
                    //   {...args}
                    // />
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.pr.status',
                      })}
                      code='LTPurchaseOrderStatus'
                      labelField='name'
                      disabled
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.exceptedDeliveryDate`}
                render={(args) => {
                  return (
                    <DatePicker
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.expectedDeliveryDate',
                      })}
                      disabledDate={(d) =>
                        !d || d.isBefore(moment().add('days', -1))}
                      // disabled={!isReadOnly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name={`${prefix}.invoiceDate`}
                render={(args) => {
                  return (
                    <DatePicker
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.invoiceDate',
                      })}
                      disabled={isReadOnly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.remark`}
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.remarks',
                      })}
                      multiline
                      rowsMax={4}
                      // disabled={isReadOnly}
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
              <Field
                name={`${prefix}.purchaseOrderDate`}
                render={(args) => {
                  return (
                    <DatePicker
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.poDate',
                      })}
                      // disabled={!isReadOnly}
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
                      // disabled={!isReadOnly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name={`${prefix}.invoiceNo`}
                render={(args) => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.pr.detail.pod.invoiceNo',
                      })}
                      disabled={isReadOnly}
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
                name={`${prefix}.supplierFK`}
                render={(args) => {
                  return (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.pr.supplier',
                      })}
                      code='ctSupplier'
                      labelField='displayValue'
                      onChange={(v, opts) => {
                        setSupplierDetails(opts)
                      }}
                      // disabled={!isReadOnly}
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
                      // disabled={!isReadOnly}
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
                      // disabled={!isReadOnly}
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
                      // disabled={!isReadOnly}
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
                      // disabled={!isReadOnly}
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

export default POForm
