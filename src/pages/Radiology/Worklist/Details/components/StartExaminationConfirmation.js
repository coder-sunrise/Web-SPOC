import React, { useEffect, useState, useContext } from 'react'
import _ from 'lodash'
import { useSelector, useDispatch } from 'dva'
import { Table, Radio } from 'antd'
import moment from 'moment'
import { ProgressButton, CommonModal, TextField } from '@/components'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'
import WorklistContext from '@/pages/Radiology/Worklist/WorklistContext'

export const StartExaminationConfirmation = ({
  open,
  workitem,
  combinedWorkitems = [],
  onStartConfirm,
  onStartClose,
}) => {
  const { getPrimaryWorkitem } = useContext(WorklistContext)

  const primaryWorkitemAccessNo = getPrimaryWorkitem(workitem)?.accessionNo

  const startExaminationConfirmationTable = [
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

  const getRadiographers = () => {
    const uniqueRadiogrpahers = _.uniq(
      combinedWorkitems
        .filter(
          v => v.assignedRadiographers && v.assignedRadiographers.length > 0,
        )
        .flatMap(v => v.assignedRadiographers.map(a => a.name)),
    )

    if (uniqueRadiogrpahers.length === 0) return ''

    return uniqueRadiogrpahers.reduce((a, b) => a + ', ' + b)
  }

  return (
    <CommonModal
      open={open}
      title='Start Examination'
      showFooter={true}
      maxWidth='sm'
      confirmProps={{ disabled: true }}
      onConfirm={() => {
        onStartConfirm()
      }}
      onClose={() => {
        if (onStartClose) onStartClose()
      }}
    >
      <div>{`Confirm to start Combined Order ${primaryWorkitemAccessNo}?`}</div>
      <div style={{ margin: 10 }}>
        <Table
          bordered
          size='small'
          pagination={false}
          columns={startExaminationConfirmationTable}
          dataSource={combinedWorkitems}
        />
        <div style={{ margin: 10 }}>
          Radiology Technologist: {getRadiographers(combinedWorkitems)}
        </div>
      </div>
    </CommonModal>
  )
}
