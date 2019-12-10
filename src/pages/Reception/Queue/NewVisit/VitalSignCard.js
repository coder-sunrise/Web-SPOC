import React, { PureComponent } from 'react'
// formik
import { Field } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// common components
import {
  NumberInput,
  CommonCard,
  GridContainer,
  GridItem,
  withFormikExtend,
} from '@/components'
import FormField from './formField'

class VitalSignCard extends PureComponent {
  render () {
    const { handleCalculateBMI, isReadOnly = false } = this.props
    return (
      <CommonCard
        size='sm'
        title={
          <FormattedMessage id='reception.queue.visitRegistration.vitalSign' />
        }
      >
        <GridContainer>
          <GridItem xs md={3}>
            <Field
              name={FormField['vitalsign.temperatureC']}
              render={(args) => (
                <NumberInput
                  {...args}
                  format='0.0'
                  disabled={isReadOnly}
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
            <Field
              name={FormField['vitalsign.bpSysMMHG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled={isReadOnly}
                  label='Blood Pressure SYS'
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.mmhg',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <Field
              name={FormField['vitalsign.bpDiaMMHG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled={isReadOnly}
                  label='Blood Pressure DIA'
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.mmhg',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <Field
              name={FormField['vitalsign.pulseRateBPM']}
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled={isReadOnly}
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
            <Field
              name={FormField['vitalsign.weightKG']}
              render={(args) => (
                <NumberInput
                  {...args}
                  disabled={isReadOnly}
                  format='0.0'
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.weight',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.weight.suffix',
                  })}
                  onChange={() => {
                    setTimeout(() => {
                      handleCalculateBMI()
                    }, 1)
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={3}>
            <Field
              name={FormField['vitalsign.heightCM']}
              render={(args) => (
                <NumberInput
                  {...args}
                  precision={0}
                  disabled={isReadOnly}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.height',
                  })}
                  suffix={formatMessage({
                    id: 'reception.queue.visitRegistration.height.suffix',
                  })}
                  // formatter={(value) => Math.floor(value)}
                  onChange={() => {
                    setTimeout(() => {
                      handleCalculateBMI()
                    }, 1)
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={4} />
          <GridItem xs md={3}>
            <Field
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
