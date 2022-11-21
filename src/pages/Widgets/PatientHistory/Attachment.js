import React from 'react'
import { Table } from 'antd'
import { downloadAttachment } from '@/services/file'
import { ATTACHMENT_TYPE } from '@/utils/constants'
import Download from '@material-ui/icons/GetApp'
import { Button } from '@/components'
import { imageFileExtensions } from '@/components/_medisys/AttachmentWithThumbnail/utils'
import tablestyles from './PatientHistoryStyle.less'

export default ({ current, dispatch }) => {
  const { attachments = [], visitAttachments = [] } = current
  const currentAttachments =
    attachments.length > 0 ? attachments : visitAttachments
  const visitAttachment = currentAttachments.filter(
    item => item.attachmentType === ATTACHMENT_TYPE.VISIT,
  )
  const visitReferralAttachment = currentAttachments.filter(
    item => item.attachmentType === ATTACHMENT_TYPE.VISITREFERRAL,
  )
  const consultationAttachment = currentAttachments.filter(
    item => item.attachmentType === ATTACHMENT_TYPE.CLINICALNOTES,
  )

  const sortAttachments = [
    ...visitAttachment.map(o => {
      return { ...o, type: 'Visit Attachment' }
    }),
    ...visitReferralAttachment.map(o => {
      return { ...o, type: 'Referral Attachment' }
    }),
    ...consultationAttachment.map(o => {
      return { ...o, type: 'Consultation Attachment' }
    }),
  ]
  let attachmentColumns = [
    {
      dataIndex: 'type',
      title: 'Type',
      width: 180,
    },
    {
      dataIndex: 'fileName',
      title: 'Document',
      render: (text, row) =>
        imageFileExtensions.includes(row.fileExtension.toLowerCase()) ? (
          <a
            onClick={() => {
              dispatch({
                type: 'imageViewer/updateState',
                payload: {
                  attachment: row,
                },
              })
            }}
          >
            {text}
          </a>
        ) : (
          <span>{text}</span>
        ),
    },
    { dataIndex: 'remarks', title: 'Remarks' },
    { dataIndex: 'createBy', title: 'From', width: 150 },
    {
      dataIndex: '',
      title: 'Action',
      width: 60,
      align: 'center',
      render: (text, row) => (
        <Button
          size='sm'
          onClick={() => {
            downloadAttachment(row)
          }}
          justIcon
          color='primary'
          style={{ marginRight: 5 }}
        >
          <Download />
        </Button>
      ),
    },
  ]
  return (
    <div style={{ marginBottom: 8, marginTop: 8 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={attachmentColumns}
        dataSource={sortAttachments}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
