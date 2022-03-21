import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import { Popover, Tooltip } from '@/components'
import { Table } from 'antd'
import { TESTTYPES, GENDER } from '@/utils/constants'
import { toLower } from 'lodash'

export const defaultData = [
  {
    id: 1,
    testCode: TESTTYPES.BASICEXAMINATION,
    type: 'Basic Examination',
    isGroup: true,
  },
  {
    id: 2,
    type: 'Temperature (\u00b0C)',
    tableName: 'basicExaminations',
    fieldName: 'temperatureC',
    format: '0.0',
  },
  {
    id: 3,
    testCode: TESTTYPES.BPSYS,
    type: 'BP Sys (mmHg)',
    typeTootip: 'Blood Pressure Systole',
    refRange: '(<130)',
    tableName: 'basicExaminations',
    fieldName: 'bpSysMMHG',
  },
  {
    id: 4,
    testCode: TESTTYPES.BPDIA,
    refRange: '(<85)',
    type: 'BP DIA (mmHg)',
    typeTootip: 'Blood Pressure Diastole',
    tableName: 'basicExaminations',
    fieldName: 'bpDiaMMHG',
  },
  {
    id: 5,
    type: 'Pulse (mmHg)',
    tableName: 'basicExaminations',
    fieldName: 'pulseRateBPM',
  },
  {
    id: 6,
    type: 'SaO2 (%)',
    tableName: 'basicExaminations',
    fieldName: 'saO2',
  },
  {
    id: 7,
    type: 'Weight (kg)',
    tableName: 'basicExaminations',
    fieldName: 'weightKG',
    format: '0.0',
  },
  {
    id: 8,
    type: 'Height (cm)',
    tableName: 'basicExaminations',
    fieldName: 'heightCM',
    format: '0.0',
  },
  {
    id: 9,
    type: 'Std Weight (kg)',
    typeTootip: 'Standard Weight',
    tableName: 'basicExaminations',
    fieldName: 'standardWeight',
    format: '0.0',
  },
  {
    id: 10,
    testCode: TESTTYPES.BMI,
    type: 'BMI (kg/m\u00b2)',
    typeTootip: 'Body Mass Index',
    refRange: '(18.5-25)',
    tableName: 'basicExaminations',
    fieldName: 'bmi',
    format: '0.0',
  },
  {
    id: 11,
    testCode: TESTTYPES.ROHRER,
    type: 'Rohrer (kg/cm\u00b3X10\u2077)',
    refRange: '(120-160)',
    tableName: 'basicExaminations',
    fieldName: 'rohrer',
    format: '0.0',
  },
  {
    id: 12,
    testCode: TESTTYPES.KAUP,
    type: 'Kaup (kg/cm\u00b2X10\u00b2)',
    refRange: '(15-18)',
    tableName: 'basicExaminations',
    fieldName: 'kaup',
    format: '0.0',
  },
  {
    id: 13,
    type: 'Body Fat (%)',
    tableName: 'basicExaminations',
    fieldName: 'bodyFatPercentage',
    format: '0.0',
  },
  {
    id: 14,
    type: 'Body Fat Mass (kg)',
    tableName: 'basicExaminations',
    fieldName: 'bodyFatMass',
    format: '0.0',
  },
  {
    id: 15,
    type: 'Degree of Obesity (%)',
    tableName: 'basicExaminations',
    fieldName: 'degreeOfObesity',
    format: '0.0',
  },
  {
    id: 16,
    type: 'Head (cm)',
    tableName: 'basicExaminations',
    fieldName: 'headCircumference',
    format: '0.0',
  },
  {
    id: 17,
    type: 'Chest (cm)',
    tableName: 'basicExaminations',
    fieldName: 'chestCircumference',
    format: '0.0',
  },
  {
    id: 18,
    testCode: TESTTYPES.WAIST,
    type: 'Waist (cm)',
    tableName: 'basicExaminations',
    fieldName: 'waistCircumference',
    format: '0.0',
  },
  {
    id: 19,
    type: 'Pregnancy',
    testCode: TESTTYPES.PREGNANCY,
    tableName: 'basicExaminations',
    fieldName: 'isPregnancy',
    valueType: 'boolean',
  },
  {
    id: 20,
    type: 'HA Vaccination',
    tableName: 'basicExaminations',
    fieldName: 'hepetitisVaccinationA',
    valueType: 'boolean',
  },
  {
    id: 21,
    type: 'HB Vaccination',
    tableName: 'basicExaminations',
    fieldName: 'hepetitisVaccinationB',
    valueType: 'boolean',
  },
  {
    id: 22,
    type: 'Fasting',
    tableName: 'basicExaminations',
    fieldName: 'isFasting',
    valueType: 'boolean',
  },
  {
    id: 23,
    type: 'Smoking',
    tableName: 'basicExaminations',
    fieldName: 'isSmoking',
    valueType: 'boolean',
  },
  {
    id: 24,
    type: 'Alcohol',
    tableName: 'basicExaminations',
    fieldName: 'isAlcohol',
    valueType: 'boolean',
  },
  {
    id: 25,
    type: 'Mensus',
    testCode: TESTTYPES.MENSUS,
    tableName: 'basicExaminations',
    fieldName: 'isMensus',
    valueType: 'boolean',
  },
  {
    id: 26,
    type: 'Visual Acuity Test',
    isGroup: true,
  },
  {
    id: 27,
    type: 'Correction Method',
    tableName: 'eyeExaminations',
    fieldName: 'visionCorrectionMethod',
  },
  {
    id: 28,
    type: '5m (R)',
    tableName: 'eyeExaminations',
    fieldName: 'rightBareEye5',
    format: '0.0',
  },
  {
    id: 29,
    type: '5m Corrected (R)',
    testCode: TESTTYPES.L5MCORRECTED,
    tableName: 'eyeExaminations',
    fieldName: 'rightCorrectedVision5',
    format: '0.0',
  },
  {
    id: 30,
    type: '5m (L)',
    tableName: 'eyeExaminations',
    fieldName: 'leftBareEye5',
    format: '0.0',
  },
  {
    id: 31,
    type: '5m Corrected (L)',
    testCode: TESTTYPES.L5MCORRECTED,
    tableName: 'eyeExaminations',
    fieldName: 'leftCorrectedVision5',
    format: '0.0',
  },
  {
    id: 32,
    type: '50cm (R)',
    tableName: 'eyeExaminations',
    fieldName: 'rightBareEye50',
    format: '0.0',
  },
  {
    id: 33,
    type: '50cm Corrected (R)',
    testCode: TESTTYPES.R50CMCORRECTED,
    tableName: 'eyeExaminations',
    fieldName: 'rightCorrectedVision50',
    format: '0.0',
  },
  {
    id: 34,
    type: '50cm (L)',
    tableName: 'eyeExaminations',
    fieldName: 'leftBareEye50',
    format: '0.0',
  },
  {
    id: 35,
    type: '50cm Corrected (L)',
    testCode: TESTTYPES.L50CMCORRECTED,
    tableName: 'eyeExaminations',
    fieldName: 'leftCorrectedVision50',
    format: '0.0',
  },
  {
    id: 36,
    type: 'I.O.P.',
    typeTootip: 'Intraocular Pressure',
    isGroup: true,
  },
  {
    id: 37,
    testCode: TESTTYPES.IOP,
    type: 'Right (mmHg)',
    refRange: '(8-20)',
    tableName: 'eyeExaminations',
    fieldName: 'rightAverageResult',
    format: '0.0',
  },
  {
    id: 38,
    testCode: TESTTYPES.IOP,
    type: 'Left (mmHg)',
    refRange: '(8-20)',
    tableName: 'eyeExaminations',
    fieldName: 'leftAverageResult',
    format: '0.0',
  },
  {
    id: 39,
    type: 'Color Vision',
    isGroup: true,
  },
  {
    id: 40,
    testCode: TESTTYPES.COLORVISIONTEST,
    type: 'Color Vision',
    tableName: 'eyeExaminations',
    fieldName: 'colorVisionTestResult',
  },
  {
    id: 41,
    type: 'Audiometry',
    isGroup: true,
  },
  {
    id: 42,
    testCode: TESTTYPES.AUDIOMETRY,
    type: 'R/1000 (dB)',
    refRange: '(<=30)',
    tableName: 'audiometryTest',
    fieldName: 'rightResult1000Hz',
  },
  {
    id: 43,
    testCode: TESTTYPES.AUDIOMETRY,
    type: 'R/4000 (dB)',
    refRange: '(<=30)',
    tableName: 'audiometryTest',
    fieldName: 'rightResult4000Hz',
  },
  {
    id: 44,
    testCode: TESTTYPES.AUDIOMETRY,
    type: 'L/1000 (dB)',
    refRange: '(<=30)',
    tableName: 'audiometryTest',
    fieldName: 'leftResult1000Hz',
  },
  {
    id: 45,
    testCode: TESTTYPES.AUDIOMETRY,
    type: 'L/4000 (dB)',
    refRange: '(<=30)',
    tableName: 'audiometryTest',
    fieldName: 'leftResult4000Hz',
  },
]

export const defaultColumns = genderFK => {
  return [
    {
      dataIndex: 'type',
      title: (
        <div
          style={{
            paddingLeft: 4,
          }}
        >
          <div>Test Name</div>
        </div>
      ),
      width: 150,
      fixed: 'left',
      render: (text, row) => {
        if (row.isGroup) {
          return (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  paddingLeft: 4,
                  paddingTop: 2,
                  paddingBottom: 2,
                  left: 0,
                  width: 152,
                }}
              >
                <Tooltip title={row.typeTootip}>
                  <span>{row.type}</span>
                </Tooltip>
                {row.testCode === TESTTYPES.BASICEXAMINATION && (
                  <Popover
                    icon={null}
                    placement='topLeft'
                    content={
                      <Table
                        size='small'
                        bordered
                        pagination={false}
                        columns={[
                          {
                            dataIndex: 'testName',
                            title: 'Test Name',
                            width: 120,
                          },
                          {
                            dataIndex: 'formula',
                            title: 'Formula',
                            width: 220,
                          },
                        ]}
                        dataSource={[
                          {
                            id: 1,
                            testName: 'Standard Weight',
                            formula: 'Height (m) * Height (m) X 22',
                          },
                          {
                            id: 2,
                            testName: 'Body Fat Mass',
                            formula: 'Weight (kg) X Body Fat %',
                          },
                          {
                            id: 3,
                            testName: 'BMI',
                            formula: 'Weight (kg)/ Height (m)\u00b2',
                          },
                          {
                            id: 4,
                            testName: 'Rohrer',
                            formula:
                              'Weight (kg)/ Height (cm)\u00b3 X 10\u2077',
                          },
                          {
                            id: 4,
                            testName: 'Kaup',
                            formula:
                              'Weight (kg)/ Height (cm)\u00b2 X 10\u00b2',
                          },
                        ]}
                      />
                    }
                  >
                    <InfoCircleOutlined style={{ marginLeft: 6 }} />
                  </Popover>
                )}
              </div>
            </div>
          )
        }
        const isSub =
          [
            TESTTYPES.R5MCORRECTED,
            TESTTYPES.R50CMCORRECTED,
            TESTTYPES.L5MCORRECTED,
            TESTTYPES.L50CMCORRECTED,
          ].indexOf(row.testCode) >= 0

        return (
          <div
            style={{
              paddingLeft: isSub ? 36 : 4,
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <Tooltip title={row.typeTootip}>
              <span> {isSub ? 'Corrected' : row.type}</span>
            </Tooltip>
          </div>
        )
      },
      onCell: row => {
        if (row.isGroup)
          return {
            style: { backgroundColor: '#daecf5' },
          }
      },
    },
    {
      dataIndex: 'refRange',
      align: 'right',
      title: (
        <div
          style={{
            paddingRight: 4,
          }}
        >
          <div>Ref. Range</div>
        </div>
      ),
      width: 80,
      fixed: 'left',
      render: (text, row) => {
        let range = row.refRange
        if (row.testCode === TESTTYPES.WAIST) {
          if (genderFK === GENDER.FEMALE) range = '(F<90)'
          else if (genderFK === GENDER.MALE) range = '(M<85)'
        }
        return (
          <div
            style={{
              padding: '2px 4px',
            }}
          >
            {range}
          </div>
        )
      },
      onCell: row => {
        if (row.isGroup)
          return {
            style: { backgroundColor: '#daecf5' },
          }
      },
    },
    {
      dataIndex: 'action',
      title: '',
      width: '100%',
    },
  ]
}
