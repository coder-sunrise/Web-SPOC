import React, { Fragment } from 'react'
import { connect } from 'dva'

import FitlerBar from './FilterBar'
import Grid from './Grid'

const AppointmentSearch = ({
  dispatch,
  handleSelectEvent,
  handleAddAppointmentClick,
}) => {
  return (
    <Fragment>
      <FitlerBar
        dispatch={dispatch}
        handleAddAppointmentClick={handleAddAppointmentClick}
      />
      <Grid handleSelectEvent={handleSelectEvent} />
    </Fragment>
  )
}

export default connect(({}) => ({}))(AppointmentSearch)
