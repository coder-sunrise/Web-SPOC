/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import { Collapse } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { Edit, Print } from '@material-ui/icons'
import { connect } from 'dva'
import router from 'umi/router'
import { Field } from 'formik'
import numeral from 'numeral'
import Search from '@material-ui/icons/Search'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CardContainer,
  withFormikExtend,
  CommonModal,
  Button,
  Tooltip,
  Checkbox,
  ProgressButton,
  CodeSelect,
  DateRangePicker,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { download } from '@/utils/request'
// utils
import { findGetParameter, commonDataReaderTransform } from '@/utils/utils'
import { VISIT_TYPE, CLINIC_TYPE } from '@/utils/constants'
import { DoctorProfileSelect } from '@/components/_medisys'
import * as WidgetConfig from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import HistoryDetails from './HistoryDetails'
import customtyles from './PatientHistoryStyle.less'

const defaultValue = {
  visitDate: [
    moment(new Date()).startOf('day').toDate(),
    moment(new Date()).endOf('day').toDate(),
  ],
  selectDoctors: [],
  selectCategories: [],
  isAllDate: true,
}

const styles = (theme) => ({
  root: {},
  hide: {
    display: 'none',
  },
  title: {
    fontSize: '1em',
  },
  note: {
    fontSize: '0.85em',
    fontWeight: 400,
    // marginTop: -3,
    lineHeight: '10px',
  },
  listRoot: {
    width: '100%',
  },
  listItemRoot: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: '0.85em',
  },
  listItemDate: {
    position: 'absolute',
    right: '21%',
  },
  paragraph: {
    marginLeft: theme.spacing(1),
    fontSize: '0.85em',
  },
  leftPanel: {
    position: 'sticky',
    width: 400,
    top: 0,
    float: 'left',
    marginRight: theme.spacing(1),
    marginTop: 0,
  },
  rightPanel: {
    marginTop: 0,

    '& h5': {
      textDecoration: 'underline',
      marginTop: theme.spacing(2),
      fontSize: '1em',
    },
  },
  integratedLeftPanel: {
    width: '100%',
  },
})
@connect(
  ({
    clinicInfo,
    clinicSettings,
    codetable,
    user,
    scriblenotes,
    patient,
    patientHistory,
  }) => ({
    clinicSettings,
    codetable,
    user,
    clinicInfo,
    scriblenotes,
    patient: patient.entity || patient.default,
    patientHistory,
  }),
)
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    ...defaultValue,
  }),
})
class PatientHistory extends Component {
  constructor (props) {
    super(props)
    this.scrollRef = React.createRef()
    this.widgets = WidgetConfig.widgets(
      props,
      this.scribbleNoteUpdateState,
    ).filter((o) => {
      return this.getCategoriesOptions().find((c) => c.value === o.id)
    })

    this.state = {
      selectedData: '',
      showHistoryDetails: false,
      selectHistory: undefined,
      activeKey: [],
      selectItems: [],
      visitDate: [
        moment(new Date()).startOf('day').toDate(),
        moment(new Date()).endOf('day').toDate(),
      ],
      selectDoctors: [],
      selectCategories: [],
      isAllDate: true,
      pageIndex: 0,
      loadVisits: [],
      isScrollBottom: false,
      totalVisits: 0,
      currentHeight: window.innerHeight,
    }
  }

  componentWillMount () {
    const { dispatch } = this.props

    dispatch({
      type: 'patientHistory/initState',
      payload: {
        queueID: Number(findGetParameter('qid')) || 0,
        version: Number(findGetParameter('v')) || undefined,
        visitID: findGetParameter('visit'),
        patientID: Number(findGetParameter('pid')) || 0,
      },
    }).then(() => {
      dispatch({
        type: 'patientHistory/getUserPreference',
        payload: {},
      }).then((result) => {
        const { setFieldValue } = this.props
        let selectCategories = [
          -99,
          ...this.getCategoriesOptions().map((o) => o.value),
        ]
        if (result) {
          selectCategories = result.SelectCategories.filter((o) =>
            selectCategories.find((c) => c === o),
          )
        }
        this.setState({ selectCategories }, () => {
          setFieldValue('selectCategories', selectCategories)
          this.queryVisitHistory()
        })
      })
    })
  }

  componentDidMount () {
    window.addEventListener('resize', () => {
      this.setState({ currentHeight: window.innerHeight })
    })
    if (this.scrollRef) {
      this.scrollRef.addEventListener('scroll', (e) => {
        const { isScrollBottom } = this.state
        if (!isScrollBottom) {
          const { clientHeight, scrollHeight, scrollTop } = e.target
          const isBottom = clientHeight + scrollTop === scrollHeight
          if (isBottom) {
            this.setState({ isScrollBottom: isBottom })
          }
        }
      })
    }
  }

  getCategoriesOptions = () => {
    const { clinicInfo } = this.props
    const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
    let categories = []
    if (clinicTypeFK === CLINIC_TYPE.GP) {
      categories = WidgetConfig.GPCategory
    } else if (clinicTypeFK === CLINIC_TYPE.DENTAL) {
      categories = WidgetConfig.DentalCategory
    } else if (clinicTypeFK === CLINIC_TYPE.EYE) {
      categories = WidgetConfig.EyeCategory
    }

    return WidgetConfig.categoryTypes
      .filter((o) => {
        const accessRight = Authorized.check(o.authority)
        if (!accessRight || accessRight.rights === 'hidden') return false

        if (categories.find((c) => c === o.value)) {
          return true
        }
        return false
      })
      .map((o) => {
        return { ...o }
      })
  }

  queryVisitHistory = () => {
    const { isAllDate, pageIndex, selectDoctors = [], visitDate } = this.state
    const {
      dispatch,
      clinicSettings,
      patientHistory,
      setFieldValue,
      values,
    } = this.props
    const { settings = [] } = clinicSettings
    const { viewVisitPageSize = 10 } = settings

    let visitFromDate
    let visitToDate
    if (visitDate && visitDate.length > 0) {
      visitFromDate = visitDate[0]
    }

    if (visitDate && visitDate.length > 1) {
      visitToDate = visitDate[1]
    }

    dispatch({
      type: 'patientHistory/queryVisitHistory',
      payload: {
        visitFromDate: visitFromDate
          ? moment(visitFromDate).startOf('day').formatUTC()
          : undefined,
        visitToDate: visitToDate
          ? moment(visitToDate).endOf('day').formatUTC(false)
          : undefined,
        isAllDate,
        pageIndex: pageIndex + 1,
        pageSize: viewVisitPageSize,
        patientProfileId: patientHistory.patientID,
        selectDoctors: selectDoctors.join(','),
      },
    }).then((r) => {
      this.setState((preState) => {
        const list = r.list.map((o) => {
          return {
            ...o,
            currentId: `${o.isNurseNote ? 'NurseNote' : 'Visit'}-${o.id}`,
          }
        })
        const currentVisits = [
          ...preState.loadVisits,
          ...list,
        ]
        return {
          ...preState,
          loadVisits: currentVisits,
          totalVisits: r.totalVisits,
          pageIndex: preState.pageIndex + 1,
          activeKey: [
            ...preState.activeKey,
            ...list.map((o) => o.currentId),
          ],
        }
      })
      if (values.isSelectAll) setFieldValue('isSelectAll', false)
    })
  }

  selectOnChange = (e, row) => {
    const { setFieldValue, values } = this.props
    if (e.target.value) {
      this.setState(
        (preState) => {
          const currentSelectItem = [
            ...preState.selectItems,
            row.currentId,
          ]
          return { ...preState, selectItems: currentSelectItem }
        },
        () => {
          if (this.state.selectItems.length === this.state.loadVisits.length)
            setFieldValue('isSelectAll', true)
        },
      )
    } else {
      this.setState(
        (preState) => {
          const currentSelectItem = preState.selectItems.filter(
            (o) => o !== row.currentId,
          )
          return { ...preState, selectItems: currentSelectItem }
        },
        () => {
          if (values.isSelectAll) setFieldValue('isSelectAll', false)
        },
      )
    }
  }

  getTitle = (row) => {
    const {
      theme,
      patientHistory,
      dispatch,
      codetable,
      user,
      clinicSettings,
      patient = {},
      fromModule,
    } = this.props
    const {
      userTitle,
      userName,
      visitDate,
      signOffDate,
      visitPurposeFK,
      timeIn,
      timeOut,
      visitPurposeName,
      coHistory = [],
      isNurseNote,
    } = row
    const { settings = [] } = clinicSettings
    const { patientID } = patientHistory
    const isRetailVisit = visitPurposeFK === VISIT_TYPE.RETAIL
    const patientIsActive = patient.isActive
    const docotrName = userName
      ? `${userTitle || ''} ${userName || ''}`
      : undefined
    let LastUpdateBy
    if (coHistory.length > 0) {
      LastUpdateBy = coHistory[0].userName
        ? `${coHistory[0].userTitle || ''} ${coHistory[0].userName || ''}`
        : undefined
    } else {
      LastUpdateBy = userName
        ? `${userTitle || ''} ${userName || ''}`
        : undefined
    }
    const isSelect = this.state.selectItems.find((o) => o === row.currentId)
      ? true
      : false

    return (
      <div
        style={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 2,
          paddingBottom: 2,
        }}
        onClick={() => {
          this.setState((preState) => {
            if (preState.activeKey.find((key) => key === row.currentId)) {
              return {
                ...preState,
                activeKey: preState.activeKey.filter(
                  (key) => key !== row.currentId,
                ),
              }
            }
            return {
              ...preState,
              activeKey: [
                ...preState.activeKey,
                row.currentId,
              ],
            }
          })
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {fromModule !== 'Consultation' && (
              <div
                style={{
                  marginTop: fromModule === 'History' ? -12 : -16,
                  marginLeft: 5,
                  height: 24,
                  width: 30,
                }}
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <Checkbox
                  label=''
                  checked={isSelect}
                  onChange={(e) => this.selectOnChange(e, row)}
                />
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: fromModule !== 'Consultation' ? -14 : 0,
            }}
          >
            <span className='material-icons'>
              {this.state.activeKey.find((key) => key === row.currentId) ? (
                'expand_more'
              ) : (
                'navigate_next'
              )}
            </span>
          </div>
          {isNurseNote && (
            <div style={{ fontSize: '0.9em' }}>
              <div style={{ fontWeight: 500 }}>
                {`${moment(visitDate).format(
                  'DD MMM YYYY HH:MM',
                )} - Nurse Notes${docotrName ? ` - ${docotrName}` : ''}`}
              </div>
            </div>
          )}
          {!isNurseNote && (
            <div style={{ fontSize: '0.9em' }}>
              <div style={{ fontWeight: 500 }}>
                {`${moment(visitDate).format('DD MMM YYYY')} (Time In: ${moment(
                  timeIn,
                ).format('HH:mm')} Time Out: ${timeOut
                  ? moment(timeOut).format('HH:mm')
                  : '-'})${docotrName ? ` - ${docotrName}` : ''}`}
              </div>
              <span>
                {`${visitPurposeName}, Last Update By: ${LastUpdateBy ||
                  ''} on ${moment(signOffDate).format('DD MMM YYYY HH:mm')}`}
              </span>
            </div>
          )}
          {!isNurseNote && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {patientIsActive &&
              !isRetailVisit &&
              (fromModule !== 'Consultation' && fromModule !== 'History') && (
                <Authorized authority='patientdashboard.editconsultation'>
                  <Tooltip title='Edit Consultation'>
                    <Button
                      color='primary'
                      style={{ marginLeft: theme.spacing(2) }}
                      size='sm'
                      justIcon
                      onClick={(event) => {
                        event.stopPropagation()

                        dispatch({
                          type: `consultation/edit`,
                          payload: {
                            id: row.id,
                            version: patientHistory.version,
                          },
                        }).then((o) => {
                          if (o) {
                            if (o.updateByUserFK !== user.data.id) {
                              const { clinicianprofile = [] } = codetable
                              const version = Date.now()
                              const editingUser = clinicianprofile.find(
                                (m) => m.userProfileFK === o.updateByUserFK,
                              ) || {
                                name: 'Someone',
                              }
                              dispatch({
                                type: 'global/updateAppState',
                                payload: {
                                  openConfirm: true,
                                  openConfirmContent: `${editingUser.name} is currently editing the patient note, do you want to overwrite?`,
                                  onConfirmSave: () => {
                                    dispatch({
                                      type: `consultation/overwrite`,
                                      payload: {
                                        id: row.id,
                                        version,
                                      },
                                    }).then((c) => {
                                      dispatch({
                                        type: 'patient/closePatientModal',
                                      })
                                      router.push(
                                        `/reception/queue/consultation?qid=${row.queueFK}&pid=${patientID}&cid=${c.id}&v=${version}`,
                                      )
                                    })
                                  },
                                },
                              })
                            } else {
                              dispatch({
                                type: 'patient/closePatientModal',
                              })
                              router.push(
                                `/reception/queue/consultation?qid=${row.queueFK}&pid=${patientID}&cid=${o.id}&v=${patientHistory.version}`,
                              )
                            }
                          }
                        })
                      }}
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                </Authorized>
              )}
            </div>
          )}
          {!isNurseNote &&
          settings.showConsultationVersioning &&
          !isRetailVisit && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Tooltip title='View History'>
                <span
                  className='material-icons'
                  style={{ color: 'gray' }}
                  onClick={(event) => {
                    event.stopPropagation()
                    this.setState({
                      showHistoryDetails: true,
                      selectHistory: { ...row },
                    })
                  }}
                >
                  history
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    )
  }

  checkSelectWidget = (widgetId) => {
    const { selectCategories = [] } = this.state
    if (selectCategories.length > 0) {
      return selectCategories.find((c) => c === widgetId)
    }
    return true
  }

  getDetailPanel = (history) => {
    const { isFullScreen = true, classes } = this.props
    const { visitPurposeFK, isNurseNote, nurseNotes } = history
    if (isNurseNote) {
      let e = document.createElement('div')
      e.innerHTML = nurseNotes
      let htmlData = e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
      return (
        <div
          style={{
            padding: 10,
          }}
        >
          <span
            style={{
              fontWeight: 500,
              color: 'darkBlue',
              fontSize: '0.85rem',
            }}
          >
            Nurse Notes
          </span>
          <div
            style={{ fontSize: '0.85rem' }}
            className={classes.paragraph}
            dangerouslySetInnerHTML={{ __html: htmlData }}
          />
        </div>
      )
    }

    let current = {
      ...history.patientHistoryDetail,
      visitAttachments: history.visitAttachments,
      visitRemarks: history.visitRemarks,
      referralBy: history.referralBy,
      referralInstitution: history.referralInstitution,
      referralDate: history.referralDate,
    }
    let visitDetails = {
      visitDate: history.visitDate,
      patientName: history.patientName,
      patientAccountNo: history.patientAccountNo,
    }
    let currentTagWidgets = this.widgets.filter((_widget) => {
      return this.checkShowData(
        _widget.id,
        current,
        visitPurposeFK,
        isNurseNote,
      )
    })

    return (
      <div
        style={{
          padding: 10,
        }}
      >
        {currentTagWidgets.length > 0 ? (
          currentTagWidgets.map((o) => {
            const Widget = o.component
            return (
              <div>
                <span
                  style={{
                    fontWeight: 500,
                    color: 'darkBlue',
                    fontSize: '0.85rem',
                  }}
                >
                  {o.name}
                </span>
                {Widget ? (
                  <Widget
                    current={current}
                    visitDetails={visitDetails}
                    {...this.props}
                    setFieldValue={this.props.setFieldValue}
                    isFullScreen={isFullScreen}
                  />
                ) : (
                  ''
                )}
              </div>
            )
          })
        ) : (
          <div> No Data</div>
        )}
      </div>
    )
  }

  toggleScribbleModal = () => {
    const { scriblenotes } = this.props
    this.props.dispatch({
      type: 'scriblenotes/updateState',
      payload: {
        showViewScribbleModal: !scriblenotes.showViewScribbleModal,
        isReadonly: false,
      },
    })
  }

  scribbleNoteUpdateState = (selectedDataValue) => {
    this.setState({
      selectedData: selectedDataValue,
    })
  }

  setExpandAll = (isExpandAll = false) => {
    const { loadVisits } = this.state
    if (isExpandAll) {
      this.setState({ activeKey: loadVisits.map((o) => o.currentId) })
    } else {
      this.setState({ activeKey: [] })
    }
  }

  selectAllOnChange = (e) => {
    if (e.target.value) {
      this.setState((preState) => {
        return {
          ...preState,
          selectItems: [
            ...preState.loadVisits.map((o) => o.currentId),
          ],
        }
      })
    } else {
      this.setState({ selectItems: [] })
    }
  }

  getPatientInfo = () => {
    const {
      patient = {},
      codetable: { ctg6pd = [], ctnationality = [], ctgender = [] },
    } = this.props
    const {
      name,
      patientAccountNo,
      nationalityFK,
      dob,
      patientAllergy,
      genderFK,
      patientAllergyMetaData,
      patientMedicalHistory = {},
    } = patient
    const {
      medicalHistory,
      familyHistory,
      socialHistory,
    } = patientMedicalHistory
    const gender = ctgender.find((o) => o.id === genderFK)
    const nationality = ctnationality.find((o) => o.id === nationalityFK)
    let g6PD
    if (patientAllergyMetaData.length > 0)
      g6PD = ctg6pd.find((o) => o.id === patientAllergyMetaData[0].g6PDFK)

    let age = '0'
    const years = Math.floor(moment.duration(moment().diff(dob)).asYears())
    if (years > 0) {
      age = `${years} ${years > 1 ? 'yrs' : 'yr'}`
    } else {
      const months = Math.floor(moment.duration(moment().diff(dob)).asMonths())
      age = `{${months} ${years > 1 ? 'months' : 'month'}}`
    }

    const allergies = _.orderBy(
      patientAllergy,
      [
        'type',
      ],
      [
        'asc',
      ],
    )
    return [
      {
        patientName: name,
        patientAccountNo,
        patientNationality: nationality ? nationality.name : 'Unknown',
        patientAge: age,
        patientSex: gender ? gender.name : 'Unknown',
        patientG6PD: g6PD ? g6PD.name : 'Unknown',
        patientAllergy: allergies.map((o) => o.allergyName).join(', '),
        patientSocialHistory: socialHistory,
        patientFamilyHistory: familyHistory,
        patientMajorInvestigation: medicalHistory,
      },
    ]
  }

  checkShowData = (widgetId, current, visitPurposeFK, isNurseNote) => {
    if (isNurseNote) return false
    if (visitPurposeFK === VISIT_TYPE.RETAIL) {
      return (
        (widgetId === WidgetConfig.WIDGETS_ID.INVOICE ||
          widgetId === WidgetConfig.WIDGETS_ID.VISITREMARKS ||
          widgetId === WidgetConfig.WIDGETS_ID.REFERRAL ||
          widgetId === WidgetConfig.WIDGETS_ID.ATTACHMENT) &&
        this.checkSelectWidget(widgetId) &&
        WidgetConfig.showWidget(current, widgetId)
      )
    }
    return (
      this.checkSelectWidget(widgetId) &&
      WidgetConfig.showWidget(current, widgetId)
    )
  }

  getReferral = (current) => {
    return {
      isShowReferral: true,
      referralBy: current.referralBy,
      referralInstitution: current.referralInstitution,
      referralDate: current.referralDate,
    }
  }

  getEyeVisualAcuityTest = (current) => {
    const eyeVisualAcuityTest = current.eyeVisualAcuityTestForms[0] || {}
    return {
      isAided: eyeVisualAcuityTest.isAided,
      isOwnSpecs: eyeVisualAcuityTest.isOwnSpecs,
      isRefractionOn: eyeVisualAcuityTest.isRefractionOn,
      refractionOnRemarks: eyeVisualAcuityTest.refractionOnRemarks,
      nearVADOD: eyeVisualAcuityTest.nearVADOD,
      nearVAPHOD: eyeVisualAcuityTest.nearVAPHOD,
      nearVANOD: eyeVisualAcuityTest.nearVANOD,
      nearVAcmOD: eyeVisualAcuityTest.nearVAcmOD,
      nearVADOS: eyeVisualAcuityTest.nearVADOS,
      nearVAPHOS: eyeVisualAcuityTest.nearVAPHOS,
      nearVANOS: eyeVisualAcuityTest.nearVANOS,
      nearVAcmOS: eyeVisualAcuityTest.nearVAcmOS,
      isNoSpec: eyeVisualAcuityTest.isNoSpec,
      specsAge: eyeVisualAcuityTest.specsAge,
      specSphereOD: eyeVisualAcuityTest.specSphereOD,
      specCylinderOD: eyeVisualAcuityTest.specCylinderOD,
      specAxisOD: eyeVisualAcuityTest.specAxisOD,
      specVaOD: eyeVisualAcuityTest.specVaOD,
      specSphereOS: eyeVisualAcuityTest.specSphereOS,
      specCylinderOS: eyeVisualAcuityTest.specCylinderOS,
      specAxisOS: eyeVisualAcuityTest.specAxisOS,
      specVaOS: eyeVisualAcuityTest.specVaOS,
      eyeVisualAcuityTestRemark: eyeVisualAcuityTest.remark,
      isEyeVisualAcuityTest: true,
    }
  }

  getRefractionForm = (current) => {
    const { formData = {} } = current.corEyeRefractionForm
    const {
      Tenometry = {},
      EyeDominance = {},
      PupilSize = {},
      Tests = [],
      NearAdd = {},
    } = formData
    const visitRefractionFormTests = Tests.map((o) => {
      return {
        visitFK: current.currentId,
        sphereOD: o.SphereOD,
        cylinderOD: o.CylinderOD,
        axisOD: o.AxisOD,
        vaOD: o.VaOD,
        sphereOS: o.SphereOS,
        cylinderOS: o.CylinderOS,
        axisOS: o.AxisOS,
        vaOS: o.VaOS,
        testName: o.EyeRefractionTestType,
      }
    })

    return {
      isRefractionForm: true,
      eyeRefractionFormRemarks: formData.Remarks,
      eyeRefractionFormTestRemarks: formData.TestRemarks,
      eyeRefractionFormTenometryR: Tenometry.R
        ? numeral(Tenometry.R).format('0.0')
        : undefined,
      eyeRefractionFormTenometryL: Tenometry.L
        ? numeral(Tenometry.L).format('0.0')
        : undefined,
      eyeRefractionFormDominanceL: EyeDominance.Left,
      eyeRefractionFormDominanceR: EyeDominance.Right,
      eyeRefractionFormPupilSizeL: PupilSize.L,
      eyeRefractionFormPupilSizeR: PupilSize.R,
      eyeRefractionFormVanHerick: formData.VanHerick,
      eyeRefractionFormNearAddDOD: NearAdd.NearAddDOD,
      eyeRefractionFormNearAddPHOD: NearAdd.NearAddPHOD,
      eyeRefractionFormNearAddNOD: NearAdd.NearAddNOD,
      eyeRefractionFormNearAddcmOD: NearAdd.NearAddcmOD,
      eyeRefractionFormNearAddDOS: NearAdd.NearAddDOS,
      eyeRefractionFormNearAddPHOS: NearAdd.NearAddPHOS,
      eyeRefractionFormNearAddNOS: NearAdd.NearAddNOS,
      eyeRefractionFormNearAddcmOS: NearAdd.NearAddcmOS,
      visitRefractionFormTests,
    }
  }

  printHandel = () => {
    const { loadVisits, selectItems } = this.state
    const { codetable: { ctcomplication = [] } } = this.props
    let visitListing = []
    let treatment = []
    let diagnosis = []
    let eyeVisualAcuityTestForms = []
    let refractionFormTests = []
    let eyeExaminations = []
    let vitalSign = []
    let orders = []
    let consultationDocument = []

    loadVisits
      .filter((visit) => selectItems.find((item) => item === visit.currentId))
      .forEach((visit) => {
        let current = {
          ...visit.patientHistoryDetail,
          visitRemarks: visit.visitRemarks,
          referralBy: visit.referralBy,
          referralInstitution: visit.referralInstitution,
          referralDate: visit.referralDate,
          visitPurposeFK: visit.visitPurposeFK,
          currentId: visit.currentId,
          isNurseNote: visit.isNurseNote,
          nurseNotes: visit.nurseNotes,
          visitDate: visit.visitDate,
          userName: visit.userName,
          userTitle: visit.userTitle,
        }
        const { isNurseNote, nurseNotes = '', visitPurposeFK } = current
        const isShowHistory = this.checkShowData(
          WidgetConfig.WIDGETS_ID.ASSOCIATED_HISTORY,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowChiefComplaints = this.checkShowData(
          WidgetConfig.WIDGETS_ID.CHIEF_COMPLAINTS,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowClinicNotes = this.checkShowData(
          WidgetConfig.WIDGETS_ID.CLINICAL_NOTE,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowPlan = this.checkShowData(
          WidgetConfig.WIDGETS_ID.PLAN,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowReferral = this.checkShowData(
          WidgetConfig.WIDGETS_ID.REFERRAL,
          current,
          visitPurposeFK,
          current.isNurseNote,
        )
        const isShowVisitRemarks = this.checkShowData(
          WidgetConfig.WIDGETS_ID.VISITREMARKS,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowTreatment = false
        // this.checkShowData(
        //  WidgetConfig.WIDGETS_ID.TREATMENT,
        //  current,
        //  visitPurposeFK,
        //  isNurseNote,
        // )
        const isShowDiagnosis = this.checkShowData(
          WidgetConfig.WIDGETS_ID.DIAGNOSIS,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowEyeVisualAcuityTest = this.checkShowData(
          WidgetConfig.WIDGETS_ID.VISUALACUITYTEST,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowRefractionForm = this.checkShowData(
          WidgetConfig.WIDGETS_ID.REFRACTIONFORM,
          current,
          visitPurposeFK,
          current.isNurseNote,
        )
        const isShowEyeExaminations = this.checkShowData(
          WidgetConfig.WIDGETS_ID.EXAMINATIONFORM,
          current,
          visitPurposeFK,
          current.isNurseNote,
        )
        const isShowVitalSign = this.checkShowData(
          WidgetConfig.WIDGETS_ID.VITALSIGN,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowOrders = this.checkShowData(
          WidgetConfig.WIDGETS_ID.ORDERS,
          current,
          visitPurposeFK,
          isNurseNote,
        )
        const isShowConsultationDocument = this.checkShowData(
          WidgetConfig.WIDGETS_ID.CONSULTATION_DOCUMENT,
          current,
          visitPurposeFK,
          isNurseNote,
        )

        if (
          isNurseNote ||
          isShowHistory ||
          isShowChiefComplaints ||
          isShowClinicNotes ||
          isShowPlan ||
          isShowReferral ||
          isShowVisitRemarks ||
          isShowTreatment ||
          isShowDiagnosis ||
          isShowEyeVisualAcuityTest ||
          isShowRefractionForm ||
          isShowEyeExaminations ||
          isShowVitalSign ||
          isShowOrders ||
          isShowConsultationDocument
        ) {
          let referral = { isShowReferral: false }
          if (isShowReferral) {
            referral = this.getReferral(current)
          }
          let refractionFormDetails = { isRefractionForm: false }
          if (isShowRefractionForm) {
            refractionFormDetails = this.getRefractionForm(current)
          }

          let eyeVisualAcuityTestDetails = { isEyeVisualAcuityTest: false }
          if (isShowEyeVisualAcuityTest) {
            eyeVisualAcuityTestDetails = this.getEyeVisualAcuityTest(current)
          }

          const {
            visitRefractionFormTests = [],
            ...restRefractionFormProps
          } = refractionFormDetails
          // visitListing
          visitListing.push({
            currentId: current.currentId,
            visitDate: current.visitDate,
            doctor: `${current.userTitle || ''} ${current.userName || ''}`,
            history: isShowHistory ? current.history : '',
            chiefComplaints: isShowChiefComplaints
              ? current.chiefComplaints
              : '',
            clinicNotes: isShowClinicNotes ? current.note : '',
            plan: isShowPlan ? current.plan : '',
            isNurseNote: isNurseNote || false,
            nurseNotes,
            visitRemarks: isShowVisitRemarks ? current.visitRemarks : '',
            ...referral,
            ...restRefractionFormProps,
            ...eyeVisualAcuityTestDetails,
          })

          // treatment
          if (isShowTreatment) {
            treatment = treatment.concat(
              current.orders.filter((o) => o.type === 'Treatment').map((o) => {
                return {
                  visitFK: current.currentId,
                  name: o.name,
                  toothNumber: o.toothNumber,
                  legend: o.legend,
                  description: o.description,
                }
              }),
            )
          }

          // diagnosis
          if (isShowDiagnosis) {
            diagnosis = diagnosis.concat(
              current.diagnosis.map((o) => {
                let currentComplication = o.corComplication.map((c) => {
                  const selectItem = ctcomplication.find(
                    (cc) => cc.id === c.complicationFK,
                  )
                  return {
                    ...c,
                    name: selectItem ? selectItem.name : undefined,
                  }
                })
                return {
                  visitFK: current.currentId,
                  diagnosisDescription: o.diagnosisDescription,
                  complication: currentComplication
                    .filter((c) => c.name)
                    .map((c) => c.name)
                    .join(', '),
                }
              }),
            )
          }

          // Refraction Form Test
          refractionFormTests = refractionFormTests.concat(
            visitRefractionFormTests,
          )

          // Eye Examinations
          if (isShowEyeExaminations) {
            const { formData = {} } = current.corEyeExaminationForm
            eyeExaminations = eyeExaminations.concat(
              (formData.EyeExaminations || []).map((o) => {
                return {
                  visitFK: current.currentId,
                  rightEye: o.RightEye,
                  eyeExaminationType: o.EyeExaminationType,
                  leftEye: o.LeftEye,
                }
              }),
            )
          }

          // Vital Sign
          if (isShowVitalSign) {
            vitalSign = vitalSign.concat(
              current.patientNoteVitalSigns.map((o) => {
                return {
                  visitFK: current.currentId,
                  temperatureC: `${o.temperatureC
                    ? numeral(o.temperatureC).format('0.0')
                    : 0.0} \u00b0C`,
                  bpSysMMHG: `${o.bpSysMMHG
                    ? numeral(o.bpSysMMHG).format('0.0')
                    : 0.0} mmHg`,
                  bpDiaMMHG: `${o.bpDiaMMHG
                    ? numeral(o.bpDiaMMHG).format('0.0')
                    : 0.0} mmHg`,
                  pulseRateBPM: `${o.pulseRateBPM
                    ? numeral(o.pulseRateBPM).format('0.0')
                    : 0.0} bpm`,
                  weightKG: `${o.weightKG
                    ? numeral(o.weightKG).format('0')
                    : 0} KG`,
                  heightCM: `${o.heightCM
                    ? numeral(o.heightCM).format('0.0')
                    : 0.0} CM`,
                  bmi: `${o.bmi
                    ? numeral(o.bmi).format('0.0')
                    : 0.0} kg/m\u00b2`,
                }
              }),
            )
          }

          // orders
          if (isShowOrders) {
            orders = orders.concat(
              current.orders.map((o) => {
                return {
                  visitFK: current.currentId,
                  type: o.isDrugMixture ? 'Drug Mixture' : o.type,
                  isDrugMixture: o.isDrugMixture,
                  name: o.name,
                  description: o.description,
                  quantity: o.quantity,
                  uom: o.dispenseUOMDisplayValue,
                }
              }),
            )
          }

          // Consultation Document
          if (isShowConsultationDocument) {
            consultationDocument = consultationDocument.concat(
              current.documents.map((o) => {
                return {
                  visitFK: current.currentId,
                  type: o.type,
                  subject: o.type === 'Others' ? o.title : o.subject,
                }
              }),
            )
          }
        }
      })

    const payload = {
      PatientInfo: this.getPatientInfo(),
      VisitListing: visitListing,
      Treatment: treatment,
      Diagnosis: diagnosis,
      EyeVisualAcuityTestForms: eyeVisualAcuityTestForms,
      RefractionFormTests: refractionFormTests,
      EyeExaminations: eyeExaminations,
      VitalSign: vitalSign,
      Orders: orders,
      ConsultationDocument: consultationDocument,
    }

    download(
      `/api/Reports/${68}?ReportFormat=pdf`,
      {
        subject: `PatientHistory-${moment().format('DDMMYYYYHHmmss')}`,
        type: 'pdf',
      },
      {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          reportContent: JSON.stringify(commonDataReaderTransform(payload)),
        },
      },
    )
  }

  getFilterBar = () => {
    const { values, fromModule, isFullScreen = true } = this.props
    const { isAllDate } = values
    const { selectItems } = this.state
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <div
              style={{
                display: 'inline-Block',
              }}
            >
              <Field
                name='visitDate'
                render={(args) => (
                  <DateRangePicker
                    style={{
                      width: !isFullScreen ? 240 : 300,
                    }}
                    label='Visit Date From'
                    label2='To'
                    {...args}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div style={{ display: 'inline-Block', marginLeft: 5 }}>
              <Field
                name='isAllDate'
                render={(args) => <Checkbox {...args} label='All Date' />}
              />
            </div>
            <div style={{ display: 'inline-Block' }}>
              <Field
                name='selectCategories'
                render={(args) => (
                  <CodeSelect
                    valueField='value'
                    label='Categories'
                    mode='multiple'
                    style={{ width: !isFullScreen ? 150 : 240 }}
                    options={this.getCategoriesOptions()}
                    onChange={(v) => {
                      const { dispatch } = this.props
                      dispatch({
                        type: 'patientHistory/saveUserPreference',
                        payload: {
                          userPreferenceDetails: {
                            SelectCategories: v.filter((o) => o !== -99),
                            Identifier: 'SelectCategories',
                          },
                          itemIdentifier: 'SelectCategories',
                        },
                      })
                    }}
                    {...args}
                  />
                )}
              />
            </div>
            <div style={{ display: 'inline-Block', marginLeft: 5 }}>
              <Field
                name='selectDoctors'
                render={(args) => (
                  <DoctorProfileSelect
                    style={{ width: !isFullScreen ? 150 : 240 }}
                    label='Doctors'
                    mode='multiple'
                    {...args}
                    allValue={-99}
                    allValueOption={{
                      id: -99,
                      clinicianProfile: {
                        name: 'All',
                        isActive: true,
                      },
                    }}
                    labelField='clinicianProfile.name'
                    localFilter={(option) => option.clinicianProfile.isActive}
                  />
                )}
              />
            </div>
            <div style={{ display: 'inline-Block', marginLeft: 5 }}>
              <ProgressButton
                color='primary'
                size='sm'
                icon={<Search />}
                onClick={this.handelSearch}
              >
                Search
              </ProgressButton>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {fromModule !== 'Consultation' && (
            <div
              style={{
                position: 'relative',
                bottom: -8,
              }}
            >
              <div style={{ display: 'inline-Block' }}>
                <Field
                  name='isSelectAll'
                  render={(args) => (
                    <Checkbox
                      onChange={this.selectAllOnChange}
                      {...args}
                      label='Select All'
                    />
                  )}
                />
              </div>
              <div
                style={{
                  display: 'inline-Block',
                  fontWeight: 500,
                }}
              >
                {`(Selected: ${selectItems.length})`}
              </div>
            </div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <div
              style={{
                display: 'inline-Block',
              }}
            >
              <span
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  this.setExpandAll(true)
                }}
              >
                <span
                  className='material-icons'
                  style={{
                    marginTop: 15,
                    fontSize: '1.2rem',
                  }}
                >
                  unfold_more
                </span>
                <span style={{ position: 'relative', top: -5 }}>
                  Expand All
                </span>
              </span>
              <span
                style={{
                  cursor: 'pointer',
                  marginLeft: 20,
                  marginRight: 10,
                }}
                onClick={() => {
                  this.setExpandAll(false)
                }}
              >
                <span
                  className='material-icons'
                  style={{
                    marginTop: 10,
                    fontSize: '1.2rem',
                  }}
                >
                  unfold_less
                </span>
                <span style={{ position: 'relative', top: -5 }}>
                  Collapse All
                </span>
              </span>
            </div>
            {fromModule !== 'Consultation' && (
              <Button
                color='primary'
                icon={null}
                size='sm'
                style={{
                  position: 'relative',
                  bottom: 8,
                  marginLeft: 10,
                }}
                disabled={selectItems.length === 0}
                onClick={this.printHandel}
              >
                <Print />print
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  closeHistoryDetails = () => {
    this.setState({
      showHistoryDetails: false,
      selectHistory: undefined,
    })
    this.props.dispatch({
      type: 'patientHistory/updateState',
      payload: {
        selectedSubRow: undefined,
        entity: undefined,
      },
    })
  }

  handelSearch = () => {
    const { values } = this.props
    const { visitDate, isAllDate, selectDoctors, selectCategories } = values
    this.setState(
      {
        visitDate,
        isAllDate,
        pageIndex: 0,
        loadVisits: [],
        activeKey: [],
        selectItems: [],
        isScrollBottom: false,
        totalVisits: 0,
        selectDoctors,
        selectCategories,
      },
      this.queryVisitHistory,
    )
  }

  handelLoadMore = () => {
    this.queryVisitHistory()
  }

  render () {
    const { clinicSettings, scriblenotes, fromModule } = this.props
    const cfg = {}
    const {
      showHistoryDetails,
      selectHistory,
      activeKey,
      totalVisits,
      pageIndex,
      isScrollBottom,
      loadVisits = [],
      currentHeight,
    } = this.state
    const { settings = [] } = clinicSettings
    const { viewVisitPageSize = 10 } = settings
    const moreData = totalVisits > pageIndex * viewVisitPageSize
    let otherHeight = 0
    if (fromModule === 'PatientDashboard') {
      otherHeight = 320
    } else if (fromModule === 'Consultation') {
      otherHeight = 445
    } else if (fromModule === 'History') {
      otherHeight = 220
    } else if (fromModule === 'PatientHistory') {
      otherHeight = 420
    }
    const visitContentHeight = currentHeight - otherHeight
    return (
      <div {...cfg}>
        <CardContainer hideHeader size='sm'>
          {this.getFilterBar()}
          <div
            ref={(e) => (this.scrollRef = e)}
            style={{
              overflow: 'auto',
              height: visitContentHeight,
            }}
          >
            {loadVisits.length > 0 ? (
              <div>
                <Collapse activeKey={activeKey} expandIconPosition={null}>
                  {loadVisits.map((o) => {
                    return (
                      <Collapse.Panel
                        header={this.getTitle(o)}
                        key={o.currentId}
                        className={customtyles.customPanel}
                      >
                        {this.getDetailPanel(o)}
                      </Collapse.Panel>
                    )
                  })}
                </Collapse>
              </div>
            ) : (
              <p>No Visit Record Found</p>
            )}
          </div>

          <div
            style={{
              display: 'inline-Block',
              float: 'right',
              height: 30,
              paddingTop: 8,
            }}
          >
            {isScrollBottom &&
            moreData && (
              <a
                style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                onClick={this.handelLoadMore}
              >
                Load More
              </a>
            )}
          </div>
        </CardContainer>
        <CommonModal
          open={scriblenotes.showViewScribbleModal}
          title='Scribble'
          fullScreen
          bodyNoPadding
          observe='ScribbleNotePage'
          onClose={this.toggleScribbleModal}
        >
          <ScribbleNote
            {...this.props}
            toggleScribbleModal={this.toggleScribbleModal}
            scribbleData={this.state.selectedData}
          />
        </CommonModal>
        <CommonModal
          open={showHistoryDetails}
          title='History'
          fullScreen
          bodyNoPadding
          keepMounted={false}
          onClose={this.closeHistoryDetails}
        >
          <HistoryDetails
            {...this.props}
            closeHistoryDetails={this.closeHistoryDetails}
            selectHistory={selectHistory}
            scribbleNoteUpdateState={this.scribbleNoteUpdateState}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientHistory)
