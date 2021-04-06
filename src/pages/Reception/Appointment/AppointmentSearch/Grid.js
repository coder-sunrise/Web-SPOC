import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
// react dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CommonTableGrid,
  timeFormat,
  timeFormat24HourWithSecond,
} from '@/components'
// utils
import Authorized from '@/utils/Authorized'
import { AppointmentTypeLabel } from '@/components/_medisys'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})

@connect(({ codetable }) => ({
  appointmentTypes: codetable.ctappointmenttype,
}))
class Grid extends PureComponent {
  appointmentRow = (p) => {
    const { classes, handleSelectEvent } = this.props
    const { row, children, tableRow } = p
    let newchildren = []
    const middleColumns = children.slice(3, 9)

    if (row.countNumber === 1) {
      newchildren.push(
        children.filter((value, index) => index < 3).map((item) => ({
          ...item,
          props: {
            ...item.props,
            rowSpan: row.rowspan,
          },
        })),
      )

      newchildren.push(middleColumns)

      newchildren.push(
        children.filter((value, index) => index > 8).map((item) => ({
          ...item,
          props: {
            ...item.props,
            rowSpan: row.rowspan,
          },
        })),
      )
    } else {
      newchildren.push(middleColumns)
    }

    const selectedData = {
      ...tableRow.row,
      doctor: null,
    }

    const doubleClick = () => {
      const accessRight = Authorized.check('appointment.appointmentdetails')

      if (!accessRight || (accessRight && accessRight.rights !== 'enable'))
        return

      handleSelectEvent(selectedData)
    }

    if (row.countNumber === 1) {
      return (
        <Table.Row {...p} onDoubleClick={doubleClick}>
          {newchildren}
        </Table.Row>
      )
    }
    return (
      <Table.Row {...p} className={classes.subRow} onDoubleClick={doubleClick}>
        {newchildren}
      </Table.Row>
    )
  }

  render () {
    return (
      <CommonTableGrid
        style={{ marginTop: 10 }}
        type='appointment'
        getRowId={(row) => row.uid}
        columns={[
          { name: 'patientName', title: 'Patient' },
          { name: 'patientAccountNo', title: 'Account No.' },
          { name: 'patientContactNo', title: 'Contact No.' },
          { name: 'appointmentDate', title: 'Appt Date' },
          { name: 'apptTime', title: 'Appt Time' },
          { name: 'doctor', title: 'Doctor' },
          { name: 'appointmentTypeFK', title: 'Appt Type' },
          { name: 'roomFk', title: 'Room' },
          { name: 'duration', title: 'Duration' },
          { name: 'appointmentRemarks', title: 'Remarks' },
          { name: 'appointmentStatusFk', title: 'Appt Status' },
          { name: 'bookedByUser', title: 'Book By' },
          { name: 'bookOn', title: 'Book On' },
        ]}
        columnExtensions={[
          {
            columnName: 'patientName',
            // sortBy: 'name',
            sortingEnabled: false,
          },
          {
            columnName: 'patientAccountNo',
            sortBy: 'patientAccountNo',
          },
          {
            columnName: 'patientContactNo',
            sortBy: 'contactNumber',
          },
          {
            columnName: 'appointmentDate',
            type: 'date',
            width: 100,
          },
          {
            columnName: 'apptTime',
            sortingEnabled: false,
            render: (row) =>
              moment(row.apptTime, timeFormat24HourWithSecond).format(
                timeFormat,
              ),
            width: 80,
          },
          {
            columnName: 'doctor',
            sortingEnabled: false,
          },
          {
            columnName: 'appointmentTypeFK',
            sortingEnabled: false,
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
          },
          {
            columnName: 'roomFk',
            type: 'codeSelect',
            code: 'ctroom',
            sortingEnabled: false,
          },
          {
            columnName: 'duration',
            sortingEnabled: false,
            width: 115,
          },
          {
            columnName: 'appointmentRemarks',
            sortingEnabled: false,
          },
          {
            columnName: 'appointmentStatusFk',
            type: 'codeSelect',
            code: 'ltappointmentstatus',
            sortBy: 'status',
          },
          {
            columnName: 'bookedByUser',
            sortingEnabled: false,
          },
          {
            columnName: 'bookOn',
            type: 'date',
            width: 100,
          },
        ]}
        TableProps={{ rowComponent: this.appointmentRow }}
      />
    )
  }
}

export default withStyles(styles, { withTheme: true })(Grid)
