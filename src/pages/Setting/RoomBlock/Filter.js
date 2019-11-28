import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import Add from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import * as Yup from 'yup'
import moment from 'moment'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  Button,
  ProgressButton,
  DatePicker,
  Field,
} from '@/components'
// medisys components

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
  tansactionCheck: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    right: 0,
  },
})
@withFormik({
  mapPropsToValues: () => {
    return {
      roomBlockGroupFK: [],
      dateFrom: moment(),
      dateTo: moment().add(6, 'months'),
      recurrence: undefined,
    }
  },
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date(),
    dateTo: Yup.date().when(
      'dateFrom',
      (dateFrom, schema) =>
        dateFrom &&
        schema.max(
          moment(dateFrom).add(6, 'months'),
          'Maximum 6 months date range.',
        ),
    ),
  }),

  handleSubmit: (values, { props }) => {
    const { roomBlockRecurrenceFK, roomBlockGroupFK, dateFrom, dateTo } = values
    const { dispatch } = props

    let stringRoomBlockGroupFK = Number(roomBlockGroupFK)
    let type = 'RoomBlockGroupFkNavigation.RoomFK'
    if (roomBlockGroupFK.length > 1) {
      type = 'in_RoomBlockGroupFkNavigation.RoomFK'
      stringRoomBlockGroupFK = roomBlockGroupFK.join('|')
    }

    dispatch({
      type: 'roomBlock/query',
      payload: {
        [type]:
          stringRoomBlockGroupFK === 0 ? undefined : stringRoomBlockGroupFK,

        'RoomBlockGroupFkNavigation.RoomBlockRecurrenceFkNavigation.RecurrencePatternFK': roomBlockRecurrenceFK,
        lgteql_startDateTime: dateFrom
          ? moment(dateFrom).formatUTC()
          : undefined,
        lsteql_endDateTime: dateTo
          ? moment(dateTo).endOf('day').formatUTC(false)
          : undefined,
        pagesize: 999,
      },
    })
  },
})
class Filter extends PureComponent {
  setDateTo = (v) => {
    if (v) {
      this.props.setFieldValue('dateTo', moment(v).add(6, 'months'))
    } else {
      this.props.setFieldValue('dateTo', undefined)
    }
  }

  render () {
    const { classes, values, handleSubmit } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='roomBlockGroupFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Room'
                    code='ctRoom'
                    mode='multiple'
                    // allValue={-99}
                    maxTagCount={values.roomBlockGroupFK.length > 1 ? 0 : 1}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} md={2}>
            <Field
              name='dateFrom'
              render={(args) => {
                return (
                  <DatePicker
                    label='From date'
                    onChange={(v) => this.setDateTo(v)}
                    timeFormat={false}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} md={2}>
            <Field
              name='dateTo'
              render={(args) => {
                return (
                  <DatePicker label='To date' timeFormat={false} {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='roomBlockRecurrenceFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Recurrence Type'
                    code='LTRecurrencePattern'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          {/* <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoomBlock/query',
                    payload: this.props.values,
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.dispatch({
                    type: 'settingRoomBlock/updateState',
                    payload: {
                      entity: undefined,
                    },
                  })
                  this.props.toggleModal()
                }}
              >
                Add New
              </Button>
            </div>
          </GridItem> */}
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={4}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={handleSubmit}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.toggleModal()
                  // this.props.dispatch({
                  //   type: 'roomBlock/reset',
                  // })
                }}
              >
                <Add />
                Add New
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'RoomBlockSetting' })(Filter)
