import {
  GridContainer,
  GridItem,
  TextField,
  EditableTableGrid,
  Button,
  CodeSelect,
  FieldArray,
} from '@/components'
import { Table } from 'antd'
import { useState } from 'react'
import { FastField } from 'formik'
import { getUniqueId } from '@/utils/utils'

const InvestigativeTests = props => {
  const { prefixProp, values, setFieldValue } = props
  const prop = `${prefixProp}.corInvestigativeTests_Item`
  const originRows = _.get(values, prop) || []
  const [rows, setRows] = useState(
    originRows.map(r => ({ ...r, uid: getUniqueId() })),
  )

  const handleCommitChanges = ({ rows }) => {
    setRows(rows)
    setFieldValue(prop, rows)
  }

  const handleAddedRowsChange = addedRows => {
    return addedRows.map(row => ({
      id: 0,
      isNew: true,
      sequence: rows.filter(r => !r.isDeleted).length + 1,
      typeOfTestFK: 1,
      findings: '',
      uid: getUniqueId(),
    }))
  }

  return (
    <GridContainer>
      <GridItem md={12}>
        <span
          style={{
            fontWeight: 500,
            fontSize: '1rem',
            marginRight: 8,
            marginTop: 8,
          }}
        >
          Investigative Tests
        </span>
      </GridItem>
      <GridItem md={12}>
        <FieldArray
          name={prop}
          render={arrayHelpers => {
            return (
              <EditableTableGrid
                rows={rows}
                getRowId={r => r.uid}
                columns={[
                  { name: 'sequence', title: 'S/N' },
                  { name: 'typeOfTestFK', title: 'Type Of Test' },
                  { name: 'findings', title: 'Findings' },
                ]}
                columnExtensions={[
                  {
                    columnName: 'sequence',
                    type: 'number',
                    precision: 0,
                    width: 60,
                    disabled: true,
                  },
                  {
                    columnName: 'typeOfTestFK',
                    type: 'codeSelect',
                    code: 'ctTypeOfTest',
                  },
                  {
                    columnName: 'findings',
                    type: 'text',
                  },
                ]}
                EditingProps={{
                  showAddCommand: true,
                  onAddedRowsChange: handleAddedRowsChange,
                  onCommitChanges: handleCommitChanges,
                }}
                FuncProps={{ pager: false }}
              />
            )
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
export default InvestigativeTests
