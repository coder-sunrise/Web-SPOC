import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import {} from 'antd'
import { CommonModal } from '@/components'
import { ReportViewer } from '@/components/_medisys'
export const LabResultReportPreview = ({ open, visitId, onClose }) => {
  const [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()

  const onCloseReport = () => {
    setShowModal(false)
    onClose && onClose()
  }
  useEffect(() => {
    setShowModal(open)
  }, [visitId])

  return (
    <CommonModal
      open={showModal}
      onClose={onCloseReport}
      title='Lab Result Report'
      maxWidth='lg'
    >
      <ReportViewer reportID={94} reportParameters={{ visitId: visitId }} />
    </CommonModal>
  )
}
