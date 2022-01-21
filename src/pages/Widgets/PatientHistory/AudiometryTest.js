import React from 'react'
import { Table } from 'antd'
import { formatMessage } from 'umi'
import numeral from 'numeral'
import { Tooltip } from '@/components'
import tablestyles from './PatientHistoryStyle.less'
import { hasValue, getHistoryValueForBoolean } from './config'

const getRows = (corAudiometryTest = []) => {
  let data = []
  data = [
    {
      id: 1,
      type: 'Right',
      result1000Hz: hasValue(corAudiometryTest[0].rightResult1000Hz)
        ? `${corAudiometryTest[0].rightResult1000Hz} dB`
        : '-',
      result4000Hz: hasValue(corAudiometryTest[0].rightResult4000Hz)
        ? `${corAudiometryTest[0].rightResult4000Hz} dB`
        : '-',
    },
    {
      id: 2,
      type: 'Left',
      result1000Hz: hasValue(corAudiometryTest[0].leftResult1000Hz)
        ? `${corAudiometryTest[0].leftResult1000Hz} dB`
        : '-',
      result4000Hz: hasValue(corAudiometryTest[0].leftResult4000Hz)
        ? `${corAudiometryTest[0].leftResult4000Hz} dB`
        : '-',
    },
  ]
  return data
}
export default ({ current }) => {
  const { corAudiometryTest = [] } = current
  return (
    <div style={{ marginBottom: 8, marginTop: 8 }}>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'type',
            title: ' ',
            width: 80,
          },
          {
            dataIndex: 'result1000Hz',
            title: '1000Hz Result',
            align: 'center',
          },
          {
            dataIndex: 'result4000Hz',
            title: '4000Hz Result',
            align: 'center',
          },
        ]}
        dataSource={getRows(corAudiometryTest)}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
