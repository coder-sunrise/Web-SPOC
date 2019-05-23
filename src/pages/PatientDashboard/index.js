import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import Link from 'umi/link'
import { withStyles, MenuItem, MenuList, Divider } from '@material-ui/core'
import {
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  Transition,
  TextField,
  AntdInput,
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
  hide: {
    display: 'none',
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
    return (
      <div>
        <Banner />
        <Divider light />
        <AutoComplete dataSource={dataSource} />
        <Input placeholder='Basic usage' />
        <TextField label='Basic usage' />
        <AntdInput label='Basic usage' />

        <Form.Item label='E-mail'>
          <Input />
        </Form.Item>
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
