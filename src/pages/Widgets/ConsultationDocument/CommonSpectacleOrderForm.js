import { FastField } from 'formik'
import { GridContainer, GridItem, TextField, CodeSelect } from '@/components'
const CommonSpectacleOrderForm = props => {
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

      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Prescription</div>
        <div
          style={{
            lineHeight: '16px',
            position: 'relative',
            bottom: -5,
            right: -7,
            fontWeight: 500,
          }}
        >
          Left Eye (LE)
        </div>
        <GridContainer>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_SPH`}
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_CYL`}
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_AXIS`}
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_ADD`}
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_VA`}
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_LE_PH`}
              render={args => {
                return <TextField label='PH' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <div
          style={{
            marginTop: 8,
            lineHeight: '16px',
            position: 'relative',
            bottom: -5,
            right: -7,
            fontWeight: 500,
          }}
        >
          Right Eye (RE)
        </div>
        <GridContainer>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_SPH`}
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_CYL`}
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_AXIS`}
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_ADD`}
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_VA`}
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}prescription_RE_PH`}
              render={args => {
                return <TextField label='PH' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>

      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>Frame Measurement</div>
        <div
          style={{
            lineHeight: '16px',
            position: 'relative',
            bottom: -5,
            right: -7,
            fontWeight: 500,
          }}
        >
          Left Eye (LE)
        </div>
        <GridContainer>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_LE_Binocular_PD`}
              render={args => {
                return <TextField label='Binocular PD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_LE_Monocular_PD`}
              render={args => {
                return <TextField label='Monocular PD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_LE_SegmentHeight`}
              render={args => {
                return <TextField label='Segment Height' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <div
          style={{
            marginTop: 8,
            lineHeight: '16px',
            position: 'relative',
            bottom: -5,
            right: -7,
            fontWeight: 500,
          }}
        >
          Right Eye (RE)
        </div>
        <GridContainer>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_RE_Binocular_PD`}
              render={args => {
                return <TextField label='Binocular PD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_RE_Monocular_PD`}
              render={args => {
                return <TextField label='Monocular PD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name={`${prefix}frameMeasurement_RE_SegmentHeight`}
              render={args => {
                return <TextField label='Segment Height' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}frameTypeFK`}
              render={args => {
                return (
                  <CodeSelect
                    code='ctframetype'
                    {...args}
                    labelField='displayValue'
                    label='Frame Type'
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}polishFK`}
              render={args => {
                return (
                  <CodeSelect
                    code='ctpolish'
                    {...args}
                    labelField='displayValue'
                    label='Polish'
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
      <div
        style={{
          border: '0.5px solid #CCCCCC',
          margin: '8px 0px',
          padding: 8,
          borderRadius: '5px',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>
          Frame Details (Fill in details below for Customer's Own Frame)
        </div>
        <GridContainer>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}frame`}
              render={args => {
                return <TextField label='Frame' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}brand`}
              render={args => {
                return <TextField label='Brand' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}model`}
              render={args => {
                return <TextField label='Model' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}size`}
              render={args => {
                return <TextField label='Size' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={2}>
            <FastField
              name={`${prefix}color`}
              render={args => {
                return <TextField label='Color' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={12}>
            <FastField
              name={`${prefix}remarks`}
              render={args => {
                return <TextField label='Remarks' {...args} />
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
        <div style={{ fontWeight: 'bold' }}>SRP For</div>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}srpFor_FullName`}
              render={args => {
                return <TextField label='Full Name' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name={`${prefix}srpFor_YrOrClass`}
              render={args => {
                return <TextField label='Yr/Class' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  )
}

export default CommonSpectacleOrderForm
