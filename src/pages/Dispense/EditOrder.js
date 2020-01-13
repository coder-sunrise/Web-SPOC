import React, { Component } from 'react'
import router from 'umi/router'
// common component
import {
  GridContainer,
  GridItem,
  notification,
  withFormikExtend,
} from '@/components'
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

// @Authorized.Secured('queue.dispense.editorder')
@withFormikExtend({
  authority: [
    'queue.dispense.editorder',
  ],
  notDirtyDuration: 0, // this page should alwasy show warning message when leave
  mapPropsToValues: () => ({ dummyField: '' }),
  dirtyCheckMessage: 'Discard edit order?',
  onDirtyDiscard: discardConsultation,
  enableReinitialize: false,
  displayName: 'EditOrder',
})
class EditOrder extends Component {
  componentDidMount () {
    const { setFieldValue } = this.props
    setTimeout(() => {
      setFieldValue('fakeField', 'setdirty')
    }, 500)
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
    const { dispatch, dispense, visitRegistration, history } = this.props
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

  signOrder = async (values) => {
    const { consultationDocument, orders, dispatch, dispense } = this.props
    const payload = convertToConsultation(values, {
      consultationDocument,
      orders,
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

  render () {
    const { classes, dispense, consultation, dispatch } = this.props
    const orderWidget = widgets.find((o) => o.id === '5')
    const cdWidget = widgets.find((o) => o.id === '3')
    const Order = orderWidget.component
    const ConsultationDocument = cdWidget.component

    return (
      <div className={classes.content}>
        <GridContainer>
          <GridItem xs={12} md={6}>
            <h5>Orders</h5>
            <Order className={classes.orderPanel} status='' />
          </GridItem>
          <GridItem xs={12} md={6}>
            <h5>
              <span style={{ display: 'inline-block' }}>
                Consultation Document
              </span>
              <span className={classes.cdAddButton}>
                {cdWidget.toolbarAddon}
              </span>
            </h5>
            <ConsultationDocument
              forDispense
              parentProps={{
                values: consultation.entity,
              }}
              onCancel={this.cancelOrder}
              onSave={this.signOrder}
            />
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default EditOrder
