import React, { PureComponent } from 'react'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { Field, FastField, withFormik } from 'formik'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
import { Refresh } from '@material-ui/icons'
// custom components
import {
  GridContainer,
  GridItem,
  Button,
  Checkbox,
  Select,
  TextField,
  DatePicker,
  NumberInput,
  CodeSelect,
} from '@/components'
// code table
import {
  drugs,
  consumptionMethods,
  dosage,
  dosageUnits,
  frequency,
  periods,
  precautions,
} from '@/utils/codes'
// assets
import { tooltip } from '@/assets/jss'

const styles = () => ({
  refreshButton: { marginTop: '20px', padding: 0 },
  remarksButton: { marginTop: '12px' },
  prnCheckBox: { marginTop: '25px' },
  tooltip,
})

class DrugControl extends PureComponent {
  render () {
    const { classes, handleRemarksClick, handleAdd } = this.props
    return (
      <GridItem md={9}>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='itemCode'
              render={(args) => {
                return (
                  <Select
                    label={formatMessage({
                      id: 'reception.queue.dispense.drugItem.drug',
                    })}
                    options={drugs}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={6}>
            <Field
              name='stock'
              render={(args) => (
                <TextField
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.stockUOM',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='instruction'
              render={(args) => (
                <TextField
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.instruction',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='consumptionMethod'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.consumptionMethod',
                  })}
                  options={consumptionMethods}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='dosage'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.dosage',
                  })}
                  options={dosage}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='dosageUnit'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.dosageUnit',
                  })}
                  options={dosageUnits}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='frequency'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.frequency',
                  })}
                  options={frequency}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='periodAmount'
              render={(args) => (
                <NumberInput
                  qty
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.periodAmount',
                  })}
                  prefix='For'
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='period'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.period',
                  })}
                  options={periods}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='PRN'
              render={(args) => (
                <Checkbox
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.prn',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <Field
              name='precautionOne'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.precautionOne',
                  })}
                  options={precautions}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <Field
              name='precautionTwo'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.precautionTwo',
                  })}
                  options={precautions}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={12}>
            <Field
              name='precautionThree'
              render={(args) => (
                <Select
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.precautionThree',
                  })}
                  options={precautions}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='batchNo'
              render={(args) => (
                <TextField
                  {...args}
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.batchNo',
                  })}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='expireDate'
              render={(args) => (
                <DatePicker
                  {...args}
                  className='rdtPickerOpenUpwards'
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.expireDate',
                  })}
                />
              )}
            />
          </GridItem>

          <GridItem md={1} classes={{ grid: classes.refreshButton }}>
            <Tooltip
              title={formatMessage({
                id: 'reception.queue.dispense.drugItem.refreshTooltip',
              })}
              placement='top-start'
              classes={{ tooltip: classes.tooltip }}
            >
              <Button size='sm' color='primary' justIcon round>
                <Refresh />
              </Button>
            </Tooltip>
          </GridItem>
          <GridItem md={5}>
            <Field
              name='remarks'
              render={(args) => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={4}
                  label={formatMessage({
                    id: 'reception.queue.dispense.drugItem.remarks',
                  })}
                />
              )}
            />
          </GridItem>

          <GridItem md={12}>
            <GridContainer justify='center' alignItems='center'>
              <GridItem xs md={6} className='centerizedContent topSpacing'>
                <Button size='sm' color='success' onClick={handleAdd}>
                  <FormattedMessage id='reception.queue.dispense.button.add' />
                </Button>
                <Button size='sm' color='danger'>
                  <FormattedMessage id='reception.queue.dispense.button.reset' />
                </Button>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </GridItem>
    )
  }
}

export default withStyles(styles)(DrugControl)
