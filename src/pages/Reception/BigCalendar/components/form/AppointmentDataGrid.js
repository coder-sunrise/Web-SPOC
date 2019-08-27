import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { EditableTableGrid, dateFormat } from '@/components'
import { AppointmentTypeOptions, reduceToColorClass } from '../../setting'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'
// services
import request from '@/utils/request'

const validationSchema = Yup.object().shape({
  startTime: Yup.string().required(),
  endTime: Yup.string()
    .laterThan(Yup.ref('startTime'), 'Time From must be later than Time To')
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

class AppointmentDataGrid extends React.PureComponent {
  constructor (props) {
    super(props)
    const { appointmentDate, classes } = this.props
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

      if (column.columnName === 'appointmentTypeFK') {
        return {
          ...column,
          render: (row) => {
            console.log({ row })
            return <div>123</div>
          },
          renderDropdown: (option) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {option.value !== 'all' && (
                  <span
                    className={classnames([
                      classes.colorDot,
                      // getColorClassByAppointmentType(option, classes),
                    ])}
                    style={{
                      backgroundColor: '#42a5f5',
                    }}
                  />
                )}
                <span>{option.name}</span>
              </div>
            )
          },
        }
      }
      return { ...column }
    })
    this.state = {
      columnExtensions,
    }

    this.getClinicianFK()
  }

  getClinicianFK = async () => {
    const url = '/api/ClinicianProfile'
    const result = await request(url, { pagesize: 9999 })
    const { status, data } = result
    if (parseInt(status, 10) === 200) {
      const { columnExtensions } = this.state
      this.setState((prevState) => ({
        ...prevState,
        columnExtensions: columnExtensions.map(
          (column) =>
            column.columnName === 'clinicianFK'
              ? {
                  ...column,
                  options: [
                    ...data.data,
                  ],
                }
              : { ...column },
        ),
      }))
    }
  }

  onRadioChange = (row, e, checked) => {
    if (checked) {
      const { data, handleCommitChanges } = this.props
      const newRows = data.map(
        (eachRow) =>
          eachRow.id !== row.id
            ? {
                ...eachRow,
                primaryDoctor: false,
              }
            : { ...eachRow, primaryDoctor: checked },
      )
      handleCommitChanges({ rows: newRows })
    }
  }

  onCommitChanges = ({ rows, deleted }) => {
    this.props.handleCommitChanges({ rows, deleted })
  }

  render () {
    const { data, handleCommitChanges } = this.props

    return (
      <div>
        <EditableTableGrid
          rows={data}
          schema={validationSchema}
          leftColumns={[
            'conflict',
          ]}
          FuncProps={{
            pager: false,
          }}
          EditingProps={{
            showAddCommand: true,
            onCommitChanges: handleCommitChanges,
            addedRows:
              data.length === 0
                ? [
                    {
                      clinicianFK: undefined,
                      appointmentTypeFK: undefined,
                      startTime: undefined,
                      endTime: undefined,
                      roomFk: undefined,
                      isPrimaryClinician: undefined,
                    },
                  ]
                : [],
          }}
          columns={AppointmentDataColumn}
          columnExtensions={this.state.columnExtensions}
        />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AppointmentDataGrid' })(
  AppointmentDataGrid,
)
