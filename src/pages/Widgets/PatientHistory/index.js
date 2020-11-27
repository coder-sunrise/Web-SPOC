/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import { Collapse } from 'antd'
import moment from 'moment'
import { Edit, Print } from '@material-ui/icons'
import { connect } from 'dva'
import router from 'umi/router'
import { Field } from 'formik'
import Search from '@material-ui/icons/Search'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CardContainer,
  withFormikExtend,
  Skeleton,
  CommonModal,
  Button,
  Tooltip,
  Checkbox,
  ProgressButton,
  CodeSelect,
} from '@/components'
import Authorized from '@/utils/Authorized'
// utils
import { findGetParameter } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'
import { FilterBarDate, DoctorProfileSelect } from '@/components/_medisys'
import * as WidgetConfig from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import HistoryDetails from './HistoryDetails'
import customtyles from './PatientHistoryStyle.less'

const defaultValue = {
  visitFromDate: moment(new Date()).startOf('day').toDate(),
  visitToDate: moment(new Date()).endOf('day').toDate(),
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
    patient,
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
      const accessRight = Authorized.check(o.authority)
      return (
        accessRight &&
        accessRight.rights !== 'hidden' &&
        this.getCategoriesOptions().find((c) => c.value === o.id)
      )
    })

    this.state = {
      selectedData: '',
      showHistoryDetails: false,
      selectHistory: undefined,
      activeKey: [],
      selectItems: [],
      visitFromDate: moment(new Date()).startOf('day').toDate(),
      visitToDate: moment(new Date()).endOf('day').toDate(),
      selectDoctors: [],
      selectCategories: [],
      isAllDate: true,
      pageIndex: 0,
      loadVisits: [],
      isScrollBottom: false,
      totalVisits: 0,
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
      this.queryVisitHistory()
    })
  }

  componentDidMount () {
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

  queryVisitHistory = () => {
    const {
      visitFromDate,
      visitToDate,
      isAllDate,
      pageIndex,
      selectDoctors = [],
    } = this.state
    const { dispatch, clinicSettings, patientHistory } = this.props
    const { settings = [] } = clinicSettings
    const { viewVisitPageSize = 10 } = settings
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
        const currentVisits = [
          ...preState.loadVisits,
          ...r.list,
        ]
        return {
          ...preState,
          loadVisits: currentVisits,
          totalVisits: r.totalVisits,
          pageIndex: preState.pageIndex + 1,
          activeKey: [
            ...preState.activeKey,
            ...r.list.map((o) => o.id),
          ],
        }
      })
    })
  }

  getTitle = (row) => {
    const {
      theme,
      patientHistory,
      dispatch,
      codetable,
      user,
      clinicSettings,
      patient: { entity },
    } = this.props
    const { location } = window
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
    } = row
    const { settings = [] } = clinicSettings
    const { patientID } = patientHistory
    const fromConsultation = location.pathname.includes('consultation')
    const isRetailVisit = visitPurposeFK === VISIT_TYPE.RETAIL
    const patientIsActive = entity && entity.isActive
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
            if (preState.activeKey.find((key) => key === row.id)) {
              return {
                ...preState,
                activeKey: preState.activeKey.filter((key) => key !== row.id),
              }
            }
            return {
              ...preState,
              activeKey: [
                ...preState.activeKey,
                row.id,
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
            <span className='material-icons'>
              {this.state.activeKey.find((key) => key === row.id) ? (
                'expand_more'
              ) : (
                'navigate_next'
              )}
            </span>
          </div>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {patientIsActive &&
            !isRetailVisit &&
            !fromConsultation && (
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
          {settings.showConsultationVersioning &&
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
    const { isFullScreen = true } = this.props
    const { visitPurposeFK } = history
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
      if (visitPurposeFK === VISIT_TYPE.RETAIL) {
        return (
          (_widget.id === WidgetConfig.WIDGETS_ID.INVOICE ||
            _widget.id === WidgetConfig.WIDGETS_ID.VISITREMARKS ||
            _widget.id === WidgetConfig.WIDGETS_ID.REFERRAL ||
            _widget.id === WidgetConfig.WIDGETS_ID.ATTACHMENT) &&
          this.checkSelectWidget(_widget.id) &&
          WidgetConfig.showWidget(current, _widget)
        )
      }
      return (
        this.checkSelectWidget(_widget.id) &&
        WidgetConfig.showWidget(current, _widget)
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
      this.setState({ activeKey: loadVisits.map((o) => o.id) })
    } else {
      this.setState({ activeKey: [] })
    }
  }

  getCategoriesOptions = () => {
    let client = 'Dental'
    let categories = []
    if (client === 'GP') {
      categories = WidgetConfig.GPCategory
    } else if (client === 'Dental') {
      categories = WidgetConfig.DentalCategory
    } else if (client === 'Eye') {
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

  getFilterBar = () => {
    const { values } = this.props
    const { visitFromDate, visitToDate, isAllDate } = values
    const { selectItems } = this.state
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div>
            <div style={{ display: 'inline-Block', width: 120 }}>
              <Field
                name='visitFromDate'
                render={(args) => (
                  <FilterBarDate
                    {...args}
                    label='Visit Date From'
                    formValues={{
                      startDate: visitFromDate,
                      endDate: visitToDate,
                    }}
                    disabled={isAllDate}
                  />
                )}
              />
            </div>
            <div
              style={{ display: 'inline-Block', marginLeft: 10, width: 120 }}
            >
              <Field
                name='visitToDate'
                render={(args) => (
                  <FilterBarDate
                    {...args}
                    label='Visit Date To'
                    isEndDate
                    formValues={{
                      startDate: visitFromDate,
                      endDate: visitToDate,
                    }}
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
            <div style={{ display: 'inline-Block', marginLeft: 5, width: 130 }}>
              <Field
                name='selectCategories'
                render={(args) => (
                  <CodeSelect
                    valueField='value'
                    label='Categories'
                    mode='multiple'
                    options={this.getCategoriesOptions()}
                    {...args}
                  />
                )}
              />
            </div>
            <div
              style={{ display: 'inline-Block', marginLeft: 10, width: 130 }}
            >
              <Field
                name='selectDoctors'
                render={(args) => (
                  <DoctorProfileSelect
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
            <div style={{ display: 'inline-Block', marginLeft: 10 }}>
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
          <div
            style={{
              position: 'relative',
              bottom: -8,
            }}
          >
            <div style={{ display: 'inline-Block' }}>
              <Field
                name='isSelectAll'
                render={(args) => <Checkbox {...args} label='Select All' />}
              />
            </div>
            <div
              style={{
                display: 'inline-Block',
                fontWeight: 500,
              }}
            >
              {`(Select: ${selectItems.length})`}
            </div>
          </div>
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
            <Button
              color='primary'
              icon={null}
              size='sm'
              style={{
                position: 'relative',
                bottom: 8,
              }}
            >
              <Print />print
            </Button>
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
    const {
      visitFromDate,
      visitToDate,
      isAllDate,
      selectDoctors,
      selectCategories,
    } = values
    this.setState(
      {
        visitFromDate,
        visitToDate,
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
    const { clinicSettings, scriblenotes, height } = this.props
    const cfg = {}

    const {
      showHistoryDetails,
      selectHistory,
      activeKey,
      totalVisits,
      pageIndex,
      isScrollBottom,
      loadVisits = [],
    } = this.state
    const { settings = [] } = clinicSettings
    const { viewVisitPageSize = 10 } = settings
    const moreData = totalVisits > pageIndex * viewVisitPageSize
    const ContentHeight = height - 300
    const visitContentHeight = ContentHeight - 30
    return (
      <div {...cfg}>
        <CardContainer hideHeader size='sm'>
          {this.getFilterBar()}
          <div
            ref={(e) => (this.scrollRef = e)}
            style={{
              overflow: 'auto',
              height: 520,
            }}
          >
            {loadVisits.length > 0 ? (
              <div>
                <Collapse activeKey={activeKey} expandIconPosition={null}>
                  {loadVisits.map((o) => {
                    return (
                      <Collapse.Panel
                        header={this.getTitle(o)}
                        key={o.id}
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
          {isScrollBottom &&
          moreData && (
            <div
              style={{
                display: 'inline-Block',
                float: 'right',
              }}
            >
              <a
                style={{ textDecoration: 'underline', fontStyle: 'italic' }}
                onClick={this.handelLoadMore}
              >
                Load More
              </a>
            </div>
          )}
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
