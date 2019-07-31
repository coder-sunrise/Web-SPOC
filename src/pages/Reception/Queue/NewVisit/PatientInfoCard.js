import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import moment from 'moment'
// antd
import { Spin } from 'antd'
// material ui
import { withStyles } from '@material-ui/core'
// custom components
import { Card, CardAvatar, CardBody } from '@/components'
// assets
import avatar from '@/assets/img/faces/marc.jpg'
// service
import { getCodes } from '@/utils/codes'

const styles = () => ({})

@connect(({ visitRegistration, loading }) => ({ visitRegistration, loading }))
class PatientInfoCard extends PureComponent {
  state = {
    ctGender: [],
  }

  componentDidMount () {
    getCodes('ctgender')
      .then((response) => {
        if (!response && !response.data) return
        const data = [
          ...response,
        ]
        this.setState({ ctGender: data })
      })
      .catch((error) => {
        console.log('error occured', error)
      })
  }

  getAge = () => {
    const { visitRegistration } = this.props
    const { dob } = visitRegistration.patientInfo

    const age = moment().diff(dob, 'years')
    return age
  }

  getNationality = () => {
    const { visitRegistration } = this.props
    const { nationalityFK } = visitRegistration.patientInfo

    if (!nationalityFK || localStorage.getItem('CT_Nationality') === null)
      return ''

    const nationalities = JSON.parse(localStorage.getItem('CT_Nationality'))
    const nationality = nationalities.find((item) => item.id === nationalityFK)

    return nationality ? nationality.name : ''
  }

  getGender = () => {
    const { ctGender } = this.state
    const { visitRegistration } = this.props
    const { genderFK } = visitRegistration.patientInfo
    console.log({ info: visitRegistration.patientInfo })
    const gender = ctGender.find((item) => item.id === genderFK)
    console.log({ gender, ctGender })
    if (gender) return gender.name

    return ''
  }

  render () {
    const { classes, visitRegistration, loading } = this.props
    const {
      name,
      patientAccountNo,
      patientReferenceNo,
      dob,
      gender,
    } = visitRegistration.patientInfo
    console.log({ visitRegistration })
    return (
      <Card size='sm' profile>
        {loading.effects['visitRegistration/fetchPatientInfoByPatientID'] ? (
          <Spin className='centerredLoading' />
        ) : (
          <React.Fragment>
            <CardAvatar profile>
              <img src={avatar} alt='...' />
            </CardAvatar>
            <CardBody profile>
              <React.Fragment>
                <h4 className={classNames(classes.cardTitle)}>{name}</h4>
                <h5 className={classNames(classes.cardCategory)}>
                  {`${patientReferenceNo}`}
                </h5>
                <h5 className={classNames(classes.cardCategory)}>
                  {`${patientAccountNo}, ${this.getNationality()}`}
                </h5>
                <h5>
                  {`${moment(dob).format(
                    'DD-MMM-YYYY',
                  )}, (${this.getAge()}, ${this.getGender()})`}
                </h5>
              </React.Fragment>
            </CardBody>
          </React.Fragment>
        )}
      </Card>
    )
  }
}

export default withStyles(styles)(PatientInfoCard)
