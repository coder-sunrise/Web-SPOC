import React, { PureComponent } from 'react'

// formik
import { FastField } from 'formik'

// umi
import { formatMessage, FormattedMessage } from 'umi/locale'

// custom components
import {
  DatePicker,
  TextField,
  Card,
  CardHeader,
  CardBody,
  CardText,
  GridContainer,
  GridItem,
} from '@/components'

class SchemesCard extends PureComponent {
  render() {
    return (
      <Card>
        <CardHeader text color="primary">
          <CardText color="primary">
            <h4 style={{ color: 'white' }}>
              <FormattedMessage id="reception.queue.visitRegistration.scheme" />
            </h4>
          </CardText>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs md={12}>
              <FastField
                name="AccountNo"
                render={args => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.accountNo',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name="Balance"
                render={args => (
                  <TextField
                    {...args}
                    currency
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.balance',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name="Validity"
                render={args => (
                  <DatePicker
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.validity',
                    })}
                    className="rdtPickerOpenUpwards"
                    timeFormat={false}
                    disabled={false}
                    {...args}
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

export default SchemesCard
