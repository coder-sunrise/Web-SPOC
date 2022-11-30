import {
  GridContainer,
  GridItem,
  TextField,
  MultipleTextField,
} from '@/components'
import { FastField } from 'formik'
const PatientHistory = props => {
  const { prefixProp } = props
  return (
    <GridContainer style={{ marginTop: 8 }}>
      <GridItem md={12}>
        <div>
          <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
            Patient History
          </span>
          Reason of Visit / Chief Complaint(s) / Symptom(s)
        </div>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.subject`}
          render={args => (
            <MultipleTextField
              label=''
              maxLength={2000}
              autoSize={{ minRows: 4 }}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Ocular & General History
        </span>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.personalOcularHealth`}
          render={args => (
            <TextField
              label='Personal Ocular Health'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.personalGeneralHealth`}
          render={args => (
            <TextField
              label='Personal General Health'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.allergies`}
          render={args => (
            <TextField
              label='Medications, Allergies'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.familyOcularHealth`}
          render={args => (
            <TextField
              label='Family Ocular Health'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.familyGeneralHealth`}
          render={args => (
            <TextField
              label='Family General Health'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Visual Requirements
        </span>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.refraction`}
          render={args => (
            <TextField
              label='Refraction / Optical Appliances Hx / Contact Lens Hx'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.visualTasks`}
          render={args => (
            <TextField
              label='Visual Tasks'
              multiline
              maxLength={500}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={12}>
        <span style={{ fontWeight: 500, fontSize: '1rem', marginRight: 8 }}>
          Other Observations
        </span>
      </GridItem>
      <GridItem md={12}>
        <FastField
          name={`${prefixProp}.otherObservations`}
          render={args => (
            <TextField
              label='Others Observations'
              multiline
              maxLength={2000}
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default PatientHistory
