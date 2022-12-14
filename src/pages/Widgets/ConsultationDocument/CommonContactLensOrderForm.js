import { FastField } from 'formik'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  NumberInput,
} from '@/components'
import ContactLensPrescriptionModule from './components/ContactLensPrescriptionModule'
const CommonContactLensOrderForm = props => {
  const prefix = props.prefix ? `${props.prefix}.` : ''
  return (
    <div>
      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Lens Product</div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}leftLensProductFK`}
              render={args => (
                <CodeSelect
                  {...args}
                  code='inventoryconsumable'
                  labelField='displayValue'
                  label='Left Lens'
                />
              )}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}rightLensProductFK`}
              render={args => (
                <CodeSelect
                  {...args}
                  code='inventoryconsumable'
                  labelField='displayValue'
                  label='Right Lens'
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </div>
      <ContactLensPrescriptionModule prefix={prefix} />
      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Quantity</div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='leftLensQuantity'
              render={args => {
                return <NumberInput label='Left Lens' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='rightLensQuantity'
              render={args => {
                return <NumberInput label='Right Lens' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      <div style={{ margin: '0px 8px' }}>
        <GridContainer>
          <GridItem xs>
            <FastField
              name='remarks'
              render={args => {
                return <TextField label='Remarks' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      <div
        style={{
          margin: '8px 0px',
          padding: 8,
        }}
      >
        <div style={{ fontWeight: 'bold' }}>SRP For</div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}srpFullName`}
              render={args => {
                return <TextField label='Full Name' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={3}>
            <FastField
              name={`${prefix}yrClass`}
              render={args => {
                return <TextField label='Yr/Class' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      <div
        style={{
          marginTop: 8,
          padding: 8,
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Student</div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='studentFullName'
              render={args => {
                return (
                  <TextField label='Full Name' maxLength={2000} {...args} />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  )
}

export default CommonContactLensOrderForm
