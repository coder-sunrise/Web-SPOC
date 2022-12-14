import { GridContainer, GridItem, TextField } from '@/components'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'

const _styles = withStyles(theme => ({}), { withTheme: true })

const ContactLensPrescriptionModule = props => {
  let { classes, prefix = '' } = props
  return (
    <div
      style={{
        border: '0.5px solid #ccc',
        margin: '8px 0px',
        padding: 8,
        borderRadius: '5px',
      }}
    >
      <div style={{ fontWeight: 'bolder' }}>Prescription</div>
      <div
        style={{
          lineHeight: '16px',
          position: 'relative',
          bottom: -5,
          right: -7,
          fontWeight: 500,
        }}
      >
        Left Eye(LE)
      </div>
      <GridContainer>
        <GridItem xs>
          <FastField
            name={`${prefix}leftBC`}
            render={args => {
              return <TextField label='BC' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftDIA`}
            render={args => {
              return <TextField label='DIA' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftSPH`}
            render={args => {
              return <TextField label='SPH' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftCYL`}
            render={args => {
              return <TextField label='CYL' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftAXIS`}
            render={args => {
              return <TextField label='AXIS' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftCOLOR_TINT`}
            render={args => {
              return <TextField label='COLOR/TINT' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftADD`}
            render={args => {
              return <TextField label='ADD' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftVA`}
            render={args => {
              return <TextField label='VA' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}leftPH`}
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
        Right Eye(RE)
      </div>
      <GridContainer>
        <GridItem xs>
          <FastField
            name={`${prefix}rightBC`}
            render={args => {
              return <TextField label='BC' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightDIA`}
            render={args => {
              return <TextField label='DIA' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightSPH`}
            render={args => {
              return <TextField label='SPH' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightCYL`}
            render={args => {
              return <TextField label='CYL' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightAXIS`}
            render={args => {
              return <TextField label='AXIS' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightCOLOR_TINT`}
            render={args => {
              return <TextField label='COLOR/TINT' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightADD`}
            render={args => {
              return <TextField label='ADD' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightVA`}
            render={args => {
              return <TextField label='VA' {...args} />
            }}
          />
        </GridItem>
        <GridItem xs>
          <FastField
            name={`${prefix}rightPH`}
            render={args => {
              return <TextField label='PH' {...args} />
            }}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default compose(_styles)(ContactLensPrescriptionModule)
