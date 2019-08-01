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
    const { handleCalculateBMI } = this.props
    return (
      <CommonCard
        size='sm'
        title={
          <FormattedMessage id='reception.queue.visitRegistration.vitalSign' />
        }
      >
        <GridContainer>
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.temperatureC']}
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
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.bpSysMMHG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label='Blood Pressure SYS'
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.mmhg',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.bpDiaMMHG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label='Blood Pressure DIA'
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.mmhg',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.pulseRateBPM']}
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
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.weightKG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.weight',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.weight.suffix',
                  })}
                  onChange={handleCalculateBMI}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.heightCM']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.height',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.height.suffix',
                  })}
                  onChange={handleCalculateBMI}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4} />
          <GridItem xs md={3}>
            <FastField
              name={FormField['vitalsign.bmi']}
              render={(args) => (
                <NumberInput
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.bmi',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.bmi.suffix',
                  })}
                  disabled
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
