import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  GridContainer,
  GridItem,
  SizeContainer,
  withFormikExtend,
} from '@/components'
// medisys-components
import { ErrorWrapper, LoadingWrapper } from 'medisys-components'
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import ReferralCard from './ReferralCard'
// import ParticipantCard from './ParticipantCard'
import VisitValidationSchema from './validationScheme'
import FormFieldName from './formField'
// services
import { deleteFileByFileID } from '@/services/file'
// misc utils
import { formikMapPropsToValues, formikHandleSubmit } from './miscUtils'

const styles = (theme) => ({
  gridContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  formContent: {
    minHeight: '50vh',
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
  loadingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    minHeight: '50vh',
    '& > p': {
      fontSize: '1.1rem',
    },
  },
})

@connect(({ queueLog, loading, visitRegistration }) => ({
  queueLog,
  loading,
  visitRegistration,
}))
@withFormikExtend({
  displayName: 'VisitRegistration',
  enableReinitialize: true,
  validationSchema: VisitValidationSchema,
  mapPropsToValues: formikMapPropsToValues,
  handleSubmit: formikHandleSubmit,
})
class NewVisit extends PureComponent {
  componentWillUnmount () {
    // call file index API METHOD='DELETE'
    // for Attachments where fileStatus === 'Uploaded' but not 'Confirmed'
    // unmount will be invoked too when submit succeeded,
    // but this.props.values will be empty after submit succeeed

    const { values } = this.props
    if (values && values.visitAttachment) {
      const { visitAttachment } = values

      const notConfirmedFiles = visitAttachment.filter(
        (attachment) => attachment.fileIndexFK === undefined,
      )

      notConfirmedFiles.forEach((item) => {
        !item.isDeleted && deleteFileByFileID(item.id)
      })
    }
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

  updateAttachments = ({ added, deleted }) => {
    const { values: { visitAttachment = [] }, setFieldValue } = this.props
    let updated = [
      ...visitAttachment,
    ]

    if (added)
      updated = [
        ...updated,
        ...added,
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    setFieldValue('visitAttachment', updated)
  }

  render () {
    const {
      classes,
      footer,
      handleSubmit,
      loading,
      visitRegistration: { visitInfo, errorState },
      values,
      isSubmitting,
    } = this.props
    const isEdit = Object.keys(visitInfo).length > 0
    const fetchingVisitInfo =
      loading.effects['visitRegistration/fetchVisitInfo']
    const fetchingInfoText = fetchingVisitInfo
      ? 'Loading visit info...'
      : undefined
    const loadingText = isEdit ? 'Saving visit...' : 'Registering visit...'

    return (
      <React.Fragment>
        <LoadingWrapper
          loading={isSubmitting || fetchingVisitInfo}
          text={!fetchingInfoText ? loadingText : fetchingInfoText}
        >
          <GridContainer className={classes.gridContainer}>
            <GridItem xs sm={12} md={3}>
              <PatientInfoCard />
            </GridItem>
            <GridItem container xs md={9} className={classes.formContent}>
              <ErrorWrapper errorState={errorState} errorKey='visitInfo'>
                <SizeContainer size='sm'>
                  <React.Fragment>
                    <GridItem xs md={12} className={classes.row}>
                      <VisitInfoCard
                        handleUpdateAttachments={this.updateAttachments}
                        attachments={values.visitAttachment}
                      />
                    </GridItem>
                    <GridItem xs md={12} className={classes.row}>
                      <VitalSignCard handleCalculateBMI={this.calculateBMI} />
                    </GridItem>
                    <GridItem xs md={12} className={classes.row}>
                      <ReferralCard
                        handleUpdateAttachments={this.updateAttachments}
                        attachments={values.visitAttachment}
                      />
                    </GridItem>
                  </React.Fragment>
                </SizeContainer>
              </ErrorWrapper>
              {/*
                <GridItem xs md={12} container>
                  <GridItem xs md={12} className={classes.cardContent}>
                    <ParticipantCard />
                  </GridItem>
                </GridItem>
              */}
            </GridItem>
          </GridContainer>
        </LoadingWrapper>
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
