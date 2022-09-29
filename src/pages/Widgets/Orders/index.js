import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles, Divider, Paper, IconButton } from '@material-ui/core'
import { getUniqueId } from '@/utils/utils'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import './index.css'
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
import { sumReducer, calculateAdjustAmount } from '@/utils/utils'

import Grid from './Grid'
import Detail from './Detail/index'

const styles = theme => ({
  rightAlign: {
    textAlign: 'right',
  },
  summaryRow: {
    margin: '3px 0 3px 0',
    height: 20,
  },
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
    lineHeight: '16px',
  },
  switchContainer: {
    color: 'currentColor',
    borderRadius: 0,
    '& .ant-switch-handle': {
      width: 20,
      height: 18,
      '&::before': {
        borderRadius: 3,
        right: 2,
      },
    },
  },
})
// @skeleton()
@connect(
  ({ orders, codetable, clinicInfo, patient, user, consultationDocument }) => ({
    orders,
    codetable,
    patient,
    user,
    clinicInfo,
    consultationDocument,
  }),
)
class Orders extends PureComponent {
  state = {
    total: 0,
    gst: 0,
    totalWithGst: 0,
    adjustments: [],
  }

  componentWillMount() {}

  getServiceCenterService = () => {
    const { values, setFieldValue, setValues } = this.props
    const { serviceFK, serviceCenterFK } = values

    if (!serviceCenterFK || !serviceFK) return
    const serviceCenterService =
      this.state.serviceCenterServices.find(
        o => o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      setValues({
        ...values,
        serviceCenterServiceFK: serviceCenterService.serviceCenter_ServiceId,
        serviceCode: this.state.services.find(o => o.value === serviceFK).code,
        serviceName: this.state.services.find(o => o.value === serviceFK).name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      })
      this.updateTotalPrice(serviceCenterService.unitPrice)
    }
  }

  render() {
    const { props } = this
    const { className, footer, isEnableEditOrder = true, ...restProps } = props
    return (
      <div className={className} id='ordersContainer'>
        {isEnableEditOrder && <Detail {...restProps} />}
        {/* <Divider light /> */}

        <Grid
          {...props}
          isEnableEditOrder={isEnableEditOrder}
          // summary={this.state}
          // handleAddAdjustment={this.addAdjustment}
        />
        {/* {this.generateFinalAmount()} */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Orders)
