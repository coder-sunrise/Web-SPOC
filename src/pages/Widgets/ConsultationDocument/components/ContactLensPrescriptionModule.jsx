import { GridContainer, GridItem, TextField } from '@/components'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { useTheme } from '@material-ui/core/styles'

const _styles = withStyles(theme => ({}), { withTheme: true })

const ContactLensPrescriptionModule = props => {
  let { classes } = props
  let { spacing } = useTheme()
  return (
    <GridItem>
      <div
        style={{
          border: '1px solid #ccc',
          marginTop: spacing(2),
          borderRadius: '5px',
        }}
      >
        <GridItem xs>
          <div style={{ fontWeight: 'bolder' }}>Prescription</div>
          <div style={{ marginBottom: '-10px', fontSize: '0.8rem' }}>
            Left Eye(LE)
          </div>
        </GridItem>
        <GridContainer>
          <GridItem xs>
            <FastField
              name='leftBC'
              render={args => {
                return <TextField label='BC' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftDIA'
              render={args => {
                return <TextField label='DIA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftSPH'
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftCYL'
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftAXIS'
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftCOLOR_TINT'
              render={args => {
                return <TextField label='COLOR/TINT' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftADD'
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftVA'
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftPH'
              render={args => {
                return <TextField label='PH' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridItem xs>
          <div style={{ marginBottom: '-10px', fontSize: '0.8rem' }}>
            Right Eye(RE)
          </div>
        </GridItem>
        <GridContainer>
          <GridItem xs>
            <FastField
              name='rightBC'
              render={args => {
                return <TextField label='BC' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightDIA'
              render={args => {
                return <TextField label='DIA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightSPH'
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightCYL'
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightAXIS'
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightCOLOR_TINT'
              render={args => {
                return <TextField label='COLOR/TINT' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightADD'
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightVA'
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightPH'
              render={args => {
                return <TextField label='PH' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </div>
    </GridItem>
  )
}

export default compose(_styles)(ContactLensPrescriptionModule)
