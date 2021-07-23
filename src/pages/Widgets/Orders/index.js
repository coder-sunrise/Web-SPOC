import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import { withStyles, Divider, Paper, IconButton } from '@material-ui/core'
import { getUniqueId } from '@/utils/utils'
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
import { sumReducer, calculateAdjustAmount } from '@/utils/utils'

import Grid from './Grid'
import Detail from './Detail/index'
import Details from './Detail/PrescriptionSet/Details'

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
@connect(({ orders, codetable, clinicInfo }) => ({
  orders,
  codetable,
  clinicInfo,
}))
class Orders extends PureComponent {
  state = {
    total: 0,
    gst: 0,
    totalWithGst: 0,
    adjustments: [],
    showPrescriptionSetDetailModal: false,
  }

  componentWillMount () {
    const { dispatch, status } = this.props

    const codeTableNameArray = [
      'inventorymedication',
      'inventoryvaccination',
      'ctMedicationUsage',
      'ctMedicationDosage',
      'ctMedicationUnitOfMeasurement',
      'ctMedicationFrequency',
      'ctVaccinationUsage',
      'ctVaccinationUnitOfMeasurement',
      'documenttemplate',
    ]
    dispatch({
      type: 'codetable/batchFetch',
      payload: {
        codes: codeTableNameArray,
      },
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

  newPrescriptionSet = async () => {
    const { dispatch, orders: { rows = [] } } = this.props
    await dispatch({
      type: 'prescriptionSet/updateState',
      payload: {
        entity: undefined,
        prescriptionSetItems: rows.filter(r => !r.isDeleted && r.type === '1').map((drug, index) => {
          return {
            ...drug,
            id: undefined,
            uid: getUniqueId(),
            prescriptionSetItemPrecaution: drug.corPrescriptionItemPrecaution.filter(p => !p.isDeleted).map(p => {
              return { ...p, id: undefined }
            }),
            prescriptionSetItemInstruction: drug.corPrescriptionItemInstruction.filter(i => !i.isDeleted).map(i => {
              return { ...i, id: undefined }
            }),
            prescriptionSetItemDrugMixture: drug.corPrescriptionItemDrugMixture.filter(dm => !dm.isDeleted).map(dm => {
              return { ...dm, id: undefined }
            }),
            sequence: index
          }
        })
      }
    })

    this.setState({ showPrescriptionSetDetailModal: true })
  }

  toggleShowPrescriptionSetDetailModal = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'prescriptionSet/updateState',
      payload: {
        entity: undefined,
        prescriptionSetItems: [],
        editPrescriptionSetItem: undefined
      }
    })

    this.setState({ showPrescriptionSetDetailModal: false })
  }

  render () {
    const { props } = this
    const { className, footer, ...restProps } = props
    return (
      <div className={className}>
        <Detail {...restProps} />
        {/* <Divider light /> */}

        <Grid
          {...props}
          newPrescriptionSet={this.newPrescriptionSet}
          // summary={this.state}
          // handleAddAdjustment={this.addAdjustment}
        />
        {/* {this.generateFinalAmount()} */}
        <CommonModal
          open={this.state.showPrescriptionSetDetailModal}
          title='Add New Prescription Set'
          onClose={this.toggleShowPrescriptionSetDetailModal}
          onConfirm={this.toggleShowPrescriptionSetDetailModal}
          observe='PrescriptionSetDetail'
          maxWidth='md'
          showFooter={false}
          overrideLoading
          cancelText='Cancel'
        >
          <Details {...this.props} />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Orders)
