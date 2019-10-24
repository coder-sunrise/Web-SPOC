import React, { Component, PureComponent } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  NumberInput,
  notification,
} from '@/components'
// sub component
import Banner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from './DispenseDetails'
import Main from './Main'
import EditOrder from './EditOrder'

import style from './style'
// utils
import { getAppendUrl } from '@/utils/utils'
import { postPDF } from '@/services/report'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { queryDrugLabelDetails } from '@/services/dispense'
// model
@connect(
  ({
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient,
    clinicSettings,
  }) => ({
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient: patient.entity,
    clinicSettings,
  }),
)
class Dispense extends PureComponent {
  constructor (props) {
    super(props)
    this.timer = null
    this.iswsConnect = false
    this.wsConnection = null
    this.handleClickPrintDrugLabel = null
    this.connectWebSocket()
    this.setHandleClickPrintDrugLabel()
  }

  componentDidMount () {
    this.setTimerOn()
  }

  componentWillUnmount () {
    if (this.timer) clearInterval(this.timer)
    if (this.wsConnection) this.wsConnection.close()
    this.props.dispatch({
      type: 'dispense/updateState',
      payload: {
        editingOrder: false,
      },
    })
  }

  getExtraComponent = () => {
    const { classes, dispense, values } = this.props
    const { entity, totalWithGST } = dispense
    return (
      <GridContainer
        // className={classes.actionPanel}
        direction='column'
        justify='space-evenly'
        alignItems='center'
      >
        <h4 style={{ position: 'relative', marginTop: 0 }}>
          Total Invoice
          <span>
            &nbsp;:&nbsp;
            <NumberInput
              text
              currency
              value={totalWithGST || entity.invoice.invoiceTotalAftGST}
            />
          </span>
        </h4>
      </GridContainer>
    )
  }

  setTimerOn () {
    this.timer = setInterval(() => {
      this.connectWebSocket()
    }, 1000)
  }

  setHandleClickPrintDrugLabel () {
    this.handleClickPrintDrugLabel = async (row) => {
      const drugLabelDetails1 = await queryDrugLabelDetails(row.id)
      const { data } = drugLabelDetails1
      if (data) {
        const DrugLabelDetails = [
          {
            PatientName: data.name,
            PatientReferenceNo: data.patientReferenceNo,
            PatientAccountNo: data.patientAccountNo,
            ClinicName: data.clinicName,
            ClinicAddress: data.clinicAddress,
            ClinicOfficeNumber: data.officeNo,
            DrugName: data.name,
            ConsumptionMethod: data.instruction,
            Precaution: data.precaution,
            IssuedDate: data.issuedDate,
            ExpiryDate: row.expiryDate,
            UOM: data.dispenseUOM,
            Quantity: data.dispensedQuanity,
            BatchNo: row.batchNo,
          },
        ]

        const result = await postPDF(24, { DrugLabelDetails })
        if (result) {
          const base64Result = arrayBufferToBase64(result)
          if (this.iswsConnect === true) {
            this.wsConnection.send(`["${base64Result}"]`)
          } else {
            notification.error({
              message: `The printing client application didn\'t running up, please start it.`,
            })
          }
        }
      }
    }
  }

  connectWebSocket () {
    if (this.iswsConnect === false) {
      let settings = JSON.parse(sessionStorage.getItem('clinicSettings'))
      if (settings.printToolSocketURL) {
        this.wsConnection = new window.WebSocket(settings.printToolSocketURL)
        this.wsConnection.onopen = () => {
          this.iswsConnect = true
        }

        this.wsConnection.onclose = () => {
          this.iswsConnect = false
        }
      }
    }
  }

  render () {
    const { classes, dispense } = this.props
    const { editingOrder } = dispense
    return (
      <div className={classes.root}>
        <Banner
          style={{}}
          patientInfo={dispense.patientInfo}
          extraCmt={this.getExtraComponent()}
        />
        <SizeContainer size='sm'>
          {!editingOrder ? (
            <Main
              {...this.props}
              handleClickPrintDrugLabel={this.handleClickPrintDrugLabel}
            />
          ) : (
            <EditOrder {...this.props} />
          )}
        </SizeContainer>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
