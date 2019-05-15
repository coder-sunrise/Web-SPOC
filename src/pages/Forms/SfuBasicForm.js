import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage, FormattedMessage } from 'umi/locale'
// import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
// import { TooltipComponent } from '@syncfusion/ej2-react-popups'
// import {TextBox as TextBoxComponent , TextArea,RadioButtonGroup} from '@/components'
// import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons'
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
// import Button from "devextreme-react/button"
// import Paper from '@material-ui/core/Paper'
// import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import { RadioButtonGroup, FormField, DatePicker } from '@/components'
import {
  withFormik,
  Formik,
  Form,
  Field,
  FastField,
  ErrorMessage,
} from 'formik'
import humps from 'humps'
import CustomInput from 'mui-pro-components/CustomInput'
import Card from 'mui-pro-components/Card/Card.jsx'
import CardHeader from 'mui-pro-components/Card/CardHeader.jsx'
import CardText from 'mui-pro-components/Card/CardText.jsx'
import CardIcon from 'mui-pro-components/Card/CardIcon.jsx'
import CardBody from 'mui-pro-components/Card/CardBody.jsx'
import Yup from '@/utils/yup'
import MailOutline from '@material-ui/icons/MailOutline'

import {
  // Form,
  Input,
  // DatePicker,
  Select,
  // Button,
  // Card,
  InputNumber,
  Radio,
  Icon,
  // Tooltip,
} from 'antd'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

// import styles from './style.less'
// import 'devextreme/dist/css/dx.common.css'
// import 'devextreme/dist/css/dx.light.compact.css'
// Yup.setLocale({
//   mixed: {
//     default:  `${humps(path)} is a required field`,
//   },
//   number: {
//     min: 'Deve ser maior que ${min}',
//   },
// });

// const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
// const { TextArea } = Input
const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 800,
  },
  actionBar: {
    marginTop: theme.spacing.unit * 3,
  },
  radiogroup: {
    marginTop: theme.spacing.unit * 1,
  },
})
// @Form.create()
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@withFormik({
  mapPropsToValues: () => ({
    Title: '',
    Start: '',
    End: '2018-12-14',
    Goal: '',
    Standard: '',
    Client: '',
    Invites: '',
    Weight: '',
    TargetDisclosure: '',
  }),
  validationSchema: Yup.object().shape({
    Title: Yup.string().required(),
    Goal: Yup.string().required(),
    Start: Yup.date().required(),
    End: Yup.date().required(),
    Standard: Yup.string().required(),
    Client: Yup.string().required(),
    Invites: Yup.string(),
    Weight: Yup.number(),
    TargetDisclosure: Yup.string().required(),
  }),
  // Custom sync validation
  // validate: values => {
  //   const errors = {}

  //   if (!values.title) {
  //     errors.title = 'Required'
  //   }

  //   return errors
  // },

  handleBlur: (a, b, c) => {
    // console.log(a,b,c)
    // handleChange(e);
    // setFieldTouched(name, true, false);
  },

  handleSubmit: (values, { setSubmitting }) => {
    console.log(values)
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2))
      setSubmitting(false)
    }, 1000)
  },

  displayName: 'BasicForm',
})
class SfuBasicForm extends PureComponent {
  // handleSubmit = e => {
  //   const { dispatch, form } = this.props
  //   e.preventDefault()
  //   form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       dispatch({
  //         type: 'form/submitRegularForm',
  //         payload: values,
  //       })
  //     }
  //   })
  // };

  render () {
    const { submitting } = this.props
    // const {
    //   form: { getFieldDecorator, getFieldValue },
    // } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    }
    const { classes } = this.props

    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    } = this.props
    // console.log(this)
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id='app.forms.basic.title' />}
        content={<FormattedMessage id='app.forms.basic.description' />}
      >
        <Card>
          {/* <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
        let errors = {}
        if (!values.email) {
          errors.email = 'Required'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        return errors
      }}
            onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" />
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" />
                <button type="submit" disabled={isSubmitting}>
            Submit
                </button>
              </Form>
      )}
          </Formik> */}
        </Card>
        <Card>
          <CardHeader color='rose' icon>
            <CardIcon color='rose'>
              <MailOutline />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Stacked Form</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <Grid container justify='center' spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Title'
                    render={(args) => {
                      return (
                        <CustomInput
                          label={formatMessage({ id: 'form.title.label' })}
                          autoFocus
                          {...args}
                        />
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container justify='center' spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Start'
                    render={(args) => (
                      <DatePicker
                        label={formatMessage({
                          id: 'form.date.placeholder.start',
                        })}
                        timeFormat={false}
                        {...args}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs>
                  <FastField
                    name='End'
                    render={(args) => (
                      <DatePicker
                        label={formatMessage({
                          id: 'form.date.placeholder.end',
                        })}
                        timeFormat={false}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Goal'
                    render={(args) => (
                      <CustomInput
                        label={formatMessage({ id: 'form.goal.label' })}
                        multiline
                        rowsMax='4'
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Standard'
                    render={(args) => (
                      <CustomInput
                        label={formatMessage({ id: 'form.standard.label' })}
                        multiline
                        rowsMax='4'
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Client'
                    render={(args) => (
                      <CustomInput
                        label={formatMessage({ id: 'form.client.label' })}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Tooltip
                                title={formatMessage({
                                  id: 'form.client.placeholder',
                                })}
                              >
                                <AccountCircle />
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Invites'
                    render={(args) => (
                      <CustomInput
                        label={`${formatMessage({
                          id: 'form.invites.label',
                        })} ${formatMessage({ id: 'form.optional' })}`}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs>
                  <FastField
                    name='Weight'
                    render={(args) => (
                      <CustomInput
                        label={`${formatMessage({
                          id: 'form.weight.label',
                        })} ${formatMessage({ id: 'form.optional' })}`}
                        type='number'
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>%</InputAdornment>
                          ),
                        }}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={24} className={classes.radiogroup}>
                <Grid item xs>
                  <FastField
                    name='TargetDisclosure'
                    render={(args) => (
                      <RadioButtonGroup
                        label={formatMessage({ id: 'form.public.label' })}
                        tipText={
                          <FormattedMessage id='form.public.label.help' />
                        }
                        row
                        // help={form.errors.TargetDisclosure}
                        // error={!!form.errors.TargetDisclosure}
                        options={[
                          {
                            value: '1',
                            label: (
                              <FormattedMessage id='form.public.radio.public' />
                            ),
                          },
                          {
                            value: '2',
                            label: (
                              <FormattedMessage id='form.public.radio.partially-public' />
                            ),
                          },
                          {
                            value: '3',
                            label: (
                              <FormattedMessage id='form.public.radio.private' />
                            ),
                          },
                        ]}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                justify='center'
                spacing={24}
                className={classes.actionBar}
              >
                <Grid item>
                  <Button variant='contained' color='primary' type='submit'>
                    <FormattedMessage id='form.submit' />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' type='submit'>
                    <FormattedMessage id='form.save' />
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </CardBody>
        </Card>
        {/* </Card> */}
      </PageHeaderWrapper>
    )
  }
}

export default withStyles(styles)(SfuBasicForm)
