import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import ListAlt from '@material-ui/icons/ListAlt'
import Search from '@material-ui/icons/Search'
import Business from '@material-ui/icons/Business'
import FolderOpen from '@material-ui/icons/FolderOpen'
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
import MuiButton from '@material-ui/core/Button'

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
  Card,
  CardBody,
} from '@/components'
import { Icon, Input, AutoComplete, Form } from 'antd'

import avatar from '@/assets/img/faces/marc.jpg'
import { getAppendUrl } from '@/utils/utils'

import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
// import Banner from './Banner'
// import Orders from './Orders'
// import ConsultationDocument from './ConsultationDocument'
// import ResultHistory from './ResultHistory'
// import Invoice from './Invoice'

const menuData = [
  {
    title: 'Master Setting',
    items: [
      {
        text: 'Clinic Information',
      },
      {
        text: 'GST Setup',
      },
      {
        text: 'General Setting',
      },
    ],
  },
  {
    title: 'Clinic Setting',
    items: [
      {
        text: 'Service',
      },
      {
        text: 'Service Center',
        icon: <Business />,
      },
      {
        text: 'Service Center Category',
        icon: <FolderOpen />,
      },
      {
        text: 'Service Category',
        icon: <FolderOpen />,
      },
      {
        text: 'Revenue Category',
        icon: <FolderOpen />,
      },
      {
        text: 'Room',
      },
      {
        text: 'Clinic Operation Hour',
      },
      {
        text: 'Clinic Break Hour',
      },
      {
        text: 'Public Holiday',
      },
    ],
  },
  {
    title: 'System User',
  },
  {
    title: 'Print Setup',
  },
  {
    title: 'User Preference',
  },
  {
    title: 'Templates',
  },
  {
    title: 'Contact',
  },
]
const styles = (theme) => ({
  bigviewBtn: {
    // width: 180,
    marginRight: 0,
  },
  longTextBtn: {
    '& span': {
      whiteSpace: 'initial',
    },
    '& svg': {
      width: 60,
      height: 60,
    },
  },
})

@connect(({ systemSetting, global }) => ({
  systemSetting,
  global,
}))
class SystemSetting extends PureComponent {
  constructor (props) {
    super(props)

    const { classes, theme } = props
    this.menus = menuData.map((o) => {
      return {
        ...o,
        content: (
          <GridContainer>
            {(o.items || []).map((item) => {
              return (
                <GridItem
                  key={item.name}
                  xs={6}
                  md={3}
                  lg={2}
                  style={{ marginBottom: theme.spacing(2) }}
                >
                  <Button
                    fullWidth
                    bigview
                    color='primary'
                    className={classnames({
                      [classes.bigviewBtn]: true,
                      // [classes.longTextBtn]: item.longText,
                    })}
                    variant='outlined'
                  >
                    {item.icon || <ListAlt />}
                    {item.text}
                  </Button>
                </GridItem>
              )
            })}
          </GridContainer>
        ),
      }
    })
  }

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

  componentDidMount () {}

  componentWillUnmount () {}

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

    return (
      <CardContainer hideHeader>
        <TextField prefix={<Search />} simple />
        <Accordion active={0} collapses={this.menus} />
        {/* <Button color='primary'>Test Test TestTest Test Test</Button>
        <MuiButton color='primary' variant='contained'>
          Test Test TestTest Test Test
        </MuiButton> */}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(SystemSetting)
