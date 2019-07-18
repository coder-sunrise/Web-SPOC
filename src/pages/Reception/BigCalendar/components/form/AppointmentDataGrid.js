import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// antd
import { Select as OriAntdSelect } from 'antd'
// common component
import { EditableTableGrid2 } from '@/components'
import {
  AppointmentTypeOptions,
  getColorClassByAppointmentType,
  reduceToColorClass,
} from '../../setting'
import {
  AppointmentDataColExtensions,
  AppointmentDataColumn,
} from './variables'

const validationSchema = Yup.object().shape({
  timeFrom: Yup.date().required(),
  timeTo: Yup.date()
    .min(Yup.ref('timeFrom'), 'Time To must be later than Time From')
    .required(),
  doctor: Yup.string().required(),
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
  state = {
    editingRowIds: [],
    rowChanges: [],
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  changeRowChanges = (rowChanges) => {
    this.setState({ rowChanges })
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

  render () {
    const { classes, appointmentDate, data, handleCommitChanges } = this.props
    // const { rows } = this.state
    const columnExtensions = AppointmentDataColExtensions.map((column) => {
      if (column.columnName === 'primaryDoctor') {
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
            ? moment(appointmentDate, 'DD MMM YYYY')
            : moment(),
        }
      }

      if (column.columnName === 'appointmentType') {
        return {
          ...column,
          options: AppointmentTypeOptions,
          renderDropdown: (option) => {
            return (
              <React.Fragment>
                {option.value !== 'all' && (
                  <span
                    className={classnames([
                      classes.colorDot,
                      getColorClassByAppointmentType(option.value, classes),
                    ])}
                  />
                )}
                <span>{option.name}</span>
              </React.Fragment>
            )
          },
        }
      }
      return { ...column }
    })

    return (
      <EditableTableGrid2
        rows={data}
        columns={AppointmentDataColumn}
        columnExtensions={columnExtensions}
        schema={validationSchema}
        leftColumns={[
          'conflict',
        ]}
        EditingProps={{
          showAddCommand: true,
          editingRowIds: this.state.editingRowIds,
          rowChanges: this.state.rowChanges,
          onEditingRowIdsChange: this.changeEditingRowIds,
          onRowChangesChange: this.changeRowChanges,
          onCommitChanges: handleCommitChanges,
        }}
      />
    )
  }
}

export default withStyles(styles, { name: 'AppointmentDataGrid' })(
  AppointmentDataGrid,
)
