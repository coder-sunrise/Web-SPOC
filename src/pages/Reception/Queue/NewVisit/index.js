import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import { Button, GridContainer, GridItem } from '@/components'
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import SchemesCard from './SchemesCard'
import ReferralCard from './ReferralCard'
import ParticipantCard from './ParticipantCard'
import VisitValidationSchema from './validationScheme'
import FormFieldName from './formField'
// services
import { fetchDoctorProfile } from '../services'

const styles = (theme) => ({
  gridContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  formContent: {
    padding: `0px ${32}px !important`,
  },
  cardContent: {
    padding: `0px ${16}px !important`,
  },
  row: {
    marginBottom: theme.spacing(3),
  },
  footerContent: {
    paddingRight: `${theme.spacing.unit * 2}px !important`,
    paddingTop: `${theme.spacing.unit * 2}px !important`,
  },
  hide: {
    display: 'none',
  },
  patientInfo: {
    marginTop: '20px',
  },
})

@connect(({ queueLog }) => ({ queueLog }))
@withFormik({
  enableReinitialize: true,
  validationSchema: VisitValidationSchema,
  mapPropsToValues: ({ queueLog }) => {
    const nextQueueNo = queueLog.queueListing.length + 1
    return {
      [FormFieldName['visit.queueNo']]: nextQueueNo,
    }
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    const { queueNo, ...restValues } = values
    const { dispatch, queueLog, onConfirm } = props
    const { sessionInfo, visitPatientInfo } = queueLog
    const visitID = sessionInfo.id

    const visitReferenceNo = `${sessionInfo.sessionNo}-${parseFloat(
      visitID,
    ).toFixed(1)}`

    const patientProfileFK = visitPatientInfo.id

    const payload = {
      queueNo,
      queueNoPrefix: sessionInfo.sessionNoPrefix,
      visit: {
        patientProfileFK,
        bizSessionFK: visitID,
        visitPurposeFK: 1,
        visitReferenceNo,
        // doctorProfileFK: null,
        // plannedVisitFK: null,
        // counterFK: null,
        // roomFK: null,
        // timeIn: new Date(),
        // timeOut: new Date(),
        // visitDate: new Date(),
        // queueSetupFK: null,
        visitStatus: 'WAITING',
        visitRemarks: null,
        temperatureC: null,
        bpSysMMHG: 1,
        bpDiaMMHG: 2,
        heightCM: null,
        weightKG: null,
        bmi: null,
        pulseRateBPM: null,
        priorityTime: null,
        priorityType: null,
        referralPersonFK: null,
        referralCompanyFK: null,
        referralPerson: null,
        referralDate: null,
        ...restValues,
      },
    }
    console.log({ visitDate: new Date() })
    dispatch({
      type: 'queueLog/registerVisitInfo',
      payload,
    })
    setSubmitting(false)
    onConfirm()
  },
})
class NewVisit extends PureComponent {
  getAge = () => {
    const { visitPatientInfo } = this.props
    const { dateOfBirth } = visitPatientInfo

    const age = moment().diff(dateOfBirth, 'years')
    return age
  }

  calculateBMI = () => {
    const { heightCM, weightKG } = this.props.values
    const { setFieldValue, setFieldTouched } = this.props
    if (heightCM && weightKG) {
      const heightM = heightCM / 100
      const bmi = weightKG / heightM ** 2
      const bmiInTwoDecimal = Math.round(bmi * 100) / 100
      setFieldValue(FormFieldName['vitalsign.bmi'], bmiInTwoDecimal)
      setFieldTouched(FormFieldName['vitalsign.bmi'], true)
    }
  }

  render () {
    const {
      classes,
      handleSubmit,
      isValidating,
      isSubmitting,
      values,
    } = this.props

    return (
      <React.Fragment>
        <GridContainer className={classes.gridContainer}>
          <GridItem xs sm={12} md={3} className={classes.patientInfo}>
            <PatientInfoCard />
          </GridItem>
          <GridItem container xs md={9} className={classes.formContent}>
            <GridItem xs md={12} container className={classes.row}>
              <GridItem xs d={6} className={classes.cardContent}>
                <VisitInfoCard />
              </GridItem>
              <GridItem xs md={6} className={classes.cardContent}>
                <VitalSignCard handleCalculateBMI={this.calculateBMI} />
              </GridItem>
            </GridItem>
            <GridItem xs md={12} container className={classes.row}>
              <GridItem xs md={6} className={classes.cardContent}>
                <SchemesCard />
              </GridItem>
              <GridItem xs md={6} className={classes.cardContent}>
                <ReferralCard />
              </GridItem>
            </GridItem>
            {/*
              <GridItem xs md={12} container>
                <GridItem xs md={12} className={classes.cardContent}>
                  <ParticipantCard />
                </GridItem>
              </GridItem>
            */}

            <GridItem
              container
              justify='flex-end'
              className={classes.footerContent}
            >
              <Button
                color='primary'
                disabled={isSubmitting || isValidating}
                onClick={handleSubmit}
              >
                {!isSubmitting && !isValidating && <span>Register Visit</span>}
                {isSubmitting && <span>Submitting...</span>}
                {isValidating && <span>Validating...</span>}
              </Button>
            </GridItem>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewVisitModal' })(NewVisit)
