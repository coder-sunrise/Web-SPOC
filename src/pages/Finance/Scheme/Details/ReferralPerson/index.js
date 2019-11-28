import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Divider } from '@material-ui/core'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { compare } from '@/layouts'
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

const submitKey = 'schemeReferralPerson/submitDetail'
const styles = (theme) => ({
  ...basicStyle(theme),
})
@connect(({ schemeReferralPerson }) => ({
  schemeReferralPerson,
}))
@withFormik({
  mapPropsToValues: ({ schemeReferralPerson }) => {
    // console.log(com)
    return schemeReferralPerson.entity
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
@compare('schemeReferralPerson')
class ReferralPerson extends PureComponent {
  search = () => {
    this.props.dispatch({
      type: 'schemeReferralPerson/search',
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
            <GridItem xs={4}>
              <FastField
                name='name'
                render={(args) => <TextField label='Name' {...args} />}
              />
            </GridItem>
            <GridItem xs={4}>
              <FastField
                name='company'
                render={(args) => <TextField label='Company' {...args} />}
              />
            </GridItem>
            <GridItem xs={3}>
              <div className={classes.filterBtn}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    // this.props.history.push('/inventory/master/schemeReferralPerson')
                  }}
                >
                  New
                </Button>
                <ProgressButton text='Search' onClick={this.search} />
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ReferralPerson)
