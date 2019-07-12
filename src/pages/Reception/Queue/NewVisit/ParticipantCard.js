import React, { PureComponent } from 'react'
// formik
import { FastField } from 'formik'
// custom components
import { CommonCard, GridContainer, GridItem, Select } from '@/components'
import FormField from './formField'

class ParticipantCard extends PureComponent {
  render () {
    return (
      <CommonCard size='sm' title='Participant'>
        <GridContainer>
          <GridItem xs md={12}>
            <FastField
              name={FormField['participant.participant']}
              render={(args) => (
                <Select {...args} options={[]} label='Participant' />
              )}
            />
          </GridItem>
          <GridItem xs md={12}>
            <FastField
              name={FormField['participant.participants']}
              render={(args) => (
                <Select
                  {...args}
                  options={[]}
                  mode='multi'
                  label='Participants'
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </CommonCard>
    )
  }
}

export default ParticipantCard
