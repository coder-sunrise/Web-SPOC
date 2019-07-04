import React, { Component, PureComponent, useState } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { connect } from 'dva'
import Yup from '@/utils/yup'

import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  Popover,
  Switch,
  NumberInput,
} from '@/components'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

const styles = (theme) => ({})
@connect(({ consultation, global }) => ({
  consultation,
  global,
}))
@withFormik({
  mapPropsToValues: ({ consultation }) => {
    return {
      ...consultation.default,
      type: true,
      finalAmount: 190,
    }
  },
  validationSchema: Yup.object().shape({
    adjustment: Yup.string().required(),

    remarks: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    if (props.onConfirm) props.onConfirm()
  },
  displayName: 'InvoiceAdjustment',
})
class InvoiceAdjustment extends PureComponent {
  render () {
    const { theme, footer, values, ...props } = this.props
    // console.log(values)
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={8}>
              <Field
                name='adjustment'
                render={(args) => {
                  if (values.type) {
                    return <NumberInput currency label='Adjustment' {...args} />
                  }
                  return (
                    <NumberInput
                      max={100}
                      min={-100}
                      percentage
                      label='Adjustment'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='type'
                render={(args) => {
                  return (
                    <Switch
                      checkedChildren='$'
                      unCheckedChildren='%'
                      label=''
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax='2'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='finalAmount'
                render={(args) => {
                  return (
                    <NumberInput
                      style={{ marginTop: theme.spacing(2) }}
                      currency
                      prefix='Total Invoice After Adjustment:'
                      noUnderline
                      disabled
                      normalText
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(InvoiceAdjustment)
