/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import { Tag, Collapse } from 'antd'
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import { connect } from 'dva'
import router from 'umi/router'
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
} from '@/components'
import Authorized from '@/utils/Authorized'
// utils
import { findGetParameter } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'
import * as WidgetConfig from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'
import HistoryDetails from './HistoryDetails'
import customtyles from './PatientHistoryStyle.less'

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
    patientHistory,
    clinicInfo,
    clinicSettings,
    codetable,
    user,
    scriblenotes,
    patient,
  }) => ({
    patientHistory,
    clinicSettings,
    codetable,
    user,
    clinicInfo,
    scriblenotes,
    patient,
  }),
)
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ patientHistory }) => {
    const returnValue = patientHistory.entity
      ? patientHistory.entity
      : patientHistory.default

    return {
      ...returnValue,
      eyeVisualAcuityTestAttachments: (returnValue.eyeVisualAcuityTestAttachments ||
        [])
        .map((eyeAttachment) => eyeAttachment.attachment),
    }
  },
})
class PatientHistory extends Component {
  constructor (props) {
    super(props)
    this.widgets = WidgetConfig.widgets(
      props,
      this.scribbleNoteUpdateState,
    ).filter((o) => {
      const accessRight = Authorized.check(o.authority)
      return accessRight && accessRight.rights !== 'hidden'
    })
    const activeHistoryTags = this.getActiveHistoryTags()

    this.state = {
      selectedData: '',
      selectTag:
        activeHistoryTags.length > 0 ? activeHistoryTags[0] : { children: [] },
      showHistoryDetails: false,
      selectHistory: undefined,
      activeKey: [],
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
      const { patientHistory } = this.props
      let sortedPatientHistory = []

      sortedPatientHistory = patientHistory.list
        ? patientHistory.list.filter(
            (o) =>
              o.visitPurposeFK === VISIT_TYPE.RETAIL ||
              (o.coHistory && o.coHistory.length > 0),
          )
        : []
      this.setState({ activeKey: sortedPatientHistory.map((o) => o.id) })
    })
  }

  getActiveHistoryTags = () => {
    const activeHistoryTags = WidgetConfig.historyTags.filter((o) => {
      const enableAuthority = o.authority.find((a) => {
        const accessRight = Authorized.check(a)
        if (!accessRight || accessRight.rights === 'hidden') return false
        return true
      })

      if (enableAuthority) {
        return true
      }
      return false
    })
    return activeHistoryTags
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
          this.state.selectTag.children.indexOf(_widget.id) >= 0 &&
          WidgetConfig.showWidget(current, _widget)
        )
      }
      return (
        this.state.selectTag.children.indexOf(_widget.id) >= 0 &&
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
    if (isExpandAll) {
      const { patientHistory } = this.props
      let sortedPatientHistory = []

      sortedPatientHistory = patientHistory.list
        ? patientHistory.list.filter(
            (o) =>
              o.visitPurposeFK === VISIT_TYPE.RETAIL ||
              (o.coHistory && o.coHistory.length > 0),
          )
        : []
      this.setState({ activeKey: sortedPatientHistory.map((o) => o.id) })
    } else {
      this.setState({ activeKey: [] })
    }
  }

  getFilterBar = () => {
    const { CheckableTag } = Tag
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ margin: '10px 0' }} className={customtyles.customTag}>
          {this.getActiveHistoryTags().map((tag) => (
            <CheckableTag
              style={{ padding: '5px 10px' }}
              key={tag.value}
              checked={this.state.selectTag.value === tag.value}
              onChange={(checked) => {
                if (checked) this.setState({ selectTag: tag })
                return null
              }}
            >
              {tag.name}
            </CheckableTag>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
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
            <span style={{ position: 'relative', top: -5 }}>Expand All</span>
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
            <span style={{ position: 'relative', top: -5 }}>Collapse All</span>
          </span>
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

  render () {
    const { patientHistory, clinicSettings, scriblenotes } = this.props
    const cfg = {}
    let sortedPatientHistory = []

    sortedPatientHistory = patientHistory.list
      ? patientHistory.list.filter(
          (o) =>
            o.visitPurposeFK === VISIT_TYPE.RETAIL ||
            (o.coHistory && o.coHistory.length > 0),
        )
      : []

    if (!clinicSettings) return null

    const { showHistoryDetails, selectHistory, activeKey } = this.state
    return (
      <div {...cfg}>
        <CardContainer hideHeader size='sm'>
          {this.getFilterBar()}
          {sortedPatientHistory ? sortedPatientHistory.length > 0 ? (
            <div>
              <Collapse activeKey={activeKey} expandIconPosition={null}>
                {sortedPatientHistory.map((o) => {
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
          ) : (
            <React.Fragment>
              <Skeleton height={30} />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} />
              <Skeleton height={30} width='80%' />
              <Skeleton height={30} width='80%' />
            </React.Fragment>
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
