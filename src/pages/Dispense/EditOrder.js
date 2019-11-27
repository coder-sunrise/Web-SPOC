import React, { Component } from 'react'
import router from 'umi/router'
// material ui
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import { Button, GridContainer, GridItem, notification } from '@/components'
import { convertToConsultation } from '@/pages/Consultation/utils'
// utils
import { getAppendUrl, navigateDirtyCheck } from '@/utils/utils'
import { widgets } from '@/utils/widgets'
import Authorized from '@/utils/Authorized'
// import model from '@/pages/Widgets/Orders/models'

// window.g_app.replaceModel(model)

// model
@Authorized.Secured('queue.dispense.editorder')
class EditOrder extends Component {
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
    // this.props.history.push(`${location.pathname}/billing`)
  }

  editOrder = () => {
    const { dispatch, dispense, visitRegistration } = this.props
    dispatch({
      type: `consultation/editOrder`,
      payload: {
        id: dispense.visitID,
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
    const { dispatch, dispense } = this.props
    dispatch({
      type: 'consultation/discard',
      payload: dispense.entity.clinicalObjectRecordFK,
    }).then((o) => {
      if (o) {
        dispatch({
          type: `dispense/updateState`,
          payload: {
            editingOrder: false,
          },
        })
      }
    })
  }

  signOrder = (values) => {
    const {
      consultationDocument,
      orders,
      dispatch,
      dispense,
      visitRegistration,
    } = this.props
    dispatch({
      type: `consultation/signOrder`,
      payload: convertToConsultation(values, { consultationDocument, orders }),
    }).then((o) => {
      if (o) {
        dispatch({
          type: `dispense/updateState`,
          payload: {
            editingOrder: false,
          },
        })

        dispatch({
          type: `dispense/refresh`,
          payload: dispense.visitID,
        })
        notification.success({
          message: 'Order signed',
        })

        // dispatch({
        //   type: `formik/clean`,
        //   payload: 'OrderPage',
        // })
      }
    })
  }

  render () {
    const { classes, dispense, consultation, dispatch } = this.props
    const orderWidget = widgets.find((o) => o.id === '5')
    const cdWidget = widgets.find((o) => o.id === '3')
    const Order = orderWidget.component
    const ConsultationDocument = cdWidget.component
    // console.log('edit order', { values: this.props.values })
    return (
      <div className={classes.root}>
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
