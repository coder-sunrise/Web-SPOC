import React, { PureComponent } from 'react'
import _ from 'lodash'
import { gstChargedTypes, surgicalRoles } from '@/utils/codes'
import { GridContainer, GridItem, EditableTableGrid } from '@/components'
import { DoctorLabel } from '@/components/_medisys'

const NonSurgical = ({ setFieldValue, values, nonSurgicalChargesSchema }) => {
  let isContainsNonPrincipalSurgeon = false

  const commitChanges = ({ rows, added, deleted }) => {
    if (added) {
      let addrow = rows.find((o) => o.id !== added[0])
      addrow.sortOrder = rows.length - 1
    }

    rows = _.orderBy(
      rows,
      [
        'sortOrder',
      ],
      [
        'asc',
      ],
    )
    if (deleted) {
      rows = rows.filter((o) => o.id !== deleted[0])
    }
    for (let index = 0; index < rows.length; index++) {
      rows[index].sortOrder = index
    }
    setFieldValue('formData.nonSurgicalCharges', rows)
  }

  const onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      newRow.inpatientAttendanceFees = 0
      newRow.otherFees = 0
      newRow.totalSurgicalFees = 0
      newRow.gSTChargedFK = 1
      newRow.gSTChargedName = 'Charged'
    }
    return addedRows
  }

  const { nonSurgicalCharges } = values.formData
  let canAddNonSurgicalCharges = nonSurgicalCharges.length < 7

  isContainsNonPrincipalSurgeon =
    nonSurgicalCharges.filter((sc) => sc.surgicalRoleFK === 1).length >= 1

  const tableParas = {
    columns: [
      { name: 'surgicalSurgeonMCRNo', title: 'MCR No' },
      { name: 'surgicalSurgeonFK', title: 'Doctor Name' },
      { name: 'surgicalRoleFK', title: 'Role' },
      {
        name: 'inpatientAttendanceFees',
        title: <div>Inpatient /Attendance Fees</div>,
      },
      {
        name: 'otherFees',
        title: 'Other Fees',
      },
      {
        name: 'totalSurgicalFees',
        title: (
          <div>
            <div>Total Fees</div>
            <div style={{ fontSize: '0.4rem', fontStyle: 'italic' }}>
              (including GST if applicable)
            </div>
          </div>
        ),
      },
      { name: 'gSTChargedFK', title: 'GST Charged' },
    ],
    columnExtensions: [
      {
        columnName: 'surgicalSurgeonMCRNo',
        type: 'codeSelect',
        code: 'doctorProfile',
        valueField: 'doctorMCRNo',
        labelField: 'doctorMCRNo',
        onChange: ({ option, row }) => {
          let title
          if (option) {
            title =
              option.clinicianProfile.title &&
              option.clinicianProfile.title !== 'Other'
                ? `${option.clinicianProfile.title} `
                : ''
          }
          row.surgicalSurgeonName = option
            ? `${title}${option.clinicianProfile.name}`
            : undefined

          row.surgicalSurgeonFK = option ? option.id : undefined
        },
        sortingEnabled: false,
        isDisabled: (row) => row.surgicalRoleFK === 1,
      },
      {
        columnName: 'surgicalSurgeonFK',
        type: 'codeSelect',
        code: 'doctorProfile',
        labelField: 'clinicianProfile.name',
        onChange: ({ option, row }) => {
          row.surgicalSurgeonMCRNo = option ? option.doctorMCRNo : undefined

          let title
          if (option) {
            title =
              option.clinicianProfile.title &&
              option.clinicianProfile.title !== 'Other'
                ? `${option.clinicianProfile.title} `
                : ''
          }
          row.surgicalSurgeonName = option
            ? `${title}${option.clinicianProfile.name}`
            : undefined
        },
        sortingEnabled: false,
        isDisabled: (row) => row.surgicalRoleFK === 1,
        renderDropdown: (option) => <DoctorLabel doctor={option} hideMCR />,
        render: (row) => <div>{row.surgicalSurgeonName}</div>,
      },
      {
        columnName: 'surgicalRoleFK',
        type: 'codeSelect',
        options: (row) => {
          if (row.surgicalRoleFK === 1 || !isContainsNonPrincipalSurgeon)
            return surgicalRoles
          return surgicalRoles.filter((o) => o.id !== 1)
        },
        labelField: 'name',
        sortingEnabled: false,
        isDisabled: (row) => row.surgicalRoleFK === 1,
        onChange: ({ val, option, row }) => {
          if (val && val === 1) {
            document.activeElement.blur()
            row.surgicalSurgeonFK = values.formData.principalSurgeonFK
            row.surgicalSurgeonMCRNo = values.formData.principalSurgeonMCRNo
            row.surgicalSurgeonName = values.formData.principalSurgeonName
          }
          row.surgicalRoleName = option ? option.name : undefined
        },
      },
      {
        columnName: 'inpatientAttendanceFees',
        type: 'currency',
        sortingEnabled: false,
        onChange: ({ value, row }) => {
          row.totalSurgicalFees = (value || 0) + (row.otherFees || 0)
        },
        width: 190,
      },
      {
        columnName: 'otherFees',
        type: 'currency',
        sortingEnabled: false,
        onChange: ({ value, row }) => {
          row.totalSurgicalFees =
            (value || 0) + (row.inpatientAttendanceFees || 0)
        },
      },
      {
        columnName: 'totalSurgicalFees',
        type: 'currency',
        sortingEnabled: false,
        disabled: true,
        width: 200,
      },
      {
        columnName: 'gSTChargedFK',
        type: 'codeSelect',
        options: gstChargedTypes,
        labelField: 'name',
        sortingEnabled: false,
        onChange: ({ option, row }) => {
          row.gSTChargedName = option ? option.name : undefined
        },
      },
    ],
  }
  return (
    <GridContainer hideHeader>
      <GridItem md={12}>
        <span>
          * Fill in any non-surgical charges for each doctor for the inpatient/
          day surgery episode.
        </span>
      </GridItem>
      <GridItem md={12}>
        <span>
          * Only charges which are payable to the doctor should be included
          here.
        </span>
      </GridItem>
      <GridItem md={12}>
        <span>
          * Charges related to surgical procedures (surgeon fees, implants,
          surgical consumables, etc.) should be listed in Section C.
        </span>
      </GridItem>
      <GridItem md={12}>
        <EditableTableGrid
          style={{ marginTop: 10 }}
          getRowId={(r) => r.id}
          rows={nonSurgicalCharges}
          EditingProps={{
            showAddCommand: canAddNonSurgicalCharges,
            onCommitChanges: commitChanges,
            onAddedRowsChange,
          }}
          FuncProps={{
            pager: false,
          }}
          schema={nonSurgicalChargesSchema}
          {...tableParas}
        />
      </GridItem>
    </GridContainer>
  )
}
export default NonSurgical
