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

const submitKey = 'schemeCompany/submitDetail'
const styles = (theme) => ({
  ...basicStyle(theme),
})
@connect(({ schemeCompany }) => ({
  schemeCompany,
}))
@withFormik({
  mapPropsToValues: ({ schemeCompany }) => {
    // console.log(com)
    return schemeCompany.entity
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
@compare('schemeCompany')
class Company extends PureComponent {
  search = () => {
    this.props.dispatch({
      type: 'schemeCompany/search',
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
            <GridItem xs={9}>
              <FastField
                name='Supplier'
                render={(args) => (
                  <Select label='Company' options={suppliers} {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={3}>
              <div className={classes.filterBtn}>
                <Button
                  variant='contained'
                  style={{ minWidth: 145 }}
                  color='primary'
                  onClick={() => {
                    // this.props.history.push('/inventory/master/schemeCompany')
                  }}
                >
                  New Company
                </Button>
              </div>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} md={9}>
              <FastField
                name='companyType'
                render={(args) => (
                  <RadioGroup
                    label=' '
                    simple
                    defaultValue='1'
                    options={[
                      {
                        value: '1',
                        label: 'Co-Payer',
                      },
                      {
                        value: '2',
                        label: 'Referral Source',
                      },
                      {
                        value: '3',
                        label: 'Supplier',
                      },
                      {
                        value: '4',
                        label: 'Customer',
                      },
                      {
                        value: '5',
                        label: 'Account Payable',
                      },
                      {
                        value: '6',
                        label: 'Others',
                      },
                    ]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12} md={3}>
              <div className={classes.filterBtn}>
                <ProgressButton
                  style={{ minWidth: 145 }}
                  text='Search'
                  onClick={this.search}
                />
              </div>
            </GridItem>
          </GridContainer>
        </div>
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Company)
