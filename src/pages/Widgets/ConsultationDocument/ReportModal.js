import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'
import { REPORT_TYPE } from '@/utils/constants'

const ReportModal = ({ dispatch, reportTypeID, reportParameters }) => {
  const [
    showReport,
    setShowReport,
  ] = useState(false)

  const [
    reportConfig,
    setReportConfig,
  ] = useState({})

  const resetReportParameters = () => {
    dispatch({
      type: 'global/updateState',
      payload: {
        reportTypeID: undefined,
        reportParameters: {},
      },
    })
  }

  const toggleReport = () => {
    if (showReport) {
      resetReportParameters()
    }
    setShowReport(!showReport)
  }

  useEffect(
    () => {
      if (reportTypeID) {
        setShowReport(true)
      }

      const { isSaved, ...restParams } = reportParameters
      if (isSaved) {
        setReportConfig({
          reportParameters: { ...restParams },
          unsavedReport: false,
        })
      } else {
        setReportConfig({
          reportContent: restParams.reportContent,
          unsavedReport: true,
        })
      }
    },
    [
      reportTypeID,
      reportParameters,
    ],
  )

  return (
    <React.Fragment>
      {/* <ReportViewer /> */}
      <CommonModal
        open={showReport}
        onClose={toggleReport}
        title={REPORT_TYPE[reportTypeID]}
        maxWidth='lg'
      >
        <ReportViewer
          showTopDivider={false}
          reportID={reportTypeID}
          {...reportConfig}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default connect(({ global }) => ({
  reportTypeID: global.reportTypeID,
  reportParameters: global.reportParameters,
}))(ReportModal)
