import React, { useState } from 'react'
import { compose } from 'redux'
// devexpress react grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// common components
import { withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import ForumIcon from '@material-ui/icons/Forum'
import DraftsIcon from '@material-ui/icons/Drafts'
import MarkunreadIcon from '@material-ui/icons/Markunread'
// common components
import { GridContextMenuButton as GridButton } from 'medisys-components'

import { CommonTableGrid, Tooltip, CommonModal, Button } from '@/components'
// medisys components
import Authorized from '@/utils/Authorized'
import MessageListing from './Reminder/MessageListing'
import FilterBar from './FilterBar'

const styles = (theme) => ({
  filterBar: {
    marginBottom: '10px',
  },
  filterBtn: {
    // paddingTop: '13px',

    textAlign: 'left',
    '& > button': {
      marginRight: theme.spacing.unit,
    },
  },
})

const Grid = ({
  smsAppointment,
  smsPatient,
  dispatch,
  type,
  columns,
  columnsExtensions,
  setSelectedRows,
  selectedRows,
  user,
  doctorprofile = [],
}) => {
  const [
    showMessageModal,
    setShowMessageModal,
  ] = useState(false)

  const [
    tableParas,
    setTableParas,
  ] = useState({
    columns,
  })
  const [
    colExtensions,
    setColExtensions,
  ] = useState(columnsExtensions)

  const [
    recipient,
    setRecipient,
  ] = useState()

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection)
  }

  const Cell = React.memo(({ ...tableProps }) => {
    if (tableProps.column.name === 'Action') {
      return (
        <Table.Cell {...tableProps}>
          <Authorized authority='sms.viewsms'>
            <Tooltip title='View SMS History' placement='bottom'>
              <div style={{ display: 'inline-block' }}>
                <Button
                  justIcon
                  color='primary'
                  onClick={() => {
                    setRecipient(tableProps.row)
                    setShowMessageModal(true)
                  }}
                >
                  <ForumIcon />
                </Button>
                {/* <GridButton
                  row={tableProps.row}
                   ontextMenuOptions={options}
                  onClick={handleMenuItemClick}
                /> */}
              </div>
            </Tooltip>
          </Authorized>
        </Table.Cell>
      )
    }

    return <Table.Cell {...tableProps} />
  })

  const messageListingProps = {
    recipient,
    dispatch,
    setSelectedRows,
    smsAppointment,
    smsPatient,
  }

  const filterBarProps = {
    type,
    dispatch,
    setSelectedRows,
    selectedRows,
    smsPatient,
  }

  return (
    <React.Fragment>
      <FilterBar
        {...filterBarProps}
        currentUser={user.data.clinicianProfile.id}
        doctorprofile={doctorprofile}
      />
      <CommonTableGrid
        type={type === 'Appointment' ? 'smsAppointment' : 'smsPatient'}
        onSelectionChange={handleSelectionChange}
        selection={selectedRows}
        columnExtensions={colExtensions}
        ActionProps={{ TableCellComponent: Cell }}
        FuncProps={{
          selectable: true,
          selectConfig: {
            showSelectAll: true,
            rowSelectionEnabled: (row) => {
              return row.patientIsActive
            },
          },
        }}
        {...tableParas}
      />
      <CommonModal
        open={showMessageModal}
        title='Send SMS'
        observe='Sms'
        onClose={() => setShowMessageModal(false)}
        onConfirm={() => setShowMessageModal(false)}
      >
        {showMessageModal ? <MessageListing {...messageListingProps} /> : null}
      </CommonModal>
    </React.Fragment>
  )
}
// export default compose(React.memo)(Grid)
export default compose(
  withStyles(styles, { withTheme: true }),
  withFormik({}),
  React.memo,
)(Grid)
