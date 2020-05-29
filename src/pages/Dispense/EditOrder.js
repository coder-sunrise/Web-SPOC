import React, { Component } from 'react'
import _ from 'lodash'
import router from 'umi/router'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
// common component
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
} from '@/components'
import Yup from '@/utils/yup'
import { convertToConsultation } from '@/pages/Consultation/utils'
// utils
import { getAppendUrl } from '@/utils/utils'
import { widgets } from '@/utils/widgets'
import Authorized from '@/utils/Authorized'

const discardConsultation = async ({ dispatch, dispense }) => {
  try {
    const consultationResult = await dispatch({
      type: 'consultation/discard',
      payload: dispense.entity.clinicalObjectRecordFK,
    })
    if (consultationResult) {
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
    }
  } catch (error) {
    console.error({ error })
  }
}
const styles = () => ({})
// @Authorized.Secured('queue.dispense.editorder')
@connect(({ consultation }) => ({
  consultation,
}))
@withFormikExtend({
  authority: [
    'queue.dispense.editorder',
  ],
  notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: ({ consultation }) => {
    return {
      ...(consultation.entity || consultation.default),
      dummyField: '',
      dispenseAcknowledgement: {
        editDispenseReasonFK: 1,
      },
    }
  },
  validationSchema: Yup.object().shape({
    dispenseAcknowledgement: Yup.object().shape({
      editDispenseReasonFK: Yup.number().required(),
      remarks: Yup.string().when('editDispenseReasonFK', {
        is: (val) => val === 2,
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
  state = {
    acknowledged: false,
  }

  componentDidMount () {
    const { setFieldValue } = this.props
    setTimeout(() => {
      setFieldValue('fakeField', 'setdirty')
    }, 500)
  }

  componentWillUnmount () {
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
    router.push(getAppendUrl(parameters, '/reception/queue/billing'))
  }

  editOrder = () => {
    const { dispatch, dispense, history } = this.props
    const { location } = history
    const { query } = location
    dispatch({
      type: `consultation/editOrder`,
      payload: {
        id: dispense.visitID,
        queueID: query.qid,
        version: dispense.version,
      },
    }).then((o) => {
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
    const { values, validateForm, handleSubmit } = this.props
    const isFormValid = await validateForm()
    if (!_.isEmpty(isFormValid)) {
      handleSubmit()
    } else {
      const {
        consultationDocument,
        orders,
        dispatch,
        dispense,
        forms,
      } = this.props
      const payload = convertToConsultation(values, {
        consultationDocument,
        orders,
        forms,
      })

      const signResult = await dispatch({
        type: `consultation/signOrder`,
        payload,
      })
      if (signResult) {
        notification.success({
          message: 'Order signed',
        })

        await dispatch({
          type: `dispense/refresh`,
          payload: dispense.visitID,
        })
        dispatch({
          type: `dispense/updateState`,
          payload: {
            editingOrder: false,
          },
        })
      }
    }
  }

  render () {
    const { classes, theme } = this.props
    const orderWidget = widgets.find((o) => o.id === '5')
    const cdWidget = widgets.find((o) => o.id === '3')
    const formsWidget = widgets.find((o) => o.id === '10')
    const Order = orderWidget.component
    const ConsultationDocument = cdWidget.component
    const Forms = formsWidget.component
    const formAccessRight = Authorized.check(formsWidget.authority)
    return (
      <div className={classes.content}>
        <GridContainer>
          <GridItem xs={12} md={6}>
            <h5>Orders</h5>
            <Order className={classes.orderPanel} status='' from='ca' />
          </GridItem>
          {formAccessRight &&
          formAccessRight.rights !== 'hidden' && (
            <GridItem xs={12} md={6}>
              <h5>
                <span style={{ display: 'inline-block' }}>Forms</span>
                <span className={classes.cdAddButton}>
                  {cdWidget.toolbarAddon}
                </span>
              </h5>
              <Forms />
            </GridItem>
          )}
          <GridItem xs={12} md={6}>
            <Authorized authority={cdWidget.accessRight}>
              <h5>
                <span style={{ display: 'inline-block' }}>
                  Consultation Document
                </span>
                <span className={classes.cdAddButton}>
                  {cdWidget.toolbarAddon}
                </span>
              </h5>
              <ConsultationDocument forDispense />
            </Authorized>
            <GridItem xs={12} md={6}>
              <FastField
                name='dispenseAcknowledgement.editDispenseReasonFK'
                render={(args) => {
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
            <GridItem xs={12}>
              <FastField
                name='dispenseAcknowledgement.remarks'
                render={(args) => {
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
            <GridItem xs={12}>
              <FastField
                name='acknowledged'
                render={(args) => {
                  return (
                    <Checkbox
                      onChange={(e) => {
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
            <GridItem
              xs={12}
              style={{ textAlign: 'center', paddingTop: theme.spacing(2) }}
            >
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
            </GridItem>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(EditOrder)
