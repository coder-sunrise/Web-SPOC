import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  EditableTableGrid,
  CommonTableGrid,
  dateFormat,
  notification,
} from '@/components'
import { AppointmentTypeLabel } from '@/components/_medisys'
import AuthorizedContext from '@/components/Context/Authorized'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'
import ErrorPopover from './ErrorPopover'
import { CALENDAR_RESOURCE } from '@/utils/constants'
import { NavigateBeforeSharp, ReportProblem } from '@material-ui/icons'

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

@connect(({ codetable, clinicSettings }) => ({
  appointmentTypes: codetable.ctappointmenttype,
  ctcalendarresource: codetable.ctcalendarresource,
  rooms: codetable.ctroom,
  apptTimeIntervel: clinicSettings.settings.apptTimeIntervel,
}))
class AppointmentDataGrid extends React.Component {
  constructor(props) {
    super(props)
  }

  getColumnExtensions = () => {
    const {
      appointmentDate,
      data,
      selectedSlot,
      apptTimeIntervel = 30,
      checkAddResource,
      disabled,
    } = this.props
    const columnExtensions = AppointmentDataColExtensions(
      apptTimeIntervel,
      disabled,
    ).map(column => {
      /* if (column.columnName === 'isPrimaryClinician') {
        return {
          ...column,
          checkedValue: true,
          uncheckedValue: false,
          onChange: this.onRadioChange,
        }
      } */

      if (column.type === 'time') {
        return {
          ...column,
          currentDate: appointmentDate
            ? moment(appointmentDate, dateFormat)
            : moment(),
        }
      }

      if (column.columnName === 'calendarResourceFK') {
        return {
          ...column,
          render: row => {
            const { calendarResourceFK } = row
            const { ctcalendarresource = [] } = this.props
            const calendarResource = ctcalendarresource.find(
              item => item.id === calendarResourceFK,
            )

            if (!calendarResource) return null
            if (calendarResource.resourceType === CALENDAR_RESOURCE.DOCTOR) {
              const title = calendarResource.clinicianProfileDto.title || ''
              return (
                <p>{`${title} ${calendarResource.clinicianProfileDto.name}`}</p>
              )
            } else {
              return calendarResource.name
            }
          },
          onChange: ({ row, option }) => {
            const { data, handleCommitChanges } = this.props
            const newRows = data.map(eachRow =>
              eachRow.id !== row.id
                ? {
                    ...eachRow,
                  }
                : {
                    ...eachRow,
                    calendarResource: option ? { ...option } : undefined,
                    isPrimaryClinician:
                      !option ||
                      option.resourceType === CALENDAR_RESOURCE.RESOURCE
                        ? false
                        : eachRow.isPrimaryClinician,
                  },
            )
            handleCommitChanges({ rows: newRows })
          },
          localFilter: o =>
            o.isActive &&
            (checkAddResource() || o.resourceType === CALENDAR_RESOURCE.DOCTOR),
        }
      }

      if (column.columnName === 'appointmentTypeFK') {
        return {
          ...column,
          render: row => {
            const { appointmentTypeFK } = row
            const { appointmentTypes = [] } = this.props
            const appointmentType = appointmentTypes.find(
              item => item.id === appointmentTypeFK,
            )

            if (!appointmentType) return null
            return (
              <AppointmentTypeLabel
                color={appointmentType.tagColorHex}
                label={appointmentType.displayValue}
              />
            )
          },
          renderDropdown: option => {
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
          onChange: row => {},
        }
      }
      return { ...column }
    })
    return columnExtensions
  }

  onRadioChange = ({ row, checked }) => {
    if (checked) {
      const { data, handleCommitChanges } = this.props
      const newRows = data.map(eachRow =>
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

  render() {
    const {
      classes,
      data,
      handleCommitChanges,
      disabled,
      validationSchema,
      handleEditingRowsChange,
      editingRows,
      selectedSlot,
      conflicts = [],
    } = this.props

    const tempColumnExtensions = this.getColumnExtensions()
    const funcProps = {
      edit: false,
      pager: false,
      sort: true,
      sortConfig: {
        defaultSorting: [{ columnName: 'startTime', direction: 'asc' }],
      },
    }
    return (
      <div className={classes.container}>
        {disabled ? (
          <CommonTableGrid
            rows={data}
            columns={AppointmentDataColumn}
            columnExtensions={tempColumnExtensions}
            FuncProps={funcProps}
          />
        ) : (
          <EditableTableGrid
            rows={data}
            forceRender
            columns={AppointmentDataColumn}
            columnExtensions={tempColumnExtensions}
            FuncProps={funcProps}
            EditingProps={{
              showCommandColumn: false,
              onCommitChanges: handleCommitChanges,
            }}
            schema={validationSchema}
          />
        )}
        <div>
          {conflicts.map(conflict => (
            <div style={{ margin: '4px 0px' }}>
              <ReportProblem
                style={{
                  color: conflict.isPrevent ? 'orange' : 'darkblue',
                  marginRight: 6,
                }}
              />
              {conflict.conflictContent}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentDataGrid' })(
  AppointmentDataGrid,
)
