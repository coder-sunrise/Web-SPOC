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
import { ErrorWrapper, LoadingWrapper } from '@/components/_medisys'
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
import { VISIT_STATUS } from '../variables'
import { VISIT_TYPE } from '@/utils/constants'
import { calculateBMI } from '@/utils/utils'

const styles = (theme) => ({
  gridContainer: {
    marginBottom: theme.spacing(1),
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
  readOnlyChip: {
    position: 'absolute',
    zIndex: 20,
    top: 0,
    right: 0,
  },
})

const getHeight = (propsHeight) => {
  if (propsHeight < 0) return '100%'

  const modalMargin = 64
  const footerAndHeaderHeight = 95
  return propsHeight - footerAndHeaderHeight - modalMargin
}

@connect(
  ({
    clinicInfo,
    queueLog,
    loading,
    visitRegistration,
    patient,
    codetable,
  }) => ({
    clinicInfo,
    queueLog,
    loading,
    visitRegistration,
    patientInfo: patient.entity,
    doctorProfiles: codetable.doctorprofile,
  }),
)
@withFormikExtend({
  displayName: 'VisitRegistration',
  authority: 'queue.visitregistrationdetails',
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

  handleCalculateBMI = () => {
    const { heightCM, weightKG } = this.props.values
    console.log(heightCM, weightKG)
    const { setFieldValue, setFieldTouched } = this.props
    if (heightCM && weightKG) {
      const bmiInTwoDecimal = calculateBMI(heightCM, weightKG)
      setFieldValue(FormFieldName['vitalsign.bmi'], bmiInTwoDecimal)
    } else {
      setFieldValue(FormFieldName['vitalsign.bmi'], null)
    }
    setFieldTouched(FormFieldName['vitalsign.bmi'], true)
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

  validatePatient = () => {
    const {
      queueLog: { list = [] } = { list: [] },
      patientInfo,
      dispatch,
      handleSubmit,
      errors,
      values,
    } = this.props

    if (Object.keys(errors).length > 0) return handleSubmit()

    const alreadyRegisteredVisit = list.reduce(
      (registered, queue) =>
        !registered ? queue.patientProfileFK === patientInfo.id : registered,
      false,
    )

    if (!values.id && alreadyRegisteredVisit)
      return dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmTitle: 'Confirm Register New Visit',
          openConfirmContent:
            'This patient already registered in current session, are you sure to continue?',
          onConfirmSave: handleSubmit,
        },
      })
    return handleSubmit()
  }

  render () {
    const {
      classes,
      footer,
      queueLog: { list = [] } = { list: [] },
      loading,
      visitRegistration: { errorState },
      values,
      isSubmitting,
    } = this.props

    const height = getHeight(this.props.height)

    const existingQNo = list.reduce(
      (queueNumbers, queue) =>
        queue.visitFK === values.id
          ? [
              ...queueNumbers,
            ]
          : [
              ...queueNumbers,
              queue.queueNo,
            ],
      [],
    )
    const isReadOnly =
      values.visitStatus !== VISIT_STATUS.WAITING &&
      values.visitStatus !== VISIT_STATUS.UPCOMING_APPT
    const isEdit = !!values.id
    const fetchingVisitInfo =
      loading.effects['visitRegistration/fetchVisitInfo']
    const fetchingInfoText = fetchingVisitInfo
      ? 'Loading visit info...'
      : undefined
    const loadingText = isEdit ? 'Saving visit...' : 'Registering visit...'
    const isRetail = values.visitPurposeFK === VISIT_TYPE.RETAIL
    return (
      <React.Fragment>
        <LoadingWrapper
          loading={isSubmitting || fetchingVisitInfo}
          text={!fetchingInfoText ? loadingText : fetchingInfoText}
        >
          {/* <Chip label='Read Only' className={classes.readOnlyChip} /> */}
          <GridContainer className={classes.gridContainer}>
            <GridItem xs sm={12} md={3}>
              <PatientInfoCard />
            </GridItem>
            <GridItem
              container
              xs
              md={9}
              style={{
                height,
                overflow: 'auto',
              }}
            >
              <ErrorWrapper errorState={errorState} errorKey='visitInfo'>
                <SizeContainer size='sm'>
                  <React.Fragment>
                    <GridItem xs md={12} className={classes.row}>
                      <VisitInfoCard
                        isReadOnly={isReadOnly}
                        existingQNo={existingQNo}
                        handleUpdateAttachments={this.updateAttachments}
                        attachments={values.visitAttachment}
                        visitType={values.visitPurposeFK}
                      />
                    </GridItem>
                    <GridItem xs md={12} className={classes.row}>
                      <VitalSignCard
                        isReadOnly={isRetail || isReadOnly}
                        handleCalculateBMI={this.handleCalculateBMI}
                      />
                    </GridItem>
                    <GridItem xs md={12} className={classes.row}>
                      <ReferralCard
                        isReadOnly={isRetail || isReadOnly}
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
        <div style={{ position: 'relative' }}>
          {footer &&
            footer({
              confirmBtnText: isEdit ? 'Save' : 'Register visit',
              onConfirm: this.validatePatient,
              confirmProps: {
                disabled: isReadOnly,
              },
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewVisitModal' })(NewVisit)
