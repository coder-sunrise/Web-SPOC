import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { Search, Add } from '@material-ui/icons'
import { withStyles } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'
import { status } from '@/utils/codes'
import { compose } from 'redux'

import {
  GridContainer,
  GridItem,
  Select,
  Button,
  RadioGroup,
  DatePicker,
  Checkbox,
} from '@/components'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    // paddingTop: '13px',
    lineHeight: standardRowHeight,
    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const FilterBar = (props) => {
  const { classes, theme, dispatch, values } = props

  return (
    <div className={classes.filterBar}>
      <GridContainer>
        <GridItem xs={6}>
          <FastField
            name='SearchBy'
            render={(args) => (
              <RadioGroup
                label=''
                simple
                defaultValue='appointment'
                options={[
                  {
                    value: 'appointment',
                    label: formatMessage({ id: 'sms.appointment' }),
                  },
                  {
                    value: 'patient',
                    label: formatMessage({ id: 'sms.patient' }),
                  },
                ]}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={6} />
        <GridItem xs={2}>
          <FastField
            name='Start'
            render={(args) => (
              <DatePicker
                label={formatMessage({ id: 'sms.from' })}
                timeFormat={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={2}>
          <FastField
            name='End'
            render={(args) => (
              <DatePicker
                label={formatMessage({ id: 'sms.to' })}
                timeFormat={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={4} />
        <GridItem xs={4} />
        <GridItem xs={4}>
          <FastField
            name='Doctor'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'sms.doctor',
                  })}
                  options={[
                    {
                      name: 'Dr Levine',
                      value: 'Dr Levine',
                    },
                    {
                      name: 'Dr Heloo',
                      value: 'Dr Heloo',
                    },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='AppointmentStatus'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'sms.appointment.status',
                  })}
                  options={[
                    {
                      name: 'Confirmed',
                      value: 'Confirmed',
                    },
                    {
                      name: 'Unknown',
                      value: 'Unknown',
                    },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='ExcludeSent'
            render={(args) => (
              <Checkbox
                simple
                label={formatMessage({
                  id: 'sms.appointment.exclude',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='SMSStatus'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'sms.status',
                  })}
                  options={[
                    {
                      name: 'Sent',
                      value: 'Sent',
                    },
                    {
                      name: 'Pending',
                      value: 'Pending',
                    },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <FastField
            name='MessageStatus'
            render={(args) => {
              return (
                <Select
                  label={formatMessage({
                    id: 'sms.message.status',
                  })}
                  options={[
                    {
                      name: 'Read',
                      value: 'Read',
                    },
                    {
                      name: 'Unread',
                      value: 'Unread',
                    },
                  ]}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12}>
          <div className={classes.filterBtn}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                // props.dispatch({
                //   type: 'consumable/query',
                // })
              }}
            >
              <Search />
              <FormattedMessage id='sms.search' />
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({
    mapPropsToValues: () => ({
      SearchBy: 'appointment',
    }),
  }),
  React.memo,
)(FilterBar)
