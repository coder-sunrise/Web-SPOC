import React, { PureComponent } from 'react'
import Link from 'umi/link'
import { connect } from 'dva'
import moment from 'moment'
import { Paper } from '@material-ui/core'
import { headerHeight } from 'mui-pro-jss'
import {
  GridContainer,
  GridItem,
  CodeSelect,
  DatePicker,
  dateFormatLong,
  Skeleton,
  Tooltip,
} from '@/components'
import { getAppendUrl } from '@/utils/utils'
// import model from '../models/demographic'
import Block from './Block'

@connect(({ patientDashboard, patient, codetable }) => ({
  patientDashboard,
  patient,
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
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctsalutation',
      },
    })
  }

  componentDidMount () {
    // const { props, value } = this
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
    const { patient, codetable } = props
    const { entity } = patient
    const info = entity
    const { patientAllergy = [] } = info
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
            pid: info.id,
          })}
        >
          {da.length ? `${da[0].name}${da.length > 1 ? ' ...' : ''}` : '-'}
        </Link>
      </div>
    )
  }

  render () {
    const { props } = this
    const {
      patientDashboard = {},
      patientInfo = {},
      extraCmt,
      patient,
      codetable,
      style = {
        position: 'sticky',
        top: headerHeight,
        zIndex: 1000,
        paddingLeft: 16,
        paddingRight: 16,
        // maxHeight: 100,
      },
    } = props
    console.log("************** banner ***********")
    console.log(this.props)
    const { entity } = patient
    if (!entity)
      return (
        <Paper>
          <Skeleton variant='rect' width='100%' height={100} />
        </Paper>
      )
    const { ctsalutation = [] } = codetable
    const info = entity
    const salt = ctsalutation.find((o) => o.id === info.salutationFK) || {}
    const name = `${salt.name || ''} ${info.name}`

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
                <Tooltip title={name}>
                  <span style={{ whiteSpace: 'nowrap' }}>{name}</span>
                </Tooltip>
              }
              body={
                <div>
                  {info.patientAccountNo}{' '}
                  <CodeSelect
                    text
                    code='ctNationality'
                    value={info.nationalityFK}
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
                  <DatePicker text format={dateFormatLong} value={info.dob} />
                  ({Math.floor(
                    moment.duration(moment().diff(info.dob)).asYears(),
                  )},&nbsp;
                  {
                    <CodeSelect
                      code='ctGender'
                      // optionLabelLength={1}
                      text
                      value={info.genderFK}
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
