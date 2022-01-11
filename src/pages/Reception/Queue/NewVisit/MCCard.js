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
  clinicSettings,
  ctlanguage,
  isVisitReadonlyAfterSigned,
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
          name='mcReportLanguage'
          render={args => (
            <CheckboxGroup
              label='Report Language'
              options={langueges}
              {...args}
            />
          )}
        />
      </div>
    )
  }

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
            name='mcReportPriority'
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
                onChange={e => {
                  if (e.target.value !== 'Urgent') {
                    setFieldValue('mcUrgentReportRemarks', undefined)
                  }
                }}
                {...args}
              />
            )}
          />
        </div>
        <div style={{ marginLeft: 10, width: 500 }}>
          {values.mcReportPriority === 'Urgent' && (
            <Field
              name='mcUrgentReportRemarks'
              render={args => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={3}
                  maxLength={2000}
                  authority='none'
                  disabled={isVisitReadonlyAfterSigned}
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
            showAddCommand: true,
            onCommitChanges: commitChanges,
          }}
          schema={reportingDoctorSchema}
          columns={[
            { name: 'doctorProfileFK', title: 'Reporting Doctor' },
            { name: 'action', title: ' ' },
          ]}
          columnExtensions={[
            {
              columnName: 'doctorProfileFK',
              sortingEnabled: false,
              type: 'codeSelect',
              code: 'doctorprofile',
              labelField: 'clinicianProfile.name',
              localFilter: o => o.clinicianProfile.isActive,
              renderDropdown: option => <DoctorLabel doctor={option} />,
            },
            {
              columnName: 'action',
              width: 60,
              isReactComponent: true,
              sortingEnabled: false,
              isDisabled: row => true,
              render: e => {
                const { row, columnConfig } = e
                const { control } = columnConfig
                const { commitChanges } = control
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
          ]}
          FuncProps={{
            pager: false,
          }}
        />
      </GridItem>
    </GridContainer>
  )
}

export default memo(withStyles(styles, { name: 'MCCard' })(MCCard))
