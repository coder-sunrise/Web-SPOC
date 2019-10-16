import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { FormattedMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  Button,
  Select,
  ProgressButton,
  DateRangePicker,
  DatePicker,
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

const recurrenceTypes = [
  {
    id: 'daily',
    name: 'Daily',
  },
  {
    id: 'weekly',
    name: 'Weekly',
  },
  {
    id: 'monthly',
    name: 'Monthly',
  },
]

@withFormik({
  mapPropsToValues: () => ({}),
  handleSubmit: () => {},
})
class Filter extends PureComponent {
  render () {
    const { classes, values } = this.props

    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='code'
              render={(args) => {
                return <CodeSelect label='Room' code='ctRoom' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='dateFrom'
              render={(args) => {
                return <DatePicker label='Date From' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='dateTo'
              render={(args) => {
                return <DatePicker label='Date To' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6} md={2}>
            <FastField
              name='isActive'
              render={(args) => {
                return (
                  <Select
                    label='Recurrence Type'
                    options={recurrenceTypes}
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
                icon={null}
                onClick={() => {
                  const prefix = this.props.values.isExactSearch
                    ? 'eql_'
                    : 'like_'

                  this.props.dispatch({
                    type: 'roomBlock/query',
                    payload: {
                      // [`${prefix}name`]: values.doctorName,
                      lgteql_startDateTime: values.dates
                        ? values.dates[0]
                        : undefined,
                      lsteql_endDateTime: values.dates
                        ? values.dates[1]
                        : undefined,
                      combineCondition: 'and',
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton>

              <Button
                color='primary'
                onClick={() => {
                  this.props.toggleModal()
                  this.props.dispatch({
                    type: 'roomBlock/reset',
                  })
                }}
              >
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
