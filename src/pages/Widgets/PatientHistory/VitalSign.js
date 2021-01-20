import React from 'react'
import { Table } from 'antd'
import { formatMessage } from 'umi/locale'
import numeral from 'numeral'
import tablestyles from './PatientHistoryStyle.less'

export default ({ current }) => {
  const { patientNoteVitalSigns = [] } = current
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'temperatureC',
            title: 'Temperature',
            render: (text, row) => (
              <span>
                {`${row.temperatureC
                  ? numeral(row.temperatureC).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.temperature.suffix',
                })}`}
              </span>
            ),
          },
          {
            dataIndex: 'bpSysMMHG',
            title: 'Blood Presure SYS',
            render: (text, row) => (
              <span>
                {`${row.bpSysMMHG
                  ? numeral(row.bpSysMMHG).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.mmhg',
                })}`}
              </span>
            ),
          },

          {
            dataIndex: 'bpDiaMMHG',
            title: 'Blood Presure DIA',
            render: (text, row) => (
              <span>
                {`${row.bpDiaMMHG
                  ? numeral(row.bpDiaMMHG).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.mmhg',
                })}`}
              </span>
            ),
          },
          {
            dataIndex: 'pulseRateBPM',
            title: 'Heart Rate',
            render: (text, row) => (
              <span>
                {`${row.pulseRateBPM
                  ? numeral(row.pulseRateBPM).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.heartRate.suffix',
                })}`}
              </span>
            ),
          },
          {
            dataIndex: 'weightKG',
            title: 'Weight',
            render: (text, row) => (
              <span>
                {`${row.weightKG
                  ? numeral(row.weightKG).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.weight.suffix',
                })}`}
              </span>
            ),
          },
          {
            dataIndex: 'heightCM',
            title: 'Height',
            render: (text, row) => (
              <span>
                {`${row.heightCM
                  ? numeral(row.heightCM).format('0.0')
                  : '-'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.height.suffix',
                })}`}
              </span>
            ),
          },
          {
            dataIndex: 'bmi',
            title: 'Body Mass Index (BMI)',
            render: (text, row) => (
              <span>
                {`${row.bmi
                  ? numeral(row.bmi).format('0.0')
                  : '0.0'} ${formatMessage({
                  id: 'reception.queue.visitRegistration.bmi.suffix',
                })}`}
              </span>
            ),
          },
        ]}
        dataSource={patientNoteVitalSigns}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
