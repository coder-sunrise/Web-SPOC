import React from 'react'
import { connect } from 'dva'
import * as Yup from 'yup'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { EditableTableGrid, dateFormat } from '@/components'
import { getUniqueNumericId } from '@/utils/utils'
import { AppointmentTypeLabel } from '@/components/_medisys'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'
import ErrorPopover from './ErrorPopover'

const validationSchema = Yup.object().shape({
  startTime: Yup.string().required(),
  // appointmentDuration: Yup.string().required(),
  endTime: Yup.string()
    .laterThan(Yup.ref('startTime'), 'Time To must be later than Time From')
    .required(),
  clinicianFK: Yup.string().required(),
})

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
      return { ...column }
    })

    this.columnExtensions = [
      ...columnExtensions,
    ]

    let defaultNewRows = []

    if (!data || data.length <= 0) {
      let defaultNewRow = { isPrimaryClinician: true, id: getUniqueNumericId() }
      if (selectedSlot && selectedSlot.allDay === false) {
        const startTime = moment(selectedSlot.start)
        const selectedEndTime = moment(selectedSlot.end)

        const { hour, minute } = calculateDuration(startTime, selectedEndTime)

        defaultNewRow = {
          startTime: startTime.format('HH:mm A'),

          apptDurationHour: hour || 0,
          apptDurationMinute: minute || 15,
          endTime: selectedEndTime.format('HH:mm A'),
          clinicianFK: selectedSlot.resourceId,
          ...defaultNewRow,
        }
      }
      defaultNewRows.push(defaultNewRow)
    }
    this.state = {
      defaultNewRows,
    }
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
      handleEditingRowsChange,
      editingRows,
      selectedSlot,
    } = this.props

    const { defaultNewRows } = this.state
    console.log({ data })
    return (
      <div className={classes.container}>
        <EditableTableGrid
          rows={data.length ? data : data.concat(defaultNewRows)}
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
          }}
          schema={validationSchema}
        />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentDataGrid' })(
  AppointmentDataGrid,
)
