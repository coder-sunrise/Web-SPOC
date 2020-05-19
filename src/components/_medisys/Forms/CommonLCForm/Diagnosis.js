import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  FastField,
  EditableTableGrid,
} from '@/components'
import { ICD10AMSelect } from '@/components/_medisys'

class Diagnosis extends PureComponent {
  tableParas = {
    columns: [
      { name: 'diagnosisCode', title: 'ICD10-AM Code' },
      { name: 'diagnosisName', title: 'Description' },
    ],
    columnExtensions: [
      {
        columnName: 'diagnosisCode',
        render: (row) => {
          let { values } = this.props
          let { otherDiagnosis } = values.formData
          let index = otherDiagnosis.findIndex((o) => o.uid === row.uid)
          return (
            <FastField
              name={`formData.otherDiagnosis[${index}].diagnosisCode`}
              render={(args) => (
                <ICD10AMSelect
                  labelField='code'
                  valueField='code'
                  mode='tags'
                  maxSelected={1}
                  disableAll
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisFK`,
                      option ? option.id : undefined,
                    )
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisName`,
                      option ? option.displayvalue : undefined,
                    )
                  }}
                />
              )}
            />
          )
        },
      },
      {
        columnName: 'diagnosisName',
        render: (row) => {
          let { values } = this.props
          let { otherDiagnosis } = values.formData
          let index = otherDiagnosis.findIndex((o) => o.uid === row.uid)
          return (
            <FastField
              name={`formData.otherDiagnosis[${index}].diagnosisName`}
              render={(args) => (
                <ICD10AMSelect
                  mode='tags'
                  valueField='displayvalue'
                  maxSelected={1}
                  disableAll
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisFK`,
                      option ? option.id : undefined,
                    )
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisCode`,
                      option ? option.code : undefined,
                    )
                  }}
                />
              )}
            />
          )
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
                <ICD10AMSelect
                  label='ICD10-AM Code'
                  labelField='code'
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      'formData.principalDiagnosisCode',
                      option ? option.code : undefined,
                    )
                    setFieldValue(
                      'formData.principalDiagnosisName',
                      option ? option.displayvalue : undefined,
                    )
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.principalDiagnosisFK'
              render={(args) => (
                <ICD10AMSelect
                  label='Description'
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      'formData.principalDiagnosisCode',
                      option ? option.code : undefined,
                    )
                    setFieldValue(
                      'formData.principalDiagnosisName',
                      option ? option.displayvalue : undefined,
                    )
                  }}
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
                  <ICD10AMSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    dispatch={this.props.dispatch}
                    onChange={(v, option) => {
                      const { setFieldValue } = this.props
                      setFieldValue(
                        'formData.secondDiagnosisACode',
                        option ? option.code : undefined,
                      )
                      setFieldValue(
                        'formData.secondDiagnosisAName',
                        option ? option.displayvalue : undefined,
                      )
                    }}
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisAFK'
              render={(args) => (
                <ICD10AMSelect
                  label='Description'
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      'formData.secondDiagnosisACode',
                      option ? option.code : undefined,
                    )
                    setFieldValue(
                      'formData.secondDiagnosisAName',
                      option ? option.displayvalue : undefined,
                    )
                  }}
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
                  <ICD10AMSelect
                    style={{
                      marginLeft: 20,
                      paddingRight: 20,
                    }}
                    label='ICD10-AM Code'
                    labelField='code'
                    {...args}
                    dispatch={this.props.dispatch}
                    onChange={(v, option) => {
                      const { setFieldValue } = this.props
                      setFieldValue(
                        'formData.secondDiagnosisBCode',
                        option ? option.code : undefined,
                      )
                      setFieldValue(
                        'formData.secondDiagnosisBName',
                        option ? option.displayvalue : undefined,
                      )
                    }}
                  />
                </div>
              )}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='formData.secondDiagnosisBFK'
              render={(args) => (
                <ICD10AMSelect
                  label='Description'
                  {...args}
                  dispatch={this.props.dispatch}
                  onChange={(v, option) => {
                    const { setFieldValue } = this.props
                    setFieldValue(
                      'formData.secondDiagnosisBCode',
                      option ? option.code : undefined,
                    )
                    setFieldValue(
                      'formData.secondDiagnosisBName',
                      option ? option.displayvalue : undefined,
                    )
                  }}
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
