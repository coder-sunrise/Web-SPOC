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
  doctorProfile = [],
  global,
  codetable,
  theme,
  ...restProps
}) => {
  const [doctorOptions, setDoctorOptions] = useState([])

  useEffect(() => {
    const formattedDoctorProfiles = doctorProfile.map(doctor => {
      const { doctorMCRNo, clinicianProfile } = doctor
      const { id, title, name } = clinicianProfile
      return {
        value: id,
        name:
          doctorMCRNo == undefined || doctorMCRNo == ''
            ? `${title || ''}${title ? ' ' : ''}${name}`
            : `${title || ''}${title ? ' ' : ''}${name}(${doctorMCRNo})`,
      }
    })
    setDoctorOptions(formattedDoctorProfiles)
  }, [])

  useEffect(() => {
    let tempDoctorOptions = [...doctorOptions]
    roomAssignRows.map(roomAssign => {
      tempDoctorOptions = tempDoctorOptions.filter(
        doctor => doctor.value !== roomAssign.clinicianProfileFK,
      )
      return roomAssign
    })
  }, [roomAssignRows])

  useEffect(() => {
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }, [])

  const compareDoctor = function(a, b) {
    let doctorA = doctorOptions.find(doctor => doctor.value === a)
    let doctorB = doctorOptions.find(doctor => doctor.value === b)
    if (doctorA === undefined || doctorB === undefined) return false
    return doctorA.name.localeCompare(doctorB.name)
  }
  const compareRoom = function(a, b) {
    let roomA = codetable.ctroom.find(room => room.id === a)
    let roomB = codetable.ctroom.find(room => room.id === b)
    if (roomA === undefined || roomB === undefined) return false
    return roomA.name.localeCompare(roomB.name)
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
        type: 'select',
        options: row => {
          const currentRowDoctor = doctorOptions.find(
            doctor => doctor.value === row.clinicianProfileFK,
          )

          const newDoctorOptions = doctorOptions.filter(
            doctor => doctor.value !== row.clinicianProfileFK,
          )

          return [...newDoctorOptions, currentRowDoctor]
        },
        compare: compareDoctor,
      },
      {
        columnName: 'roomFK',
        type: 'codeSelect',
        code: 'ctroom',
        compare: compareRoom,
      },
    ],
  }

  const onAddedRowsChange = addedRows => {
    return addedRows.map(row => ({
      patientAllergyStatusFK: 1,
      ...row,
      isConfirmed: true,
    }))
  }

  const onCommitChanges = ({ rows }) => {
    const returnRows = rows.filter(r => !(r.isNew && r.isDeleted))
    setFieldValue('roomAssignRows', returnRows)
  }
  // console.log(window.$tempGridRow)
  // console.log(
  //   values,
  //   roomAssignRows,
  //   (doctorProfile = []),
  //   global,
  //   codetable,
  //   restProps,
  // )
  return (
    <div>
      <GridItem md={3}>
        <p>* Only doctor users can be assigned to a room</p>
      </GridItem>
      <EditableTableGrid
        style={{ margin: theme.spacing(1) }}
        id='roomAssingmentGrid'
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

        <Button
          color='primary'
          onClick={handleSubmit}
          disabled={global.disableSave}
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default compose(
  connect(({ codetable, global }) => {
    return {
      doctorProfile: codetable.doctorprofile,
      global,
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

      const newRowAssignRows = roomAssignRows.map(room => {
        return {
          ...room,
          effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
          effectiveStartDate: moment().formatUTC(),
        }
      })
      const payload = [...newRowAssignRows]
      // console.log({ payload })
      dispatch({
        type: 'settingRoomAssignment/upsert',
        payload,
      }).then(r => {
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
