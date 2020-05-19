import React, { PureComponent } from 'react'
import { ltAdmittingSpecialty } from '@/utils/codes'
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
    const { formData } = values
    const { admittingSpecialtys = [] } = formData
    const maxadmittingspecialtyCount = admittingSpecialtys.length <= 1 ? 1 : 0
    return (
      <GridContainer>
        <GridItem xs={4}>
          <FastField
            name='formData.patientName'
            render={(args) => {
              return <TextField disabled label='Name' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='formData.patientNRICNo'
            render={(args) => {
              return <TextField disabled label='NRIC/Passport No.' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='formData.patientAccountNo'
            render={(args) => {
              return <TextField label='Patient Account No.' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='formData.admissionDate'
            render={(args) => {
              return (
                <DatePicker label='Date of Admission' autoFocus {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='formData.dischargeDate'
            render={(args) => {
              return (
                <DatePicker label='Date of Discharge' autoFocus {...args} />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='formData.caseType'
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
            name='formData.admittingSpecialtys'
            render={(args) => (
              <CodeSelect
                label='Admitting Specialty'
                {...args}
                options={ltAdmittingSpecialty}
                valueField='id'
                disableAll
                mode='multiple'
                onChange={() => {
                  if (!admittingSpecialtys.find((o) => o === 99)) {
                    setFieldValue('formData.others', undefined)
                  }
                }}
                maxTagCount={maxadmittingspecialtyCount}
                maxTagPlaceholder='admitting specialty'
              />
            )}
          />
        </GridItem>
        <GridItem xs={8}>
          {admittingSpecialtys.find((o) => o === 99) && (
            <FastField
              name='formData.others'
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
