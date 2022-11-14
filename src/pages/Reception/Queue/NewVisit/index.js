import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
// material ui
import { withStyles } from '@material-ui/core'
// custom component
import {
  CommonCard,
  GridContainer,
  GridItem,
  SizeContainer,
  withFormikExtend,
  Accordion,
  notification,
} from '@/components'
// medisys-components
import { ErrorWrapper, LoadingWrapper } from '@/components/_medisys'
// Sub-components
import PatientBanner from '@/pages/PatientDashboard/Banner'
import { deleteFileByFileID } from '@/services/file'
import { VISIT_TYPE, SCHEME_TYPE } from '@/utils/constants'
import { locationQueryParameters } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import PatientInfoCard from './PatientInfoCard'
import VisitInfoCard from './VisitInfoCard'
import ReferralCard from './ReferralCard'
import PrintLabLabelButton from '@/components/_medisys/PatientInfoSideBanner/PatientLabelBtn'

// import ParticipantCard from './ParticipantCard'
import {
  VisitValidationSchema,
  reportingDoctorSchema,
} from './validationScheme'
import FormFieldName from './formField'
// services
// misc utils
import { formikMapPropsToValues, formikHandleSubmit } from './miscUtils'
import { VISIT_STATUS } from '../variables'
import { orderItemCategory } from '@/utils/codes'
import _ from 'lodash'

const styles = theme => ({
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

const getHeight = propsHeight => {
  if (propsHeight < 0) return '100%'
  return propsHeight - 64
}

@connect(
  ({
    clinicSettings,
    clinicInfo,
    queueLog,
    loading,
    global,
    visitRegistration,
    patient,
    codetable,
  }) => ({
    clinicSettings,
    clinicInfo,
    queueLog,
    global,
    loading,
    visitRegistration,
    patientInfo: patient.entity || {},
    doctorProfiles: codetable.doctorprofile,
    ctinvoiceadjustment: codetable.ctinvoiceadjustment,
    ctvisitpurpose: codetable.ctvisitpurpose,
    ctlanguage: codetable.ctlanguage,
  }),
)
@withFormikExtend({
  displayName: 'VisitRegistration',
  enableReinitialize: true,
  validationSchema: VisitValidationSchema,
  mapPropsToValues: formikMapPropsToValues,
  handleSubmit: formikHandleSubmit,
})
class NewVisit extends PureComponent {
  state = {
    hasActiveSession: false,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount = async () => {
    const { dispatch, patientInfo, values, visitRegistration } = this.props
    this.setBannerHeight()

    const bizSession = await dispatch({
      type: 'visitRegistration/getBizSession',
      payload: {
        IsClinicSessionClosed: false,
      },
    })
    const { data = [] } = bizSession
    this.setState({
      hasActiveSession: data.length > 0,
    })
    await this.getCodeTables()
  }

  getCodeTables = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctinvoiceadjustment',
        force: true,
        filter: {
          isActive: true,
        },
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctvisitpurpose',
        force: true,
        filter: {
          isActive: true,
        },
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctlanguage',
        force: true,
      },
    })
  }
  componentWillUnmount() {
    // call file index API METHOD='DELETE'
    // for Attachments where fileStatus === 'Uploaded' but not 'Confirmed'
    // unmount will be invoked too when submit succeeded,
    // but this.props.values will be empty after submit succeeed

    const { values } = this.props
    if (values && values.visitAttachment) {
      const { visitAttachment } = values

      const notConfirmedFiles = visitAttachment.filter(
        attachment => attachment.fileIndexFK === undefined,
      )

      notConfirmedFiles.forEach(item => {
        !item.isDeleted && deleteFileByFileID(item.id)
      })
    }
  }

  updateAttachments = ({ added, deleted }) => {
    const {
      values: { visitAttachment = [] },
      setFieldValue,
    } = this.props
    let updated = [...visitAttachment]

    if (added) updated = [...updated, ...added]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [...attachments, { ...item, isDeleted: true }]

        return [...attachments, { ...item }]
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

    const { doctorProfileFK, visitDoctor = [] } = values

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

  setBannerHeight = () => {
    const banner = document.getElementById('patientBanner')
    const bannerHeight = banner ? banner.offsetHeight : 0
    this.setState({
      bannerHeight: bannerHeight,
    })
    if (bannerHeight === 0) setTimeout(this.setBannerHeight, 1000)
  }

  getExtraComponent = () => {
    const { clinicSettings, patientInfo } = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          height: '100%',
          width: '90%',
        }}
      >
        {patientInfo && (
          <PrintLabLabelButton
            patientId={patientInfo.id}
            clinicSettings={clinicSettings?.settings}
            isEnableScanner
          />
        )}
      </div>
    )
  }

  render() {
    const {
      classes,
      footer,
      theme,
      queueLog: { list = [] } = { list: [] },
      loading,
      visitRegistration: { errorState, visitMode },
      values,
      global,
      isSubmitting,
      dispatch,
      setFieldValue,
      clinicSettings,
      patientInfo,
      ctinvoiceadjustment,
      codetable,
    } = this.props
    const height = getHeight(this.props.height)

    const existingQNo = list.reduce(
      (queueNumbers, queue) =>
        queue.visitFK === values.id
          ? [...queueNumbers]
          : [...queueNumbers, queue.queueNo],
      [],
    )
    const isReadOnly =
      !patientInfo || !patientInfo.isActive || visitMode === 'view'
    const isEdit = !!values.id
    const fetchingVisitInfo =
      loading.effects['visitRegistration/fetchVisitInfo']
    const fetchingInfoText = fetchingVisitInfo
      ? 'Loading visit info...'
      : undefined
    const loadingText = isEdit ? 'Saving visit...' : 'Registering visit...'
    const isRetail = values.visitPurposeFK === VISIT_TYPE.OTC
    const params = locationQueryParameters()
    const vis = parseInt(params.vis, 10)
    const autoRefreshChas = !(params.md === 'visreg' && vis > 0)
    let referralType = 'None'
    // Edit visit
    if (values.id) {
      if (values.referralSourceFK || values.referralPersonFK) {
        referralType = 'Company'
      } else if (values.referralPatientProfileFK) {
        referralType = 'Patient'
      }
    } else if (clinicSettings.settings.isVisitReferralSourceMandatory) {
      referralType = 'Company'
    }
    if (!values.referredBy) {
      this.props.setFieldValue('referredBy', referralType)
    }

    const isBasicExaminationDisabled =
      !patientInfo || !patientInfo.isActive || visitMode === 'view'
        ? true
        : values.isDoctorConsulted
    return (
      <React.Fragment>
        <LoadingWrapper
          loading={isSubmitting || fetchingVisitInfo}
          text={!fetchingInfoText ? loadingText : fetchingInfoText}
        >
          <GridContainer className={classes.gridContainer}>
            <GridItem xs sm={12} md={12}>
              <div style={{ padding: 8, marginTop: -20 }}>
                <PatientBanner
                  from='VisitReg'
                  isReadOnly={isReadOnly}
                  isRetail={isRetail}
                  {...this.props}
                />
              </div>
            </GridItem>
            <GridItem
              container
              xs
              md={12}
              style={{
                height: height - (this.state.bannerHeight || 0) - 10,
                overflow: 'scroll',
              }}
            >
              <ErrorWrapper errorState={errorState} errorKey='visitInfo'>
                <SizeContainer size='sm'>
                  <React.Fragment>
                    <Authorized.Context.Provider
                      value={{
                        rights: isReadOnly ? 'disable' : 'enable',
                      }}
                    >
                      <GridItem xs={12} className={classes.row}>
                        <VisitInfoCard
                          isDoctorConsulted={values.isDoctorConsulted}
                          existingQNo={existingQNo}
                          visitMode={visitMode}
                          copaymentScheme={(
                            patientInfo?.patientScheme || []
                          ).filter(
                            t =>
                              [
                                SCHEME_TYPE.CORPORATE,
                                SCHEME_TYPE.INSURANCE,
                              ].indexOf(t.schemeTypeFK) >= 0,
                          )}
                          isReadOnly={isReadOnly}
                          handleUpdateAttachments={this.updateAttachments}
                          attachments={values.visitAttachment}
                          visitType={values.visitPurposeFK}
                          dispatch={dispatch}
                          {...this.props}
                        />
                      </GridItem>
                    </Authorized.Context.Provider>
                    <React.Fragment>
                      <GridItem xs={12} className={classes.row}>
                        <CommonCard title='Referral'>
                          <ReferralCard
                            {...this.props}
                            mode='visitregistration'
                            visitMode={visitMode}
                            disabled={isReadOnly}
                            handleUpdateAttachments={this.updateAttachments}
                            attachments={values.visitAttachment}
                            dispatch={dispatch}
                            values={values}
                            referralType={referralType}
                            setFieldValue={setFieldValue}
                          />
                        </CommonCard>
                      </GridItem>
                    </React.Fragment>
                  </React.Fragment>
                </SizeContainer>
              </ErrorWrapper>
            </GridItem>
          </GridContainer>
        </LoadingWrapper>
        <div style={{ position: 'relative' }}>
          {footer &&
            footer({
              confirmBtnText: isEdit ? 'Save' : 'Register Visit',
              onConfirm: this.validatePatient,
              confirmProps: {
                disabled: visitMode === 'view',
              },
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewVisitModal', withTheme: true })(
  NewVisit,
)
