import React, { Component, PureComponent } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
import { consultationDocumentTypes } from '@/utils/codes'
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
import { postPDF, getPDF } from '@/services/report'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import { LoadingWrapper } from '@/components/_medisys'
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
    loading,
  }) => ({
    loading,
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
    this.iswsConnect = false
    this.wsConnection = null
    this.handleOnPrint = null
    this.connectWebSocket()
    this.setHandleClickPrint()
  }

  componentWillUnmount () {
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
    const totalInvoice = entity
      ? entity.invoice.invoiceTotalAftGST
      : totalWithGST
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
            <NumberInput text currency value={totalInvoice} />
          </span>
        </h4>
      </GridContainer>
    )
  }

  setHandleClickPrint () {
    this.handleOnPrint = async (type, row) => {
      this.connectWebSocket()
      let printResult

      if (type === 'Medication') {
        let drugLableSource = await this.generateDrugLablePrintSource(row)
        if (drugLableSource) {
          printResult = await postPDF(
            drugLableSource.reportId,
            drugLableSource.payload,
          )
        }
      } else {
        const documentType = consultationDocumentTypes.find(
          (o) =>
            o.name.toLowerCase() === row.type.toLowerCase() ||
            (o.name === 'Others' && row.type === 'Other Documents'),
        )
        if (!documentType || !documentType.downloadConfig) {
          notification.error({ message: 'No configuration found' })
          return
        }
        const { downloadConfig } = documentType
        const payload = JSON.parse(`{"${downloadConfig.key}":${row.sourceFK}}`)

        printResult = await getPDF(downloadConfig.id, payload)
      }

      if (printResult) {
        const base64Result = arrayBufferToBase64(printResult)
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

  generateDrugLablePrintSource = async (row) => {
    const drugLabelDetails1 = await queryDrugLabelDetails(row.id)
    const { data } = drugLabelDetails1
    if (data) {
      const drugLabelDetail = [
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
      return { reportId: 24, payload: { DrugLabelDetails: drugLabelDetail } }
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
    const { classes, dispense, loading } = this.props
    const { editingOrder } = dispense
    return (
      <div className={classes.root}>
        <LoadingWrapper loading={loading.models.dispense}>
          <Banner
            style={{}}
            patientInfo={dispense.patientInfo}
            extraCmt={this.getExtraComponent()}
          />
          <SizeContainer size='sm'>
            <React.Fragment>
              {!editingOrder ? (
                <Main {...this.props} onPrint={this.handleOnPrint} />
              ) : (
                <EditOrder {...this.props} />
              )}
            </React.Fragment>
          </SizeContainer>
        </LoadingWrapper>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
