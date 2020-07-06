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

const PatientParticulars = ({ setFieldValue, values }) => {
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
            return <TextField autoFocus label='Patient Account No.' {...args} />
          }}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='formData.admissionDate'
          render={(args) => {
            return <DatePicker label='Date of Admission' {...args} />
          }}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='formData.dischargeDate'
          render={(args) => {
            return <DatePicker label='Date of Discharge' {...args} />
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
                  value: 'Inpatient',
                  label: 'Inpatient',
                },
                {
                  value: 'DaySurgery',
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
              valueField='code'
              disableAll
              mode='multiple'
              onChange={(v) => {
                if (!v.find((o) => o === '99')) {
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
        {admittingSpecialtys.find((o) => o === '99') && (
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
export default PatientParticulars
