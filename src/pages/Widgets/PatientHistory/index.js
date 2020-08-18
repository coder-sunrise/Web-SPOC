/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import { Tag, Collapse } from 'antd'
import moment from 'moment'
import Edit from '@material-ui/icons/Edit'
import $ from 'jquery'
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
} from '@/components'
import Authorized from '@/utils/Authorized'
// utils
import { findGetParameter } from '@/utils/utils'
import { VISIT_TYPE } from '@/utils/constants'
import { scribbleTypes } from '@/utils/codes'
import * as WidgetConfig from './config'
import ScribbleNote from '../../Shared/ScribbleNote/ScribbleNote'

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
  }) => ({
    patientHistory,
    clinicSettings,
    codetable,
    user,
    clinicInfo,
    scriblenotes,
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
    const { theme, patientHistory, dispatch, codetable, user } = this.props
    const { location } = window
    const {
      userTitle,
      userName,
      visitDate,
      signOffDate,
      visitPurposeFK,
      timeIn,
      timeOut,
    } = row
    const { patientID } = patientHistory
    const fromConsultation = location.pathname.includes('consultation')
    const isRetailVisit = visitPurposeFK === VISIT_TYPE.RETAIL
    return (
      <div style={{ display: 'flex', fontSize: '0.9em' }}>
        <div style={{ fontWeight: 500 }}>
          {`${moment(visitDate).format('DD MMM YYYY')} (Time In: ${moment(
            timeIn,
          ).format('HH:MM')} Time Out: ${timeOut
            ? moment(timeOut).format('HH:MM')
            : '-'}) - ${userTitle || ''} ${userName}`}
        </div>
        {!isRetailVisit && (
          <div style={{ marginLeft: 'auto' }}>
            <span>
              Update Date:&nbsp;{moment(signOffDate).format(
                'DD MMM YYYY HH:MM',
              )}
            </span>
            {!fromConsultation && (
              <Authorized authority='patientdashboard.editconsultation'>
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
              </Authorized>
            )}
          </div>
        )}
      </div>
    )
  }

  showWidget = (current, widget) => {
    // check show notes
    const notesTypes = WidgetConfig.notesTypes.find(
      (type) => type.value === widget.id,
    )

    if (notesTypes) {
      const { scribbleNotes = [] } = current
      const scribbleType = scribbleTypes.find(
        (o) => o.type === notesTypes.fieldName,
      )
      if (
        !current[notesTypes.fieldName] &&
        (!scribbleType ||
          scribbleNotes.filter(
            (o) => o.scribbleNoteTypeFK === scribbleType.typeFK,
          ).length <= 0)
      )
        return false
    }

    // check show diagnosis
    if (
      widget.id === '12' &&
      (!current.diagnosis || current.diagnosis.length <= 0)
    )
      return false

    // check show eyevisualacuity
    if (
      widget.id === '13' &&
      (!current.eyeVisualAcuityTestForms ||
        current.eyeVisualAcuityTestForms.length <= 0)
    )
      return false

    // check show eyerefractionform
    if (
      widget.id === '16' &&
      (!current.corEyeRefractionForm ||
        JSON.stringify(current.corEyeRefractionForm.formData) === '{}')
    )
      return false

    // check show eyeexaminationform
    if (
      widget.id === '15' &&
      (!current.corEyeExaminationForm ||
        JSON.stringify(current.corEyeExaminationForm.formData) === '{}' ||
        (current.corEyeExaminationForm.formData.EyeExaminations || []).length <=
          0)
    )
      return false

    // check show forms
    if (widget.id === '14' && (!current.forms || current.forms.length <= 0))
      return false
    // check show orders
    if (widget.id === '7' && (!current.orders || current.orders.length <= 0))
      return false
    // check show document
    if (
      widget.id === '20' &&
      (!current.documents || current.documents.length <= 0)
    )
      return false
    // check show DentalChart
    if (
      widget.id === '9' &&
      (!current.dentalChart || current.dentalChart.length <= 0)
    )
      return false
    // check show invoice
    if (widget.id === '8' && !current.invoice) return false

    // check show treatment
    if (
      widget.id === '10' &&
      (!current.orders ||
        current.orders.filter((o) => o.type === 'Treatment').length <= 0)
    )
      return false

    return true
  }

  getDetailPanel = (history) => {
    const { visitPurposeFK } = history
    let currentTagWidgets = this.widgets.filter((_widget) => {
      if (visitPurposeFK === VISIT_TYPE.RETAIL) {
        return (
          _widget.id === WidgetConfig.WIDGETS_ID.INVOICE &&
          this.state.selectTag.children.indexOf(_widget.id) >= 0
        )
      }
      return this.state.selectTag.children.indexOf(_widget.id) >= 0
    })
    let current = history.patientHistoryDetail || {}
    let visitDetails = {
      visitDate: history.visitDate,
      patientName: history.patientName,
      patientAccountNo: history.patientAccountNo,
    }
    return (
      <CardContainer hideHeader size='sm'>
        {currentTagWidgets.map((o) => {
          const Widget = o.component
          if (this.showWidget(current, o))
            return (
              <div>
                <h5 style={{ fontWeight: 500, color: 'darkBlue' }}>{o.name}</h5>
                {Widget ? (
                  <Widget
                    current={current}
                    visitDetails={visitDetails}
                    {...this.props}
                    setFieldValue={this.props.setFieldValue}
                  />
                ) : (
                  ''
                )}
              </div>
            )
          return ''
        })}
      </CardContainer>
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

  getFilterBar = () => {
    const { CheckableTag } = Tag
    return (
      <div style={{ margin: '10px 0' }}>
        {this.getActiveHistoryTags().map((tag) => (
          <CheckableTag
            style={{ padding: '5px 10px' }}
            key={tag.value}
            checked={this.state.selectTag.value === tag.value}
            onChange={(checked) => {
              if (checked) this.setState({ selectTag: tag })
              else this.setState({ selectTag: { children: [] } })
            }}
          >
            {tag.name}
          </CheckableTag>
        ))}
      </div>
    )
  }

  render () {
    const { patientHistory, clinicSettings, scriblenotes } = this.props
    const cfg = {}

    if (!clinicSettings) return null

    let sortedPatientHistory = ''

    sortedPatientHistory = patientHistory.list
      ? patientHistory.list.filter(
          (o) =>
            o.visitPurposeFK === VISIT_TYPE.RETAIL ||
            (o.coHistory && o.coHistory.length >= 1),
        )
      : ''

    return (
      <div {...cfg}>
        <CardContainer hideHeader size='sm'>
          {this.getFilterBar()}
          {sortedPatientHistory ? sortedPatientHistory.length > 0 ? (
            <div>
              <Collapse
                defaultActiveKey={sortedPatientHistory.map((o) => o.id)}
                ghost
              >
                {sortedPatientHistory.map((o) => {
                  return (
                    <Collapse.Panel header={this.getTitle(o)} key={o.id}>
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
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PatientHistory)
