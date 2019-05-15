import React, { PureComponent } from 'react'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { Field } from 'formik'
// custom component
import { Button, GridContainer, GridItem, Select, TextField } from '@/components'
// code table
import { consumptionMethods } from '@/utils/codes'

class ServiceControl extends PureComponent {
  render() {
    return (
      <GridItem md={9}>
        <GridItem md={12}>
          <Field
            name="serviceFormValues.Service"
            render={args => (
              <Select
                label={formatMessage({
                  id: 'reception.queue.dispense.serviceItem.service',
                })}
                options={consumptionMethods}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Field
            name="serviceFormValues.ServiceCenter"
            render={args => (
              <Select
                label={formatMessage({
                  id: 'reception.queue.dispense.serviceItem.serviceCentre',
                })}
                options={consumptionMethods}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Field
            name="serviceFormValues.Instructions"
            render={args => (
              <TextField
                label={formatMessage({
                  id: 'reception.queue.dispense.serviceItem.instructions',
                })}
                rowsMax={4}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Field
            name="serviceFormValues.Remarks"
            render={args => (
              <TextField
                label={formatMessage({
                  id: 'reception.queue.dispense.serviceItem.remarks',
                })}
                multiline
                rowsMax={6}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <GridContainer justify="center" alignItems="center">
            <GridItem xs md={6} className="centerizedContent topSpacing">
              <Button color="success">
                <FormattedMessage id="reception.queue.dispense.button.add" />
              </Button>
              <Button color="danger">
                <FormattedMessage id="reception.queue.dispense.button.reset" />
              </Button>
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridItem>
    )
  }
}

export default ServiceControl
