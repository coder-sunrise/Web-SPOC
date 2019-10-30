import React, { useState, useEffect } from 'react'
import { CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'

const ReportModal = ({ reportTypeID, reportParameters }) => {
  console.log({ reportTypeID, reportParameters })
  const [
    showReport,
    setShowReport,
  ] = useState(false)

  const [
    reportConfig,
    setReportConfig,
  ] = useState({})

  const toggleReport = () => {
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
  console.log({ reportConfig })
  return (
    <React.Fragment>
      {/* <ReportViewer /> */}
      <CommonModal
        open={showReport}
        onClose={toggleReport}
        title='Invoice'
        maxWidth='lg'
      >
        <ReportViewer
          showTopDivider={false}
          // unsavedReport
          reportID={reportTypeID}
          {...reportConfig}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default ReportModal
