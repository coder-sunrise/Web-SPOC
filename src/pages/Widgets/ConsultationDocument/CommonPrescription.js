import { FastField } from 'formik'
import { GridContainer, GridItem, TextField, DatePicker } from '@/components'
const CommonPrescription = () => {
  return (
    <div style={{ border: '0.5px solid #CCCCCC', padding: 8 }}>
      <div style={{ fontWeight: 'bold' }}>Prescription</div>
      <div style={{ lineHeight: '16px' }}>Left Eye (LE)</div>
      <GridContainer>
        <GridItem xs={2}>
          <FastField
            name='leftSPH'
            render={args => {
              return <TextField label='SPH' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='leftCYL'
            render={args => {
              return <TextField label='CYL' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='leftAXIS'
            render={args => {
              return <TextField label='AXIS' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='leftADD'
            render={args => {
              return <TextField label='ADD' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='leftVA'
            render={args => {
              return <TextField label='VA' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='leftPH'
            render={args => {
              return <TextField label='PH' maxLength={500} {...args} />
            }}
          />
        </GridItem>
      </GridContainer>
      <div style={{ marginTop: 8, lineHeight: '16px' }}>Right Eye (RE)</div>
      <GridContainer>
        <GridItem xs={2}>
          <FastField
            name='rightSPH'
            render={args => {
              return <TextField label='SPH' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='rightCYL'
            render={args => {
              return <TextField label='CYL' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='rightAXIS'
            render={args => {
              return <TextField label='AXIS' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='rightADD'
            render={args => {
              return <TextField label='ADD' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='rightVA'
            render={args => {
              return <TextField label='VA' maxLength={500} {...args} />
            }}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='rightPH'
            render={args => {
              return <TextField label='PH' maxLength={500} {...args} />
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default CommonPrescription
