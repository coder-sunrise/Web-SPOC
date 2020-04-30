import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  TextField,
  FastField,
  DatePicker,
  RadioButtonGroup,
  CodeSelect,
} from '@/components'

class PatientParticulars extends PureComponent {
  render () {
    const { values, setFieldValue } = this.props
    const { admittingSpecialtyFK } = values
    return (
      <GridContainer>
        <GridItem xs={4}>
          <FastField
            name='dataContent.patientName'
            render={(args) => {
              return <TextField disabled label='Name' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='dataContent.patientNRICNo'
            render={(args) => {
              return <TextField disabled label='NRIC/Passport No.' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='dataContent.patientAccountNo'
            render={(args) => {
              return <TextField label='Patient Account No.' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='dataContent.admissionDate'
            render={(args) => {
              return (
                <DatePicker label='Date of Admission' autoFocus {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='dischargeDate'
            render={(args) => {
              return (
                <DatePicker label='Date of Discharge' autoFocus {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='caseType'
            render={(args) => (
              <RadioButtonGroup
                label='Case Type'
                row
                itemHorizontal
                options={[
                  {
                    value: '1',
                    label: 'Inpatient',
                  },
                  {
                    value: '2',
                    label: 'Day Surgery',
                  },
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={4}>
          <FastField
            name='dataContent.admittingSpecialtyFK'
            render={(args) => (
              <CodeSelect
                label='Admitting Specialty'
                {...args}
                code='CTCaseDescription'
                onChage={(v) => {
                  if (!v || v !== 99) {
                    setFieldValue('others', undefined)
                  }
                }}
              />
            )}
          />
        </GridItem>
        <GridItem xs={8}>
          {admittingSpecialtyFK === 99 && (
            <FastField
              name='dataContent.others'
              render={(args) => {
                return <TextField label='Others (please specify)' {...args} />
              }}
            />
          )}
        </GridItem>
      </GridContainer>
    )
  }
}
export default PatientParticulars
