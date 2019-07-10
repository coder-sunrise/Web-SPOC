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
        url: '/setting/clinicinfo',
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
        url: '/setting/service',
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
        url: '/setting/publicholiday',
      },
      {
        text: 'Doctor Block',
        url: '/setting/doctorblock',
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
    minHeight: 106,
  },
  longTextBtn: {
    '& span': {
      whiteSpace: 'initial',
    },
    '& svg': {
      width: 50,
      height: 50,
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
          <GridContainer style={{ marginTop: theme.spacing(1) }}>
            {(o.items || []).map((item) => {
              return (
                <GridItem
                  key={item.name}
                  xs={4}
                  md={2}
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
                    onClick={() => {
                      this.props.history.push(item.url)
                    }}
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

  state = {}

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
