import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import DateRange from '@material-ui/icons/DateRange'
import {
  withStyles,
  MenuItem,
  MenuList,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core'

import { unstable_Box as Box } from '@material-ui/core/Box'
import {
  PictureUpload,
  GridContainer,
  GridItem,
  CardContainer,
  Transition,
  TextField,
  AntdInput,
  Select,
  Accordion,
  Button,
} from '@/components'
import { Icon, Input, AutoComplete, Form } from 'antd'

import avatar from '@/assets/img/faces/marc.jpg'
import { getAppendUrl } from '@/utils/utils'

import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import Banner from './Banner'
import Orders from './Orders'
import ConsultationDocument from './ConsultationDocument'
import ResultHistory from './ResultHistory'
import Invoice from './Invoice'

const styles = (theme) => ({
  ...inputStyle(theme),
  root: {},
  hide: {
    display: 'none',
  },
  note: {
    fontSize: 10,
    fontWeight: 400,
    marginTop: -3,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  paragraph: {
    marginLeft: theme.spacing(1),
  },
  leftPanel: {
    position: 'sticky',
    width: 300,
    top: 164,
    float: 'left',
    marginRight: theme.spacing(1),
  },
  rightPanel: {
    '& h6': {
      textDecoration: 'underline',
    },
  },
})
const dataSource = [
  '12345',
  '23456',
  '34567',
]
@connect(({ patientDashboard, global }) => ({
  patientDashboard,
  global,
}))
class PatientDashboard extends PureComponent {
  state = {
    selectedIndex: null,
    showCollectPayment: false,
    columns: [
      { name: 'Id', title: 'id' },
      { name: 'PatientRefNo', title: 'Patient Ref No.' },
      { name: 'PatientName', title: 'Patient Name' },
      { name: 'CardType', title: '' },
      { name: 'FinNumber', title: 'Account' },
      { name: 'copay', title: 'Co-Pay' },
      { name: 'amount', title: 'Amount' },
      { name: 'outstandingBalance', title: 'O/S Balance' },
      { name: 'payAmount', title: 'Pay Amount', nonEditable: false },
      { name: 'balance', title: 'Balance' },
    ],
  }

  componentDidMount () {
    if (this.props.patientDashboard.currentId) {
      this.props.dispatch({
        type: 'patientDashboard/query',
        payload: {
          id: this.props.patientDashboard.currentId,
        },
      })
    }
    // dispatch({
    //   type: 'updateState',
    //   payload: {
    //     currentComponent: query.cmt,
    //     currentId: query.pid,
    //   },
    // })
  }

  componentWillUnmount () {}

  filterList = (item) => {
    const { columns } = this.state
    const cols = columns.map((col) => col.name)
    const list = Object.keys(item).reduce((filtered, key) => {
      return cols.includes(key)
        ? { ...filtered, [key]: item[key] }
        : { ...filtered }
    }, {})
    return list
  }

  handleListItemClick = (e, i) => {
    this.setState({ selectedIndex: i })
  }

  getTitle = () => (
    <GridContainer>
      <GridItem sm={7}>
        <h6>Consultation Visit</h6>
        <div className={this.props.classes.note}>V4, Dr Levine</div>
      </GridItem>
      <GridItem sm={5}>
        <h6 style={{ whiteSpace: 'nowrap' }}>
          <DateRange style={{ fontSize: 10 }} />12 Apr 2019
        </h6>
      </GridItem>
    </GridContainer>
  )

  getContent = () => (
    <List
      component='nav'
      classes={{
        root: this.props.classes.listRoot,
      }}
      disablePadding
    >
      <ListItem
        alignItems='flex-start'
        classes={{
          root: this.props.classes.listItemRoot,
        }}
        divider
        disableGutters
        button
      >
        <ListItemText
          primaryTypographyProps={{
            style: { fontSize: 13 },
          }}
          primary={
            <div style={{ width: '100%', paddingRight: 28 }}>
              <GridContainer>
                <GridItem sm={7}>V3, Dr Levine</GridItem>
                <GridItem sm={5}>12 Apr 2019</GridItem>
              </GridContainer>
            </div>
          }
        />
      </ListItem>
      <ListItem
        alignItems='flex-start'
        classes={{
          root: this.props.classes.listItemRoot,
        }}
        divider
        disableGutters
        button
      >
        <ListItemText
          primaryTypographyProps={{
            style: { fontSize: 13 },
          }}
          primary={
            <div style={{ width: '100%', paddingRight: 28 }}>
              <GridContainer>
                <GridItem sm={7}>V2, Dr Levine</GridItem>
                <GridItem sm={5}>11 Apr 2019</GridItem>
              </GridContainer>
            </div>
          }
        />
      </ListItem>
    </List>
  )

  startConsultation = () => {
    this.props.history.push(
      '/reception/queue/patientdashboard/consultation/new',
    )
  }

  render () {
    const {
      theme,
      classes,
      height,
      linkProps = {},
      onMenuClick = (p) => p,
      ...resetProps
    } = this.props
    // console.log(this.props)

    const { patientDashboard, global, history } = resetProps
    if (!patientDashboard) return null
    const { currentComponent, currentId } = patientDashboard
    // const labelClass = {
    //   [classes.label]: true,
    //   [classes.labelAnimation]: true,
    //   [classes.labelShrink]: shouldShrink,
    //   [classes.labelFocused]: shrink,
    // }
    // const listItemClasses = {
    //   [classes.root]: true,
    //   [classes.labelAnimation]: true,
    //   [classes.labelShrink]: shouldShrink,
    //   [classes.labelFocused]: shrink,
    // }

    return (
      <div className={classes.root}>
        <Banner
          extraCmt={
            <Button
              color='primary'
              onClick={this.startConsultation}
              style={{ marginTop: 25 }}
            >
              Start Consultation
            </Button>
          }
          {...this.props}
        />
        {/* <AutoComplete dataSource={dataSource} />
        <Input placeholder='Basic usage' />
        <TextField label='Basic usage' />
        <AntdInput label='Basic usage' />

        <Form.Item label='E-mail'>
          <Input />
        </Form.Item> */}
        <CardContainer hideHeader size='sm' className={classes.leftPanel}>
          <Accordion
            active={0}
            collapses={[
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
              {
                title: this.getTitle(),
                content: this.getContent(),
              },
            ]}
          />
        </CardContainer>
        <CardContainer
          hideHeader
          size='sm'
          className={classes.rightPanel}
          // style={{ marginLeft: theme.spacing.unit * 2 }}
        >
          <Select
            noWrapper
            options={[]}
            label='Filter By'
            style={{ maxWidth: 300 }}
          />
          <h6>Chief Complaints</h6>
          <div className={classes.paragraph}>
            <p>A *paragraph* of text</p>
            <p>A _second_ row of text</p>
          </div>

          <h6>Plan</h6>
          <h6>Diagnosis</h6>
          <h6>Orders</h6>
          <Orders />
          <h6>Consultation Document</h6>
          <ConsultationDocument />
          <h6>Result History</h6>
          <ResultHistory />
          <h6>Invoice</h6>
          <Invoice />
        </CardContainer>
        {/* <GridContainer gutter={4} gridLayout>
          <GridItem sm={12} md={3}>
            
          </GridItem>
          <GridItem sm={12} md={9}>
            
          </GridItem>
        </GridContainer> */}
      </div>
      // <GridContainer>
      //   <GridItem xs={12} sm={12} md={2} style={{ paddingTop: 20 }}>
      //     <Card profile>

      //     </Card>
      //   </GridItem>
      // </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientDashboard)
