import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import { PATIENT_LAB, REPORT_ID } from '@/utils/constants'
import { CommonModal } from '@/components'
import { findGetParameter } from '@/utils/utils'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getRawData } from '@/services/report'
import Detail from './Detail'
import FilterBar from './FilterBar'
import OverallGrid from './OverallGrid'
import PatientGrid from './PatientGrid'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  gridRow: {
    marginTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@connect(({ labTrackingDetails, clinicSettings, global }) => ({
  labTrackingDetails,
  clinicSettings: clinicSettings.settings,
  mainDivHeight: global.mainDivHeight,
}))
class LabTrackingDetails extends PureComponent {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctcasedescription',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctcasetype',
      },
    })
  }

  toggleModal = () => {
    const { labTrackingDetails } = this.props
    this.props.dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: !labTrackingDetails.showModal,
      },
    })
  }

  handlePrintClick = async (row) => {
    const { clinicSettings, handlePrint } = this.props
    const { labelPrinterSize } = clinicSettings

    let reportID = REPORT_ID.PATIENT_LAB_LABEL_80MM_45MM

    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_ID.PATIENT_LAB_LABEL_89MM_36MM
    } else if (labelPrinterSize === '7.6cmx3.8cm') {
      reportID = REPORT_ID.PATIENT_LAB_LABEL_76MM_38MM
    }

    const data = await getRawData(reportID, { visitId: row.visitFK })
    const payload = [
      {
        ReportId: reportID,
        Copies: 1,
        ReportData: JSON.stringify(data),
      },
    ]

    handlePrint(JSON.stringify(payload))
  }

  render () {
    const {
      resultType,
      dispatch,
      labTrackingDetails,
      patientId,
      isPatientInactive,
      mainDivHeight = 700,
    } = this.props
    const IsOverallGrid = resultType === PATIENT_LAB.LAB_TRACKING

    let patientID = patientId || Number(findGetParameter('pid')) || undefined

    let height
    if (resultType === PATIENT_LAB.LAB_TRACKING) {
      height = mainDivHeight - 120 - ($('.filterBar').height() || 0)
    } else if (resultType === PATIENT_LAB.CONSULTATION) {
      height = mainDivHeight - 80 - ($('.filterBar').height() || 0)
    } else {
      height = mainDivHeight - 280 - ($('.filterBar').height() || 0)
    }

    if (height < 300) height = 300

    const cfg = {
      toggleModal: this.toggleModal,
      handlePrintClick: this.handlePrintClick,
      height,
    }

    return (
      <div>
        <div className='filterBar'>
          <FilterBar
            dispatch={dispatch}
            IsOverallGrid={IsOverallGrid}
            patientId={patientID}
          />
        </div>

        <div style={{ margin: 10 }}>
          {IsOverallGrid ? (
            <OverallGrid dispatch={dispatch} {...cfg} {...this.props} />
          ) : (
            <PatientGrid
              readOnly={isPatientInactive}
              dispatch={dispatch}
              {...cfg}
              {...this.props}
            />
          )}
        </div>
        <CommonModal
          open={labTrackingDetails.showModal}
          title='Edit Lab Tracking / Results'
          observe='LabResultsDetail'
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} mode='integrated' />
        </CommonModal>
      </div>
    )
  }
}

export default withWebSocket()(
  withStyles(styles, { withTheme: true })(LabTrackingDetails),
)
