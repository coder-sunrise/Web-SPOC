import React, { PureComponent } from 'react'
import Link from 'umi/link'
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
  dateFormatLong,
} from '@/components'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import avatar from '@/assets/img/faces/marc.jpg'
import { titles, finTypes, gender } from '@/utils/codes'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'
// import model from '../models/demographic'
import Block from './Block'

@connect(({ patientDashboard, codetable }) => ({
  patientDashboard,
  codetable,
}))
class Banner extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    const { dispatch } = props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctdrugallergy',
      },
    })
  }

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

  getAllergyLink () {
    const { props } = this
    const { patientDashboard, codetable } = props
    const { patientInfo } = patientDashboard
    if (!patientInfo) return null
    const { patientAllergy = [] } = patientInfo
    const { ctdrugallergy = [] } = codetable
    const da = ctdrugallergy.filter((o) =>
      patientAllergy.find((m) => m.allergyFK === o.id),
    )
    // console.log(da, da.length)
    return (
      <div>
        <Link
          to={getAppendUrl({
            md: 'pt',
            cmt: 3,
            pid: patientInfo.id,
          })}
        >
          {da.length ? da[0].name + `${da.length > 1 ? ' ...' : ''}` : '-'}
        </Link>
      </div>
    )
  }

  render () {
    const { props, state } = this
    const {
      theme,
      classes,
      setValues,
      patientDashboard,
      extraCmt,
      style = {
        position: 'sticky',
        top: headerHeight,
        zIndex: 1000,
        paddingLeft: 16,
        paddingRight: 16,
      },
    } = props
    if (!patientDashboard) return null
    const { patientInfo } = patientDashboard
    if (!patientInfo) return null
    return (
      // <Affix target={() => window.mainPanel} offset={headerHeight + 1}>
      <Paper style={style}>
        <GridContainer>
          {/* <GridItem xs={6} md={1} gutter={0}>
            <CardAvatar testimonial square>
              <img src={avatar} alt='...' />
            </CardAvatar>
          </GridItem> */}
          <GridItem xs={6} md={2}>
            <Block
              h3={
                <div>
                  <CodeSelect
                    // authority='none'
                    text
                    code='ctSalutation'
                    value={patientInfo.salutationFK}
                  />{' '}
                  {patientInfo.name}
                </div>
              }
              body={
                <div>
                  {patientInfo.patientAccountNo}{' '}
                  <CodeSelect
                    text
                    code='ctNationality'
                    value={patientInfo.nationalityFK}
                  />
                </div>
              }
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block
              header='Info'
              body={
                <div>
                  <DatePicker
                    text
                    format={dateFormatLong}
                    value={patientInfo.dob}
                  />
                  ({Math.floor(
                    moment.duration(moment().diff(patientInfo.dob)).asYears(),
                  )},&nbsp;
                  {
                    <CodeSelect
                      code='ctGender'
                      // optionLabelLength={1}
                      text
                      value={patientInfo.genderFK}
                    />
                  })
                </div>
              }
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <Block header='Allergies' body={this.getAllergyLink()} />
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
