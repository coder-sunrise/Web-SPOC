import React, { PureComponent } from 'react'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { Field } from 'formik'
// custom component
import { Button, GridContainer, GridItem, Select, TextField } from '@/components'
// code table
import { consumptionMethods } from '@/utils/codes'

class ConsumablesControl extends PureComponent {
  render() {
    return (
      <GridItem md={9}>
        <GridItem md={12}>
          <Field
            name="consumablesFormValues.Consumable"
            render={args => (
              <Select
                label={formatMessage({
                  id: 'reception.queue.dispense.consumableItem.consumable',
                })}
                options={consumptionMethods}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={12}>
          <Field
            name="consumablesFormValues.Remarks"
            render={args => (
              <TextField
                label={formatMessage({
                  id: 'reception.queue.dispense.consumableItem.remarks',
                })}
                rowsMax={6}
                multiline
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

export default ConsumablesControl
