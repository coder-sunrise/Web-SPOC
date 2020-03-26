import React from 'react'
import { compose } from 'redux'
import {
  withFormikExtend,
  GridItem,
  Button,
  EditableTableGrid,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'

import { DoctorLabel } from '@/components/_medisys'

const tableParas = {
  columns: [
    { name: 'doctor', title: 'Doctor' },
    { name: 'room', title: 'Room' },
    // { name: 'roomDisplayName', title: 'Room Display Name' },
  ],
  columnExtensions: [
    {
      columnName: 'doctor',
      width: 500,
      type: 'codeSelect',
      code: 'doctorprofile',
      labelField: 'clinicianProfile.name',
      valueField: 'clinicianProfile.id',
      remoteFilter: {
        'clinicianProfile.isActive': false,
      },
      renderDropdown: (option) => <DoctorLabel doctor={option} />,
    },
    {
      columnName: 'room',
      type: 'codeSelect',
      code: 'ctroom',
    },
    // {
    //   columnName: 'roomDisplayName',
    //   maxLength: 10,
    // },
  ],
}

const Grid = ({
  handleSubmit,
  setFieldValue,
  values: { roomAssignRows = [] },
}) => {
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
        // schema={schema}
        rows={roomAssignRows}
        FuncProps={{
          pager: false,
        }}
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
    mapPropsToValues: () => {},
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history } = props
      const payload = {}
      dispatch({
        type: 'settingRoomAssignment/upsert',
        payload,
      }).then((r) => {
        if (r) {
          resetForm()
          history.push('/setting')
        }
      })
    },
    displayName: 'RoomAssignment',
  }),
)(Grid)
