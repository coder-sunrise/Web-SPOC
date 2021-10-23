import React, { useEffect, useState, useContext } from 'react'
import _ from 'lodash'
import { useSelector, useDispatch } from 'dva'
import { Table, Radio } from 'antd'
import moment from 'moment'
import { ProgressButton, CommonModal, TextField } from '@/components'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'
import { examinationSteps } from '@/utils/codes'

const startExaminationConfirmationTable = [
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

export const StartExaminationConfirmation = ({
  open,
  workitem,
  combinedWorkitems = [],
  onStartConfirm,
  onStartClose,
}) => {
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
      <div>Confirm to start examination below? </div>
      <div style={{ margin: 10 }}>
        <Table
          bordered
          size='small'
          pagination={false}
          columns={startExaminationConfirmationTable}
          dataSource={combinedWorkitems}
        />
        <div style={{ margin: 10 }}>
          Radiographer(s): {getRadiographers(combinedWorkitems)}
        </div>
      </div>
    </CommonModal>
  )
}
