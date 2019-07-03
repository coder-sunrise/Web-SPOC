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
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

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
} from '@/components'
import Grid from './Grid'

const submitKey = 'schemeCoPayment/submitDetail'
const styles = (theme) => ({
  ...basicStyle(theme),
})
@connect(({ schemeCoPayment }) => ({
  schemeCoPayment,
}))
@withFormik({
  mapPropsToValues: ({ schemeCoPayment }) => {
    // console.log(com)
    return schemeCoPayment.entity
  },
  validationSchema: Yup.object().shape({
    // EditingItems: Yup.array().of(
    //   Yup.object().shape({
    //     Description: Yup.string().required('Description is required'),
    //     UnitPrice: Yup.number().required('Unit Price is required'),
    //   }),
    // ),
    Code: Yup.string().required(),
    Name: Yup.string().required(),
    RevenueCategory: Yup.string().required(),
  }),

  handleSubmit: (values, { props }) => {
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
@compare('schemeCoPayment')
class CoPayment extends PureComponent {
  search = () => {
    this.props.dispatch({
      type: 'schemeCoPayment/search',
    })
  }

  render () {
    // console.log(this)
    const { props } = this
    const { classes, theme, ...restProps } = props
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className={classes.filterBar}>
          <GridContainer>
            <GridItem xs={6} md={4}>
              <FastField
                name='schemeName'
                render={(args) => <TextField label='Scheme Name' {...args} />}
              />
            </GridItem>
            <GridItem xs={6} md={4}>
              <FastField
                name='schemeTypeFK'
                render={(args) => (
                  <Select label='Scheme Type' options={suppliers} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={4}>
              <FastField
                name='schemeCategoryFK'
                render={(args) => (
                  <Select
                    label='Scheme Category'
                    options={suppliers}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={4}>
              <FastField
                name='nameFK'
                render={(args) => (
                  <Select label='Co-Payer Name' options={suppliers} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={4}>
              <FastField
                name='nameTypeFK'
                render={(args) => (
                  <Select label='Co-Payer Type' options={suppliers} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={6} md={4}>
              <FastField
                name='statusFK'
                render={(args) => (
                  <Select label='Status' options={suppliers} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <div className={classes.filterBtn}>
                <ProgressButton
                  style={{ minWidth: 145 }}
                  text='Search'
                  onClick={this.search}
                />
                <Button
                  variant='contained'
                  style={{ minWidth: 145 }}
                  color='primary'
                  onClick={() => {
                    // this.props.history.push('/inventory/master/schemeCoPayment')
                  }}
                >
                  Add New
                </Button>
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CoPayment)
