import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Table, Radio } from 'antd'
import moment from 'moment'
import { ProgressButton, CommonModal, TextField } from '@/components'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'

const cancelConfirmationTable = [
  {
    title: 'Accession No.',
    dataIndex: 'accessionNo',
    key: 'name',
  },
  {
    title: 'Examination',
    dataIndex: 'itemDescription',
    key: 'itemDescription',
  },
]

export const CancelConfirmation = ({
  open,
  workitem,
  visitWorkitems,
  onCancelConfirm,
  onCancelClose,
}) => {
  const [cancellationReason, setCancellationReason] = useState('')

  useEffect(() => {
    return () => setCancellationReason('')
  }, [])

  return (
    <CommonModal
      open={open}
      title='Cancel Examination'
      showFooter={true}
      maxWidth='sm'
      confirmProps={{ disabled: true }}
      onConfirm={() => {
        onCancelConfirm(cancellationReason)
      }}
      onClose={() => {
        if (onCancelClose) onCancelClose()
      }}
    >
      <div>Confirm to cancel examination below? </div>
      <div style={{ margin: 10 }}>
        <Table
          bordered
          size='small'
          pagination={false}
          columns={cancelConfirmationTable}
          dataSource={(() => {
            return workitem.primaryWorkitemFK && workitem.radiologyWorkitemId
              ? visitWorkitems.filter(
                  w =>
                    w.primaryWorkitemFK ===
                    visitWorkitems.find(
                      w =>
                        w.radiologyWorkitemId === workitem.radiologyWorkitemId,
                    ).primaryWorkitemFK,
                )
              : [workitem]
          })()}
        />

        <TextField
          label='Reason'
          onChange={e => setCancellationReason(e.target.value)}
        />
      </div>
    </CommonModal>
  )
}
