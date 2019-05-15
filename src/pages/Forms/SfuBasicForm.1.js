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
import { Scheduler, DayView, Appointments } from '@devexpress/dx-react-scheduler-material-ui'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import {RadioButtonGroup} from '@/components'
import { withFormik ,Formik, Form, Field,FastField, ErrorMessage } from 'formik'
import * as Yup from 'yup' 
import humps from 'humps'
import {
  // Form,
  Input,
  DatePicker,
  Select,
  // Button,
  Card,
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
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 800,
  },
  actionBar:{
    marginTop: theme.spacing.unit*3,
  },
  radiogroup:{
    marginTop: theme.spacing.unit*1,

  },
})
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
// @Form.create()
@withFormik({
  mapPropsToValues: () => ({ 
    Start:'2018-12-13',
    End:'2018-12-14',

  }),
  validationSchema:Yup.object().shape({
    Title: Yup.string().required(),
    Goal: Yup.string().required(),
    Start: Yup.date().required(),
    End: Yup.date().required(),
    Standard: Yup.string().required(),
    Client: Yup.string().required(),
    Invites: Yup.string(),
    Weight: Yup.number(),
    Public:Yup.string().required(),
  }),
  // Custom sync validation
  // validate: values => {
  //   const errors = {}

  //   if (!values.title) {
  //     errors.title = 'Required'
  //   }

  //   return errors
  // },

  handleBlur:(a,b,c)=>{
    console.log(a,b,c)
    // handleChange(e);
    // setFieldTouched(name, true, false);
  },

  handleSubmit: (values, { setSubmitting }) => {
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
    } =this.props
    // console.log(this)
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.forms.basic.title" />}
        content={<FormattedMessage id="app.forms.basic.description" />}
      >    
        <Paper className={classes.root}>
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

          <form onSubmit={handleSubmit}>
            <Grid container justify="center" spacing={24}>
              <Grid item xs>
                <FastField
                  name="Title"
                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.title.label' })}
                    fullWidth
                    autoFocus
                    name="Title"
                    helperText={form.touched.Title ? form.errors.Title : ""}
                    error={form.touched.Title && !!form.errors.Title}
                    {...field}
                  />}
                />
              </Grid>   
            </Grid>
            <Grid container justify="center" spacing={24}>
              <Grid item xs>
                <FastField
                  name="Start"
                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.date.placeholder.start' })}
                    type="date"
                    fullWidth
                    helperText={form.touched.Start ? form.errors.Start : ""}
                    error={form.touched.Start && !!form.errors.Start}
                    {...field}
                  />}
                />
              </Grid>              
              <Grid item xs>
                <FastField
                  name="End"
                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.date.placeholder.end' })}
                    type="date"
                    fullWidth
                    helperText={form.touched.End ? form.errors.End : ""}
                    error={form.touched.End && !!form.errors.End}
                    {...field}
                  />}
                />
              </Grid>
            </Grid>
            <Grid container spacing={24}>
              <Grid item xs>
                <FastField
                  name="Goal"

                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.goal.label' })}
                    multiline
                    rowsMax="4"
                    fullWidth
                    name="Goal"

                    helperText={form.touched.Goal ? form.errors.Goal : ""}
                    error={form.touched.Goal && !!form.errors.Goal}
                    {...field}
                  />}
                />
              
              </Grid>
            </Grid> 
            <Grid container spacing={24}>
              <Grid item xs>
                <FastField
                  name="Standard"
                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.standard.label' })}
                    multiline
                    rowsMax="4"
                    fullWidth
                    helperText={form.touched.Standard ? form.errors.Standard : ""}
                    error={form.touched.Standard && !!form.errors.Standard}
                    {...field}
                  />}
                />
              </Grid>
            </Grid> 
            
            <Grid container spacing={24}>
              <Grid item xs>
                <FastField
                  name="Client"
                  render={({ field, form }) => <TextField
                    label={formatMessage({ id: 'form.client.label' })}
                    multiline
                    rowsMax="4"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={formatMessage({id: 'form.client.placeholder'})}>
                            <AccountCircle />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    helperText={form.touched.Client ? form.errors.Client : ""}
                    error={form.touched.Client && !!form.errors.Client}
                    {...field}
                  />}
                />
              </Grid>
            </Grid> 
            <Grid container spacing={24}>
              <Grid item xs>
                <FastField
                  name="Invites"
                  render={({ field, form }) => <TextField
                    label={`${formatMessage({ id: 'form.invites.label' })} ${formatMessage({ id: 'form.optional' })}`}
                    fullWidth
                    helperText={form.touched.Invites ? form.errors.Invites : ""}
                    error={form.touched.Invites && !!form.errors.Invites}
                    {...field}
                  />}
                />
              </Grid>
            </Grid> 
            <Grid container spacing={24}>
              <Grid item xs>
                <FastField
                  name="Weight"
                  render={({ field, form }) => <TextField
                    label={`${formatMessage({ id: 'form.weight.label' })} ${formatMessage({ id: 'form.optional' })}`}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          %
                        </InputAdornment>
                      ),
                    }}
                    helperText={form.touched.Weight ? form.errors.Weight : ""}
                    error={form.touched.Weight && !!form.errors.Weight}
                    {...field}
                  />}
                />
              </Grid>
            </Grid>
            <Grid container spacing={24} className={classes.radiogroup}>
              <Grid item xs>
                <FastField
                  name="Public"
                  render={({ field, form }) => <RadioButtonGroup 
                    label={formatMessage({ id: 'form.public.label' })}
                    help={<FormattedMessage id="form.public.label.help" />}
                    row
                    helperText={form.touched.Public ? form.errors.Public : ""}
                    error={form.touched.Public && !!form.errors.Public}
                    options={[{
                value:'1', 
                label:<FormattedMessage id="form.public.radio.public" />,
              },{
                value:'2', 
                label:<FormattedMessage id="form.public.radio.partially-public" />,
              },{
                value:'3', 
                label:<FormattedMessage id="form.public.radio.private" />,
              }]}
                    {...field}
                  />}
                />
                
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={24} className={classes.actionBar}>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  <FormattedMessage id="form.submit" />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">
                  <FormattedMessage id="form.save" />
                </Button>
              </Grid>
            </Grid>
          </form>
          
        </Paper>          
        {/* </Card> */}
      </PageHeaderWrapper>
    )
  }
}

export default  withStyles(styles)(SfuBasicForm)
