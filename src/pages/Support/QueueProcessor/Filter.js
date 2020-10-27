import React, { PureComponent } from 'react'
import { FormattedMessage } from 'umi/locale'
import Search from '@material-ui/icons/Search'
import { queueProcessorType, queueItemStatus } from '@/utils/codes'
import { DoctorProfileSelect } from '@/components/_medisys'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  Button,
  TextField,
  Select,
  ProgressButton,
  CodeSelect,
  DateRangePicker,
} from '@/components'

@withFormikExtend({
  mapPropsToValues: () => { },
  handleSubmit: () => { },
  displayName: 'QueueProcessorFilter',
})
class Filter extends PureComponent {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.filterBar}>
        <GridContainer>
          <GridItem xs={6} md={4}>
            <FastField
              name='queueProcessTypeFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Process Type'
                    options={queueProcessorType}
                    {...args}
                    valueField='value'
                    all={-99}
                    defaultOptions={[
                      {
                        isExtra: true,
                        id: -99,
                        displayValue: 'All',
                      },
                    ]}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='invoiceDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Request Date From'
                    label2='Request Date To'
                    {...args}
                  />)
              }
              }
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='doctorID'
              render={(args) => <DoctorProfileSelect {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={4}>
            <FastField
              name='queueProcessStatusFK'
              render={(args) => {
                return <Select label='Status' options={queueItemStatus} {...args} />
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={3}>
            <div className={classes.filterBtn}>
              <ProgressButton
                color='primary'
                icon={<Search />}
                onClick={() => {
                  const { status, processType } = this.props.values
                  console.log({ status, processType })
                  this.props.dispatch({
                    type: 'queueProcessor/query',
                    payload: {
                      status,
                      processType, 
                    },
                  })
                }}
              >
                <FormattedMessage id='form.search' />
              </ProgressButton> 
            </div>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default Filter
