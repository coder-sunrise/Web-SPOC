import React, { PureComponent } from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Add, Delete } from '@material-ui/icons'
import { gstChargedTypes, surgicalRoles } from '@/utils/codes'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  DatePicker,
  RadioButtonGroup,
  CodeSelect,
  Tooltip,
  CardContainer,
  Popconfirm,
  Button,
  TimePicker,
  EditableTableGrid,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'

class Procedures extends PureComponent {
  addProcedure = () => {
    const { setFieldValue, values, formListing } = this.props
    const { visitDate } = formListing.visitDetail
    const maxIndev = _.maxBy(values.formData.procuderes, 'index').index
    let newProcedure = values.formData.procuderes.map((o) => o)
    newProcedure.push({
      index: maxIndev + 1,
      procedureDate: visitDate,
      procedureStartTime: moment(),
      procedureEndTime: moment(),
      natureOfOpertation: '1',
      surgicalCharges: [
        {
          id: -1,
          surgicalRoleFK: 1,
          surgicalSurgeonFK: values.formData.principalSurgeonFK,
          surgicalSurgeonMCRNo: values.formData.principalSurgeonMCRNo,
          surgicalSurgeonName: values.formData.principalSurgeonName,
          surgeonFees: 0,
          implantFees: 0,
          otherFees: 0,
          totalSurgicalFees: 0,
          gSTChargedFK: 1,
        },
      ],
    })
    setFieldValue('formData.procuderes', newProcedure)
  }

  deleteProcedure = (row) => {
    const { setFieldValue, values } = this.props
    let newProcedure = values.formData.procuderes.map((o) => o)
    newProcedure = newProcedure.filter((o) => o.index !== row.index)

    newProcedure.forEach((s) => {
      if (s.index > row.index) {
        s.index -= 1
      }
    })
    setFieldValue('formData.procuderes', newProcedure)
  }

  principalSurgeonChanged = (v, option) => {
    const { values, setFieldValue } = this.props
    setFieldValue(
      'formData.principalSurgeonMCRNo',
      option ? option.doctorMCRNo : undefined,
    )
    setFieldValue(
      'formData.principalSurgeonName',
      option ? option.clinicianProfile.name : undefined,
    )

    let newProcuderes = values.formData.procuderes.map((o) => {
      return {
        ...o,
        surgicalCharges: o.surgicalCharges.map((sc) => {
          if (sc.surgicalRoleFK === 1) {
            return {
              ...sc,
              surgicalSurgeonFK: option ? option.id : undefined,
              surgicalSurgeonMCRNo: option ? option.doctorMCRNo : undefined,
              surgicalSurgeonName: option
                ? option.clinicianProfile.name
                : undefined,
            }
          }
          return { ...sc }
        }),
      }
    })
    setFieldValue('formData.procuderes', newProcuderes)

    let newNonSurgicalCharges = values.formData.nonSurgicalCharges.map((o) => {
      if (o.surgicalRoleFK === 1) {
        return {
          ...o,
          surgicalSurgeonFK: option ? option.id : undefined,
          surgicalSurgeonMCRNo: option ? option.doctorMCRNo : undefined,
          surgicalSurgeonName: option
            ? option.clinicianProfile.name
            : undefined,
        }
      }
      return { ...o }
    })

    setFieldValue('formData.nonSurgicalCharges', newNonSurgicalCharges)
  }

  commitChanges = (i, { rows, deleted }) => {
    const { setFieldValue } = this.props
    if (deleted) {
      rows = rows.filter((o) => o.id !== deleted[0])
    }
    setFieldValue(`formData.procuderes[${i}].surgicalCharges`, rows)
  }

  onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      newRow.surgeonFees = 0
      newRow.implantFees = 0
      newRow.otherFees = 0
      newRow.totalSurgicalFees = 0
      newRow.gSTChargedFK = 1
    }
    return addedRows
  }

  render () {
    const { values, surgicalChargesSchema } = this.props

    const _timeFormat = 'hh:mm a'
    return (
      <div>
        <GridContainer>
          <GridItem md={12}>
            <span>
              * if there are more than three(3) procedures, Procedure Number
              more 3 will be printed in Annex pages.
            </span>
          </GridItem>
          <GridItem md={12}>
            <span>
              * Refer to Section E for non-surgical procedure related charges.
            </span>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem md={4}>
            <FastField
              name='formData.principalSurgeonFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Principal Surgeon'
                    code='doctorProfile'
                    labelField='clinicianProfile.name'
                    valueField='id'
                    renderDropdown={(option) => <DoctorLabel doctor={option} />}
                    {...args}
                    onChange={this.principalSurgeonChanged}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <div>
          <div>
            {values.formData.procuderes.map((o) => {
              const i = o.index - 1

              let canAddSurgicalCharges
              if (o.index <= 3) {
                canAddSurgicalCharges = o.surgicalCharges.length < 3
              } else {
                canAddSurgicalCharges = o.surgicalCharges.length < 5
              }

              let isContainsPrincipalSurgeon =
                o.surgicalCharges.filter((sc) => sc.surgicalRoleFK === 1)
                  .length >= 1

              let tableParas = {
                columns: [
                  { name: 'surgicalSurgeonMCRNo', title: 'MCR No' },
                  { name: 'surgicalSurgeonFK', title: 'Doctor Name' },
                  { name: 'surgicalRoleFK', title: 'Role' },
                  {
                    name: 'surgeonFees',
                    title: 'Surgeon Fees',
                  },
                  {
                    name: 'implantFees',
                    title: 'Implant Fees',
                  },
                  {
                    name: 'otherFees',
                    title: 'Other Fees',
                  },
                  {
                    name: 'totalSurgicalFees',
                    title: (
                      <div>
                        <div>Total</div>
                        <div>Surgical Fees</div>
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
                      row.surgicalSurgeonMCRNo = option
                        ? option.doctorMCRNo
                        : undefined
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
                      if (
                        row.surgicalRoleFK === 1 ||
                        !isContainsPrincipalSurgeon
                      )
                        return surgicalRoles
                      return surgicalRoles.filter((role) => role.id !== 1)
                    },
                    labelField: 'name',
                    sortingEnabled: false,
                    isDisabled: (row) => row.surgicalRoleFK === 1,
                  },
                  {
                    columnName: 'surgeonFees',
                    type: 'currency',
                    sortingEnabled: false,
                    onChange: ({ value, row }) => {
                      row.totalSurgicalFees =
                        (value || 0) +
                        (row.implantFees || 0) +
                        (row.otherFees || 0)
                    },
                  },
                  {
                    columnName: 'implantFees',
                    type: 'currency',
                    sortingEnabled: false,
                    onChange: ({ value, row }) => {
                      row.totalSurgicalFees =
                        (value || 0) +
                        (row.surgeonFees || 0) +
                        (row.otherFees || 0)
                    },
                  },
                  {
                    columnName: 'otherFees',
                    type: 'currency',
                    sortingEnabled: false,
                    onChange: ({ value, row }) => {
                      row.totalSurgicalFees =
                        (value || 0) +
                        (row.implantFees || 0) +
                        (row.surgeonFees || 0)
                    },
                  },
                  {
                    columnName: 'totalSurgicalFees',
                    type: 'currency',
                    sortingEnabled: false,
                    disabled: true,
                  },
                  {
                    columnName: 'gSTChargedFK',
                    type: 'codeSelect',
                    options: gstChargedTypes,
                    labelField: 'name',
                    sortingEnabled: false,
                  },
                ],
              }
              return (
                <GridContainer>
                  <GridItem md={6}>
                    <div>Procedure {o.index}</div>
                  </GridItem>
                  <GridItem md={6} container justify='flex-end'>
                    {i !== 0 && (
                      <Popconfirm
                        title='Are you sure delete this item?'
                        onConfirm={() => {
                          this.deleteProcedure(o)
                        }}
                      >
                        <Button justIcon color='danger'>
                          <Delete />
                        </Button>
                      </Popconfirm>
                    )}
                  </GridItem>
                  <GridItem md={12}>
                    <CardContainer hideHeader>
                      <GridContainer>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].procedureDate`}
                            render={(args) => {
                              return (
                                <DatePicker
                                  label='Date of Procedure'
                                  autoFocus
                                  {...args}
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].procedureStartTime`}
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='Start Time in OT'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].procedureEndTime`}
                            render={(args) => {
                              return (
                                <TimePicker
                                  {...args}
                                  label='End Time in OT'
                                  format={_timeFormat}
                                  use12Hours
                                />
                              )
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12}>
                          <FastField
                            name={`formData.procuderes[${i}].natureOfOpertation`}
                            render={(args) => (
                              <RadioButtonGroup
                                label='Nature of Opertation'
                                row
                                itemHorizontal
                                options={[
                                  {
                                    value: '1',
                                    label: 'Medical',
                                  },
                                  {
                                    value: '2',
                                    label: 'Cosmetic',
                                  },
                                  {
                                    value: '3',
                                    label: 'Repeated',
                                  },
                                  {
                                    value: '4',
                                    label: 'Staged',
                                  },
                                ]}
                                {...args}
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].surgicalProcedureFK`}
                            render={(args) => (
                              <CodeSelect
                                label='Surgical Procedure'
                                labelField='displayValue'
                                {...args}
                                code='ctprocedure'
                                onChange={(val, option) => {
                                  const { setFieldValue } = this.props
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureTable`,
                                    option ? option.table : undefined,
                                  )
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureCode`,
                                    option ? option.code : undefined,
                                  )
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureName`,
                                    option ? option.displayValue : undefined,
                                  )
                                }}
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].surgicalProcedureFK`}
                            render={(args) => (
                              <CodeSelect
                                label='Procedure Code'
                                labelField='code'
                                {...args}
                                code='ctprocedure'
                                onChange={(val, option) => {
                                  const { setFieldValue } = this.props
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureTable`,
                                    option ? option.table : undefined,
                                  )
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureCode`,
                                    option ? option.code : undefined,
                                  )
                                  setFieldValue(
                                    `formData.procuderes[${i}].surgicalProcedureName`,
                                    option ? option.displayValue : undefined,
                                  )
                                }}
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={4}>
                          <FastField
                            name={`formData.procuderes[${i}].surgicalProcedureTable`}
                            render={(args) => (
                              <TextField disabled label='Table' {...args} />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={12}>
                          Only{' '}
                          <span
                            style={{
                              fontStyle: 'italic',
                              textDecoration: 'underline',
                            }}
                          >
                            surgical-related
                          </span>{' '}
                          charges to be reimbursed to the doctor need to be
                          filled in below.
                        </GridItem>
                        <GridItem md={12}>
                          <EditableTableGrid
                            getRowId={(r) => r.id}
                            rows={o.surgicalCharges}
                            EditingProps={{
                              showAddCommand: canAddSurgicalCharges,
                              onCommitChanges: (val) => {
                                this.commitChanges(i, val)
                              },
                              onAddedRowsChange: this.onAddedRowsChange,
                            }}
                            FuncProps={{
                              pager: false,
                            }}
                            schema={surgicalChargesSchema}
                            {...tableParas}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardContainer>
                  </GridItem>
                </GridContainer>
              )
            })}
          </div>
          <GridContainer>
            <GridItem md={12}>
              <Tooltip title='Add Procedure'>
                <Button
                  color='primary'
                  icon={<Add />}
                  style={{ marginTop: 10 }}
                  onClick={this.addProcedure}
                >
                  New Procedure
                </Button>
              </Tooltip>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    )
  }
}
export default Procedures
