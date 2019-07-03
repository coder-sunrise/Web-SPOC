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

@connect(({ queueLog, loading }) => ({ queueLog, loading }))
class PatientInfoCard extends PureComponent {
  state = {
    ctGender: [],
  }

  componentDidMount () {
    // TODO: enhance this part to store codetable and keep track of updating date
    // getCodes('Nationality')
    //   .then((response) => {
    //     if (!response && !response.data) return
    //     const data = [
    //       ...response.data.Nationality,
    //     ]
    //     localStorage.setItem('CT_Nationality', JSON.stringify(data))
    //   })
    //   .catch((error) => {
    //     console.log('error occured', error)
    //   })
    getCodes('Gender')
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
    const { queueLog } = this.props
    const { dob } = queueLog.visitPatientInfo

    const age = moment().diff(dob, 'years')
    return age
  }

  getNationality = () => {
    const { queueLog } = this.props
    const { nationalityFK } = queueLog.visitPatientInfo

    if (!nationalityFK || localStorage.getItem('CT_Nationality') === null)
      return ''

    const nationalities = JSON.parse(localStorage.getItem('CT_Nationality'))
    const nationality = nationalities.find((item) => item.id === nationalityFK)

    return nationality ? nationality.name : ''
  }

  getGender = () => {
    const { ctGender } = this.state
    const { queueLog } = this.props
    const { genderFK } = queueLog.visitPatientInfo
    const gender = ctGender.find((item) => item.id === genderFK)
    if (gender) return gender.name

    return ''
  }

  render () {
    const { classes, queueLog, loading } = this.props
    const {
      name,
      patientAccountNo,
      patientReferenceNo,
      dob,
      gender,
    } = queueLog.visitPatientInfo
    return (
      <Card size='sm' profile>
        {loading.effects['queueLog/fetchPatientInfoByPatientID'] ? (
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
