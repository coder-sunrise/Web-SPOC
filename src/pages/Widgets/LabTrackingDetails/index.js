import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import { PATIENT_LAB, REPORT_ID } from '@/utils/constants'
import { CommonModal, TextField, Tooltip } from '@/components'
import { findGetParameter } from '@/utils/utils'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getRawData } from '@/services/report'
import Authorized from '@/utils/Authorized'
import Detail from './Detail'
import FilterBar from './FilterBar'
import OverallGrid from './OverallGrid'
import PatientGrid from './PatientGrid'

const styles = theme => ({
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
  constructor(props) {
    super(props)
    this.state = {
      visitPurpose: JSON.parse(props.clinicSettings.visitTypeSetting),
      isShowWriteOffModel: false,
      writeOffReason: undefined,
      writeOffList: [],
    }
  }
  toggleModal = () => {
    const { labTrackingDetails } = this.props
    this.props.dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: !labTrackingDetails.showModal,
        entity: undefined,
      },
    })
  }
  handlePrintClick = async row => {
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

  onClickWriteOff = () => {
    this.setState({ isShowWriteOffModel: true })
  }

  toggleShowWriteOffModel = () => {
    this.setState({ isShowWriteOffModel: false, writeOffReason: undefined })
  }

  confirmWriteOff = () => {
    if ((this.state.writeOffReason || '').trim().length === 0) return
    const { dispatch } = this.props
    dispatch({
      type: 'labTrackingDetails/writeOff',
      payload: {
        writeOffReason: this.state.writeOffReason,
        writeOffIds: this.state.writeOffList.join(','),
      },
    }).then(r => {
      if (r) {
        this.setState({
          writeOffReason: undefined,
          writeOffList: [],
          isShowWriteOffModel: false,
        })
        dispatch({
          type: 'labTrackingDetails/query',
        })
      }
    })
  }

  onDataSelectChange = v => {
    this.setState({ writeOffList: v })
  }
  render() {
    const {
      resultType,
      dispatch,
      labTrackingDetails,
      patientId,
      isPatientInactive,
      mainDivHeight = 700,
      height,
    } = this.props
    const IsOverallGrid = resultType === PATIENT_LAB.LAB_TRACKING

    let patientID = patientId || Number(findGetParameter('pid')) || undefined

    let tableHeight
    if (resultType === PATIENT_LAB.LAB_TRACKING) {
      tableHeight =
        mainDivHeight - 130 - ($('.filterLabTrackingBar').height() || 0)
    } else if (resultType === PATIENT_LAB.CONSULTATION) {
      tableHeight =
        mainDivHeight - 80 - ($('.filterLabTrackingBar').height() || 0)
    } else {
      tableHeight = height - 260 - ($('.filterLabTrackingBar').height() || 0)
    }

    if (tableHeight < 300) tableHeight = 300

    const cfg = {
      toggleModal: this.toggleModal,
      handlePrintClick: this.handlePrintClick,
      height: tableHeight,
    }

    const editExternalTrackingRight = Authorized.check(
      'reception/labtracking',
    ) || { rights: 'hidden' }

    return (
      <div>
        <div className='filterLabTrackingBar'>
          <FilterBar
            dispatch={dispatch}
            IsOverallGrid={IsOverallGrid}
            patientId={patientID}
            onClickWriteOff={this.onClickWriteOff}
            writeOffCount={this.state.writeOffList.length}
            onDataSelectChange={this.onDataSelectChange}
          />
        </div>

        <div style={{ margin: 10 }}>
          {IsOverallGrid ? (
            <OverallGrid
              dispatch={dispatch}
              {...this.props}
              {...cfg}
              writeOffList={this.state.writeOffList}
              onDataSelectChange={this.onDataSelectChange}
            />
          ) : (
            <PatientGrid
              readOnly={
                isPatientInactive ||
                editExternalTrackingRight.rights === 'hidden'
              }
              dispatch={dispatch}
              visitPurpose={this.state.visitPurpose}
              {...this.props}
              {...cfg}
            />
          )}
        </div>
        <CommonModal
          open={labTrackingDetails.showModal}
          title='Edit External Tracking'
          observe='LabResultsDetail'
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} mode='integrated' />
        </CommonModal>

        <CommonModal
          open={this.state.isShowWriteOffModel}
          title='Confirm Write-Off'
          maxWidth='sm'
          bodyNoPadding
          onClose={this.toggleShowWriteOffModel}
          onConfirm={this.confirmWriteOff}
          showFooter={true}
        >
          <div style={{ padding: '0px 16px 8px 16px' }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>Write-Off Reason</span>
              {(this.state.writeOffReason || '').trim().length === 0 && (
                <Tooltip title='Write-Off reason is required'>
                  <span style={{ color: 'red', marginLeft: 4 }}>*</span>
                </Tooltip>
              )}
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
              (This remarks will be indicated in all selected records)
            </div>
            <div>
              <TextField
                label='Remarks'
                maxLength={2000}
                value={this.state.writeOffReason}
                onChange={e => {
                  this.setState({ writeOffReason: e.target.value })
                }}
              />
            </div>
          </div>
        </CommonModal>
      </div>
    )
  }
}

export default withWebSocket()(
  withStyles(styles, { withTheme: true })(LabTrackingDetails),
)
