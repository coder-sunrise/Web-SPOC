import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import $ from 'jquery'
import classnames from 'classnames'

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

            history.push(`/reception/queue`)
          }
        })
      },
    },
  })
}

// @skeleton()
@connect(
  ({
    consultation,
    global,
    consultationDocument,
    orders,
    patientDashboard,
  }) => ({
    consultation,
    global,
    consultationDocument,
    orders,
    patientDashboard,
  }),
)
@withFormikExtend({
  mapPropsToValues: ({ consultation = {} }) => {
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
      patientDashboard = {},
      consultation = {},
      orders = {},
      ...resetProps
    } = this.props

    const { entity } = consultation

    const { visitInfo = {} } = patientDashboard
    const { visit = {} } = visitInfo
    const { summary } = orders
    // const { adjustments, total, gst, totalWithGst } = summary
    // console.log('values', values, visit)
    // console.log(currentLayout)

    // console.log(state.currentLayout)
    return (
      <div className={classes.root} ref={this.container}>
        <Banner
          style={{}}
          extraCmt={
            <div
              style={{
                textAlign: 'center',
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
              }}
            >
              <h4 style={{ position: 'relative' }}>
                Total Invoice
                {/* <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={this.showInvoiceAdjustment}>
                        Add Invoice Adjustment
                      </Menu.Item>
                      <Menu.Divider />

                      <Menu.Item>Absorb GST</Menu.Item>
                    </Menu>
                  }
                  trigger={[
                    'click',
                  ]}
                >
                  <IconButton className={classes.iconButton}>
                    <MoreHoriz />
                  </IconButton>
                </Dropdown> */}
                {summary && (
                  <span>
                    &nbsp;:&nbsp;
                    <NumberInput text currency value={summary.totalWithGST} />
                  </span>
                )}
              </h4>

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
            </div>
          }
          {...this.props}
        />
        <AuthorizedContext.Provider
          value={{
            view: {
              name: 'consultation.view',
              rights: values.status === 'Paused' ? 'disable' : 'enable',
            },
            edit: {
              name: 'consultation.edit',
              rights: values.status === 'Paused' ? 'disable' : 'enable',
            },
          }}
        >
          <Layout {...this.props} />
        </AuthorizedContext.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Consultation)
