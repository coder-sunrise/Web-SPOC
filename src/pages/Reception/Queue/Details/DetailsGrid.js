import React, { PureComponent } from 'react'
import router from 'umi/router'
// dva
import { connect } from 'dva'
// table grid component
import { Table } from '@devexpress/dx-react-grid-material-ui'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
import Pageview from '@material-ui/icons/Pageview'
// custom components
import { CommonTableGrid2 } from '@/components'
import GridButton from './GridButton'
// assets
import { tooltip } from '@/assets/jss/index'
import { filterData } from '../utils'

const styles = () => ({
  tooltip,
  fullscreenBtn: {
    float: 'right',
    top: '-15px',
    left: '20px',
    zIndex: 999,
  },
})

const FuncConfig = { pager: false }
const TableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'queueNo', title: 'Q. No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'gender/age', title: 'Gender / Age' },

    { name: 'doctor', title: 'Doctor' },
    { name: 'roomNo', title: 'Room No.' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceAmount', title: 'Invoice Amount' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'identityNo', title: 'Identity No.' },
    { name: 'gst', title: 'GST' },
    { name: 'payment', title: 'Payment' },
    { name: 'paymentMode', title: 'Payment Mode' },
    { name: 'company', title: 'Company' },
    { name: 'outstandingBalance', title: 'Outstanding' },
    { name: 'scheme', title: 'Scheme' },
    { name: 'contactNo', title: 'Phone' },
    // { name: 'gender', title: 'Gender' },
    // { name: 'age', title: 'Age' },
    // { name: 'refNo', title: 'Ref. No.' },
    // { name: 'visitRefNo', title: 'Visit Ref No.' },
    // { name: 'referralCompany', title: 'Referral Company' },
    // { name: 'referralPerson', title: 'Referral Person' },
    // { name: 'referralRemarks', title: 'Referral Remarks' },
    { name: 'Action', title: 'Action' },
  ],
  leftColumns: [
    'visitStatus',
    'queueNo',
  ],
  columnExtensions: [
    { columnName: 'visitStatus', type: 'status', width: 150 },
    { columnName: 'paymentMode', width: 150 },
    { columnName: 'patientName', width: 250 },
    { columnName: 'referralCompany', width: 150 },
    { columnName: 'referralPerson', width: 150 },
    { columnName: 'referralRemarks', width: 150 },
    { columnName: 'invoiceAmount', type: 'number', currency: true },
    { columnName: 'payment', type: 'number', currency: true },
    { columnName: 'gst', type: 'number', currency: true },
    { columnName: 'outstandingBalance', type: 'number', currency: true },
    { columnName: 'Action', width: 120, align: 'center' },
  ],
}

@connect(({ queueLog }) => ({ queueLog }))
class DetailsGrid extends PureComponent {
  onViewDispenseClick = (queue) => {
    const { dispatch, location } = this.props
    const href = `${location.pathname}/dispense/${queue.visitRefNo}`

    dispatch({
      type: 'menu/updateBreadcrumb',
      payload: {
        href,
        name: queue.visitRefNo,
      },
    })
    router.push(href)
  }

  onEditVisitClick = (queue) => {}

  onViewPatientDashboardClick = (row, id) => {
    switch (id) {
      case '1':
        router.push(`/reception/queue/dispense/${row.visitRefNo}`)
        break
      case '0':
      case '2':
      case '3':
        break
      case '4':
        router.push('/reception/queue/patientdashboard')
        break
      case '5':
        break
      default:
        break
    }
  }

  Cell = (props) => {
    const { classes, ...tableProps } = props
    if (tableProps.column.name === 'Action') {
      return (
        <Table.Cell {...tableProps}>
          <Tooltip
            title='More Actions'
            placement='bottom'
            classes={{ tooltip: classes.tooltip }}
          >
            <div style={{ display: 'inline-block' }}>
              <GridButton
                row={tableProps.row}
                Icon={<Pageview />}
                onClick={this.onViewPatientDashboardClick}
              />
            </div>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...tableProps} />
  }

  TableCell = (props) => {
    return this.Cell({ ...props })
  }

  render () {
    const ActionProps = {
      TableCellComponent: withStyles(styles)(this.TableCell),
    }
    const { queueLog } = this.props
    const { currentFilter, queueListing } = queueLog

    return (
      <CommonTableGrid2
        height={600}
        rows={filterData(currentFilter, queueListing)}
        ActionProps={ActionProps}
        {...TableConfig}
        FuncProps={FuncConfig}
      />
    )
  }
}

export default DetailsGrid
