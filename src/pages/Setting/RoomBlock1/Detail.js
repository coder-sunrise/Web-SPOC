import React, { PureComponent } from 'react'
import _ from 'lodash'
import { formatMessage, FormattedMessage } from 'umi/locale'
import moment from 'moment'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DateRangePicker,
  NumberInput,
  DatePicker,
  TimePicker,
  Checkbox,
  fullDateTime,
  FieldSet,
} from '@/components'

// import Recurrence from '@/pages/Reception/BigCalendar/components/form/Recurrence'
import { Recurrence } from '@/components/_medisys'

const styles = (theme) => ({})

@withFormikExtend({
  mapPropsToValues: ({ settingRoomBlock }) =>
    settingRoomBlock.entity || settingRoomBlock.default,
  validationSchema: Yup.object().shape(
    {
      // code: Yup.string().required(),
      // displayValue: Yup.string().required(),
      // effectiveDates: Yup.array().of(Yup.date()).min(2).required(),
    },
  ),
  handleSubmit: (values, { props }) => {
    const {
      effectiveDates,
      eventDate,
      duration,
      remarks,
      ...restValues
    } = values
    const { dispatch, onConfirm } = props
    const hours = duration.split(':')[0]
    const minutes = duration.split(':')[1]
    const endDate = moment(eventDate, 'YYYY-MM-DDTHH:mm:ssZ')
      .add(6, 'hours')
      .add(1, 'minutes')

    // console.log('check', hours, minutes, eventDate, moment(), endDate, duration)
    const roomBlock = {
      // startDateTime: eventDate + duration,
      startDateTime: eventDate,
      endDateTime: eventDate,
      remarks,
    }

    dispatch({
      type: 'settingRoomBlock/upsert',
      payload: {
        ...restValues,
        effectiveStartDate: effectiveDates[0],
        effectiveEndDate: effectiveDates[1],
        roomStatusFK: 1,
        roomBlock: [
          roomBlock,
        ],
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'settingRoomBlock/query',
        })
      }
    })
  },
  displayName: 'RoomDetail',
})
class Detail extends PureComponent {
  state = {}

  render () {
    const { props } = this
    const { classes, theme, footer, values } = props
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={12}>
              <FastField
                name='roomFK'
                render={(args) => (
                  <CodeSelect label='Room' code='ctRoom' {...args} />
                )}
              />
            </GridItem>
            <GridItem md={6}>
              <FastField
                name='eventDate'
                render={(args) => (
                  <DatePicker
                    label='Event Date'
                    format={fullDateTime}
                    showTime={{ format: 'HH:mm' }}
                    {...args}
                  />
                )}
              />
            </GridItem>

            <GridItem md={6}>
              <FastField
                name='duration'
                render={(args) => {
                  return (
                    <TimePicker use12Hours={false} label='Duration' {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <FastField
                name='remarks'
                render={(args) => {
                  return (
                    <TextField
                      label='Remarks'
                      multiline
                      rowsMax={4}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={12}>
              <Recurrence
                block
                disabled={values.id !== undefined}
                formValues={values}
                recurrenceDto={values.recurrenceDto}
              />
            </GridItem>
          </GridContainer>
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default Detail
