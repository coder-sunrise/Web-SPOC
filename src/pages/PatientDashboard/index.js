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
} from '@/components'
import { Icon, Input, AutoComplete, Form } from 'antd'

import avatar from '@/assets/img/faces/marc.jpg'
import { getAppendUrl } from '@/utils/utils'

import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import inputStyle from 'mui-pro-jss/material-dashboard-pro-react/antd/input'
import Banner from './Banner'

const styles = (theme) => ({
  ...inputStyle(theme),
  root: {
    marginRight: -10,
    marginLeft: -10,
  },
  hide: {
    display: 'none',
  },
  note: {
    color: '#c0c1c2',
    fontSize: 10,
    fontWeight: 400,
    marginTop: -10,
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
    console.log('c PatientDashboard')
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
        <Banner />
        <Divider light />
        {/* <AutoComplete dataSource={dataSource} />
        <Input placeholder='Basic usage' />
        <TextField label='Basic usage' />
        <AntdInput label='Basic usage' />

        <Form.Item label='E-mail'>
          <Input />
        </Form.Item> */}
        <GridContainer gutter={4}>
          <GridItem sm={12} md={3}>
            <CardContainer hideHeader sm>
              <Accordion
                active={0}
                collapses={[
                  {
                    title: this.getTitle(),
                    content: this.getContent(),
                  },
                  {
                    title: this.getTitle(),
                    content:
                      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
                  },
                  {
                    title: this.getTitle(),
                    content:
                      "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.",
                  },
                ]}
              />
            </CardContainer>
          </GridItem>
          <GridItem sm={12} md={9}>
            <CardContainer
              hideHeader
              sm
              // style={{ marginLeft: theme.spacing.unit * 2 }}
            >
              <Select
                noWrapper
                option={[]}
                label='Filter By'
                style={{ maxWidth: 300 }}
              />
              <h5>Chief Complaints</h5>
              <Typography component='div'>
                <p>A *paragraph* of text</p>
                <p>A _second_ row of text</p>
              </Typography>

              <h5>Plan</h5>
              <h5>Diagnosis</h5>
              <h5>Orders</h5>
            </CardContainer>
          </GridItem>
        </GridContainer>
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
