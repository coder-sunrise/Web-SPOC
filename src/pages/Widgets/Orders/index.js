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
import { sumReducer, calculateAdjustAmount } from '@/utils/utils'

import Grid from './Grid'
import Detail from './Detail/index'

const styles = (theme) => ({
  rightAlign: {
    textAlign: 'right',
  },
  summaryRow: {
    margin: '3px 0 3px 0',
    height: 20,
  },
})
// @skeleton()
@connect(({ orders, codetable }) => ({
  orders,
  codetable,
}))
class Orders extends PureComponent {
  state = {
    total: 0,
    gst: 0,
    totalWithGst: 0,
    adjustments: [],
  }

  componentDidMount () {
    const { dispatch, status } = this.props

    const codeTableNameArray = []
    codeTableNameArray.push('ctMedicationUsage')
    codeTableNameArray.push('ctMedicationDosage')
    codeTableNameArray.push('ctMedicationUnitOfMeasurement')
    codeTableNameArray.push('ctMedicationFrequency')
    codeTableNameArray.push('ctVaccinationUsage')
    codeTableNameArray.push('ctVaccinationUnitOfMeasurement')

    codeTableNameArray.forEach((o) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: o,
        },
      })
    })
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
        serviceCode: this.state.services.find((o) => o.value === serviceFK)
          .code,
        serviceName: this.state.services.find((o) => o.value === serviceFK)
          .name,
        unitPrice: serviceCenterService.unitPrice,
        total: serviceCenterService.unitPrice,
        quantity: 1,
      })
      this.updateTotalPrice(serviceCenterService.unitPrice)
    }
  }

  render () {
    const { state, props } = this
    const {
      theme,
      classes,
      orders,
      className,
      visitRegistration,
      codetable,
    } = props
    const { footer, ...restProps } = props // for dispense add order popup modal
    return (
      <div className={className}>
        <Detail {...restProps} />
        <Divider light />

        <Grid
          {...props}
          // summary={this.state}
          // handleAddAdjustment={this.addAdjustment}
        />
        {/* {this.generateFinalAmount()} */}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Orders)
