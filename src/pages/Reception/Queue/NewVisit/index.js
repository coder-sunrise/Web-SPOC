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
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import ReferralCard from './ReferralCard'
// import ParticipantCard from './ParticipantCard'
// medisys-components
import { ErrorWrapper, LoadingWrapper } from 'medisys-components'
import VisitValidationSchema from './validationScheme'
import FormFieldName from './formField'
// services
import { deleteFileByFileID } from '@/services/file'

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
  mapPropsToValues: ({ queueLog, visitRegistration }) => {
    let qNo = 0.0
    if (queueLog) {
      const { queueListing } = queueLog
      const largestQNo = queueListing.reduce(
        (largest, { queueNo }) =>
          parseFloat(queueNo) > largest ? parseFloat(queueNo) : largest,
        0,
      )
      qNo = parseFloat(largestQNo + 1).toFixed(1)
    }

    const { visitInfo } = visitRegistration

    if (Object.keys(visitInfo).length > 0) {
      qNo = visitInfo.queueNo
    }
    const { visit = {} } = visitInfo

    const visitEntries = Object.keys(visit).reduce(
      (entries, key) => ({
        ...entries,
        [key]: visit[key] === null ? undefined : visit[key],
      }),
      {},
    )

    return {
      queueNo: qNo,
      ...visitEntries,
    }
  },
  handleSubmit: async (values, { props, setSubmitting }) => {
    const { queueNo, visitAttachment, ...restValues } = values
    const { dispatch, queueLog, visitRegistration, onConfirm } = props

    const { sessionInfo } = queueLog
    const {
      visitInfo: { id = undefined, visit, ...restVisitInfo },
      patientInfo,
    } = visitRegistration
    const bizSessionFK = sessionInfo.id

    const visitReferenceNo = `${sessionInfo.sessionNo}-${parseFloat(id).toFixed(
      1,
    )}`

    const patientProfileFK = patientInfo.id

    let uploaded = []
    if (visitAttachment) {
      uploaded = visitAttachment
        .filter((item) => {
          // filter out not yet confirmed files
          if (item.fileIndexFK === undefined && item.isDeleted) return false
          return true
        })
        .map(
          (
            { fileIndexFK, fileName, attachmentType, isDeleted, ...rest },
            index,
          ) =>
            !fileIndexFK
              ? {
                  // file status === uploaded, only 4 info needed for API
                  fileIndexFK: rest.id,
                  sortOrder: index,
                  fileName,
                  attachmentType,
                  isDeleted,
                }
              : {
                  // file status === confirmed, need to provide full object for API
                  ...rest,
                  fileIndexFK,
                  fileName,
                  attachmentType,
                  isDeleted,
                  sortOrder: index,
                },
        )
    }
    const payload = {
      id,
      ...restVisitInfo,
      queueNo,
      queueNoPrefix: sessionInfo.sessionNoPrefix,
      visit: {
        visitAttachment: uploaded,
        patientProfileFK,
        bizSessionFK,
        visitReferenceNo,
        visitStatus: 'WAITING',
        visitRemarks: null,
        temperatureC: null,
        bpSysMMHG: null,
        bpDiaMMHG: null,
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
        ...restValues, // override values from formik values
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
      return response && onConfirm()
    })
  },
})
class NewVisit extends PureComponent {
  componentWillUnmount () {
    // delete Attachments where fileStatus === 'Uploaded'
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
    // console.log({ attachments: values.visitAttachment })
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
