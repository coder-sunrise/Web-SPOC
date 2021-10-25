import React, { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'dva'
import { Table, Radio } from 'antd'
import moment from 'moment'
import { ProgressButton, CommonModal, TextField } from '@/components'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'

export const CancelConfirmation = ({
  open,
  workitem,
  onCancelConfirm,
  onCancelClose,
}) => {
  const [cancellationReason, setCancellationReason] = useState('')
  const { getPrimaryWorkitem } = useContext(WorklistContext)
  const { visitWorkitems } = workitem
  useEffect(() => {
    return () => setCancellationReason('')
  }, [])

  const primaryWorkitemAccessNo = getPrimaryWorkitem(workitem)?.accessionNo

  const cancelConfirmationTable = [
    {
      title: 'Accession No.',
      dataIndex: 'accessionNo',
      key: 'name',
      render: (text, record) => {
        return primaryWorkitemAccessNo &&
          primaryWorkitemAccessNo === record.accessionNo
          ? `${text} (Primary)`
          : text
      },
    },
    {
      title: 'Examination',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
    },
  ]

  const getConfirmMessage = () => {
    return primaryWorkitemAccessNo
      ? `Confirm to cancel Combined Order ${primaryWorkitemAccessNo}?`
      : `Confirm to cancel examination below?`
  }

  return (
    <CommonModal
      open={open}
      title='Cancel Examination'
      showFooter={true}
      maxWidth='sm'
      footProps={{
        confirmProps: { disabled: !cancellationReason.trim() },
      }}
      onConfirm={() => {
        onCancelConfirm(cancellationReason)
      }}
      onClose={() => {
        if (onCancelClose) onCancelClose()
      }}
    >
      <div> {getConfirmMessage()} </div>
      <div style={{ margin: 10 }}>
        <Table
          bordered
          size='small'
          pagination={false}
          columns={cancelConfirmationTable}
          dataSource={(() => {
            return workitem.primaryWorkitemFK && workitem.radiologyWorkitemId
              ? visitWorkitems.filter(
                  w => w.primaryWorkitemFK === workitem.primaryWorkitemFK,
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
