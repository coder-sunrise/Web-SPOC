import React, { useState } from 'react'
import { compose } from 'redux'
import moment from 'moment'
// devexpress react grid
import { Table } from '@devexpress/dx-react-grid-material-ui'
// common components
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import ForumIcon from '@material-ui/icons/Forum'
import DraftsIcon from '@material-ui/icons/Drafts'
import MarkunreadIcon from '@material-ui/icons/Markunread'
// common components
import { GridContextMenuButton as GridButton } from 'medisys-components'
import MessageListing from './Reminder/MessageListing'

import {
  CommonTableGrid,
  Tooltip,
  GridContainer,
  CommonModal,
} from '@/components'
// medisys components
import Authorized from '@/utils/Authorized'
import FilterByAppointment from './FilterBar/FilterByAppointment'
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
const generateRowData = () => {
  // let data = []
  // for (let i = 0; i < 10; i++) {
  //   data.push({
  //     id: `row-${i}-data`,
  //     patientName: `Tan ${i}`,
  //     contactNo: `1234567${i}`,
  //     upComingAppt: moment().format('DD-MMM-YYYY HH:MM'),
  //     remarks: '',
  //     doctor: 'Dr Levine',
  //     status: 'Confirmed',
  //     apptType: 'Screening',
  //     reminderSent: 'Yes',
  //   })
  // }
  // return data
}
const Grid = ({
  sms,
  dispatch,
  type,
  columns,
  columnsExtensions,
  setSelectedRows,
  selectedRows,
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
    selectedRow,
    setSelectedRow,
  ] = useState([])

  const [
    recipient,
    setRecipient,
  ] = useState()

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection)
  }

  const handleContextMenuClick = (recordRow, id) => {
    setRecipient(recordRow)
    switch (id) {
      case '0':
        setShowMessageModal(true)
        break
      default:
        break
    }
  }

  const gridGetRowID = (row) => row.id

  const Cell = React.memo(({ ...tableProps }) => {
    const handleMenuItemClick = (row, id) => {
      handleContextMenuClick(row, id)
    }

    const defaultContextMenuOptions = [
      {
        id: 0,
        label: 'View SMS History',
        Icon: ForumIcon,
      },
      // {
      //   id: 1,
      //   label: 'Mark as Read',
      //   Icon: DraftsIcon,
      // },
      // {
      //   id: 1,
      //   label: 'Mark as Unread',
      //   Icon: MarkunreadIcon,
      // },
    ]
    const options = defaultContextMenuOptions

    if (tableProps.column.name === 'Action') {
      return (
        <Table.Cell {...tableProps}>
          <Authorized authority='sms.viewsms'>
            <Tooltip title='More Actions' placement='bottom'>
              <div style={{ display: 'inline-block' }}>
                <GridButton
                  row={tableProps.row}
                  contextMenuOptions={options}
                  onClick={handleMenuItemClick}
                />
              </div>
            </Tooltip>
          </Authorized>
        </Table.Cell>
      )
    }

    return <Table.Cell {...tableProps} />
  })

  const messageListingProps = {
    sms,
    recipient,
    dispatch,
    setSelectedRows,
  }

  const filterBarProps = {
    type,
    dispatch,
  }

  return (
    <React.Fragment>
      <FilterBar {...filterBarProps} />
      <CommonTableGrid
        type='sms'
        entity={sms}
        onSelectionChange={handleSelectionChange}
        selection={selectedRows}
        columnExtensions={colExtensions}
        ActionProps={{ TableCellComponent: Cell }}
        FuncProps={{
          selectable: true,
          selectConfig: {
            showSelectAll: true,
            rowSelectionEnabled: () => true,
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
  withFormik({
    mapPropsToValues: () => ({
      SearchBy: 'appointment',
    }),
  }),
  React.memo,
)(Grid)
