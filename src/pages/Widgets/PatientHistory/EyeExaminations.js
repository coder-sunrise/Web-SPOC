import React from 'react'
import { Table } from 'antd'
import { formatMessage } from 'umi'
import numeral from 'numeral'
import { Tooltip, RadioGroup } from '@/components'
import tablestyles from './PatientHistoryStyle.less'
import { inputValue, getHistoryValueForBoolean } from './config'

const getVisualAcuityTestRows = (corEyeExaminations = []) => {
  let data = []
  data = [
    {
      id: 1,
      type: 'Right Eye',
      bareEye5: inputValue(corEyeExaminations[0].rightBareEye5)
        ? `${numeral(corEyeExaminations[0].rightBareEye5).format('0.0')}`
        : '-',
      correctedVision5: inputValue(corEyeExaminations[0].rightCorrectedVision5)
        ? `${numeral(corEyeExaminations[0].rightCorrectedVision5).format(
            '0.0',
          )}`
        : '-',
      bareEye50: inputValue(corEyeExaminations[0].rightBareEye50)
        ? `${numeral(corEyeExaminations[0].rightBareEye50).format('0.0')}`
        : '-',
      correctedVision50: inputValue(
        corEyeExaminations[0].rightCorrectedVision50,
      )
        ? `${numeral(corEyeExaminations[0].rightCorrectedVision50).format(
            '0.0',
          )}`
        : '-',
    },
    {
      id: 2,
      type: 'Left Eye',
      bareEye5: inputValue(corEyeExaminations[0].leftBareEye5)
        ? `${numeral(corEyeExaminations[0].leftBareEye5).format('0.0')}`
        : '-',
      correctedVision5: inputValue(corEyeExaminations[0].leftCorrectedVision5)
        ? `${numeral(corEyeExaminations[0].leftCorrectedVision5).format('0.0')}`
        : '-',
      bareEye50: inputValue(corEyeExaminations[0].leftBareEye50)
        ? `${numeral(corEyeExaminations[0].leftBareEye50).format('0.0')}`
        : '-',
      correctedVision50: inputValue(corEyeExaminations[0].leftCorrectedVision50)
        ? `${numeral(corEyeExaminations[0].leftCorrectedVision50).format(
            '0.0',
          )}`
        : '-',
    },
  ]
  return data
}

const getIntraocularPressureTestRows = (corEyeExaminations = []) => {
  let data = []
  data = [
    {
      id: 1,
      type: 'Right Eye',
      firstResult: inputValue(corEyeExaminations[0].rightFirstResult)
        ? `${corEyeExaminations[0].rightFirstResult}`
        : '-',
      secondResult: inputValue(corEyeExaminations[0].rightSecondResult)
        ? `${corEyeExaminations[0].rightSecondResult}`
        : '-',
      thirdResult: inputValue(corEyeExaminations[0].rightThirdResult)
        ? `${corEyeExaminations[0].rightThirdResult}`
        : '-',
      averageResult: inputValue(corEyeExaminations[0].rightAverageResult)
        ? `${numeral(corEyeExaminations[0].rightAverageResult).format('0.0')}`
        : '-',
    },
    {
      id: 2,
      type: 'Left Eye',
      firstResult: inputValue(corEyeExaminations[0].leftFirstResult)
        ? `${corEyeExaminations[0].leftFirstResult}`
        : '-',
      secondResult: inputValue(corEyeExaminations[0].leftSecondResult)
        ? `${corEyeExaminations[0].leftSecondResult}`
        : '-',
      thirdResult: inputValue(corEyeExaminations[0].leftThirdResult)
        ? `${corEyeExaminations[0].leftThirdResult}`
        : '-',
      averageResult: inputValue(corEyeExaminations[0].leftAverageResult)
        ? `${numeral(corEyeExaminations[0].leftAverageResult).format('0.0')}`
        : '-',
    },
  ]
  return data
}

const showVisualAcuityTest = (corEyeExaminations = []) => {
  if (
    corEyeExaminations.find(
      row =>
        inputValue(row.visionCorrectionMethod) ||
        inputValue(row.leftBareEye5) ||
        inputValue(row.leftCorrectedVision5) ||
        inputValue(row.leftBareEye50) ||
        inputValue(row.leftCorrectedVision50) ||
        inputValue(row.rightBareEye5) ||
        inputValue(row.rightCorrectedVision5) ||
        inputValue(row.rightBareEye50) ||
        inputValue(row.rightCorrectedVision50),
    )
  )
    return true
  return false
}

const showIOP = (corEyeExaminations = []) => {
  if (
    corEyeExaminations.find(
      row =>
        inputValue(row.leftFirstResult) ||
        inputValue(row.leftSecondResult) ||
        inputValue(row.leftThirdResult) ||
        inputValue(row.rightFirstResult) ||
        inputValue(row.rightSecondResult) ||
        inputValue(row.rightThirdResult),
    )
  )
    return true
  return false
}
const showColorVisionTest = (corEyeExaminations = []) => {
  if (
    corEyeExaminations.find(
      row =>
        inputValue(row.colorVisionTestResult) ||
        (inputValue(row.remarks) && row.remarks.trim().length),
    )
  )
    return true
  return false
}
export default ({ current }) => {
  const { corEyeExaminations = [] } = current
  return (
    <div style={{ marginBottom: 8, marginTop: 8 }}>
      {showVisualAcuityTest(corEyeExaminations) && (
        <div>
          <div style={{ fontWeight: 'bold', margin: '6px 0px' }}>
            Visual Acuity Test
          </div>
          <RadioGroup
            label='Vision Correction Method'
            options={[
              { value: 'Lasik', label: 'Lasik' },
              { value: 'Contact Lens', label: 'Contact Lens' },
              { value: 'Glasses', label: 'Glasses' },
            ]}
            value={corEyeExaminations[0].visionCorrectionMethod}
            disabled
          />
          <Table
            size='small'
            bordered
            pagination={false}
            columns={[
              {
                dataIndex: 'type',
                title: 'Eye/Distance',
                width: 140,
              },
              {
                dataIndex: 'bareEye5',
                title: '5 meters (Bare Eye)',
                align: 'center',
              },
              {
                dataIndex: 'correctedVision5',
                title: '5 meters (Corrected Vision)',
                align: 'center',
              },
              {
                dataIndex: 'bareEye50',
                title: '50 meters (Bare Eye)',
                align: 'center',
              },
              {
                dataIndex: 'correctedVision50',
                title: '50 meters (Corrected Vision)',
                align: 'center',
              },
            ]}
            dataSource={getVisualAcuityTestRows(corEyeExaminations)}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {showIOP(corEyeExaminations) && (
        <div>
          <div style={{ fontWeight: 'bold', margin: '6px 0px' }}>
            Intraocular Pressure Test (IOP)
          </div>
          <Table
            size='small'
            bordered
            pagination={false}
            columns={[
              {
                dataIndex: 'type',
                title: 'Eye/Test Result',
                width: 140,
              },
              {
                dataIndex: 'firstResult',
                title: '1st Result (mmHg)',
                align: 'center',
              },
              {
                dataIndex: 'secondResult',
                title: '2nd Result (mmHg)',
                align: 'center',
              },
              {
                dataIndex: 'thirdResult',
                title: '3rd Result (mmHg)',
                align: 'center',
              },
              {
                dataIndex: 'averageResult',
                title: 'Average Result (mmHg)',
                align: 'center',
              },
            ]}
            dataSource={getIntraocularPressureTestRows(corEyeExaminations)}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? tablestyles.once : tablestyles.two
            }}
            className={tablestyles.table}
          />
        </div>
      )}
      {showColorVisionTest(corEyeExaminations) && (
        <div>
          <div style={{ fontWeight: 'bold', margin: '6px 0px' }}>
            Color Vision Test
          </div>
          <div style={{ position: 'relative', paddingLeft: 200 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: -4,
              }}
            >
              <RadioGroup
                label='Color Vision Test Result'
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'Abnormal', label: 'Abnormal' },
                ]}
                value={corEyeExaminations[0].colorVisionTestResult}
                disabled
              />
            </div>
            <div>
              <div
                style={{ fontWeight: 'inherit', color: 'rgba(0, 0, 0, 0.54)' }}
              >
                Remarks
              </div>
              <div>
                {inputValue(corEyeExaminations[0].remarks) &&
                corEyeExaminations[0].remarks.trim().length
                  ? corEyeExaminations[0].remarks
                  : '-'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
