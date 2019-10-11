import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles, Divider, Paper, IconButton } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  skeleton,
  Popconfirm,
  Tooltip,
  NumberInput,
} from '@/components'
import { getServices } from '@/utils/codes'
import { sumReducer , calculateAdjustAmount } from '@/utils/utils'

import Grid from './Grid'
import Detail from './Detail/index'

const styles = (theme) => ({
  rightAlign: {
    textAlign: 'right',
  },
})
// @skeleton()
@connect(({ orders, visitRegistration }) => ({
  orders,
  visitRegistration,
}))
class Orders extends PureComponent {
  state = {
    total: 0,
    gst: 0,
    totalWithGst: 0,
    adjustments: [],
  }

  componentDidMount () {
    const { dispatch, status, visitRegistration } = this.props
    const { entity: vistEntity } = visitRegistration
    const { visit = {} } = vistEntity

    if (status === 'consultation' && visit.visitStatus === 'WAITING') {
      dispatch({
        type: 'orders/updateState',
        payload: {
          rows: [],
        },
      })

      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctservice',
          filter: {
            'serviceFKNavigation.IsActive': true,
            combineCondition: 'or',
          },
        },
      }).then((list) => {
        // console.log(list)
        // eslint-disable-next-line compat/compat
        const { services, serviceCenters, serviceCenterServices } = getServices(
          list,
        )
        this.setState({
          services,
          serviceCenters,
          serviceCenterServices,
        })

        let orderList = serviceCenterServices.filter(
          (o) => o.isAutoOrder === true && o.isDefault === true,
        )
        let order = []
        for (let i = 0; i < orderList.length; i++) {
          let serviceFKValue = 0
          let serviceCenterFKValue = 0
          let serviceNameValue = ''
          let totalAfterItemAdjustmentValue = 0
          let adjAmountValue = 0

          for (let a = 0; a < services.length; a++) {
            if (orderList[i].displayValue === services[a].name) {
              serviceFKValue = services[a].value
              serviceNameValue = services[a].name
            }
          }

          for (let b = 0; b < serviceCenters.length; b++) {
            if (orderList[i].serviceCenter === serviceCenters[b].name) {
              serviceCenterFKValue = serviceCenters[b].value
            }
          }

          totalAfterItemAdjustmentValue = 0
          adjAmountValue = 0

          let rowRecord = {
            sequence: i,
            type: '3',
            serviceFK: serviceFKValue,
            serviceCenterFK: serviceCenterFKValue,
            serviceCenterServiceFK: orderList[i].serviceCenter_ServiceId,
            serviceName: serviceNameValue,
            unitPrice: orderList[i].unitPrice,
            total: orderList[i].unitPrice,
            quantity: 1,
            totalAfterItemAdjustment: orderList[i].unitPrice,
            adjAmount: adjAmountValue,
            remark: '',
            subject: orderList[i].displayValue,
            uid: '',
            weightage: 0,
            totalAfterOverallAdjustment: 0,
          }

          dispatch({
            type: 'orders/upsertRow',
            payload: rowRecord,
          })

          order.push(rowRecord)
        }
        console.log('final order  ', order)
      })

      this.state = {
        services: [],
        serviceCenters: [],
      }
    } else {
      dispatch({
        type: 'orders/updateState',
        payload: {
          rows: [],
        },
      })
    }
  }

  getServiceCenterService = () => {
    const { values, setFieldValue, setValues } = this.props
    const { serviceFK, serviceCenterFK } = values

    if (!serviceCenterFK || !serviceFK) return
    const serviceCenterService =
      this.state.serviceCenterServices.find(
        (o) =>
          o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      setValues({
        ...values,
        serviceCenterServiceFK: serviceCenterService.serviceCenter_ServiceId,
        serviceName: this.state.services.find((o) => o.value === serviceFK)
          .name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      })
      this.updateTotalPrice(serviceCenterService.unitPrice)
    }
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { orders } = nextProps
  //   const { rows, finalAdjustments } = orders
  //   const total = rows
  //     .map((o) => o.totalAfterOverallAdjustment)
  //     .reduce(sumReducer, 0)
  //   const gst = total * 0.07
  //   let totalWithGst = total + gst
  //   const adjustments = finalAdjustments.filter((o) => !o.isDeleted)
  //   adjustments.forEach((fa) => {
  //     totalWithGst += fa.adjAmount
  //   })
  //   if (preState.totalWithGst !== totalWithGst)
  //     return {
  //       adjustments,
  //       total,
  //       gst,
  //       totalWithGst,
  //     }

  //   return null
  // }

  // componentDidMount () {
  //   this.props.dispatch({
  //     type: 'orders/calculateAmount',
  //   })
  // }

  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   if (
  //     _.isEqual(
  //       nextProps.orders.finalAdjustments,
  //       this.props.orders.finalAdjustments,
  //     )
  //   ) {
  //     console.log('UNSAFE_componentWillReceiveProps', nextProps, this.props)
  //   }
  // }

  // recacluateAmount = () => {
  //   const { orders } = this.props
  //   const { rows, adjustment } = orders
  //   console.log(rows, adjustment)
  // }

  // addAdjustment = () => {
  //   this.props.dispatch({
  //     type: 'global/updateState',
  //     payload: {
  //       openAdjustment: true,
  //       openAdjustmentConfig: {
  //         callbackConfig: {
  //           model: 'orders',
  //           reducer: 'addFinalAdjustment',
  //         },
  //         showRemark: true,
  //         defaultValues: {
  //           // ...this.props.orders.entity,
  //           initialAmout: this.state.total,
  //         },
  //       },
  //     },
  //   })
  // }

  // generateFinalAmount = () => {
  //   const { state, props } = this
  //   const { theme, classes, orders, dispatch } = props
  //   return (
  //     <React.Fragment>
  //       <GridContainer style={{ marginTop: theme.spacing(2) }} gutter={0}>
  //         <GridItem xs={0} md={8} />
  //         <GridItem xs={6} md={2}>
  //           <p style={{ position: 'relative' }}>
  //             <span>Adjustment</span>
  //             <Tooltip title='Add Adjustment'>
  //               <IconButton
  //                 style={{
  //                   position: 'absolute',
  //                   marginLeft: theme.spacing(1),
  //                   top: -1,
  //                 }}
  //                 onClick={this.addAdjustment}
  //               >
  //                 <Add />
  //               </IconButton>
  //             </Tooltip>
  //           </p>
  //           {this.state.adjustments.map((o) => {
  //             return (
  //               <p style={{ position: 'relative' }} key={o.uid}>
  //                 <Popconfirm
  //                   onConfirm={() =>
  //                     dispatch({
  //                       type: 'orders/deleteFinalAdjustment',
  //                       payload: {
  //                         uid: o.uid,
  //                       },
  //                     })}
  //                 >
  //                   <Tooltip title='Delete Adjustment'>
  //                     <IconButton
  //                       style={{
  //                         position: 'absolute',
  //                         top: -1,
  //                       }}
  //                     >
  //                       <Delete />
  //                     </IconButton>
  //                   </Tooltip>
  //                 </Popconfirm>

  //                 <span style={{ marginLeft: 25 }}>{o.adjRemark}</span>
  //               </p>
  //             )
  //           })}
  //           <p>7.00% GST</p>

  //           <p style={{ marginTop: theme.spacing(1) }}>Total</p>
  //         </GridItem>
  //         <GridItem xs={6} md={2}>
  //           <p>&nbsp;</p>
  //           {this.state.adjustments.map((o) => {
  //             return (
  //               <p key={o.uid} className={classes.rightAlign}>
  //                 <NumberInput value={o.adjAmount} currency text />
  //               </p>
  //             )
  //           })}
  //           <p className={classes.rightAlign}>
  //             <NumberInput value={state.gst} currency text />
  //           </p>

  //           <p
  //             className={classes.rightAlign}
  //             style={{ marginTop: theme.spacing(1) }}
  //           >
  //             <NumberInput value={state.totalWithGst} currency text />
  //           </p>
  //         </GridItem>
  //       </GridContainer>
  //       <GridContainer
  //         style={{
  //           top: -30,
  //           position: 'relative',
  //         }}
  //         gutter={0}
  //       >
  //         <GridItem xs={0} md={8} />
  //         <GridItem xs={12} md={4}>
  //           <Divider light />
  //         </GridItem>
  //       </GridContainer>
  //     </React.Fragment>
  //   )
  // }

  render () {
    const { state, props } = this
    const { theme, classes, orders, className } = props

    return (
      <div className={className}>
        <Detail {...props} />
        <Divider light />

        <Grid
          {...props}
          // summary={this.state}
          handleAddAdjustment={this.addAdjustment}
        />
        {/* {this.generateFinalAmount()} */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Orders)
