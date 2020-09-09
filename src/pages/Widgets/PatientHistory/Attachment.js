import React from 'react'
import { Table } from 'antd'
import moment from 'moment'
import { downloadAttachment } from '@/services/file'
import { ATTACHMENT_TYPE } from '@/utils/constants'
import Download from '@material-ui/icons/GetApp'
import { Button } from '@/components'
import tablestyles from './PatientHistoryStyle.less'

export default ({ current }) => {
  const { attachments = [], visitAttachments = [] } = current
  const currentAttachments =
    attachments.legth > 0 ? attachments : visitAttachments
  const visitAttachment = currentAttachments.filter(
    (item) => item.attachmentType === ATTACHMENT_TYPE.VISIT,
  )
  const visitReferralAttachment = currentAttachments.filter(
    (item) => item.attachmentType === ATTACHMENT_TYPE.VISITREFERRAL,
  )
  const consultationAttachment = currentAttachments.filter(
    (item) => item.attachmentType === ATTACHMENT_TYPE.CLINICALNOTES,
  )
  const eyeVisualAcuityAttachment = currentAttachments.filter(
    (item) => item.attachmentType === ATTACHMENT_TYPE.EYEVISUALACUITY,
  )

  let attachmentColumns = [
    {
      dataIndex: 'fileName',
      title: 'Document',
    },
    { dataIndex: 'remarks', title: 'Remarks' },
    { dataIndex: 'createBy', title: 'From' },
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
  let visitReferralAttachmentColumns = [
    {
      dataIndex: 'fileName',
      title: 'Document',
    },
    { dataIndex: 'remarks', title: 'Remarks' },
    { dataIndex: 'referredBy', title: 'Referred By' },
    { dataIndex: 'referredInstitution', title: 'Institution' },
    {
      dataIndex: 'referredDate',
      title: 'Referred Date',
      width: 110,
      render: (text, row) => (
        <span>{moment(row.lastUpdateDate).format('DD MMM YYYY')}</span>
      ),
    },
    { dataIndex: 'createBy', title: 'From' },
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
    <div style={{ marginLeft: 8 }}>
      {visitAttachment.length > 0 && (
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Visit Attachment
          </span>
          <Table
            size='small'
            bordered
            pagination={false}
            columns={attachmentColumns}
            dataSource={visitAttachment}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {visitReferralAttachment.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Referral Attachment
          </span>
          <Table
            size='small'
            bordered
            pagination={false}
            columns={visitReferralAttachmentColumns}
            dataSource={visitReferralAttachment}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {consultationAttachment.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Consultation Attachment
          </span>
          <Table
            size='small'
            bordered
            pagination={false}
            columns={attachmentColumns}
            dataSource={consultationAttachment}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {eyeVisualAcuityAttachment.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Visual Acuity Test
          </span>
          <Table
            size='small'
            bordered
            pagination={false}
            columns={attachmentColumns}
            dataSource={eyeVisualAcuityAttachment}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
    </div>
  )
}
