import React, { useState, useEffect } from 'react'
import { CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'

const ReportModal = ({ reportTypeID, reportContent }) => {
  console.log({ reportTypeID, reportContent })
  const [
    showReport,
    setShowReport,
  ] = useState(false)

  const toggleReport = () => {
    setShowReport(!showReport)
  }

  useEffect(
    () => {
      if (reportTypeID) {
        setShowReport(true)
      }
    },
    [
      reportTypeID,
      reportContent,
    ],
  )

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
          unsavedReport
          reportID={reportTypeID}
          reportContent={reportContent}
        />
      </CommonModal>
    </React.Fragment>
  )
}

export default ReportModal
