import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { EditableTableGrid, dateFormat } from '@/components'
import { AppointmentTypeLabel } from '@/components/_medisys'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'
import ErrorPopover from './ErrorPopover'
import AuthorizedContext from '@/components/Context/Authorized'

const styles = () => ({
  container: {
    position: 'relative',
  },
  errorIcon: {
    position: 'absolute',
    top: 10,
    left: 22,
    zIndex: 100,
  },
  selectContainer: {
    width: '100%',
  },
  dropdownMenu: {
    zIndex: 1310,
  },
  colorDot: {
    height: '0.8rem',
    width: '1.5rem',
    borderRadius: '20%',
    display: 'inline-block',
    marginRight: 10,
  },
})

const calculateDuration = (startTime, endTime) => {
  const hour = endTime.diff(startTime, 'hour')
  const minute = (endTime.diff(startTime, 'minute') / 60 - hour) * 60
  return { hour, minute }
}

@connect(({ codetable }) => ({
  appointmentTypes: codetable.ctappointmenttype,
  clinicianProfiles: codetable.clinicianprofile,
  rooms: codetable.ctroom,
}))
class AppointmentDataGrid extends React.Component {
  constructor (props) {
    super(props)
    const { appointmentDate, data, selectedSlot } = this.props
    const columnExtensions = AppointmentDataColExtensions.map((column) => {
      if (column.columnName === 'isPrimaryClinician') {
        return {
          ...column,
          checkedValue: true,
          uncheckedValue: false,
          onChange: this.onRadioChange,
        }
      }

      if (column.type === 'time') {
        return {
          ...column,
          currentDate: appointmentDate
            ? moment(appointmentDate, dateFormat)
            : moment(),
        }
      }

      if (column.columnName === 'roomFk') {
        return {
          ...column,
          render: (row) => {
            const { rooms = [] } = this.props
            const room = rooms.find((item) => item.id === row.roomFk)
            if (room) return room.name
            return ''
          },
        }
      }

      if (column.columnName === 'clinicianFK') {
        return {
          ...column,
          render: (row) => {
            const { clinicianFK } = row
            const { clinicianProfiles = [] } = this.props
            const clinicianProfile = clinicianProfiles.find(
              (item) => item.id === clinicianFK,
            )

            if (!clinicianProfile) return null
            const title = clinicianProfile.title || ''
            return <p>{`${title} ${clinicianProfile.name}`}</p>
          },
        }
      }

      if (column.columnName === 'appointmentTypeFK') {
        return {
          ...column,
          render: (row) => {
            const { appointmentTypeFK } = row
            const { appointmentTypes = [] } = this.props
            const appointmentType = appointmentTypes.find(
              (item) => item.id === appointmentTypeFK,
            )

            if (!appointmentType) return null
            return (
              <AppointmentTypeLabel
                color={appointmentType.tagColorHex}
                label={appointmentType.displayValue}
              />
            )
          },
          renderDropdown: (option) => {
            let color
            if (option.tagColorHex)
              color = option.tagColorHex.includes('#')
                ? option.tagColorHex
                : `#${option.tagColorHex}`
            return (
              <AppointmentTypeLabel color={color} label={option.displayValue} />
            )
          },
        }
      }

      if (column.columnName === 'startTime') {
        return {
          ...column,
          onChange: (row) => {
            console.log({ row })
          },
        }
      }
      return { ...column }
    })

    this.columnExtensions = [
      ...columnExtensions,
    ]
  }

  onRadioChange = ({ row, checked }) => {
    if (checked) {
      const { data, handleCommitChanges } = this.props
      const newRows = data.map(
        (eachRow) =>
          eachRow.id !== row.id
            ? {
                ...eachRow,
                isPrimaryClinician: false,
              }
            : { ...eachRow, isPrimaryClinician: checked },
      )
      handleCommitChanges({ rows: newRows })
    }
  }

  render () {
    const {
      classes,
      data,
      handleCommitChanges,
      disabled,
      validationSchema,
      handleEditingRowsChange,
      editingRows,
      selectedSlot,
    } = this.props

    return (
      <div className={classes.container}>
        <AuthorizedContext.Provider
          value={{ rights: disabled ? 'disable' : 'enable' }}
        >
          <EditableTableGrid
            rows={data}
            disabled={disabled}
            columns={AppointmentDataColumn}
            columnExtensions={[
              ...this.columnExtensions,
              {
                columnName: 'conflicts',
                // type: 'error',
                editingEnabled: false,
                sortingEnabled: false,
                disabled: true,
                width: 60,
                render: (row) => {
                  if (row.conflicts && row.conflicts.length > 0) {
                    return <ErrorPopover errors={row.conflicts} />
                  }

                  return null
                },
              },
            ]}
            FuncProps={{
              edit: false,
              pager: false,
              sort: true,
              sortConfig: {
                defaultSorting: [
                  { columnName: 'startTime', direction: 'asc' },
                ],
              },
            }}
            EditingProps={{
              messages: {
                deleteCommand: 'Delete appointment slot',
              },
              showAddCommand: !disabled,
              showDeleteCommand:
                data.filter((item) => !item.isDeleted).length > 1,
              onCommitChanges: handleCommitChanges,
              onAddedRowsChange: (rows) => {
                console.log({ rows })
                return rows
              },
            }}
            schema={validationSchema}
          />
        </AuthorizedContext.Provider>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentDataGrid' })(
  AppointmentDataGrid,
)
