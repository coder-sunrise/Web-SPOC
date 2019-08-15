import React, { PureComponent } from 'react'
import { formatMessage, FormattedMessage } from 'umi/locale'
import { status } from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Checkbox,
  CodeSelect,
  Select,
  DatePicker,
  ProgressButton,
} from '@/components'

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

@withFormikExtend({
  mapPropsToValues: ({ settingRoomBlock }) => settingRoomBlock.filter || {},
  handleSubmit: () => {},
  displayName: 'RoomFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props
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
          <GridItem xs={6} md={3}>
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
          <GridItem xs={6} md={3}>
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
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
