import React, { useState } from 'react'
import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FastField,
} from '@/components'
import { ICD10AMSelect, DiagnosisSelect } from '@/components/_medisys'

const Diagnosis = ({ setFieldValue, values, diagnosisSchema }) => {
  const [
    principalDiagnosiss,
    setPrincipalDiagnosiss,
  ] = useState([])

  const [
    secondDiagnosisAs,
    setSecondDiagnosisAs,
  ] = useState([
    { id: 1, code: '444', displayvalue: '444444' },
  ])

  const [
    secondDiagnosisBs,
    setSecondDiagnosisBs,
  ] = useState([])

  const tableParas = {
    columns: [
      { name: 'diagnosisCode', title: 'ICD10-AM Code' },
      { name: 'diagnosisName', title: 'Description' },
    ],
    columnExtensions: [
      {
        columnName: 'diagnosisCode',
        render: (row) => {
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
                  options={row.diagnosiss}
                  {...args}
                  onChange={(v, option) => {
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisFK`,
                      option ? option.id : undefined,
                    )
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisName`,
                      option ? option.displayvalue : undefined,
                    )
                  }}
                  onDataSouceChange={(data) => {
                    row.diagnosiss = data
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
          let { otherDiagnosis } = values.formData
          let index = otherDiagnosis.findIndex((o) => o.uid === row.uid)
          return (
            <FastField
              name={`formData.otherDiagnosis[${index}].diagnosisName`}
              render={(args) => (
                <ICD10AMSelect
                  mode='tags'
                  valueField='displayvalue'
                  labelField='displayvalue'
                  maxSelected={1}
                  disableAll
                  {...args}
                  options={row.diagnosiss}
                  onChange={(v, option) => {
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisFK`,
                      option ? option.id : undefined,
                    )
                    setFieldValue(
                      `formData.otherDiagnosis[${index}].diagnosisCode`,
                      option ? option.code : undefined,
                    )
                  }}
                  onDataSouceChange={(data) => {
                    row.diagnosiss = data
                  }}
                />
              )}
            />
          )
        },
      },
    ],
  }

  const commitChanges = ({ rows, deleted }) => {
    if (deleted) {
      rows = rows.filter((o) => o.id !== deleted[0])
    }
    setFieldValue('formData.otherDiagnosis', rows)
  }

  const onPrincipalDiagnosisChange = (v, option) => {
    setFieldValue(
      'formData.principalDiagnosisCode',
      option ? option.code : undefined,
    )
    setFieldValue(
      'formData.principalDiagnosisName',
      option ? option.displayvalue : undefined,
    )
  }

  const onsecondDiagnosisAChange = (v, option) => {
    setFieldValue(
      'formData.secondDiagnosisACode',
      option ? option.code : undefined,
    )
    setFieldValue(
      'formData.secondDiagnosisAName',
      option ? option.displayvalue : undefined,
    )
  }

  const onsecondDiagnosisBChange = (v, option) => {
    setFieldValue(
      'formData.secondDiagnosisBCode',
      option ? option.code : undefined,
    )
    setFieldValue(
      'formData.secondDiagnosisBName',
      option ? option.displayvalue : undefined,
    )
  }

  const onPrincipalDiagnosisDataSouceChange = (data) => {
    setPrincipalDiagnosiss(data)
  }

  const onSecondDiagnosisADataSouceChange = (data) => {
    console.log('AAAAA', data)
    setSecondDiagnosisAs(data)
  }

  const onSecondDiagnosisBDataSouceChange = (data) => {
    setSecondDiagnosisBs(data)
  }
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
                label='ICD10AM-Code'
                labelField='code'
                options={principalDiagnosiss}
                onChange={onPrincipalDiagnosisChange}
                onDataSouceChange={onPrincipalDiagnosisDataSouceChange}
                {...args}
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
                labelField='displayvalue'
                options={principalDiagnosiss}
                onChange={onPrincipalDiagnosisChange}
                onDataSouceChange={onPrincipalDiagnosisDataSouceChange}
                {...args}
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
                  label='ICD10AM-Code'
                  labelField='code'
                  options={secondDiagnosisAs}
                  {...args}
                  onChange={onsecondDiagnosisAChange}
                  onDataSouceChange={onSecondDiagnosisADataSouceChange}
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
                labelField='displayvalue'
                options={secondDiagnosisAs}
                {...args}
                onChange={onsecondDiagnosisAChange}
                onDataSouceChange={onSecondDiagnosisADataSouceChange}
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
                  label='ICD10AM-Code'
                  labelField='code'
                  options={secondDiagnosisBs}
                  {...args}
                  onChange={onsecondDiagnosisBChange}
                  onDataSouceChange={onSecondDiagnosisBDataSouceChange}
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
                {...args}
                label='Description'
                labelField='displayvalue'
                options={secondDiagnosisBs}
                onChange={onsecondDiagnosisBChange}
                onDataSouceChange={onSecondDiagnosisBDataSouceChange}
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
          onCommitChanges: commitChanges,
        }}
        FuncProps={{
          pager: false,
        }}
        schema={diagnosisSchema}
        {...tableParas}
      />
      <GridContainer />
    </div>
  )
}
export default Diagnosis
