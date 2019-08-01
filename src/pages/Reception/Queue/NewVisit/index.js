import React, { PureComponent } from 'react'
import { connect } from 'dva'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  withFormikExtend,
} from '@/components'
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import SchemesCard from './SchemesCard'
import ReferralCard from './ReferralCard'
// import ParticipantCard from './ParticipantCard'
import VisitValidationSchema from './validationScheme'
import FormFieldName from './formField'

const styles = (theme) => ({
  gridContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  formContent: {
    maxHeight: '80vh',
    overflow: 'auto',
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

@connect(({ queueLog, visitRegistration }) => ({ queueLog, visitRegistration }))
@withFormikExtend({
  displayName: 'VisitRegistration',
  enableReinitialize: true,
  validationSchema: VisitValidationSchema,
  mapPropsToValues: ({ queueLog, visitRegistration }) => {
    let qNo =
      queueLog && queueLog.queueListing ? queueLog.queueListing.length + 1 : 1
    const { visitInfo } = visitRegistration
    if (Object.keys(visitInfo).length > 0) {
      qNo = visitInfo.queueNo
    }
    const { visit = {} } = visitInfo

    return {
      queueNo: qNo,
      ...visit,
    }
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    const { queueNo, ...restValues } = values
    const { dispatch, queueLog, visitRegistration, onConfirm } = props

    const { sessionInfo } = queueLog
    const { visitInfo: { id = undefined }, patientInfo } = visitRegistration
    const bizSessionFK = sessionInfo.id

    const visitReferenceNo = `${sessionInfo.sessionNo}-${parseFloat(id).toFixed(
      1,
    )}`

    const patientProfileFK = patientInfo.id

    const payload = {
      visitID: id,
      queueNo,
      queueNoPrefix: sessionInfo.sessionNoPrefix,
      visit: {
        patientProfileFK,
        bizSessionFK,
        visitReferenceNo,
        // visitPurposeFK: 1,
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

    const type =
      id === undefined
        ? 'visitRegistration/registerVisitInfo'
        : 'visitRegistration/saveVisitInfo'

    dispatch({
      type,
      payload,
    }).then((response) => {
      setSubmitting(false)
      console.log({ response })
      response && onConfirm()
    })
  },
})
class NewVisit extends PureComponent {
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
      footer,
      visitRegistration: { visitInfo },
    } = this.props
    const isEdit = Object.keys(visitInfo).length > 0
    return (
      <React.Fragment>
        <GridContainer className={classes.gridContainer}>
          <GridItem xs sm={12} md={3} className={classes.patientInfo}>
            <PatientInfoCard />
            {/* <SchemesCard /> */}
          </GridItem>
          <GridItem container xs md={9} className={classes.formContent}>
            <SizeContainer size='sm'>
              <React.Fragment>
                <GridItem xs md={12} className={classes.row}>
                  <VisitInfoCard />
                </GridItem>
                <GridItem xs md={12} className={classes.row}>
                  <VitalSignCard handleCalculateBMI={this.calculateBMI} />
                </GridItem>
                <GridItem xs md={12} className={classes.row}>
                  <ReferralCard />
                </GridItem>
              </React.Fragment>
            </SizeContainer>
            {/*
              <GridItem xs md={12} container>
                <GridItem xs md={12} className={classes.cardContent}>
                  <ParticipantCard />
                </GridItem>
              </GridItem>
            */}
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            confirmBtnText: isEdit ? 'Save' : 'Register visit',
            onConfirm: handleSubmit,
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewVisitModal' })(NewVisit)
