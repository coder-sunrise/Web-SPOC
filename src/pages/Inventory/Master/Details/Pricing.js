import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment, Save } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Divider } from '@material-ui/core'
import { compare } from '@/layouts'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { status, suppliers, dispUOMs } from '@/utils/codes'

import {
  CardContainer,
  TextField,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  RadioGroup,
  ProgressButton,
  Checkbox,
  NumberInput,
} from '@/components'

const styles = () => ({})
@withFormik({
  // mapPropsToValues: ({ consumable }) => {
  //   // console.log(com)
  //   return consumable.entity
  // },
  validationSchema: Yup.object().shape({
    // EditingItems: Yup.array().of(
    //   Yup.object().shape({
    //     Description: Yup.string().required('Description is required'),
    //     UnitPrice: Yup.number().required('Unit Price is required'),
    //   }),
    // ),
    SellingPrice: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { modelType } = props
    const submitKey = `${modelType}/submitPrice`
    props
      .dispatch({
        type: submitKey,
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          // toast.success('test')
          notification.success({
            // duration:0,
            message: 'Done',
          })
        }
      })
  },
  displayName: 'InventoryMasterDetail',
})
class Pricing extends PureComponent {
  render () {
    const { props } = this
    const { classes, theme, modelType, ...restProps } = props
    const submitKey = `${modelType}/submitPrice`
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <GridContainer gutter={0}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='LastCostPriceBefore'
                  render={(args) => {
                    return (
                      <NumberInput
                        currency
                        label='Last Cost Price (Before Bonus)'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='LastCostPriceAfter'
                  render={(args) => {
                    return (
                      <NumberInput
                        currency
                        label='Last Cost Price (After Bonus)'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='AverageCostPrice'
                  render={(args) => {
                    return (
                      <NumberInput
                        currency
                        label='Average Cost Price'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={2} />
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='MarkupMargin'
                  render={(args) => (
                    <NumberInput label='Markup Margin (%)' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='SuggestedSellingPrice'
                  render={(args) => (
                    <NumberInput
                      currency
                      label='Suggested Selling Price'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='SellingPrice'
                  render={(args) => (
                    <NumberInput currency label='Selling Price' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='MaxDiscount'
                  render={(args) => (
                    <NumberInput label='Max Discount (%)' {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        <Divider style={{ margin: '40px 0 20px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <Button
            color='danger'
            onClick={() => {
              props.history.push('/inventory/master?t=c')
            }}
          >
            Cancel
          </Button>
          <ProgressButton submitKey={submitKey} onClick={props.handleSubmit} />
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Pricing)
