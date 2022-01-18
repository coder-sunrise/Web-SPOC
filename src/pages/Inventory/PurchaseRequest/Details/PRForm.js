import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { formatMessage } from 'umi'
import { Divider } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  DatePicker,
  OutlinedTextField,
  CodeSelect,
  NumberInput,
  Field,
  ClinicianSelect,
} from '@/components'
import { MobileNumberInput } from '@/components/_medisys'
import AuthorizedContext from '@/components/Context/Authorized'

const prefix = 'purchaseRequest'

const PRForm = ({ setFieldValue, isReadOnly = false }) => {
  return (
    <div>
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.purchaseRequestNo`}
                render={args => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.purchaserequest.prno',
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
                name={`${prefix}.purchaseRequestStatusFK`}
                render={args => {
                  return (
                    <CodeSelect
                      label={formatMessage({
                        id: 'inventory.purchaserequest.status',
                      })}
                      code='LTPurchaseRequestStatus'
                      labelField='name'
                      disabled
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name={`${prefix}.remarks`}
                render={args => {
                  return (
                    <TextField
                      label={formatMessage({
                        id: 'inventory.purchaserequest.detail.remarks',
                      })}
                      multiline
                      rowsMax={4}
                      maxLength={2000}
                      disabled={isReadOnly}
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
                name={`${prefix}.purchaseRequestDate`}
                render={args => {
                  return (
                    <DatePicker
                      label={formatMessage({
                        id: 'inventory.purchaserequest.detail.requestdate',
                      })}
                      allowClear={false}
                      onChange={e => {
                        if (e === '') {
                          setFieldValue(
                            'purchaseRequest.purchaseRequestDate',
                            moment(),
                          )
                        }
                      }}
                      disabled={isReadOnly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <Field
                name={`${prefix}.exceptedDeliveryDate`}
                render={args => {
                  return (
                    <DatePicker
                      label={formatMessage({
                        id:
                          'inventory.purchaserequest.detail.expectedDeliveryDate',
                      })}
                      allowClear={true}
                      // onChange={e => {
                      //   if (e === '') {
                      //     setFieldValue(
                      //       'purchaseRequest.expectedDeliveryDate',
                      //       moment(),
                      //     )
                      //   }
                      // }}
                      disabled={isReadOnly}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name={`${prefix}.createByUserFK`}
                render={args => {
                  return (
                    <ClinicianSelect
                      label={formatMessage({
                        id: 'inventory.purchaserequest.detail.requestedBy',
                      })}
                      {...args}
                      disabled
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <p style={{ minHeight: 52 }} />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default PRForm
