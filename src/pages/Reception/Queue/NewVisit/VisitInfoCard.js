import React, { PureComponent } from 'react'
// material ui
import AttachFile from '@material-ui/icons/AttachFile'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// custom components
import {
  Button,
  TextField,
  NumberInput,
  CommonCard,
  GridContainer,
  GridItem,
  Select,
} from '@/components'
import FormField from './formField'

class VisitInfoCard extends PureComponent {
  render () {
    return (
      <CommonCard
        size='sm'
        title={
          <FormattedMessage id='reception.queue.visitRegistration.visitInformation' />
        }
      >
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name={FormField['visit.queueNo']}
              render={(args) => (
                <NumberInput
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
              name={FormField['visit.visitType']}
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitType',
                  })}
                  options={[]}
                  {...args}
                />
              )}
            />
          </GridItem>

          <GridItem xs md={12}>
            <FastField
              name={FormField['visit.doctorProfileFk']}
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.doctor',
                  })}
                  options={[]}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name={FormField['visit.visitRemarks']}
              render={(args) => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={3}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitRemarks',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <Button color='rose'>
              <AttachFile />
              <FormattedMessage id='reception.queue.visitRegistration.attachment' />
            </Button>
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default VisitInfoCard
