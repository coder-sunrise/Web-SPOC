import React, { memo } from 'react'
// formik
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { Field, FastField } from 'formik'

// custom components
import {
  TextField,
  GridContainer,
  GridItem,
  Button,
  RadioGroup,
  CheckboxGroup,
  EditableTableGrid,
  Popconfirm,
  Popover,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import Delete from '@material-ui/icons/Delete'

const styles = theme => ({
  ...basicStyle(theme),
})

const MCCard = ({
  setFieldValue,
  reportingDoctorSchema,
  theme,
  values,
  fromMedicalCheckupReporting = false,
  clinicSettings,
  ctlanguage = [],
  isVisitReadonlyAfterSigned,
  isDoctorConsulted,
  validateReportLanguage,
}) => {
  const commitChanges = ({ rows }) => {
    setFieldValue('visitDoctor', rows)
    return rows
  }

  const getReportLanguage = () => {
    const {
      primaryPrintoutLanguage = 'EN',
      secondaryPrintoutLanguage = '',
    } = clinicSettings.settings
    const primaryLanguage = ctlanguage.find(
      l => l.code === primaryPrintoutLanguage,
    )
    let langueges = [
      { value: primaryPrintoutLanguage, label: primaryLanguage?.name },
    ]
    if (secondaryPrintoutLanguage.trim().length) {
      const secondLanguage = ctlanguage.find(
        l => l.code === secondaryPrintoutLanguage,
      )
      langueges.push({
        value: secondaryPrintoutLanguage,
        label: secondLanguage?.name,
      })
    }

    if (langueges.length === 1) return ''

    return (
      <div style={{ width: 180 }}>
        <Field
          name='medicalCheckupWorkitem[0].reportLanguage'
          render={args => (
            <CheckboxGroup
              label='Report Language'
              options={langueges}
              disabled={
                !fromMedicalCheckupReporting && isVisitReadonlyAfterSigned
              }
              {...args}
            />
          )}
        />
      </div>
    )
  }
  const columns = [
    {
      name: 'doctorProfileFK',
      title: 'Reporting Doctor',
    },
  ]

  const mcWorkItemInProgress =
    values?.medicalCheckupWorkitem &&
    values?.medicalCheckupWorkitem.length > 0 &&
    (values?.medicalCheckupWorkitem[0].statusFK === 1 ||
      values?.medicalCheckupWorkitem[0].statusFK === 2)
  columns.push({ name: 'action', title: ' ' })
  const columnExtension = [
    {
      columnName: 'doctorProfileFK',
      sortingEnabled: false,
      type: 'codeSelect',
      code: 'doctorprofile',
      isDisabled: row => {
        if (!mcWorkItemInProgress) return true
        // As long as current reporting doctor is not in Waiting status then able to edit and remove.
        if (row.id > 0 && row.consultationStatus !== 'Waiting') {
          return true
        }
        return false
      },
      labelField: 'clinicianProfile.name',
      localFilter: o => o.clinicianProfile.isActive,
      renderDropdown: option => <DoctorLabel doctor={option} />,
    },
    {
      columnName: 'action',
      width: 60,
      isReactComponent: true,
      isDisabled: row => {
        return true
      },
      sortingEnabled: false,
      render: e => {
        if (!mcWorkItemInProgress) return ''
        const { row, columnConfig } = e
        const { control } = columnConfig
        const { commitChanges } = control
        if (row.id > 0 && row.consultationStatus !== 'Waiting') {
          return ''
        }
        return (
          <Popconfirm
            title='Confirm to delete?'
            onConfirm={() => {
              commitChanges({
                changed: {
                  [row.id]: {
                    isDeleted: true,
                  },
                },
              })
            }}
          >
            <Button size='sm' justIcon color='danger'>
              <Delete />
            </Button>
          </Popconfirm>
        )
      },
    },
  ]
  // As long as MC visit still in Reporting / In Progress status
  // and edit visit from MC reporting page then allow user to add reporting doctor.
  let showAddCommand = fromMedicalCheckupReporting
    ? mcWorkItemInProgress
    : !isVisitReadonlyAfterSigned && !isDoctorConsulted
  return (
    <GridContainer alignItems='center'>
      <GridItem xs md={12} container>
        <div>
          {getReportLanguage()}
          {!validateReportLanguage && (
            <div style={{ color: 'red' }}>Must select report language</div>
          )}
        </div>
        <div style={{ marginLeft: 10 }}>
          <Field
            name='medicalCheckupWorkitem[0].reportPriority'
            render={args => (
              <RadioGroup
                label='Report Priority'
                options={[
                  {
                    value: 'Normal',
                    label: 'Normal',
                  },
                  {
                    value: 'Urgent',
                    label: 'Urgent',
                  },
                ]}
                disabled={
                  !fromMedicalCheckupReporting && isVisitReadonlyAfterSigned
                }
                onChange={e => {
                  if (e.target.value !== 'Urgent') {
                    setFieldValue(
                      'medicalCheckupWorkitem[0].urgentReportRemarks',
                      undefined,
                    )
                  }
                }}
                {...args}
              />
            )}
          />
        </div>
        <div style={{ marginLeft: 10, width: 500 }}>
          {(values.medicalCheckupWorkitem || [{}])[0].reportPriority ===
            'Urgent' && (
            <Field
              name='medicalCheckupWorkitem[0].urgentReportRemarks'
              render={args => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={3}
                  maxLength={2000}
                  authority='none'
                  disabled={
                    !fromMedicalCheckupReporting && isVisitReadonlyAfterSigned
                  }
                  label='Urgent Report Remarks'
                />
              )}
            />
          )}
        </div>
      </GridItem>
      <GridItem xs md={12}>
        <EditableTableGrid
          forceRender
          style={{
            marginTop: theme.spacing(1),
          }}
          rows={values.visitDoctor}
          EditingProps={{
            showCommandColumn: false,
            showAddCommand: showAddCommand,
            onCommitChanges: commitChanges,
          }}
          schema={reportingDoctorSchema}
          columns={columns}
          columnExtensions={columnExtension}
          FuncProps={{
            pager: false,
          }}
        />
      </GridItem>
    </GridContainer>
  )
}

export default memo(withStyles(styles, { name: 'MCCard' })(MCCard))
