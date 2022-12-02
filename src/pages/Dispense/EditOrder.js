import React, { Component } from 'react'
import _ from 'lodash'
import $ from 'jquery'
import { history } from 'umi'
import moment from 'moment'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
// common component
import Warining from '@material-ui/icons/Error'
import {
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
  FastField,
  CodeSelect,
  TextField,
  Checkbox,
  Button,
  ProgressButton,
  CommonModal,
  Accordion,
} from '@/components'
import Yup from '@/utils/yup'
import {
  convertToConsultation,
  isPharmacyOrderUpdated,
} from '@/pages/Consultation/utils'
// utils
import { getAppendUrl } from '@/utils/utils'
import { widgets } from '@/utils/widgets'
import Authorized from '@/utils/Authorized'
import { sendNotification } from '@/utils/realtime'
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  VISIT_TYPE,
} from '@/utils/constants'
import ViewPatientHistory from '@/pages/Consultation/ViewPatientHistory'

const discardConsultation = async ({
  dispatch,
  dispense,
  from = 'Dispense',
  closeEditOrder,
  orders,
}) => {
  try {
    const consultationResult = await dispatch({
      type: 'consultation/discard',
      payload: {
        id: dispense.entity.clinicalObjectRecordFK,
      },
    })
    dispatch({
      type: 'orders/updateState',
      payload: {
        rows: orders._originalRows,
      },
    })
    if (consultationResult) {
      if (from === 'Dispense') {
        await dispatch({
          type: 'dispense/query',
          payload: {
            id: dispense.visitID,
            version: Date.now(),
          },
        })
        dispatch({
          type: `dispense/updateState`,
          payload: {
            editingOrder: false,
          },
        })
      } else if (closeEditOrder) {
        closeEditOrder()
      }
    }
  } catch (error) {
    console.error({ error })
  }
}
const styles = () => ({})
@connect(({ consultation, user, clinicSettings, global }) => ({
  consultation,
  user,
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  mainDivHeight: global.mainDivHeight,
}))
@withFormikExtend({
  authority: ['queue.dispense.editorder'],
  notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: ({ consultation }) => {
    return {
      ...(consultation.entity || consultation.default),
      dummyField: '',
      acknowledged: true,
      dispenseAcknowledgement: {
        editDispenseReasonFK: 1,
      },
    }
  },
  validationSchema: Yup.object().shape({
    dispenseAcknowledgement: Yup.object().shape({
      editDispenseReasonFK: Yup.number().required(),
      remarks: Yup.string().when('editDispenseReasonFK', {
        is: val => val === 2,
        then: Yup.string().required(),
      }),
    }),
  }),
  dirtyCheckMessage: 'Discard edit order?',
  onDirtyDiscard: discardConsultation,
  enableReinitialize: false,
  displayName: 'EditOrder',
})
class EditOrder extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    acknowledged: true,
  }

  componentDidMount() {
    const { setFieldValue, values } = this.props
    setTimeout(() => {
      setFieldValue('fakeField', 'setdirty')
    }, 500)
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: `dispense/updateState`,
      payload: {
        editingOrder: false,
      },
    })
  }

  makePayment = () => {
    const { dispatch, dispense } = this.props
    const { patientInfo } = dispense
    dispatch({
      type: 'dispense/closeDispenseModal',
    })
    const parameters = {
      pid: patientInfo.id,
      vid: dispense.visitID,
    }
    history.push(getAppendUrl(parameters, '/reception/queue/billing'))
  }

  editOrder = () => {
    const { dispatch, dispense } = this.props
    const { location } = history
    const { query } = location
    dispatch({
      type: `consultation/editOrder`,
      payload: {
        id: dispense.visitID,
        queueID: query.qid,
        version: dispense.version,
      },
    }).then(o => {
      if (o) {
        dispatch({
          type: `dispense/updateState`,
          payload: {
            editingOrder: true,
          },
        })
      }
    })
  }

  cancelOrder = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmContent: 'Discard edit order?',
        onConfirmSave: this.handleCancel,
      },
    })
  }

  handleCancel = () => {
    discardConsultation(this.props)
  }

  signOrder = async () => {
    const {
      values,
      validateForm,
      handleSubmit,
      forms,
      clinicSettings,
      user,
      from = 'Dispense',
      closeEditOrder,
    } = this.props
    const isFormValid = await validateForm()
    if (!_.isEmpty(isFormValid)) {
      handleSubmit()
    } else {
      const { consultationDocument, orders, dispatch, dispense } = this.props
      if (orders.summary.totalWithGST < 0) {
        window.g_app._store.dispatch({
          type: 'global/updateAppState',
          payload: {
            openConfirm: true,
            isInformType: true,
            customWidth: 'md',
            openConfirmContent: () => {
              return (
                <div>
                  <Warining
                    style={{
                      width: '1.3rem',
                      height: '1.3rem',
                      marginLeft: '10px',
                      color: 'red',
                    }}
                  />
                  <h3
                    style={{
                      marginLeft: '10px',
                      display: 'inline-block',
                    }}
                  >
                    Unable to save, total amount cannot be{' '}
                    <span style={{ fontWeight: 400 }}>negative</span>.
                  </h3>
                </div>
              )
            },
            openConfirmText: 'OK',
            onConfirmClose: () => {
              window.g_app._store.dispatch({
                type: 'global/updateAppState',
                payload: {
                  customWidth: undefined,
                },
              })
            },
          },
        })
        return
      }

      const payload = convertToConsultation(
        values,
        {
          consultationDocument,
          orders,
          forms,
        },
        true,
      )
      const signResult = await dispatch({
        type: `consultation/signOrder`,
        payload: {
          ...payload,
        },
      })
      if (signResult) {
        const { visitRegistration } = this.props
        const { entity: visit = {} } = visitRegistration
        const { id } = visit
        sendNotification('EditedConsultation', {
          type: NOTIFICATION_TYPE.CONSULTAION,
          status: NOTIFICATION_STATUS.OK,
          message: 'Completed Consultation',
          visitID: id,
        })

        notification.success({
          message: 'Order signed',
        })

        if (from === 'Dispense') {
          dispatch({
            type: `visitRegistration/query`,
            payload: dispense.visitID,
          })
          dispatch({
            type: `dispense/refresh`,
            payload: dispense.visitID,
          })
          dispatch({
            type: `dispense/updateState`,
            payload: {
              editingOrder: false,
              shouldRefreshOrder: false,
            },
          })
        } else if (closeEditOrder) {
          closeEditOrder()
        }
      }
    }
  }

  render() {
    const {
      classes,
      theme,
      values,
      mainDivHeight,
      visitRegistration: {
        entity: {
          visit: { visitPurposeFK },
        },
      },
    } = this.props
    const orderWidget = widgets.find(o => o.id === '5')
    const cdWidget = widgets.find(o => o.id === '3')
    const Order = orderWidget.component
    const ConsultationDocument = cdWidget.component
    const consultationDocumentAccessRight = Authorized.check(
      cdWidget.accessRight,
    )

    const visitRemarks = this.props.visitRegistration?.entity?.visit
      ?.visitRemarks
    const isRetail = visitPurposeFK === VISIT_TYPE.OTC
    return (
      <div>
        <div
          className={classes.content}
          style={{
            height: mainDivHeight - 170,
            overflow: 'auto',
          }}
        >
          <GridContainer>
            <GridItem xs={12} md={6}>
              <GridItem xs={12}>
                <h5>Orders</h5>
                <Order
                  visitRegistration={this.props.visitRegistration}
                  className={classes.orderPanel}
                  status=''
                  from='EditOrder'
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='visitRemarks'
                  render={args => {
                    return (
                      <TextField
                        multiline
                        rowsMax='5'
                        disabled
                        label='Visit Remarks'
                        value={visitRemarks}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              {/* {!isRetail && (
                <GridItem xs={12} md={6}>
                  <FastField
                    name='dispenseAcknowledgement.editDispenseReasonFK'
                    render={args => {
                      return (
                        <CodeSelect
                          label='Reason'
                          code='cteditdispensereasons'
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              )}
              {!isRetail && (
                <GridItem xs={12}>
                  <FastField
                    name='dispenseAcknowledgement.remarks'
                    render={args => {
                      return (
                        <TextField
                          multiline
                          rowsMax='5'
                          label='Remarks'
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              )}
              {!isRetail && (
                <GridItem xs={12}>
                  <FastField
                    name='acknowledged'
                    render={args => {
                      return (
                        <Checkbox
                          onChange={e => {
                            this.setState({
                              acknowledged: e.target.value,
                            })
                          }}
                          label='I hereby confirm the above orders are instructed by the attending physician'
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              )} */}
            </GridItem>
            <GridItem xs={12} md={6}>
              {/* {!isRetail &&
                formAccessRight &&
                formAccessRight.rights !== 'hidden' && (
                  <div>
                    <h5>
                      <span style={{ display: 'inline-block' }}>Forms</span>
                      <span className={classes.cdAddButton}>
                        {cdWidget.toolbarAddon}
                      </span>
                    </h5>
                    <Forms />
                  </div>
                )} */}
              {consultationDocumentAccessRight &&
                consultationDocumentAccessRight.rights !== 'hidden' && (
                  <div>
                    <h5>
                      <span style={{ display: 'inline-block' }}>
                        Consultation Document
                      </span>
                      <span className={classes.cdAddButton}>
                        {cdWidget.toolbarAddon}
                      </span>
                    </h5>
                    <ConsultationDocument forDispense />
                  </div>
                )}
            </GridItem>
          </GridContainer>
          <ViewPatientHistory top='170px' />
        </div>
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <Button color='danger' onClick={this.cancelOrder}>
            Cancel
          </Button>
          <ProgressButton
            color='primary'
            disabled={!this.state.acknowledged}
            onClick={this.signOrder}
          >
            Save
          </ProgressButton>
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EditOrder)
