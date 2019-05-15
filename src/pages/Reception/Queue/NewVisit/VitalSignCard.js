import React, { PureComponent } from 'react'

// formik
import { FastField } from 'formik'

// umi
import { formatMessage, FormattedMessage } from 'umi/locale'

// custom components
import {
  TextField,
  Card,
  CardHeader,
  CardBody,
  CardText,
  GridContainer,
  GridItem,
} from '@/components'

class VitalSignCard extends PureComponent {
  render () {
    return (
      <Card>
        <CardHeader text color='primary'>
          <CardText color='primary'>
            <h4 style={{ color: 'white' }}>
              <FormattedMessage id='reception.queue.visitRegistration.vitalSign' />
            </h4>
          </CardText>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs md={12}>
              <FastField
                name='Temperature'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.temperature',
                    })}
                    suffix={formatMessage({
                      id:
                        'reception.queue.visitRegistration.temperature.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={6}>
              <FastField
                name='BloodPressure'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.bloodPressure',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={6}>
              <FastField
                name='BloodPressureMMHG'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.mmhg',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name='HeartRate'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.heartRate',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.heartRate.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name='Weight'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.weight',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.weight.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name='Height'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.height',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.height.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name='BMI'
                render={(args) => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.bmi',
                    })}
                    suffix={formatMessage({
                      id: 'reception.queue.visitRegistration.bmi.suffix',
                    })}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    )
  }
}

export default VitalSignCard
