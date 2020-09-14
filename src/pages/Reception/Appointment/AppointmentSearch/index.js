import React, { Fragment, useEffect } from 'react'
import { connect } from 'dva'

import Authorized from '@/utils/Authorized'
import FitlerBar from './FilterBar'
import Grid from './Grid'

const AppointmentSearch = ({
  dispatch,
  handleSelectEvent,
  handleAddAppointmentClick,
  appointment,
  currentUser,
  doctorprofile = [],
}) => {
  const viewOtherApptAccessRight = Authorized.check(
    'appointment.viewotherappointment',
  )
  const isActiveDoctor = doctorprofile.find(
    (doctor) =>
      doctor.clinicianProfile.isActive &&
      doctor.clinicianProfile.id === currentUser,
  )

  useEffect(() => {
    let defaultDoctor = []
    if (
      !viewOtherApptAccessRight ||
      viewOtherApptAccessRight.rights !== 'enable'
    ) {
      if (isActiveDoctor) {
        defaultDoctor = [
          currentUser,
        ]
      } else {
        defaultDoctor = [
          -1,
        ]
      }
    }
    dispatch({
      type: 'appointment/query',
      payload: {
        apiCriteria: {
          doctor: defaultDoctor.join(),
          isIncludeRescheduledByClinic: true,
          isIncludeHistory: true,
        },
      },
    })
    return () => {
      dispatch({
        type: 'appointment/reset',
      })
      dispatch({
        type: 'appointment/updateState',
        payload: {
          pagination: {
            current: 1,
            totalRecords: 0,
          },
        },
      })
    }
  }, [])

  return (
    <Fragment>
      <FitlerBar
        dispatch={dispatch}
        handleAddAppointmentClick={handleAddAppointmentClick}
        appointment={appointment}
        filterByDoctor={
          (!viewOtherApptAccessRight ||
            viewOtherApptAccessRight.rights !== 'enable') &&
          isActiveDoctor ? (
            [
              currentUser,
            ]
          ) : (
            []
          )
        }
        viewOtherApptAccessRight={viewOtherApptAccessRight}
        isActiveDoctor={isActiveDoctor}
      />
      <Grid
        handleSelectEvent={(data) => {
          handleSelectEvent({ ...data, isHistory: true })
        }}
      />
    </Fragment>
  )
}

export default connect(({ appointment }) => ({ appointment }))(
  AppointmentSearch,
)
