import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import $ from 'jquery'
import classnames from 'classnames'
import numeral from 'numeral'
import Timer from 'react-compound-timer'

import { Menu, Dropdown } from 'antd'
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
  Popper,
  Fade,
  ClickAwayListener,
  Divider,
  Fab,
  Slide,
  Tooltip,
  Drawer,
} from '@material-ui/core'
import PlayArrow from '@material-ui/icons/PlayArrow'
import Pause from '@material-ui/icons/Pause'
import TimerIcon from '@material-ui/icons/Timer'

import {
  CardContainer,
  TextField,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  NumberFormatter,
  confirm,
  SizeContainer,
  Popconfirm,
  withFormikExtend,
  FastField,
  NumberInput,
  Skeleton,
} from '@/components'
import AuthorizedContext from '@/components/Context/Authorized'

import { consultationDocumentTypes, orderTypes } from '@/utils/codes'
import { getAppendUrl } from '@/utils/utils'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'
// import Test from './Test'
import Layout from './Layout'

import schema from './schema'
import styles from './style'

const saveConsultation = ({
  props,
  action,
  confirmMessage,
  successMessage,
}) => {
  const {
    dispatch,
    values,
    history,
    consultation,
    patientDashboard,
    consultationDocument = {},
    orders = {},
  } = props
  dispatch({
    type: 'global/updateAppState',
    payload: {
      openConfirm: true,
      openConfirmContent: confirmMessage,
      onOpenConfirm: () => {
        const { rows = [] } = consultationDocument
        consultationDocumentTypes.forEach((p) => {
          values[p.prop] = rows.filter((o) => o.type === p.value)
        })

        const { rows: orderRows = [], finalAdjustments = [] } = orders
        values.corOrderAdjustment = finalAdjustments
        orderTypes.forEach((p) => {
          values[p.prop] = (values[p.prop] || [])
            .concat(orderRows.filter((o) => o.type === p.value))
        })
        values.duration = Math.floor(
          Number(sessionStorage.getItem(`${values.id}_consultationTimer`)) || 0,
        )
        dispatch({
          type: `consultation/${action}`,
          payload: values,
        }).then((r) => {
          if (r) {
            if (successMessage) {
              notification.success({
                message: successMessage,
              })
            }
            sessionStorage.removeItem(`${values.id}_consultationTimer`)
            history.push(`/reception/queue`)
          }
        })
      },
    },
  })
}

const getRights = (values) => {
  return {
    view: {
      name: 'consultation.view',
      rights: values.status === 'Paused' ? 'disable' : 'enable',
    },
    edit: {
      name: 'consultation.edit',
      rights: values.status === 'Paused' ? 'disable' : 'enable',
    },
  }
}

// @skeleton()
@connect(
  ({
    consultation,
    global,
    consultationDocument,
    orders,
    patientDashboard,
    visitRegistration,
    formik,
  }) => ({
    consultation,
    global,
    consultationDocument,
    orders,
    patientDashboard,
    visitRegistration,
    formik,
  }),
)
@withFormikExtend({
  authority: {
    view: 'consultation.view',
    edit: 'consultation.edit',
  },
  mapPropsToValues: ({ consultation = {} }) => {
    // console.log('mapPropsToValues', consultation.entity, disabled, reset)
    return consultation.entity || consultation.default
  },
  validationSchema: schema,
  // enableReinitialize: true,

  handleSubmit: (values, { props }) => {
    saveConsultation({
      props: {
        values,
        ...props,
      },
      confirmMessage: 'Confirm sign off current consultation?',
      successMessage: 'Consultation signed',
      action: 'sign',
    })
  },
  displayName: 'ConsultationPage',
})
class Consultation extends PureComponent {
  // constructor (props) {
  //   super(props)
  // }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { global } = nextProps
  //   // console.log(value)
  //   if (global.collapsed !== preState.collapsed) {
  //     return {
  //       collapsed: global.collapsed,
  //       currentLayout: _.cloneDeep(preState.currentLayout),
  //     }
  //   }

  //   return null
  // }

  state = {
    recording: true,
  }

  showInvoiceAdjustment = () => {
    const { theme, ...resetProps } = this.props
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        openAdjustment: true,
        openAdjustmentConfig: {
          showRemark: true,
          defaultValues: {
            initialAmout: 150,
          },
        },
      },
    })
  }

  pauseConsultation = () => {
    saveConsultation({
      props: this.props,
      confirmMessage: 'Confirm pause current consultation?',
      successMessage: 'Consultation paused',
      action: 'pause',
    })
  }

  resumeConsultation = () => {
    const {
      dispatch,
      values,
      history,
      consultation,
      resetForm,
      user,
      patientDashboard,
    } = this.props
    dispatch({
      type: 'consultation/resume',
      payload: consultation.visitID,
    }).then((r) => {
      if (r) {
        notification.success({
          message: 'Consultation resumed',
        })
        history.push(
          getAppendUrl({
            v: Date.now(),
          }),
        )
      }
    })
  }

  discardConsultation = () => {
    const { dispatch, values, history, consultation, resetForm } = this.props
    if (values.id) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: 'Confirm to discard current consultation?',
          onOpenConfirm: () => {
            dispatch({
              type: 'consultation/discard',
              payload: values.id,
            }).then((r) => {
              if (r) {
                history.push(`/reception/queue`)
              }
            })
          },
        },
      })
    }
  }

  getExtraComponent = () => {
    const {
      theme,
      classes,
      values,
      orders = {},
      visitRegistration,
    } = this.props
    const { entity: vistEntity } = visitRegistration
    if (!vistEntity) return null
    const { visit = {} } = vistEntity
    const { summary } = orders
    return (
      <SizeContainer size='sm'>
        <div
          style={{
            textAlign: 'center',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            height: '100%',
          }}
        >
          <GridContainer
            // className={classes.actionPanel}
            direction='column'
            justify='space-evenly'
            alignItems='center'
          >
            {[
              'IN CONS',
              'WAITING',
            ].includes(visit.visitStatus) && (
              <GridItem>
                <h5 style={{ marginTop: -3, fontWeight: 'bold' }}>
                  <Timer
                    initialTime={
                      Number(
                        sessionStorage.getItem(
                          `${values.id}_consultationTimer`,
                        ),
                      ) ||
                      values.duration ||
                      0
                    }
                    direction='forward'
                    startImmediately={this.state.recording}
                  >
                    {({
                      start,
                      resume,
                      pause,
                      stop,
                      reset,
                      getTimerState,
                      getTime,
                    }) => {
                      sessionStorage.setItem(
                        `${values.id}_consultationTimer`,
                        getTime(),
                      )
                      return (
                        <React.Fragment>
                          <TimerIcon
                            style={{
                              height: 17,
                              top: 2,
                              left: -5,
                              position: 'relative',
                            }}
                          />
                          <Timer.Hours
                            formatValue={(value) =>
                              `${numeral(value).format('00')} : `}
                          />
                          <Timer.Minutes
                            formatValue={(value) =>
                              `${numeral(value).format('00')} : `}
                          />
                          <Timer.Seconds
                            formatValue={(value) =>
                              `${numeral(value).format('00')}`}
                          />

                          {/* {!this.state.recording && (
                    <IconButton
                      style={{ padding: 0, top: -1, right: -6 }}
                      onClick={() => {
                        resume()
                        this.setState({
                          recording: true,
                        })
                      }}
                    >
                      <PlayArrow />
                    </IconButton>
                  )}
                  {this.state.recording && (
                    <IconButton
                      style={{ padding: 0, top: -1, right: -6 }}
                      onClick={() => {
                        pause()
                        this.setState({
                          recording: false,
                        })
                      }}
                    >
                      <Pause />
                    </IconButton>
                  )} */}
                        </React.Fragment>
                      )
                    }}
                  </Timer>
                </h5>
              </GridItem>
            )}
            <GridItem>
              <h4 style={{ position: 'relative', marginTop: 0 }}>
                Total Invoice
                {summary && (
                  <span>
                    &nbsp;:&nbsp;
                    <NumberInput text currency value={summary.totalWithGST} />
                  </span>
                )}
              </h4>
            </GridItem>
            <GridItem>
              {values.status !== 'Paused' && (
                <ProgressButton
                  color='danger'
                  onClick={this.discardConsultation}
                >
                  Discard
                </ProgressButton>
              )}
              {values.status !== 'Paused' &&
              [
                'IN CONS',
                'WAITING',
              ].includes(visit.visitStatus) && (
                <ProgressButton
                  onClick={this.pauseConsultation}
                  color='info'
                  icon={null}
                >
                  Pause
                </ProgressButton>
              )}
              {values.status === 'Paused' && (
                <ProgressButton
                  onClick={this.resumeConsultation}
                  color='info'
                  icon={null}
                >
                  Resume
                </ProgressButton>
              )}
              <ProgressButton
                color='primary'
                onClick={this.props.handleSubmit}
                icon={null}
              >
                Sign Off
              </ProgressButton>
            </GridItem>
          </GridContainer>
        </div>
      </SizeContainer>
    )
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('UNSAFE_componentWillReceiveProps', this.props, nextProps)
    // console.log(
    //   nextProps.consultation,
    //   nextProps.consultation.consultationID,
    //   this.props.consultation.consultationID !==
    //     nextProps.consultation.consultationID,
    // )
    if (
      nextProps.consultation &&
      nextProps.consultation.entity &&
      nextProps.consultation.entity.concurrencyToken !==
        nextProps.values.concurrencyToken
    ) {
      nextProps.resetForm(nextProps.consultation.entity)
    }
  }

  render () {
    const { props, state } = this
    const {
      history,
      classes,
      theme,
      dispatch,
      values,
      visitRegistration,
      patientDashboard = {},
      consultation = {},
      orders = {},
      formik,
      ...resetProps
    } = this.props

    const { entity } = consultation
    const { entity: vistEntity } = visitRegistration
    if (!vistEntity) return null
    const { visit = {} } = vistEntity
    const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    // console.log('values', values, this.props)
    // console.log(currentLayout)

    // console.log(state.currentLayout)
    return (
      <div className={classes.root} ref={this.container}>
        <Banner
          style={{}}
          extraCmt={this.getExtraComponent()}
          {...this.props}
        />
        <Layout {...this.props} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Consultation)
