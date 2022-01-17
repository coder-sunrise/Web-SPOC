import React from 'react'
import { Table } from 'antd'
import { formatMessage } from 'umi'
import numeral from 'numeral'
import { Tooltip } from '@/components'
import tablestyles from './PatientHistoryStyle.less'
import { inputValue, getHistoryValueForBoolean } from './config'

export default ({ current }) => {
  const { patientNoteVitalSigns = [] } = current
  const generalColumns = [
    {
      dataIndex: 'temperatureC',
      title: 'Temperature',
      render: (text, row) => (
        <span>
          {inputValue(row.temperatureC)
            ? `${numeral(row.temperatureC).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.temperature.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'bpSysMMHG',
      title: 'Blood Presure SYS',
      render: (text, row) => (
        <span>
          {inputValue(row.bpSysMMHG)
            ? `${numeral(row.bpSysMMHG).format('0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.mmhg',
              })}`
            : '-'}
        </span>
      ),
    },

    {
      dataIndex: 'bpDiaMMHG',
      title: 'Blood Presure DIA',
      render: (text, row) => (
        <span>
          {inputValue(row.bpDiaMMHG)
            ? `${numeral(row.bpDiaMMHG).format('0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.mmhg',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'pulseRateBPM',
      title: 'Heart Rate',
      render: (text, row) => (
        <span>
          {inputValue(row.pulseRateBPM)
            ? `${numeral(row.pulseRateBPM).format('0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.heartRate.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'saO2',
      title: 'SaO2',
      render: (text, row) => (
        <span>
          {inputValue(row.saO2)
            ? `${numeral(row.saO2).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.saO2.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'weightKG',
      title: 'Weight',
      render: (text, row) => (
        <span>
          {inputValue(row.weightKG)
            ? `${numeral(row.weightKG).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.weight.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'heightCM',
      title: 'Height',
      render: (text, row) => (
        <span>
          {inputValue(row.heightCM)
            ? `${numeral(row.heightCM).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.height.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'bmi',
      title: 'Body Mass Index (BMI)',
      render: (text, row) => (
        <span>
          {inputValue(row.bmi)
            ? `${numeral(row.bmi).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.bmi.suffix',
              })}`
            : '0.0'}
        </span>
      ),
    },
  ]

  const otherColumns1 = [
    {
      dataIndex: 'bodyFatPercentage',
      title: 'Body Fat %',
      render: (text, row) => (
        <span>
          {inputValue(row.bodyFatPercentage)
            ? `${numeral(row.bodyFatPercentage).format('0.0')} ${formatMessage({
                id:
                  'reception.queue.visitRegistration.bodyFatPercentage.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'degreeOfObesity',
      title: 'Degree of Obesity',
      render: (text, row) => (
        <span>
          {inputValue(row.degreeOfObesity)
            ? `${numeral(row.degreeOfObesity).format('0.0')} ${formatMessage({
                id: 'reception.queue.visitRegistration.degreeOfObesity.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'headCircumference',
      title: 'Head Circumference',
      render: (text, row) => (
        <span>
          {inputValue(row.headCircumference)
            ? `${numeral(row.headCircumference).format('0.0')} ${formatMessage({
                id:
                  'reception.queue.visitRegistration.headCircumference.suffix',
              })}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'chestCircumference',
      title: 'Chest Circumference',
      render: (text, row) => (
        <span>
          {inputValue(row.chestCircumference)
            ? `${numeral(row.chestCircumference).format('0.0')} ${formatMessage(
                {
                  id:
                    'reception.queue.visitRegistration.chestCircumference.suffix',
                },
              )}`
            : '-'}
        </span>
      ),
    },
    {
      dataIndex: 'waistCircumference',
      title: 'Waist Circumference',
      render: (text, row) => {
        if (row.isChild || row.isPregnancy)
          return (
            <Tooltip title='Waist circumference is not available for children or pregnant women'>
              <span>Not Available</span>
            </Tooltip>
          )
        return (
          <span>
            {inputValue(row.waistCircumference)
              ? `${numeral(row.waistCircumference).format(
                  '0.0',
                )} ${formatMessage({
                  id:
                    'reception.queue.visitRegistration.waistCircumference.suffix',
                })}`
              : '-'}
          </span>
        )
      },
    },
    {
      dataIndex: 'isPregnancy',
      title: 'Pregnancy',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.isPregnancy)}</span>
      ),
    },
  ].filter(
    c => current.patientGender !== 'Male' || c.dataIndex !== 'isPregnancy',
  )

  const otherColumns2 = [
    {
      dataIndex: 'hepetitisVaccinationA',
      title: 'Hepetitis A Vaccination',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.hepetitisVaccinationA)}</span>
      ),
    },
    {
      dataIndex: 'hepetitisVaccinationB',
      title: 'Hepetitis B Vaccination',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.hepetitisVaccinationB)}</span>
      ),
    },
    {
      dataIndex: 'isFasting',
      title: 'Fasting',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.isFasting)}</span>
      ),
    },
    {
      dataIndex: 'isSmoking',
      title: 'Smoking',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.isSmoking)}</span>
      ),
    },
    {
      dataIndex: 'isAlcohol',
      title: 'Alcohol',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.isAlcohol)}</span>
      ),
    },
    {
      dataIndex: 'isMensus',
      title: 'Mensus',
      render: (text, row) => (
        <span>{getHistoryValueForBoolean(row.isMensus)}</span>
      ),
    },
  ].filter(c => current.patientGender !== 'Male' || c.dataIndex !== 'isMensus')

  const showGeneral = () => {
    return patientNoteVitalSigns.find(
      row =>
        inputValue(row.temperatureC) ||
        inputValue(row.bpSysMMHG) ||
        inputValue(row.bpDiaMMHG) ||
        inputValue(row.pulseRateBPM) ||
        inputValue(row.saO2) ||
        inputValue(row.weightKG) ||
        inputValue(row.heightCM) ||
        inputValue(row.bmi),
    )
  }

  const showOther1 = () => {
    return patientNoteVitalSigns.find(
      row =>
        inputValue(row.bodyFatPercentage) ||
        inputValue(row.degreeOfObesity) ||
        inputValue(row.headCircumference) ||
        inputValue(row.chestCircumference) ||
        inputValue(row.waistCircumference) ||
        inputValue(row.isPregnancy),
    )
  }

  const showOther2 = () => {
    return patientNoteVitalSigns.find(
      row =>
        inputValue(row.hepetitisVaccinationA) ||
        inputValue(row.hepetitisVaccinationB) ||
        inputValue(row.isFasting) ||
        inputValue(row.isSmoking) ||
        inputValue(row.isAlcohol) ||
        inputValue(row.isMensus),
    )
  }
  return (
    <div>
      {showGeneral() && (
        <div>
          <div style={{ fontWeight: 'bold', margin: '6px 0px' }}>General</div>

          <Table
            size='small'
            bordered
            pagination={false}
            columns={generalColumns}
            dataSource={patientNoteVitalSigns}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {(showOther1() || showOther2()) && (
        <div>
          <div style={{ fontWeight: 'bold', margin: '6px 0px' }}>Others</div>
          {showOther1() && (
            <Table
              size='small'
              bordered
              pagination={false}
              columns={otherColumns1}
              dataSource={patientNoteVitalSigns}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? tablestyles.once : tablestyles.two
              }}
              className={tablestyles.table}
            />
          )}
          {showOther2() && (
            <Table
              style={{ marginTop: 6 }}
              size='small'
              bordered
              pagination={false}
              columns={otherColumns2}
              dataSource={patientNoteVitalSigns}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? tablestyles.once : tablestyles.two
              }}
              className={tablestyles.table}
            />
          )}
        </div>
      )}
    </div>
  )
}
