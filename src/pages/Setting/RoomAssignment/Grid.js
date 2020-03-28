import React from 'react'
import { compose } from 'redux'
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

const roomAssignSchema = Yup.object().shape({
  clinicianProfileFK: Yup.number().required(),
  roomFK: Yup.number().required(),
})

const Grid = ({
  handleSubmit,
  setFieldValue,
  values,
  values: { roomAssignRows = [] },
}) => {
  const handleDoctorChange = (v, test) => {
    const { row } = v
    const { clinicianProfileFK } = row

    const isDoctorAlrdyAssigned = roomAssignRows.find(
      (roomAssign) => roomAssign.clinicianProfileFK === clinicianProfileFK,
    )
    console.log({ isDoctorAlrdyAssigned, roomAssignRows, clinicianProfileFK })

    if (isDoctorAlrdyAssigned) row.clinicianProfileFK = undefined
    console.log({ v, test })
    console.log(values.roomAssignRows)
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
        type: 'codeSelect',
        code: 'doctorprofile',
        labelField: 'clinicianProfile.name',
        valueField: 'clinicianProfile.id',
        remoteFilter: {
          'clinicianProfile.isActive': false,
        },
        localFilter: (opt) => console.log({ values }),
        onChange: (v) => handleDoctorChange(v, roomAssignRows),
        renderDropdown: (option) => <DoctorLabel doctor={option} />,
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
      console.log({ payload })
      dispatch({
        type: 'settingRoomAssignment/upsert',
        payload,
      }).then((r) => {
        if (r) {
          resetForm()
          dispatch({
            type: 'settingRoomAssignment/query',
          })
          history.push('/setting')
        }
      })
    },
    displayName: 'RoomAssignment',
  }),
)(Grid)
