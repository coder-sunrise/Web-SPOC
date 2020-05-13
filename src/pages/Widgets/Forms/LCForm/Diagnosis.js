import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  DatePicker,
  RadioButtonGroup,
  CodeSelect,
  EditableTableGrid,
} from '@/components'

class Diagnosis extends PureComponent {
  tableParas = {
    columns: [
      { name: 'diagnosisCode', title: 'ICD10-AM Code' },
      { name: 'diagnosisName', title: 'Description' },
    ],
    columnExtensions: [
      {
        columnName: 'diagnosisCode',
        type: 'codeSelect',
        code: 'CTCaseDescription',
        valueField: 'code',
        labelField: 'code',
        onChange: ({ option, row }) => {
          row.diagnosisName = option ? option.name : undefined
        },
      },
      {
        columnName: 'diagnosisName',
        type: 'codeSelect',
        code: 'CTCaseDescription',
        valueField: 'name',
        labelField: 'name',
        onChange: ({ option, row }) => {
          row.diagnosisCode = option ? option.code : undefined
        },
      },
    ],
  }

  commitChanges = ({ rows, deleted }) => {
    const { setFieldValue } = this.props
    if (deleted) {
      rows = rows.filter((o) => o.id !== deleted[0])
    }
    setFieldValue('formData.otherDiagnosis', rows)
  }

  render () {
    const { values, diagnosisSchema } = this.props
    const { otherDiagnosis } = values.formData
    return (
      <div>
        <span>Principal Diagnosis</span>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='formData.principalDiagnosisFK'
              render={(args) => (
                <CodeSelect
                  label='ICD10-AM Code'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.principalDiagnosisFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='code'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <span>Second Diagnosis</span>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisAFK'
              render={(args) => (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                    }}
                  >
                    1)
                  </span>
                  <CodeSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    code='CTCaseDescription'
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisAFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisBFK'
              render={(args) => (
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 4,
                    }}
                  >
                    2)
                  </span>
                  <CodeSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    code='CTCaseDescription'
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisBFK'
              render={(args) => (
                <CodeSelect
                  label='Description'
                  labelField='name'
                  {...args}
                  code='CTCaseDescription'
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer />
        <span>Other Diagnosis</span>
        <EditableTableGrid
          rows={otherDiagnosis}
          EditingProps={{
            showAddCommand: true,
            onCommitChanges: this.commitChanges,
          }}
          FuncProps={{
            pager: false,
          }}
          schema={diagnosisSchema}
          {...this.tableParas}
        />
        <GridContainer />
      </div>
    )
  }
}
export default Diagnosis
