import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Assignment, Save } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Divider } from '@material-ui/core'
import { compare } from '@/layouts'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { status, suppliers, dispUOMs, SDDDescription } from '@/utils/codes'

import {
  CardContainer,
  TextField,
  Button,
  GridContainer,
  GridItem,
  notification,
  Select,
  DatePicker,
  ProgressButton,
  Checkbox,
} from '@/components'

const styles = () => ({})
@withFormik({
  // mapPropsToValues: () => ({}),
  validationSchema: Yup.object().shape({
    Code: Yup.string().required(),
    Name: Yup.string().required(),
    RevenueCategory: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
    const { modelType, dispatch } = props

    const test = {
      code: 'DRUG02',
      displayValue: 'Test Drug 002',
      description: 'Test Drug 002',
      isUserMaintainable: true,
      sortOrder: 0,
      effectiveStartDate: '2019-04-18T03:14:41.336Z',
      effectiveEndDate: '2099-04-18T03:14:41.337Z',
      remark: 'Test Drug 002',
      revenueCategoryFk: '00000000-0000-0000-0000-000000000001',
      isEnableRetail: true,
      prescribeUOMFk: '00000000-0000-0000-0000-000000000001',
      dispenseUOMFk: '00000000-0000-0000-0000-000000000002',
      dispenseUOMtoPrescribeUOMMeasurement: 1,
      lastCostPriceBefBonus: 0,
      lastCostPriceAftBonus: 0,
      averageCostPrice: 0,
      profitMarginPercentage: 0,
      suggestSellingPrice: 880,
      sellingPriceBefDiscount: 0,
      maxDiscount: 0,
      sellingPriceAftDiscount: 0,
      stock: 0,
      reOrderThreshold: 0,
      criticalThreshold: 0,
      stockDrugDrugPrecaution: [
        {
          drugPrecautionFk: '00000000-0000-0000-0000-000000000001',
          sequence: 0,
        },
        {
          drugPrecautionFk: '00000000-0000-0000-0000-000000000005',
          sequence: 1,
        },
      ],
    }
    dispatch({
      type: `${modelType}/submit`,
      payload: test,
    }).then((r) => {
      if (r.message === 'Ok') {
        notification.success({
          message: 'Done',
        })
      }
    })
  },
  displayName: 'InventoryMasterDetail',
})
class Detail extends PureComponent {
  render () {
    const { props } = this
    const { classes, theme, modelType, type, ...restProps } = props
    const submitKey = `${modelType}/submit`
    console.log(props)
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
                  name='Code'
                  render={(args) => {
                    const label = `${type} Code`
                    const p = { ...args, label }
                    return <TextField {...p} />
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Name'
                  render={(args) => {
                    const label = `${type} Name`
                    const p = { ...args, label }
                    return <TextField {...p} />
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Description'
                  render={(args) => {
                    return <TextField label='Description' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Remark'
                  render={(args) => {
                    return (
                      <TextField
                        label='Remark'
                        multiline
                        rowsMax='5'
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='EnableRetail'
                  render={(args) => {
                    return (
                      <Checkbox
                        prefix='Enable Retail'
                        isSwitch
                        colon={false}
                        // controlStyle={{ marginLeft: 200 }}
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
                  name='EffectiveStartDate'
                  render={(args) => (
                    <DatePicker label='Effective Start Date' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='EffectiveEndDate'
                  render={(args) => (
                    <DatePicker label='Effective End Date' {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Supplier'
                  render={(args) => (
                    <Select label='Supplier' options={suppliers} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='BaseUOM'
                  render={(args) => (
                    <Select label='Base UOM' options={dispUOMs} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Category'
                  render={(args) => {
                    const label = `${type} Category`
                    const p = { ...args, label }
                    return <Select options={dispUOMs} {...p} />
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='RevenueCategory'
                  render={(args) => (
                    <Select
                      label='Revenue Category'
                      options={dispUOMs}
                      {...args}
                    />
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

export default withStyles(styles, { withTheme: true })(Detail)
