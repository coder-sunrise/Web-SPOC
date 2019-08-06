import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import PerfectScrollbar from 'perfect-scrollbar'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'

import { Save, Close, Clear, FilterList, Search, Add } from '@material-ui/icons'
import {
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Divider,
  Paper,
} from '@material-ui/core'
import { Affix } from 'antd'
import { formatMessage } from 'umi/locale'
import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
} from '@/components'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import avatar from '@/assets/img/faces/marc.jpg'
import { titles, finTypes, gender } from '@/utils/codes'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'
// import model from '../models/demographic'
import Block from './Block'

@connect(({ patientDashboard }) => ({
  patientDashboard,
}))
class Banner extends PureComponent {
  state = {}

  componentDidMount () {
    const { props, value } = this

    // if (props.patientDashboard.currentId) {
    //   setCurrentPatient(props, props.setValues, () => {
    //     if (value && value.contact.contactAddress.length === 0) {
    //       this.addAddress()
    //     }
    //   })
    // } else {
    //   props.setValues(props.demographic.default)
    // }
    // props.setValues(props.patientDashboard.entity)
  }

  render () {
    // console.log(this.props)
    const { props, state } = this
    const { theme, classes, setValues, extraCmt } = props
    return (
      // <Affix target={() => window.mainPanel} offset={headerHeight + 1}>
      <Paper
        style={{
          position: 'sticky',
          top: headerHeight,
          zIndex: 1000,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <GridContainer>
          {/* <GridItem xs={6} md={1} gutter={0}>
            <CardAvatar testimonial square>
              <img src={avatar} alt='...' />
            </CardAvatar>
          </GridItem> */}
          <GridItem xs={6} md={2}>
            <Block h3='Mr John Smith' body='G512345R, Malaysian' />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block header='Info' body='32, Male, 19-03-1988' />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block header='Allergies' body='Penicillin' />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block header='Medical Problem' body='Asthma' />
          </GridItem>
          <GridItem xs={12} md={4}>
            {extraCmt}
          </GridItem>
        </GridContainer>
      </Paper>
      // </Affix>
    )
  }
}

export default Banner
