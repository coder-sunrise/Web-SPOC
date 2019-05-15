import React, { PureComponent } from 'react'
// material ui
import { AttachFile } from '@material-ui/icons'

// formik
import { FastField } from 'formik'

// umi
import { formatMessage, FormattedMessage } from 'umi/locale'

// custom components
import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardBody,
  CardText,
  GridContainer,
  GridItem,
  Select,
} from '@/components'

class VisitInfoCard extends PureComponent {
  render() {
    return (
      <Card>
        <CardHeader text color="primary">
          <CardText color="primary">
            <h4 style={{ color: 'white' }}>
              <FormattedMessage id="reception.queue.visitRegistration.visitInformation" />
            </h4>
          </CardText>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs md={12}>
              <FastField
                name="VisitType"
                render={args => (
                  <Select
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.visitType',
                    })}
                    options={[
                      { name: 'Cons', value: 'cons' },
                      { name: 'Non-Cons', value: 'noncons' },
                    ]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name="QueueNo"
                render={args => (
                  <TextField
                    {...args}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.queueNo',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name="Doctor"
                render={args => (
                  <Select
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.doctor',
                    })}
                    options={[
                      { name: 'Cons', value: 'cons' },
                      { name: 'Non-Cons', value: 'noncons' },
                    ]}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <FastField
                name="VisitRemarks"
                render={args => (
                  <TextField
                    {...args}
                    multiline
                    rowsMax={4}
                    label={formatMessage({
                      id: 'reception.queue.visitRegistration.visitRemarks',
                    })}
                  />
                )}
              />
            </GridItem>
            <GridItem xs md={12}>
              <Button color="rose">
                <AttachFile />
                <FormattedMessage id="reception.queue.visitRegistration.attachment" />
              </Button>
            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    )
  }
}

export default VisitInfoCard
