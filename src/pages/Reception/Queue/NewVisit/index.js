import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { CircularProgress, withStyles } from '@material-ui/core'
// custom component
import {
  GridContainer,
  GridItem,
  SizeContainer,
  withFormikExtend,
} from '@/components'
import Loading from '@/components/PageLoading/index'
// Sub-components
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import VitalSignCard from './VitalSignCard'
import ReferralCard from './ReferralCard'
// import ParticipantCard from './ParticipantCard'
import VisitValidationSchema from './validationScheme'
import FormFieldName from './formField'
// services
import { uploadFile } from '@/services/file'

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
  hide: {
    display: 'none',
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

const uploadFiles = async (file, index) => {
  const response = await uploadFile(file)
  const { id, fileName } = response
  if (id && fileName)
    return {
      fileIndexFK: id,
      fileName,
      sortOrder: index,
      attachmentType: file.attachmentType,
    }
  return {}
}

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
    let qNo =
      queueLog && queueLog.queueListing ? queueLog.queueListing.length + 1 : 1
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
      uploaded = await Promise.all(
        visitAttachment
          .filter((attachment) => {
            if (attachment.id !== undefined) return true
            if (attachment._tempID !== undefined && attachment.isDeleted)
              return false
            return true
          })
          .map(
            (fileObject, index) =>
              fileObject.id ? fileObject : uploadFiles(fileObject, index),
          ),
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
        // ...restValues,
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

  updateAttachmens = ({ added, deleted }) => {
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
      updated = updated.map((attachment) => {
        const uploaded = attachment.id !== undefined

        if (uploaded && attachment.id === deleted)
          return { ...attachment, isDeleted: true }

        if (attachment._tempID === deleted) {
          return { ...attachment, isDeleted: true }
        }

        return { ...attachment }
      })
    setFieldValue('visitAttachment', updated)
  }

  render () {
    const {
      classes,
      footer,
      handleSubmit,
      loading,
      visitRegistration: { visitInfo },
      setFieldValue,
      values,
    } = this.props
    const isEdit = Object.keys(visitInfo).length > 0
    const fetchingVisitInfo =
      loading.effects['visitRegistration/fetchVisitInfo']
    return (
      <React.Fragment>
        <GridContainer className={classes.gridContainer}>
          <GridItem xs sm={12} md={3}>
            <PatientInfoCard />
          </GridItem>
          <GridItem container xs md={9} className={classes.formContent}>
            {fetchingVisitInfo ? (
              <div className={classes.loadingIndicator}>
                <CircularProgress />
                <p>Loading visit info...</p>
              </div>
            ) : (
              <SizeContainer size='sm'>
                <React.Fragment>
                  <GridItem xs md={12} className={classes.row}>
                    <VisitInfoCard
                      handleUpdateAttachments={this.updateAttachmens}
                      attachments={values.visitAttachment}
                    />
                  </GridItem>
                  <GridItem xs md={12} className={classes.row}>
                    <VitalSignCard handleCalculateBMI={this.calculateBMI} />
                  </GridItem>
                  <GridItem xs md={12} className={classes.row}>
                    <ReferralCard
                      handleUpdateAttachments={this.updateAttachmens}
                      attachments={values.visitAttachment}
                    />
                  </GridItem>
                </React.Fragment>
              </SizeContainer>
            )}
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
