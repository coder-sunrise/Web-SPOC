import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// umi
import { formatMessage } from 'umi/locale'
// antd
import { Spin } from 'antd'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { GridContainer, GridItem } from '@/components'
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import SchemesCard from './SchemesCard'

const styles = () => ({
  hide: {
    display: 'none',
  },
  patientInfo: {
    marginTop: '20px',
  },
})

@connect(({ queueLog, loading }) => ({ queueLog, loading }))
@withFormik({
  mapPropsToValues: () => {},
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log('handleSubmit', values, props)

    setTimeout(() => {
      setSubmitting(false)
    }, 1000)
  },
})
class NewVisit extends PureComponent {
  getAge = () => {
    const { queueLog } = this.props
    const { dateOfBirth } = queueLog.visitPatientInfo

    const age = moment().diff(dateOfBirth, 'years')
    return age
  }

  render () {
    const { footer, classes, handleSubmit, loading } = this.props
    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs sm={12} md={3} classes={{ grid: classes.patientInfo }}>
            {/*
              <Card profile>
                <CardAvatar profile>
                  <img src={avatar} alt='...' />
                </CardAvatar>
                <CardBody profile>
                  <h4 className={classNames(classes.cardTitle)}>{patientName}</h4>
                  <h5 className={classNames(classes.cardCategory)}>
                    {`${patientID}`}
                  </h5>
                  <h5 className={classNames(classes.cardCategory)}>
                    {`${patientNRIC}, ${nationality}`}
                  </h5>
                  <h5>
                    {`${moment(dateOfBirth).format(
                      'DD-MMM-YYYY',
                    )}, (${this.getAge()}, ${gender})`}
                  </h5>
                </CardBody>
              </Card>
            */}
            <PatientInfoCard />
          </GridItem>
          {loading.effects['queueLog/fetchPatientInfoByPatientID'] ? (
            <Spin size='large' className='centerredLoading' />
          ) : (
            <React.Fragment>
              <GridItem xs sm={12} md={5} container direction='row'>
                <GridItem xs sm={12} md={12}>
                  <VisitInfoCard />
                </GridItem>
                <GridItem xs sm={12} md={12}>
                  <SchemesCard />
                </GridItem>
              </GridItem>
              <GridItem xs sm={12} md={4} container direction='row'>
                <GridItem xs sm={12} md={12}>
                  <VitalSignCard />
                </GridItem>
              </GridItem>
            </React.Fragment>
          )}
        </GridContainer>
        {footer &&
          footer({
            onConfirm: handleSubmit,
            confirmBtnText: formatMessage({
              id: 'reception.queue.visitRegistration.registerVisit',
            }),
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NewVisit)
