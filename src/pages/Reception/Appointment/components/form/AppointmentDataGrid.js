import React from 'react'
import { connect } from 'dva'
import * as Yup from 'yup'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { EditableTableGrid, dateFormat } from '@/components'
import { AppointmentTypeLabel } from '@/components/_medisys'
import { AppointmentTypeOptions, reduceToColorClass } from '../../setting'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'

const validationSchema = Yup.object().shape({
  startTime: Yup.string().required(),
  endTime: Yup.string()
    .laterThan(Yup.ref('startTime'), 'Time To must be later than Time From')
    .required(),
  clinicianFK: Yup.string().required(),
})

const styles = () => ({
  ...AppointmentTypeOptions.reduce(reduceToColorClass, {}),
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

@connect(({ codetable }) => ({
  appointmentTypes: codetable.ctappointmenttype,
  clinicianProfiles: codetable.clinicianprofile,
  rooms: codetable.ctroom,
}))
class AppointmentDataGrid extends React.Component {
  constructor (props) {
    super(props)
    const { appointmentDate } = this.props
    const columnExtensions = AppointmentDataColExtensions.map((column) => {
      if (column.columnName === 'isPrimaryClinician') {
        return {
          ...column,
          checkedValue: true,
          uncheckedValue: false,
          onRadioChange: this.onRadioChange,
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
            const color = option.tagColorHex.includes('#')
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
  }

  onRadioChange = (row, e, checked) => {
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
      data,
      handleCommitChanges,
      disabled,
      handleEditingRowsChange,
    } = this.props
    return (
      <div>
        <EditableTableGrid
          disabled={disabled}
          rows={data}
          columns={AppointmentDataColumn}
          columnExtensions={this.columnExtensions}
          FuncProps={{
            pager: false,
            sort: true,
            sortConfig: {
              defaultSorting: [
                { columnName: 'startTime', direction: 'asc' },
              ],
            },
          }}
          onRowDoubleClick={undefined}
          EditingProps={{
            messages: {
              deleteCommand: 'Delete appointment slot',
            },
            showAddCommand: !disabled,
            showEditCommand: !disabled,
            showDeleteCommand: !disabled && data.length !== 1,
            onCommitChanges: handleCommitChanges,
            onEditingRowIdsChange: handleEditingRowsChange,
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
