import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import { formatMessage, FormattedMessage } from 'umi/locale'
// import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
// import { TooltipComponent } from '@syncfusion/ej2-react-popups'
// import {TextBox as TextBoxComponent , TextArea,RadioButtonGroup} from '@/components'
// import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons'
// import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars'
import moment from 'moment'
import ReactTable from 'react-table'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import Button from "devextreme-react/button"
// import Paper from '@material-ui/core/Paper'
// import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui'
import {
  Scheduler,
  DayView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui'
// import Button from '@material-ui/core/Button'
import Button from 'mui-pro-components/CustomButtons'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'

import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'

import Tooltip from '@material-ui/core/Tooltip'
import {
  withFormik,
  Formik,
  Form,
  Field,
  FastField,
  ErrorMessage,
} from 'formik'
import humps from 'humps'
import Grid from '@material-ui/core/Grid'

import Call from '@material-ui/icons/Call'
import Chat from '@material-ui/icons/Chat'
import Fingerprint from '@material-ui/icons/Fingerprint'
import FlightLand from '@material-ui/icons/FlightLand'
import Build from '@material-ui/icons/Build'

import IconButton from '@material-ui/core/IconButton'
import CustomInput from 'mui-pro-components/CustomInput'
import Card from 'mui-pro-components/Card/Card.jsx'
import CardHeader from 'mui-pro-components/Card/CardHeader.jsx'
import CardText from 'mui-pro-components/Card/CardText.jsx'
import CardIcon from 'mui-pro-components/Card/CardIcon.jsx'
import CardBody from 'mui-pro-components/Card/CardBody.jsx'
import Assignment from '@material-ui/icons/Assignment'
import Yup from '@/utils/yup'
import Drawer from '@material-ui/core/Drawer'
import Timeline from 'mui-pro-components/Timeline'

import Divider from '@material-ui/core/Divider'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SpeakerNotes from '@material-ui/icons/SpeakerNotes'
import Add from '@material-ui/icons/Add'
import { Affix } from 'antd'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import NavPills from 'mui-pro-components/NavPills'
import Badge from '@material-ui/core/Badge'

import hoverCardStyle from 'mui-pro-jss/material-dashboard-pro-react/hoverCardStyle.jsx'
import {
  RadioButtonGroup,
  FormField,
  DatePicker,
  Select,
  NumberInput,
} from '@/components'
import Invoice from './Invoice'
import Payment from './Payment'

console.log(Yup)
const drawerWidth = 400
const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: '0px !important',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
  },
  floatButton: {
    position: 'absolute',
    right: 28,
    top: -30,
    zIndex: 100,
    '& > button': {
      margin: 0,
    },
  },
  actionBar: {
    marginTop: theme.spacing.unit * 3,
  },
  radiogroup: {
    marginTop: theme.spacing.unit * 1,
  },
  buttonContainer: {
    padding: '0 10px',
  },
  ...hoverCardStyle,
})
// @Form.create()
@connect(({ invoiceDetail, loading }) => ({
  invoiceDetail,
  submitting: loading.effects['form/submitRegularForm'],
}))
@withFormik({
  mapPropsToValues: () => ({
    Date: moment().add(-1, 'months'),
    Status: '1',
    Invoice: 'IV-92867100001',
    PaymentAmt: 123,
    InvoiceAmt: 1244,
    OustandingBal: 3212,
    DebitNoteAmt: 13,
    CreditNoteAmt: 32,
  }),
  validationSchema: Yup.object().shape({
    Date: Yup.date(),
  }),
  // // Custom sync validation
  // // validate: values => {
  // //   const errors = {}
  // //   if (!values.title) {
  // //     errors.title = 'Required'
  // //   }
  // //   return errors
  // // },
  // handleBlur: (a, b, c) => {
  //   console.log(a, b, c)
  //   // handleChange(e);
  //   // setFieldTouched(name, true, false);
  // },
  // handleSubmit: (values, { setSubmitting }) => {
  //   setTimeout(() => {
  //     alert(JSON.stringify(values, null, 2))
  //     setSubmitting(false)
  //   }, 1000)
  // },
  // handleDrawerOpen: () => {
  //   this.setState({ open: true })
  // },
  // displayName: 'Finance Invoice Detail',
})
class Detail extends PureComponent {
  state = {
    open: false,
    selected: 0,
  }

  render () {
    const { theme, submitting, invoiceDetail: { list } } = this.props
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
    const rowCfg = {
      container: true,
      justify: 'center',
      spacing: 8,
    }
    const colCfg = {
      item: true,
      xs: true,
    }
    const { open } = this.state
    // console.log(theme)
    const inptCfg = {
      disabled: true,
    }
    const currencyCfg = {
      currency: true,
    }
    const widgetButtons = (
      <React.Fragment>
        <Button
          size='sm'
          onClick={() => {}}
          justIcon
          round
          color='rose'
          simple
          title='Delete'
          // style={{marginRight:theme.spacing.unit}}
        >
          <Delete />
        </Button>
        <Button
          size='sm'
          onClick={() => {}}
          justIcon
          round
          color='primary'
          simple
          title='Edit'
        >
          <Edit />
        </Button>
      </React.Fragment>
    )

    const widgetStories = [
      {
        // First story
        inverted: true,
        badgeColor: 'success',
        badgeIcon: Add,
        title: 'Add',
        titleColor: 'success',
        body: <CustomInput label='New Note' multiline />,
        footerTitle: 'Now',
      },
      {
        // First story
        inverted: true,
        badgeColor: 'danger',
        badgeIcon: Call,
        title: 'Call',
        titleColor: 'danger',
        body: <p>Patient prefers Afternoon appt</p>,
        footerTitle: '11 hours ago by Jack',
        footerButton: widgetButtons,
      },
      {
        // Second story
        inverted: true,
        badgeColor: 'success',
        badgeIcon: Chat,
        title: 'Chat',
        titleColor: 'success',
        body: <p>Call patient when the Otho Tooth brush are here</p>,
        footerTitle: '2 days ago by Zoe',
        footerButton: widgetButtons,
      },
      {
        // Third story
        inverted: true,
        badgeColor: 'info',
        badgeIcon: Fingerprint,
        title: 'Another Title',
        titleColor: 'info',
        body: (
          <div>
            <p>
              Called I Miss the Old Kanye That’s all it was Kanye And I love you
              like Kanye loves Kanye Famous viewing @ Figueroa and 12th in
              downtown LA 11:10PM
            </p>
            <p>
              What if Kanye made a song about Kanye Royère doesn't make a Polar
              bear bed but the Polar bear couch is my favorite piece of
              furniture we own It wasn’t any Kanyes Set on his goals Kanye
            </p>
          </div>
        ),
      },
      {
        // Third story
        inverted: true,
        badgeColor: 'info',
        badgeIcon: Fingerprint,
        title: 'Another Title',
        titleColor: 'info',
        body: (
          <div>
            <p>
              Called I Miss the Old Kanye That’s all it was Kanye And I love you
              like Kanye loves Kanye Famous viewing @ Figueroa and 12th in
              downtown LA 11:10PM
            </p>
            <p>
              What if Kanye made a song about Kanye Royère doesn't make a Polar
              bear bed but the Polar bear couch is my favorite piece of
              furniture we own It wasn’t any Kanyes Set on his goals Kanye
            </p>
          </div>
        ),
      },
      {
        // Third story
        inverted: true,
        badgeColor: 'info',
        badgeIcon: Fingerprint,
        title: 'Another Title',
        titleColor: 'info',
        body: (
          <div>
            <p>
              Called I Miss the Old Kanye That’s all it was Kanye And I love you
              like Kanye loves Kanye Famous viewing @ Figueroa and 12th in
              downtown LA 11:10PM
            </p>
            <p>
              What if Kanye made a song about Kanye Royère doesn't make a Polar
              bear bed but the Polar bear couch is my favorite piece of
              furniture we own It wasn’t any Kanyes Set on his goals Kanye
            </p>
          </div>
        ),
      },
      {
        // Third story
        inverted: true,
        badgeColor: 'info',
        badgeIcon: Fingerprint,
        title: 'Another Title',
        titleColor: 'info',
        body: (
          <div>
            <p>
              Called I Miss the Old Kanye That’s all it was Kanye And I love you
              like Kanye loves Kanye Famous viewing @ Figueroa and 12th in
              downtown LA 11:10PM
            </p>
            <p>
              What if Kanye made a song about Kanye Royère doesn't make a Polar
              bear bed but the Polar bear couch is my favorite piece of
              furniture we own It wasn’t any Kanyes Set on his goals Kanye
            </p>
          </div>
        ),
      },
    ]
    return (
      <div className={classes.root}>
        <div
          className={classNames(
            classes.content,
            {
              // [classes.contentShift]: open,
            },
          )}
        >
          <Badge
            className={classes.floatButton}
            style={{}}
            badgeContent={4}
            color='secondary'
          >
            <Button
              justIcon
              color='primary'
              onClick={() => this.setState({ open: true })}
            >
              <SpeakerNotes />
            </Button>
          </Badge>
          <Affix target={() => window.mainPanel} offsetTop={60}>
            <Paper
              style={{
                margin: theme.spacing.unit,
                padding: theme.spacing.unit,
              }}
            >
              <Grid {...rowCfg}>
                <Grid {...colCfg}>
                  <FastField
                    name='Invoice'
                    render={(args) => {
                      return (
                        <CustomInput
                          label={formatMessage({
                            id: 'finance.invoice.search.invoice',
                          })}
                          {...inptCfg}
                          {...args}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='Date'
                    render={(args) => (
                      <DatePicker
                        label={formatMessage({
                          id: 'finance.invoice.detail.date',
                        })}
                        timeFormat={false}
                        {...inptCfg}
                        {...args}
                      />
                    )}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='Status'
                    render={(args) => (
                      <Select
                        label={formatMessage({
                          id: 'finance.invoice.search.status',
                        })}
                        options={[
                          { name: 'New', value: '0' },
                          { name: 'Finalised', value: '1' },
                        ]}
                        {...inptCfg}
                        {...args}
                      />
                    )}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='InvoiceAmt'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id: 'finance.invoice.detail.invoice.amt',
                          })}
                          {...currencyCfg}
                          {...inptCfg}
                          {...args}
                        />
                      )
                    }}
                  />
                </Grid>
              </Grid>
              <Grid {...rowCfg}>
                <Grid {...colCfg}>
                  <FastField
                    name='PaymentAmt'
                    render={(args) => (
                      <NumberInput
                        label={formatMessage({
                          id: 'finance.invoice.detail.payment.amt',
                        })}
                        {...currencyCfg}
                        {...inptCfg}
                        {...args}
                      />
                    )}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='OustandingBal'
                    render={(args) => (
                      <NumberInput
                        label={formatMessage({
                          id: 'finance.invoice.detail.outstandingbal',
                        })}
                        {...currencyCfg}
                        {...inptCfg}
                        {...args}
                      />
                    )}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='CreditNoteAmt'
                    render={(args) => {
                      return (
                        <NumberInput
                          label={formatMessage({
                            id: 'finance.invoice.detail.credit.note.amt',
                          })}
                          {...currencyCfg}
                          {...inptCfg}
                          {...args}
                        />
                      )
                    }}
                  />
                </Grid>
                <Grid {...colCfg}>
                  <FastField
                    name='DebitNoteAmt'
                    render={(args) => (
                      <NumberInput
                        label={formatMessage({
                          id: 'finance.invoice.detail.debit.note.amt',
                        })}
                        {...currencyCfg}
                        {...inptCfg}
                        {...args}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Affix>
          <NavPills
            // color="warning"
            onChange={(event, active) => {
              this.setState({
                selected: active,
              })
            }}
            tabs={[
              {
                tabButton: 'Invoice',
                tabContent: (
                  <div style={{ padding: theme.spacing.unit }}>
                    {this.state.selected === 0 && <Invoice />}
                  </div>
                ),
              },
              {
                tabButton: 'Payment',
                tabContent: (
                  <div style={{ padding: theme.spacing.unit }}>
                    {this.state.selected === 1 && <Payment />}
                  </div>
                ),
              },
            ]}
          />
        </div>
        <Drawer
          variant='permanent'
          anchor='right'
          open={open}
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <Button
              simple
              justIcon
              color='primary'
              onClick={() => this.setState({ open: false })}
            >
              {theme.direction === 'rtl' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </Button>
          </div>
          <Divider />
          <div style={{ padding: '10px 10px 10px 20px' }}>
            <Timeline simple stories={widgetStories} />
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
