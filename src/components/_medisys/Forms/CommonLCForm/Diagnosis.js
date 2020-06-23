import React, { useState } from 'react'
import {
  GridContainer,
  GridItem,
  EditableTableGrid,
  FastField,
} from '@/components'
import { ICD10AMSelect } from '@/components/_medisys'
import { queryList } from '@/services/common'

const Diagnosis = ({ setFieldValue, values, diagnosisSchema }) => {
  const [
    principalDiagnosiss,
    setPrincipalDiagnosiss,
  ] = useState([])

  const [
    secondDiagnosisAs,
    setSecondDiagnosisAs,
  ] = useState([])

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
        type: 'select',
        labelField: 'code',
        valueField: 'code',
        options: (row) => {
          return row.diagnosiss
        },
        query: async (v) => {
          const search = {
            props: 'id,displayvalue,code',
            sorting: [
              { columnName: 'displayvalue', direction: 'asc' },
            ],
            pagesize: 30,
          }
          if (typeof v === 'string') {
            search.code = v
          } else {
            search.id = Number(v)
          }

          const response = await queryList('/api/codetable/cticd10am', search)
          return response
        },
        onChange: ({ row, option }) => {
          row.diagnosiss = [
            option,
          ]
          row.diagnosisFK = option ? option.id : undefined
          row.diagnosisCode = option ? option.code : undefined
          row.diagnosisName = option ? option.displayvalue : undefined
        },
        render: (row) => {
          return <div>{row.diagnosisCode}</div>
        },
      },
      {
        columnName: 'diagnosisName',
        type: 'select',
        labelField: 'displayvalue',
        valueField: 'displayvalue',
        options: (row) => {
          return row.diagnosiss
        },
        query: async (v) => {
          const search = {
            props: 'id,displayvalue,code',
            sorting: [
              { columnName: 'displayvalue', direction: 'asc' },
            ],
            pagesize: 30,
          }
          if (typeof v === 'string') {
            search.displayvalue = v
          } else {
            search.id = Number(v)
          }

          const response = await queryList('/api/codetable/cticd10am', search)
          return response
        },
        onChange: ({ row, option }) => {
          row.diagnosiss = [
            option,
          ]
          row.diagnosisFK = option ? option.id : undefined
          row.diagnosisCode = option ? option.code : undefined
          row.diagnosisName = option ? option.displayvalue : undefined
        },
        render: (row) => {
          return <div>{row.diagnosisName}</div>
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
      <div style={{ marginTop: 10 }}>Second Diagnosis</div>
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
      <div style={{ marginTop: 10 }}>Other Diagnosis</div>
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
