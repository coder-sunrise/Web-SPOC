import React from 'react'
import { connect } from 'dva'
// umi
import { FormattedMessage } from 'umi/locale'
// material ui
import Print from '@material-ui/icons/Print'
// common components
import { Button } from '@/components'
import withWebSocket from '@/components/Decorator/withWebSocket'
// utils
import { REPORT_ID } from '@/utils/constants'
// services
import { getRawData } from '@/services/report'

const PostCardLabelBtn = ({
  dispatch,
  handlePrint,
  selectedRows,
  smsPatient,
  clinicSettings,
}) => {
  const handleClick = () => {
    const { list = [] } = smsPatient
    const { labelPrinterSize } = clinicSettings
    let reportID = REPORT_ID.POST_CARD_LABEL_80MM_45MM

    if (labelPrinterSize === '8.9cmx3.6cm') {
      reportID = REPORT_ID.POST_CARD_LABEL_89MM_36MM
    }
    const selectedPatients = list.filter((item) =>
      selectedRows.includes(item.id),
    )
    selectedPatients.forEach(async (patient) => {
      const data = await getRawData(reportID, { patientId: patient.id })
      const payload = [
        {
          ReportId: reportID,
          ReportData: JSON.stringify({
            ...data,
          }),
        },
      ]
      handlePrint(JSON.stringify(payload))
    })
  }

  return (
    <Button
      variant='contained'
      color='primary'
      onClick={handleClick}
      disabled={selectedRows.length === 0}
    >
      <Print /> <FormattedMessage id='sms.postCardLabel' />
    </Button>
  )
}

const Connected = connect(({ clinicSettings }) => ({ clinicSettings }))(
  PostCardLabelBtn,
)

export default withWebSocket()(Connected)
