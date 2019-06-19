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
  handleSubmit: (values, { props }) => {
    console.log('handleSubmit', values, props)
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
    const { classes, handleSubmit } = this.props

    return (
      <React.Fragment>
        <GridContainer className={classes.gridContainer}>
          <GridItem xs sm={12} md={3} className={classes.patientInfo}>
            <PatientInfoCard />
          </GridItem>
          <GridItem container xs md={9} className={classes.formContent}>
            <GridItem xs md={12} container>
              <GridItem xs d={6} className={classes.cardContent}>
                <VisitInfoCard />
              </GridItem>
              <GridItem xs md={6} className={classes.cardContent}>
                <VitalSignCard />
              </GridItem>
            </GridItem>
            <GridItem xs md={12} container>
              <GridItem xs md={6} className={classes.cardContent}>
                <SchemesCard />
              </GridItem>
              <GridItem xs md={6} className={classes.cardContent}>
                <ReferralCard />
              </GridItem>
            </GridItem>
            <GridItem
              container
              justify='flex-end'
              className={classes.footerContent}
            >
              <Button color='primary' onClick={handleSubmit}>
                Register Visit
              </Button>
            </GridItem>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewVisitModal' })(NewVisit)
