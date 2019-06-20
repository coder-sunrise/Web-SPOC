import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// common components
import {
  TextField,
  NumberInput,
  CommonCard,
  GridContainer,
  GridItem,
} from '@/components'
import FormField from './formField'

class VitalSignCard extends PureComponent {
  render () {
    return (
      <CommonCard
        size='sm'
        title={
          <FormattedMessage id='reception.queue.visitRegistration.vitalSign' />
        }
      >
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name={FormField['vitalsign.temperature']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.temperature',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.temperature.suffix',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={6}>
            <FastField
              name={FormField['vitalsign.bloodPressure']}
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
              name={FormField['vitalsign.mmhg']}
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
              name={FormField['vitalsign.heartRate']}
              render={(args) => (
                <NumberInput
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
              name={FormField['vitalsign.weight']}
              render={(args) => (
                <NumberInput
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
              name={FormField['vitalsign.height']}
              render={(args) => (
                <NumberInput
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
              name={FormField['vitalsign.bmi']}
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
      </CommonCard>
    )
  }
}

export default VitalSignCard
