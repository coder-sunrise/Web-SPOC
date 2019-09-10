import React, { PureComponent, useState } from 'react'
// formik
import { FastField } from 'formik'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// common components
import DeleteIcon from '@material-ui/icons/Delete'
import { withStyles, Divider, Paper } from '@material-ui/core'
import {
  TextField,
  NumberInput,
  CommonCard,
  GridContainer,
  GridItem,
  Popover,
  Button,
  Popconfirm,
} from '@/components'

export default ({
  theme,
  index,
  arrayHelpers,
  handleCalculateBMI,
  ...props
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  return (
    <React.Fragment>
      <GridContainer style={{ marginTop: theme.spacing(1) }}>
        <GridItem xs md={3}>
          <FastField
            name={`corPatientNoteVitalSign[${index}].temperatureC`}
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
            name={`corPatientNoteVitalSign[${index}].bpSysMMHG`}
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
            name={`corPatientNoteVitalSign[${index}].bpDiaMMHG`}
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
            name={`corPatientNoteVitalSign[${index}].pulseRateBPM`}
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
            name={`corPatientNoteVitalSign[${index}].weightKG`}
            render={(args) => (
              <NumberInput
                {...args}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.weight',
                })}
                suffix={formatMessage({
                  id: 'reception.queue.visitRegistration.weight.suffix',
                })}
                onChange={handleCalculateBMI(index, args.form)}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={3}>
          <FastField
            name={`corPatientNoteVitalSign[${index}].heightCM`}
            render={(args) => (
              <NumberInput
                {...args}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.height',
                })}
                suffix={formatMessage({
                  id: 'reception.queue.visitRegistration.height.suffix',
                })}
                // formatter={(value) => Math.floor(value)}
                onChange={handleCalculateBMI(index, args.form)}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4} />
        <GridItem xs md={3}>
          <FastField
            name={`corPatientNoteVitalSign[${index}].bmi`}
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
        <GridItem xs={1} style={{ position: 'relative' }}>
          {/* <Popover
            content={
              <div>
                <p style={{ paddingLeft: 20, paddingBottom: theme.spacing(2) }}>
                  Confirm to remove this Vital Sign?
                </p>
                <Button
                  onClick={() => {
                    setShow(false)
                  }}
                  variant='outlined'
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  onClick={() => {
                    arrayHelpers.remove(index)
                    setShow(false)
                  }}
                >
                  Remove Vital Sign
                </Button>
              </div>
            }
            title='Delete Vital Sign'
            trigger='click'
            visible={show}
            onVisibleChange={() => {
              setShow(!show)
            }}
          >
            <Button
              // style={{ position: 'absolute', bottom: theme.spacing(1) }}
              justIcon
              color='danger'
              size='sm'
            >
              <DeleteIcon />
            </Button>
          </Popover> */}
          <Popconfirm
            title='Confirm to remove this Vital Sign?'
            onConfirm={() => {
              const { form } = arrayHelpers
              form.setFieldValue(
                `corPatientNoteVitalSign[${index}].isDeleted`,
                true,
              )
            }}
          >
            <Button
              style={{ position: 'absolute', bottom: theme.spacing(1) }}
              justIcon
              color='danger'
              size='sm'
            >
              <DeleteIcon />
            </Button>
          </Popconfirm>
        </GridItem>
      </GridContainer>
      <Divider />
    </React.Fragment>
  )
}
