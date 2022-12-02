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
              name='leftBc'
              render={args => {
                return <TextField label='BC' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftDia'
              render={args => {
                return <TextField label='DIA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftSph'
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftCyl'
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftAxis'
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftColorTint'
              render={args => {
                return <TextField label='COLOR/TINT' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftAdd'
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftVa'
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='leftPh'
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
              name='rightBc'
              render={args => {
                return <TextField label='BC' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightDia'
              render={args => {
                return <TextField label='DIA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightSph'
              render={args => {
                return <TextField label='SPH' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightCyl'
              render={args => {
                return <TextField label='CYL' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightAxis'
              render={args => {
                return <TextField label='AXIS' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightColorTint'
              render={args => {
                return <TextField label='COLOR/TINT' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightAdd'
              render={args => {
                return <TextField label='ADD' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightVa'
              render={args => {
                return <TextField label='VA' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='rightPh'
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
