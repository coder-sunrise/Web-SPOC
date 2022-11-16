import React, { Component } from 'react'
import { Collapse } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { Edit, Print } from '@material-ui/icons'
import SvgIcon from '@material-ui/core/SvgIcon'
import { connect } from 'dva'
import { history, formatMessage } from 'umi'
import { InvoiceReplacement } from '@/components/Icon/customIcons'
import { Field } from 'formik'
import numeral from 'numeral'
import Search from '@material-ui/icons/Search'
import { VisitTypeTag } from '@/components/_medisys'
import { withStyles, Link } from '@material-ui/core'
import { Tooltip } from '@/components'
import {
  CardContainer,
  withFormikExtend,
  CommonModal,
  Button,
  Checkbox,
  ProgressButton,
  CodeSelect,
  DateRangePicker,
  VisitTypeSelect,
  dateFormatLong,
  dateFormatLongWithTimeNoSec,
  timeFormat24Hour,
  Switch,
} from '@/components'
import Authorized from '@/utils/Authorized'
// utils
import {
  findGetParameter,
  commonDataReaderTransform,
  getDefaultLayerContent,
} from '@/utils/utils'
import { VISIT_TYPE, CLINIC_TYPE } from '@/utils/constants'
import { scribbleTypes } from '@/utils/codes'
import { DoctorProfileSelect } from '@/components/_medisys'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getReportContext } from '@/services/report'
import { getFileContentByFileID } from '@/services/file'
import * as WidgetConfig from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import HistoryDetails from './HistoryDetails'
import customtyles from './PatientHistoryStyle.less'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const defaultValue = {
  visitDate: [
    moment(new Date())
      .startOf('day')
      .toDate(),
    moment(new Date())
      .endOf('day')
      .toDate(),
  ],
  selectDoctors: [],
  visitTypeIDs: [-99],
  selectCategories: [],
  isAllDate: true,
  notesBy: 'Optometrist',
}

const styles = theme => ({
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
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
    lineHeight: '16px',
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
    global,
  }) => ({
    clinicSettings,
    codetable,
    user,
    clinicInfo,
    scriblenotes,
    patient: patient.entity || patient.default,
    patientHistory,
    global,
  }),
)
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    ...defaultValue,
  }),
})
class PatientHistory extends Component {
  constructor(props) {
    super(props)
    this.widgets = WidgetConfig.widgets(
      props,
      this.scribbleNoteUpdateState,
    ).filter(o => {
      return (
        o.id === WidgetConfig.WIDGETS_ID.ClINICALNOTES ||
        this.getCategoriesOptions().find(c => c.value === o.id)
      )
    })

    this.state = {
      selectedData: '',
      showHistoryDetails: false,
      selectHistory: undefined,
      activeKey: [],
      visitDate: [
        moment(new Date())
          .startOf('day')
          .toDate(),
        moment(new Date())
          .endOf('day')
          .toDate(),
      ],
      selectDoctors: [],
      selectCategories: [],
      visitTypeIDs: [],
      isAllDate: true,
      pageIndex: 0,
      loadVisits: [],
      totalVisits: 0,
      currentHeight: window.innerHeight,
      isLoadingData: undefined,
      notesBy: 'Optometrist',
    }
  }

  componentWillMount() {
    const { dispatch } = this.props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: { code: 'ctcomplication' },
    })

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
      }).then(result => {
        const { setFieldValue, clinicSettings } = this.props
        let selectCategories = [
          -99,
          ...this.getCategoriesOptions().map(o => o.value),
        ]
        if (result) {
          selectCategories = result
            .find(xx => xx.Identifier === 'SelectCategories')
            .SelectCategories.filter(o => selectCategories.find(c => c === o))
          let preferVisitTypeIDs =
            result.find(tt => tt.Identifier === 'SelectedVisitTypeIDs')
              ?.SelectedVisitTypeIDs || []

          const visitTypeSetting = JSON.parse(
            clinicSettings.settings.visitTypeSetting,
          )
          preferVisitTypeIDs = _.intersection(
            preferVisitTypeIDs,
            visitTypeSetting.filter(x => x.isEnabled === 'true').map(x => x.id),
          )
          this.setState({ visitTypeIDs: preferVisitTypeIDs }, () => {
            setFieldValue('visitTypeIDs', preferVisitTypeIDs)
          })
        }
        this.setState({ selectCategories }, () => {
          setFieldValue('selectCategories', selectCategories)
        })
        this.queryVisitHistory()
      })
    })
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({ currentHeight: window.innerHeight })
    })
  }

  getCategoriesOptions = () => {
    return WidgetConfig.categoryTypes
      .filter(o => {
        const accessRight = Authorized.check(o.authority)
        if (!accessRight || accessRight.rights === 'hidden') return false
        return true
      })
      .map(o => ({ ...o }))
  }

  queryVisitHistory = pageSize => {
    const {
      isAllDate,
      pageIndex,
      selectDoctors = [],
      visitDate,
      visitTypeIDs = [],
      selectCategories = [],
      notesBy,
    } = this.state
    const {
      dispatch,
      clinicSettings,
      patientHistory,
      setFieldValue,
      values,
      user,
    } = this.props
    const isStudent =
      user.data.clinicianProfile?.userProfile?.role?.clinicRoleFK === 3
    const { settings = {} } = clinicSettings
    const { viewVisitPageSize = 10 } = settings

    let visitFromDate
    let visitToDate
    if (visitDate && visitDate.length > 0) {
      visitFromDate = visitDate[0]
    }

    if (visitDate && visitDate.length > 1) {
      visitToDate = visitDate[1]
    }
    let searchCategories
    if (!selectCategories.length) {
      searchCategories = this.getCategoriesOptions()
        .map(v => v.value)
        .join(',')
    } else {
      searchCategories = selectCategories.join(',')
    }
    dispatch({
      type: 'patientHistory/queryVisitHistory',
      payload: {
        visitFromDate: visitFromDate
          ? moment(visitFromDate)
              .startOf('day')
              .formatUTC()
          : undefined,
        visitToDate: visitToDate
          ? moment(visitToDate)
              .endOf('day')
              .formatUTC(false)
          : undefined,
        isAllDate,
        notesBy: isStudent ? 'Student' : notesBy,
        visitTypeIDs: visitTypeIDs.join(','),
        pageIndex: pageIndex + 1,
        pageSize: pageSize || viewVisitPageSize,
        patientProfileId: patientHistory.patientID,
        selectDoctors: selectDoctors.join(','),
        searchCategories,
        isViewNurseNote:
          selectCategories.length === 0 ||
          !_.isEmpty(
            selectCategories.find(
              o => o === WidgetConfig.WIDGETS_ID.NURSENOTES,
            ),
          ),
      },
    }).then(r => {
      if (r) {
        this.setState(preState => {
          const list = (r.list || []).map(o => {
            return {
              ...o,
              currentId: `${o.isNurseNote ? 'NurseNote' : 'Visit'}-${o.id}`,
            }
          })
          const currentVisits = [...preState.loadVisits, ...list]
          return {
            ...preState,
            loadVisits: currentVisits,
            totalVisits: r.totalVisits,
            pageIndex: preState.pageIndex + 1,
            activeKey: [...preState.activeKey, ...list.map(o => o.currentId)],
            isLoadingData: false,
          }
        })
      }
    })
  }

  showEditButton = (visitStatus, doctorProfileFK, isClinicSessionClosed) => {
    const { notesBy, user } = this.props
    const clinicRoleFK =
      user.data.clinicianProfile?.userProfile?.role?.clinicRoleFK
    if (clinicRoleFK === 1 && notesBy === 'Optometrist') {
      if (
        (visitStatus === VISIT_STATUS.UNGRADED ||
          visitStatus === VISIT_STATUS.VERIFIED) &&
        doctorProfileFK === user.data.clinicianProfile.doctorProfile.id
      )
        return true
    }
    if (clinicRoleFK === 3) {
      if (
        visitStatus === VISIT_STATUS.IN_CONS ||
        ((visitStatus === VISIT_STATUS.UNGRADED ||
          visitStatus === VISIT_STATUS.VERIFIED) &&
          isClinicSessionClosed)
      )
        return true
    }

    return false
  }

  getTitle = row => {
    const {
      theme,
      patientHistory,
      dispatch,
      codetable,
      user,
      clinicSettings,
      patient = {},
      fromModule,
      global,
    } = this.props
    const {
      userTitle,
      userName,
      visitDate,
      signOffDate,
      visitPurposeFK,
      timeIn,
      timeOut,
      isForInvoiceReplacement,
      visitPurposeName,
      coHistory = [],
      isNurseNote,
      visitStatus,
      isExistsVerifiedReport,
      doctorProfileFK,
      isClinicSessionClosed,
      doctors = [],
      signOffByUser,
    } = row
    const clinicRoleFK =
      user.data.clinicianProfile.userProfile.role?.clinicRoleFK
    const { settings = [] } = clinicSettings
    const { patientID, ableToEditConsultation } = patientHistory
    const patientIsActive = patient.isActive
    const docotrName = userName
      ? `${userTitle || ''} ${userName || ''}`
      : undefined
    const student = doctors.find(doctor => !doctor.isPrimaryDoctor)
    const optometrist = doctors.find(doctor => doctor.isPrimaryDoctor)
    return (
      <div
        style={{
          padding: '5px 0px 4px 0px',
          height: 40,
        }}
        onClick={() => {
          this.setState(preState => {
            if (preState.activeKey.find(key => key === row.currentId)) {
              return {
                ...preState,
                activeKey: preState.activeKey.filter(
                  key => key !== row.currentId,
                ),
              }
            }
            return {
              ...preState,
              activeKey: [...preState.activeKey, row.currentId],
            }
          })
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: fromModule !== 'Consultation' ? -14 : 0,
            }}
          >
            <span
              className='material-icons'
              style={{ position: 'relative', top: 3 }}
            >
              {this.state.activeKey.find(key => key === row.currentId)
                ? 'expand_more'
                : 'navigate_next'}
            </span>
          </div>
          {isNurseNote && (
            <div style={{ fontSize: '0.9em', fontWeight: 500, marginTop: 14 }}>
              {`${moment(visitDate).format(
                dateFormatLongWithTimeNoSec,
              )} - Notes${docotrName ? ` - ${docotrName}` : ''}`}
            </div>
          )}
          {!isNurseNote && (
            <div style={{ fontSize: '0.9em' }}>
              <div style={{ fontWeight: 500, marginTop: 6 }}>
                {`${moment(visitDate).format(dateFormatLong)} (${
                  student ? `Student: ${student.name}, ` : ''
                }${optometrist ? `Optometrist: ${optometrist.name}` : ''})`}
              </div>
              <div style={{ marginTop: 18 }}>
                <span>
                  {`Last Update By: ${signOffByUser || ''} on ${moment(
                    signOffDate,
                  ).format(dateFormatLongWithTimeNoSec)}`}
                </span>
              </div>
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
                this.showEditButton(
                  visitStatus,
                  doctorProfileFK,
                  isClinicSessionClosed,
                ) &&
                fromModule !== 'Consultation' &&
                fromModule !== 'History' &&
                ableToEditConsultation && (
                  <Authorized authority='patientdashboard.editconsultation'>
                    <Tooltip title='Edit Consultation'>
                      <Button
                        color='primary'
                        style={{
                          marginLeft: theme.spacing(2),
                          position: 'relative',
                          top: 3,
                        }}
                        size='sm'
                        justIcon
                        disabled={
                          clinicRoleFK === CLINICAL_ROLE.STUDENT &&
                          (visitStatus === VISIT_STATUS.UPGRADED ||
                            visitStatus === VISIT_STATUS.VERIFIED)
                        }
                        onClick={event => {
                          event.stopPropagation()
                          const closeOtherPopup = () => {
                            if (global.showVisitRegistration) {
                              dispatch({
                                type: 'visitRegistration/closeModal',
                              })
                            }
                            dispatch({
                              type: 'patient/closePatientModal',
                            })
                          }

                          dispatch({
                            type: `consultation/edit`,
                            payload: {
                              id: row.id,
                              version: patientHistory.version,
                            },
                          }).then(o => {
                            if (o) {
                              if (o.updateByUserFK !== user.data.id) {
                                const { clinicianprofile = [] } = codetable
                                const version = Date.now()
                                const editingUser = clinicianprofile.find(
                                  m => m.userProfileFK === o.updateByUserFK,
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
                                      }).then(c => {
                                        closeOtherPopup()
                                        history.push(
                                          `/reception/queue/consultation?qid=${row.queueFK}&pid=${patientID}&cid=${c.id}&v=${version}`,
                                        )
                                      })
                                    },
                                  },
                                })
                              } else {
                                closeOtherPopup()
                                history.push(
                                  `/reception/queue/consultation?qid=${
                                    row.queueFK
                                  }&pid=${patientID}&cid=${
                                    o.id
                                  }&v=${patientHistory.version || Date.now()}`,
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
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <div style={{ display: 'inline-block', width: 40, marginRight: 10 }}>
            {visitPurposeFK && <VisitTypeTag type={visitPurposeFK} />}
          </div>
          <div
            style={{
              display: 'inline-block',
              width: 24,
              position: 'relative',
              top: 8,
              height: 24,
              marginRight: 6,
            }}
          >
            {!isNurseNote &&
              settings.showConsultationVersioning &&
              (visitStatus === VISIT_STATUS.UNGRADED ||
                visitStatus === VISIT_STATUS.VERIFIED) && (
                <Tooltip title='View History'>
                  <span
                    className='material-icons'
                    style={{ color: 'gray' }}
                    onClick={event => {
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
              )}
          </div>
        </div>
      </div>
    )
  }

  checkSelectWidget = widgetId => {
    if (widgetId === WidgetConfig.WIDGETS_ID.ClINICALNOTES) {
      return true
    }
    const { selectCategories = [] } = this.state
    if (selectCategories.length > 0) {
      return selectCategories.find(c => c === widgetId) || false
    }
    return true
  }

  getDetailPanel = history => {
    const { isFullScreen = true, classes, clinicSettings } = this.props
    const { selectCategories = [] } = this.state
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
            Notes
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
      visitRemarks: history.visitRemarks,
      visitPurposeFK: history.visitPurposeFK,
    }
    let visitDetails = {
      visitDate: history.visitDate,
      patientName: history.patientName,
      patientAccountNo: history.patientAccountNo,
    }
    let currentTagWidgets = this.widgets.filter(_widget => {
      return this.checkShowData(
        _widget.id,
        current,
        visitPurposeFK,
        isNurseNote,
      )
    })

    const { settings = {} } = clinicSettings
    const isShowContent = currentTagWidgets.length > 0

    return (
      <div
        style={{
          padding: 10,
        }}
      >
        {isShowContent ? (
          <div>
            {currentTagWidgets.map(o => {
              const Widget = o.component
              let selectForms = []
              if (o.id === WidgetConfig.WIDGETS_ID.ClINICALNOTES) {
                selectForms =
                  selectCategories.length === 0
                    ? WidgetConfig.formWidgets().map(fw => fw.id)
                    : WidgetConfig.formWidgets()
                        .filter(fw => selectCategories.indexOf(fw.id) >= 0)
                        .map(fw => fw.id)
              }
              return (
                <div>
                  <span
                    style={{
                      fontWeight: 500,
                      color: 'darkBlue',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span>{o.name}</span>
                  </span>
                  {Widget ? (
                    <Widget
                      current={current}
                      visitDetails={visitDetails}
                      {...this.props}
                      setFieldValue={this.props.setFieldValue}
                      isFullScreen={isFullScreen}
                      selectForms={selectForms}
                    />
                  ) : (
                    ''
                  )}
                </div>
              )
            })}
          </div>
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
        cavanSize: undefined,
      },
    })
  }

  scribbleNoteUpdateState = async (
    selectedDataValue,
    defaultImage,
    cavanSize,
    imageSize,
    position,
    defaultSubject,
  ) => {
    let scribbleNote = selectedDataValue
    if (!scribbleNote) {
      const layerContent = await getDefaultLayerContent(
        defaultImage,
        imageSize,
        position,
      )
      scribbleNote = {
        subject: defaultSubject,
        scribbleNoteLayers: [
          { layerType: 'image', layerNumber: -100, layerContent },
        ],
      }
    }
    this.setState(
      {
        selectedData: scribbleNote,
      },
      () => {
        this.props.dispatch({
          type: 'scriblenotes/updateState',
          payload: {
            showViewScribbleModal: true,
            isReadonly: true,
            entity: { ...scribbleNote },
            cavanSize,
          },
        })
      },
    )
  }

  setExpandAll = (isExpandAll = false) => {
    const { loadVisits } = this.state
    if (isExpandAll) {
      this.setState({ activeKey: loadVisits.map(o => o.currentId) })
    } else {
      this.setState({ activeKey: [] })
    }
  }

  checkShowData = (widgetId, current, visitPurposeFK, isNurseNote) => {
    const { selectCategories = [] } = this.state
    if (isNurseNote) return false
    if (visitPurposeFK === VISIT_TYPE.OTC) {
      return (
        (widgetId === WidgetConfig.WIDGETS_ID.ORDERS ||
          widgetId === WidgetConfig.WIDGETS_ID.INVOICE ||
          widgetId === WidgetConfig.WIDGETS_ID.VISITREMARKS) &&
        this.checkSelectWidget(widgetId) &&
        WidgetConfig.showWidget(current, widgetId)
      )
    }
    return (
      this.checkSelectWidget(widgetId) &&
      WidgetConfig.showWidget(
        current,
        widgetId,
        selectCategories.length === 0
          ? WidgetConfig.formWidgets()
          : WidgetConfig.formWidgets().filter(
              fw => selectCategories.indexOf(fw.id) >= 0,
            ),
      )
    )
  }

  getFilterBar = () => {
    const { values, fromModule, user } = this.props
    const isStudent =
      user.data.clinicianProfile?.userProfile?.role?.clinicRoleFK === 3
    const { isAllDate } = values
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <Field
              name='visitTypeIDs'
              render={args => (
                <VisitTypeSelect
                  label='Visit Type'
                  mode='multiple'
                  maxTagPlaceholder='Visit Types'
                  style={{
                    width: 200,
                    display: 'inline-Block',
                    marginBottom: -12,
                  }}
                  {...args}
                  allowClear={true}
                />
              )}
            />
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 10,
                position: 'relative',
                top: fromModule === 'PatientHistory' ? '-4px' : '0px',
              }}
            >
              <Field
                name='visitDate'
                render={args => (
                  <DateRangePicker
                    style={{
                      width: 300,
                    }}
                    label='Visit Date From'
                    label2='To'
                    {...args}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 10,
              }}
            >
              <Field
                name='isAllDate'
                render={args => (
                  <Checkbox
                    {...args}
                    label='All Date'
                    style={{ width: fromModule === 'PatientHistory' ? 75 : 80 }}
                  />
                )}
              />
            </div>
            <Field
              name='selectCategories'
              render={args => (
                <CodeSelect
                  valueField='value'
                  label='Categories'
                  mode='multiple'
                  maxTagCount={0}
                  style={{
                    width: 240,
                    display: 'inline-Block',
                    marginBottom: -12,
                    marginLeft: 10,
                  }}
                  options={this.getCategoriesOptions()}
                  groupField='title'
                  listHeight={576}
                  virtual={false}
                  {...args}
                />
              )}
            />
            <Field
              name='selectDoctors'
              render={args => (
                <DoctorProfileSelect
                  style={{
                    width: 240,
                    display: 'inline-Block',
                    marginLeft: 10,
                    marginBottom: -12,
                  }}
                  mode='multiple'
                  {...args}
                  maxTagCount={0}
                  allValue={-99}
                  allValueOption={{
                    id: -99,
                    clinicianProfile: {
                      name: 'All',
                      isActive: true,
                    },
                  }}
                  labelField='clinicianProfile.name'
                  localFilter={option => option.clinicianProfile.isActive}
                />
              )}
            />
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 10,
                position: 'relative',
                top: '-5px',
              }}
            >
              <ProgressButton
                color='primary'
                size='sm'
                icon={<Search />}
                justIcon
                onClick={this.handelSearch}
              >
                Search
              </ProgressButton>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {!isStudent && (
            <div style={{ position: 'relative', top: 10, marginRight: 4 }}>
              Notes By:
            </div>
          )}
          {!isStudent && (
            <Field
              name='notesBy'
              render={args => (
                <Switch
                  style={{ width: 200, position: 'relative', top: 0 }}
                  checkedChildren='Optom.'
                  checkedValue='Optometrist'
                  unCheckedChildren='Student'
                  unCheckedValue='Student'
                  label=''
                  onChange={this.onNotesByChange}
                  {...args}
                />
              )}
            />
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
                    marginTop: 10,
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
          </div>
        </div>
      </div>
    )
  }

  getConsultationFilterBar = () => {
    const { values, isFullScreen = true, user } = this.props
    const isStudent =
      user.data.clinicianProfile?.userProfile?.role?.clinicRoleFK === 3
    const { isAllDate } = values
    return (
      <div>
        <div style={{ display: 'flex', marginBottom: isFullScreen ? 10 : 0 }}>
          <div>
            <Field
              name='visitTypeIDs'
              render={args => (
                <VisitTypeSelect
                  label='Visit Types'
                  mode='multiple'
                  maxTagPlaceholder='Visit Types'
                  style={{
                    width: !isFullScreen ? 160 : 240,
                    display: 'inline-Block',
                    marginBottom: -12,
                  }}
                  {...args}
                  allowClear={true}
                />
              )}
            />
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 4,
              }}
            >
              <Field
                name='visitDate'
                render={args => (
                  <DateRangePicker
                    style={{
                      width: !isFullScreen ? 210 : 300,
                    }}
                    label='Visit Date From'
                    label2='To'
                    {...args}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 4,
              }}
            >
              <Field
                name='isAllDate'
                render={args => (
                  <Checkbox {...args} label='All Date' style={{ width: 70 }} />
                )}
              />
            </div>
            <Field
              name='selectCategories'
              render={args => (
                <CodeSelect
                  valueField='value'
                  label='Categories'
                  mode='multiple'
                  style={{
                    width: !isFullScreen ? 150 : 240,
                    display: 'inline-Block',
                    marginLeft: 4,
                    marginBottom: -12,
                  }}
                  options={this.getCategoriesOptions()}
                  groupField='title'
                  listHeight={576}
                  virtual={false}
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: 220 }}
                  {...args}
                />
              )}
            />
            <Field
              name='selectDoctors'
              render={args => (
                <DoctorProfileSelect
                  style={{
                    width: !isFullScreen ? 150 : 240,
                    display: 'inline-Block',
                    marginLeft: 4,
                    marginBottom: -12,
                  }}
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
                  localFilter={option => option.clinicianProfile.isActive}
                />
              )}
            />
            <div
              style={{
                display: 'inline-Block',
                marginLeft: 4,
                position: 'relative',
                top: '-5px',
                lineHeight: '46px',
              }}
            >
              <ProgressButton
                color='primary'
                size='sm'
                icon={<Search />}
                justIcon
                onClick={this.handelSearch}
              >
                Search
              </ProgressButton>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {!isStudent && (
            <div style={{ position: 'relative', top: 7, marginRight: 4 }}>
              Notes By:
            </div>
          )}
          {!isStudent && (
            <Field
              name='notesBy'
              render={args => (
                <Switch
                  style={{ width: 200, position: 'relative', top: 2 }}
                  checkedChildren='Optom.'
                  checkedValue='Optometrist'
                  unCheckedChildren='Student'
                  unCheckedValue='Student'
                  onChange={this.onNotesByChange}
                  label=''
                  {...args}
                />
              )}
            />
          )}
          <div style={{ marginLeft: 'auto' }}>
            <div>
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
                    marginTop: 10,
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
    const { values, dispatch, patientHistory } = this.props
    const {
      visitDate,
      isAllDate,
      selectDoctors,
      selectCategories,
      visitTypeIDs,
      notesBy,
    } = values
    this.setState(
      {
        visitDate,
        isAllDate,
        pageIndex: 0,
        loadVisits: [],
        activeKey: [],
        totalVisits: 0,
        selectDoctors,
        visitTypeIDs,
        selectCategories,
        notesBy,
        isLoadingData: true,
      },
      () => {
        const currentSelectCategories = selectCategories.filter(o => o !== -99)
        const currentSelectVisitTypeIds = visitTypeIDs.filter(o => o !== -99)
        const newPreference = [
          {
            SelectCategories: currentSelectCategories || [],
            Identifier: 'SelectCategories',
          },
          {
            SelectedVisitTypeIDs: visitTypeIDs || [],
            Identifier: 'SelectedVisitTypeIDs',
          },
        ]
        if (!_.isEqual(patientHistory.preference, newPreference)) {
          dispatch({
            type: 'patientHistory/saveUserPreference',
            payload: {
              List: [
                {
                  userPreferenceDetails: JSON.stringify({
                    SelectCategories: currentSelectCategories || [],
                    Identifier: 'SelectCategories',
                  }),
                  type: 5,
                  itemIdentifier: 'SelectCategories',
                },
                {
                  userPreferenceDetails: JSON.stringify({
                    SelectedVisitTypeIDs: visitTypeIDs || [],
                    Identifier: 'SelectedVisitTypeIDs',
                  }),
                  type: 5,
                  itemIdentifier: 'SelectedVisitTypeIDs',
                },
              ],
            },
          }).then(r => {
            if (r) {
              dispatch({
                type: 'patientHistory/updateState',
                payload: { preference: newPreference },
              })
            }
          })
        }
        this.queryVisitHistory()
      },
    )
  }

  onNotesByChange = v => {
    this.setState(
      {
        pageIndex: 0,
        loadVisits: [],
        activeKey: [],
        totalVisits: 0,
        notesBy: v,
        isLoadingData: true,
      },
      this.queryVisitHistory,
    )
  }

  handelLoadMore = () => {
    this.queryVisitHistory()
  }

  render() {
    const { clinicSettings, scriblenotes, fromModule, height } = this.props
    const cfg = {}
    const {
      showHistoryDetails,
      selectHistory,
      activeKey,
      totalVisits,
      pageIndex,
      loadVisits = [],
      currentHeight,
      isLoadingData,
    } = this.state
    const { settings = {} } = clinicSettings
    const { viewVisitPageSize = 10 } = settings
    const moreData = totalVisits > pageIndex * viewVisitPageSize
    let otherHeight = 0
    if (fromModule === 'PatientDashboard') {
      otherHeight = 290
    } else if (fromModule === 'Consultation') {
      otherHeight = 415
    } else if (fromModule === 'History') {
      otherHeight = 190
    } else if (fromModule === 'PatientHistory') {
      otherHeight = 390
    }
    let visitContentHeight = currentHeight - otherHeight

    return (
      <div {...cfg}>
        <CardContainer hideHeader size='sm'>
          {fromModule === 'Consultation'
            ? this.getConsultationFilterBar()
            : this.getFilterBar()}
          <div
            style={{
              overflow: 'auto',
              height: visitContentHeight,
            }}
          >
            {loadVisits.length > 0 ? (
              <div>
                <Collapse
                  style={{ border: 0 }}
                  activeKey={activeKey}
                  expandIconPosition={null}
                >
                  {loadVisits.map(o => {
                    return (
                      <Collapse.Panel
                        header={this.getTitle(o)}
                        key={o.currentId}
                        style={{ border: '1px solid #d9d9d9', borderRadius: 5 }}
                        className={customtyles.customPanel}
                      >
                        {this.getDetailPanel(o)}
                      </Collapse.Panel>
                    )
                  })}
                </Collapse>
              </div>
            ) : (
              <p>
                {isLoadingData
                  ? 'Loading'
                  : isLoadingData === undefined
                  ? ''
                  : 'No Visit Record Found'}
              </p>
            )}
            <div
              style={{
                display: 'inline-Block',
                float: 'right',
                height: 30,
                paddingTop: 8,
                marginRight: 10,
              }}
            >
              {moreData && (
                <a
                  style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                  onClick={this.handelLoadMore}
                >
                  Load More
                </a>
              )}
            </div>
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
            getCategoriesOptions={this.getCategoriesOptions}
          />
        </CommonModal>
      </div>
    )
  }
}

export default withWebSocket()(
  withStyles(styles, { withTheme: true })(PatientHistory),
)
