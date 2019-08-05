import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import moment from 'moment'
// material ui
import { Divider, CircularProgress, withStyles } from '@material-ui/core'
// custom components
import { CardContainer } from '@/components'
// sub components
import SchemesCard from './SchemesCard'
// assets
import avatar from '@/assets/img/faces/marc.jpg'
// service
import { getCodes } from '@/utils/codes'

const styles = (theme) => ({
  container: {
    minHeight: '30vh',
  },
  patientInfoContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    '& > h5': {
      marginBottom: theme.spacing(1),
    },
  },
  patientName: {
    fontWeight: 500,
  },
})

@connect(({ visitRegistration, loading }) => ({ visitRegistration, loading }))
class PatientInfoCard extends PureComponent {
  state = {
    ctGender: [],
    ctNationality: [],
  }

  componentDidMount () {
    this.fetchCodes()
  }

  fetchCodes = async () => {
    try {
      const nationality = await getCodes('ctnationality')

      const gender = await getCodes('ctgender')

      this.setState({
        ctGender: gender,
        ctNationality: nationality,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  getAge = () => {
    const { visitRegistration } = this.props
    const { dob } = visitRegistration.patientInfo

    const age = moment().diff(dob, 'years')
    return age
  }

  getNationality = () => {
    const { ctNationality } = this.state
    const { visitRegistration } = this.props
    const { nationalityFK } = visitRegistration.patientInfo
    const nationality = ctNationality.find((item) => item.id === nationalityFK)
    return nationality ? nationality.name : ''
  }

  getGender = () => {
    const { ctGender } = this.state
    const { visitRegistration } = this.props
    const { genderFK } = visitRegistration.patientInfo
    const gender = ctGender.find((item) => item.id === genderFK)
    return gender ? gender.name : ''
  }

  render () {
    const { classes, visitRegistration, loading } = this.props
    const {
      name,
      patientAccountNo,
      patientReferenceNo,
      dob,
    } = visitRegistration.patientInfo

    return (
      <CardContainer hideHeader size='sm' className={classes.container}>
        {loading.effects['visitRegistration/fetchPatientInfoByPatientID'] ? (
          <CircularProgress className='centerredLoading' />
        ) : (
          <React.Fragment>
            <div className={classes.patientInfoContainer}>
              <h4 className={classNames(classes.patientName)}>{name}</h4>
              <h5>{`${patientReferenceNo}`}</h5>
              <h5>{`${patientAccountNo}, ${this.getNationality()}`}</h5>
              <h5>
                {`${moment(dob).format(
                  'DD-MMM-YYYY',
                )}, (${this.getAge()}, ${this.getGender()})`}
              </h5>
            </div>
            <Divider light />
            <SchemesCard />
          </React.Fragment>
        )}
      </CardContainer>
    )
  }
}

export default withStyles(styles)(PatientInfoCard)
