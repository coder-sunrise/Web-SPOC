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
    console.log('handleSubmit', values, props)

    const { dispatch, queueLog } = props
    const { sessionInfo, visitPatientInfo } = queueLog
    const visitID = sessionInfo.id

    const visitReferenceNo = `${sessionInfo.sessionNo}-${parseFloat(
      visitID,
    ).toFixed(1)}`

    const patientProfileFK = visitPatientInfo.id

    dispatch({
      type: 'queueLog/registerVisitInfo',
      payload: {
        queueNo: '1',
        queueNoPrefix: null,
        visit: {
          patientProfileFK,
          doctorProfileFK: null,
          bizSessionFK: visitID,
          plannedVisitFK: null,
          visitPurposeFK: 1,
          visitReferenceNo,
          counterFK: null,
          roomFK: null,
          timeIn: '2019-07-05T13:50:00',
          timeOut: null,
          visitStatus: 'WAITING',
          visitDate: '2019-07-05T13:50:00',
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
          queueSetupFK: null,
        },
      },
    })
    setSubmitting(false)
  },
})
class NewVisit extends PureComponent {
  getAge = () => {
    const { visitPatientInfo } = this.props
    const { dateOfBirth } = visitPatientInfo

    const age = moment().diff(dateOfBirth, 'years')
    return age
  }

  render () {
    const { classes, handleSubmit, isValidating, isSubmitting } = this.props

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
                <VitalSignCard />
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
            <GridItem xs md={12} container>
              <GridItem xs md={12} className={classes.cardContent}>
                <ParticipantCard />
              </GridItem>
            </GridItem>

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
