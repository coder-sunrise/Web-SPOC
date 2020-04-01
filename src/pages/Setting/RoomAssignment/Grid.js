import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'dva'
import moment from 'moment'
import {
  withFormikExtend,
  GridItem,
  Button,
  EditableTableGrid,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import { DoctorLabel } from '@/components/_medisys'
import Yup from '@/utils/yup'
import { sendNotification } from '@/utils/realtime'

const roomAssignSchema = Yup.object().shape({
  clinicianProfileFK: Yup.number().required(),
  roomFK: Yup.number().required(),
})

let commitCount = 1000
const Grid = ({
  handleSubmit,
  setFieldValue,
  values,
  values: { roomAssignRows = [] },
  dispatch,
  doctorProfile,
}) => {
  const [
    doctorOptions,
    setDoctorOptions,
  ] = useState([])

  const [
    filteredDoctorOptions,
    setFilteredDoctorOptions,
  ] = useState([])

  useEffect(() => {
    const formattedDoctorProfiles = doctorProfile.map((doctor) => {
      const { doctorMCRNo, clinicianProfile } = doctor
      const { id, title, name } = clinicianProfile
      return {
        value: id,
        name: `${title || ''}${title ? ' ' : ''}${name} (${doctorMCRNo})`,
      }
    })
    setDoctorOptions(formattedDoctorProfiles)
    setFilteredDoctorOptions(formattedDoctorProfiles)
  }, [])

  // const handleDoctorChange = (v, test) => {
  //   const { row } = v
  //   const { clinicianProfileFK } = row

  //   const isDoctorAlrdyAssigned = roomAssignRows.find(
  //     (roomAssign) => roomAssign.clinicianProfileFK === clinicianProfileFK,
  //   )
  //   // console.log({
  //   //   isDoctorAlrdyAssigned,
  //   //   roomAssignRows,
  //   //   clinicianProfileFK,
  //   //   test,
  //   // })
  //   dispatch({
  //     // force current edit row components to update
  //     type: 'global/updateState',
  //     payload: {
  //       commitCount: (commitCount += 1),
  //     },
  //   })
  //   if (isDoctorAlrdyAssigned) row.clinicianProfileFK = undefined
  // }

  useEffect(
    () => {
      let tempDoctorOptions = [
        ...doctorOptions,
      ]
      roomAssignRows.map((roomAssign) => {
        tempDoctorOptions = tempDoctorOptions.filter(
          (doctor) => doctor.value !== roomAssign.clinicianProfileFK,
        )
        return roomAssign
      })
      setFilteredDoctorOptions(tempDoctorOptions)
    },
    [
      roomAssignRows,
    ],
  )

  useEffect(
    () => {
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    },
    [
      filteredDoctorOptions,
    ],
  )

  const handleDoctorChange = (v) => {
    const { row } = v
    const newDoctorOptions = doctorOptions.filter(
      (doctor) => doctor.value !== row.clinicianProfileFK,
    )
    setFilteredDoctorOptions(newDoctorOptions)
  }

  const tableParas = {
    columns: [
      { name: 'clinicianProfileFK', title: 'Doctor' },
      { name: 'roomFK', title: 'Room' },
    ],
    columnExtensions: [
      {
        columnName: 'clinicianProfileFK',
        width: 500,
        // type: 'codeSelect',
        // code: 'doctorprofile',
        // labelField: 'clinicianProfile.name',
        // valueField: 'clinicianProfile.id',
        // remoteFilter: {
        //   'clinicianProfile.isActive': false,
        // },
        // onChange: (v) => handleDoctorChange(v, roomAssignRows),
        // renderDropdown: (option) => <DoctorLabel doctor={option} />,
        type: 'select',
        options: (row) => {
          const currentRowDoctor = doctorOptions.find(
            (doctor) => doctor.value === row.clinicianProfileFK,
          )

          return [
            ...filteredDoctorOptions,
            currentRowDoctor,
          ]
        },
        onChange: handleDoctorChange,
      },
      {
        columnName: 'roomFK',
        type: 'codeSelect',
        code: 'ctroom',
      },
    ],
  }

  const onAddedRowsChange = (addedRows) => {
    return addedRows.map((row) => ({
      patientAllergyStatusFK: 1,
      ...row,
      isConfirmed: true,
    }))
  }

  const onCommitChanges = ({ rows }) => {
    setFieldValue('roomAssignRows', rows)
  }

  return (
    <div>
      <GridItem md={3}>
        <p>* Only doctor users can be assigned to a room</p>
      </GridItem>
      <EditableTableGrid
        style={{ margin: 20 }}
        schema={roomAssignSchema}
        rows={roomAssignRows}
        FuncProps={{
          pager: false,
        }}
        forceRender
        EditingProps={{
          showAddCommand: true,
          onCommitChanges,
          onAddedRowsChange,
        }}
        {...tableParas}
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color='danger'
          onClick={navigateDirtyCheck({
            redirectUrl: '/setting',
          })}
        >
          Cancel
        </Button>

        <Button color='primary' onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default compose(
  connect(({ codetable }) => {
    return {
      doctorProfile: codetable.doctorprofile,
    }
  }),
  withFormikExtend({
    enableReinitialize: true,
    mapPropsToValues: ({ settingRoomAssignment }) => {
      return {
        roomAssignRows: settingRoomAssignment.list || [],
      }
    },
    handleSubmit: (values, { props, resetForm }) => {
      const { roomAssignRows } = values
      const { dispatch, history } = props

      const newRowAssignRows = roomAssignRows.map((room) => {
        return {
          ...room,
          effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
          effectiveStartDate: moment().formatUTC(),
        }
      })
      const payload = [
        ...newRowAssignRows,
      ]
      // console.log({ payload })
      dispatch({
        type: 'settingRoomAssignment/upsert',
        payload,
      }).then((r) => {
        if (r) {
          resetForm()

          sendNotification('ModelUpdated', {
            modelName: 'settingRoomAssignment',
          })

          dispatch({
            type: 'settingRoomAssignment/query',
            payload: {
              pagesize: 9999,
            },
          })
          history.push('/setting')
        }
      })
    },
    displayName: 'RoomAssignment',
  }),
)(Grid)
