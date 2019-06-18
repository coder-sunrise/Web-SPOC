import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Assignment, Save } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Divider } from '@material-ui/core'
import { compare } from '@/layouts'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { status, suppliers, dispUOMs, SDDDescription } from '@/utils/codes'
import { compose } from 'redux'

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

const Detail = (props) => {
  const { classes, theme, type, ...restProps } = props
  const submitKey = `${type}/submit`
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
                  const label = 'Medication Code'
                  const p = { ...args, label }
                  return <TextField {...p} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='Name'
                render={(args) => {
                  const label = 'Medication Name'
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
                    <TextField label='Remark' multiline rowsMax='5' {...args} />
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
            <GridItem xs={12}>
              <FastField
                name='SDDID'
                render={(args) => {
                  return <TextField label='SDD ID' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='SDDDescription'
                render={(args) => {
                  const label = `${type} SDD Description`
                  const p = { ...args, label }
                  return <Select options={SDDDescription} {...p} />
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
export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    // mapPropsToValues: () => ({}),
    validationSchema: Yup.object().shape({
      Code: Yup.string().required(),
      Name: Yup.string().required(),
      RevenueCategory: Yup.string().required(),
    }),
    handleSubmit: (values, { props }) => {
      const { modelType, dispatch } = props
      // dispatch({
      //   type: `${modelType}/submit`,
      //   payload: test,
      // }).then((r) => {
      //   if (r.message === 'Ok') {
      //     notification.success({
      //       message: 'Done',
      //     })
      //   }
      // })
    },
    displayName: 'InventoryMasterDetail',
  }),
  connect(({ medicationDetail }) => ({
    medicationDetail,
  })),
)(Detail)
