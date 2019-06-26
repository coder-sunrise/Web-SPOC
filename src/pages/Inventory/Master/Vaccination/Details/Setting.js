import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { compose } from 'redux'
import {
  Card,
  CardHeader,
  CardText,
  CardBody,
  GridContainer,
  GridItem,
  Select,
  TextField,
  Transfer,
} from '@/components'

const styles = () => ({})
const Setting = ({ classes }) => {
  const settingProps = {
    items: [
      'Anti-Inflmation',
      'Anti-Swelling',
      'Apply as instructed',
      'Apply on the ear only',
      'Apply on the eye only',
      'Apply on the head and massage',
      'Avoid alcohol',
      'Avoid contact with eyes',
      'Complete whole course of medicine',
    ],
    classes,
    label: 'Precaution',
    limitTitle: 'Maximum up to 3 precautions to be configured',
    limit: 3,
  }
  return (
    <GridContainer>
      <GridItem xs={6}>
        <Card>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Prescribing</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='Dosage'
                  render={(args) => (
                    <Select label='Dosage' options={[]} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='PrescribingUOM'
                  render={(args) => (
                    <Select label='UOM' options={[]} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Frequency'
                  render={(args) => (
                    <Select label='Frequency' options={[]} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='Code'
                  render={(args) => {
                    return <TextField label='Duration' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={6}>
        <Card>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Dispensing</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12}>
                <FastField
                  name='Usage'
                  render={(args) => (
                    <Select label='Usage' options={[]} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='Quantity'
                  render={(args) => {
                    return <TextField label='Quantity' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='DispensingUOM'
                  render={(args) => (
                    <Select label='UOM' options={[]} {...args} />
                  )}
                />
              </GridItem>
              <GridItem xs={6} />
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <p style={{ textAlign: 'Center' }}>
          1 Dispense UOM = <u>1.00</u> Prescribing UOM
        </p>
      </GridItem>
      {/* <GridItem xs={12}>
        <Card className='Test'>
          <CardHeader color='primary' text>
            <CardText color='primary'>
              <h5 className={classes.cardTitle}>Medication Precaution</h5>
            </CardText>
          </CardHeader>
          <CardBody>
            <Transfer {...settingProps} />
          </CardBody>
        </Card>
      </GridItem> */}
    </GridContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }))(Setting)
