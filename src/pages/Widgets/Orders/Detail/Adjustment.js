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
@connect(({ orders, global }) => ({
  orders,
  global,
}))
@withFormik({
  mapPropsToValues: ({ orders }) => {
    return {
      ...orders.default,
      type: true,
    }
  },
  validationSchema: Yup.object().shape({
    adjustment: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    if (props.onConfirm) props.onConfirm()
  },
  displayName: 'Adjustment',
})
class Adjustment extends PureComponent {
  render () {
    const { theme, footer, values, ...props } = this.props
    // console.log(values)
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={8}>
              <Field
                name='adjValue'
                render={(args) => {
                  if (values.type) {
                    return (
                      <NumberInput
                        autoFocus
                        currency
                        label='Adjustment'
                        {...args}
                      />
                    )
                  }
                  return (
                    <NumberInput
                      percentage
                      autoFocus
                      label='Adjustment'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='adjType'
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
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            extraButtons: (
              <Button color='primary' onClick={props.onConfirm}>
                Remove Adj
              </Button>
            ),
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Adjustment)
