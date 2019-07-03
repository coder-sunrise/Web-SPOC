import React from 'react'
// custom component
import { GridContainer, GridItem } from '@/components'
// sub componnet
import DateNavigator from './DateNavigator'
import DateButton from './DateButton'
import CalendarView from './CalendarView'
import FilterBar from './FilterBar'

const Toolbar = () => {
  return (
    <GridContainer>
      <GridItem xs md={12}>
        <FilterBar />
      </GridItem>
      <GridItem xs md={2}>
        <DateNavigator />
      </GridItem>
      <GridItem xs md={8}>
        <DateButton />
      </GridItem>
      <GridItem xs md={2} container justify='flex-end'>
        <CalendarView />
      </GridItem>
    </GridContainer>
  )
}

export default Toolbar
