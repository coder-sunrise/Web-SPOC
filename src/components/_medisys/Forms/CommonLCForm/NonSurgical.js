import React, { PureComponent } from 'react'
import { gstChargedTypes, surgicalRoles } from '@/utils/codes'
import { GridContainer, GridItem, EditableTableGrid } from '@/components'

class NonSurgical extends PureComponent {
  isContainsNonPrincipalSurgeon = false

  commitChanges = ({ rows, deleted }) => {
    const { setFieldValue } = this.props
    if (deleted) {
      rows = rows.filter((o) => o.id !== deleted[0])
    }
    setFieldValue('formData.nonSurgicalCharges', rows)
  }

  onAddedRowsChange = (addedRows) => {
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

  render () {
    const { values, nonSurgicalChargesSchema } = this.props
    const { nonSurgicalCharges } = values.formData
    let canAddNonSurgicalCharges = nonSurgicalCharges.length < 7

    this.isContainsNonPrincipalSurgeon =
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
              <div style={{ fontSize: '0.5rem', fontStyle: 'italic' }}>
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
            row.surgicalSurgeonName = option
              ? option.clinicianProfile.name
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
            row.surgicalSurgeonName = option
              ? option.clinicianProfile.name
              : undefined
          },
          sortingEnabled: false,
          isDisabled: (row) => row.surgicalRoleFK === 1,
        },
        {
          columnName: 'surgicalRoleFK',
          type: 'codeSelect',
          options: (row) => {
            if (row.surgicalRoleFK === 1 || !this.isContainsNonPrincipalSurgeon)
              return surgicalRoles
            return surgicalRoles.filter((o) => o.id !== 1)
          },
          labelField: 'name',
          sortingEnabled: false,
          isDisabled: (row) => row.surgicalRoleFK === 1,
          onChange: ({ val, option, row }) => {
            if (val && val === 1) {
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
          width: 170,
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
            * Fill in any non-surgical charges for each doctor for the
            inpatient/ day surgery episode.
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
            getRowId={(r) => r.id}
            rows={nonSurgicalCharges}
            EditingProps={{
              showAddCommand: canAddNonSurgicalCharges,
              onCommitChanges: this.commitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
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
}
export default NonSurgical
