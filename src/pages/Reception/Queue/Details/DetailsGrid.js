import React, { PureComponent } from 'react'
import router from 'umi/router'
import classnames from 'classnames'
// dva
import { connect } from 'dva'
// table grid component
import { Table } from '@devexpress/dx-react-grid-material-ui'
// umi locale
import { formatMessage } from 'umi/locale'
// material ui
import { Tooltip, withStyles } from '@material-ui/core'
import { Edit, Pageview, Remove, Fullscreen } from '@material-ui/icons'
// custom components
import { Button, CommonModal, CommonTableGrid2 } from '@/components'
import GridButton from './GridButton'
// assets
import { tooltip } from '@/assets/jss/index'

const styles = () => ({
  tooltip,
  fullscreenBtn: {
    float: 'right',
    top: '-15px',
    left: '20px',
    zIndex: 999,
  },
})

const generateRowData = () => {
  const data = []
  for (let i = 0; i < 5; i += 1) {
    data.push({
      Id: `row-${i}-data`,
      queueNo: i,
      visitStatus: 'REGISTERED',
      roomNo: '',
      doctor: 'Cheah',
      refNo: `PT-0000${i}`,
      patientName: 'Annie Leonhart @ Annabelle Perfectionism',
      gender: 'Female',
      age: i,
      visitRefNo: `190402-01-${i}`,
    })
  }
  return data
}

const WithFullscreenModal = ({ show, onClose, onConfirm, children }) => {
  return show ? (
    <CommonModal
      open={show}
      title={formatMessage({
        id: 'reception.queue.queueLog',
      })}
      onClose={onClose}
      onConfirm={onConfirm}
      fullScreen
      showFooter={false}
    >
      <div>{children}</div>
    </CommonModal>
  ) : (
    children
  )
}

@connect(({ queueLog }) => ({ queueLog }))
class DetailsGrid extends PureComponent {
  state = {
    isFullscreen: false,
    tableParams: {
      columns: [
        { name: 'visitStatus', title: 'Status' },
        { name: 'queueNo', title: 'Q. No.' },
        { name: 'roomNo', title: 'Room No.' },
        { name: 'doctor', title: 'Doctor' },
        { name: 'refNo', title: 'Ref. No.' },
        { name: 'timeIn', title: 'Time In' },
        { name: 'timeOut', title: 'Time Out' },
        { name: 'appointmentTime', title: 'Appt. Time' },
        { name: 'patientName', title: 'Patient Name' },
        { name: 'identityNo', title: 'Identity No.' },
        { name: 'gender', title: 'Gender' },
        { name: 'age', title: 'Age' },
        { name: 'invoiceNo', title: 'Invoice No' },
        { name: 'invoiceAmount', title: 'Invoice Amount' },
        { name: 'gst', title: 'GST' },
        { name: 'payment', title: 'Payment' },
        { name: 'paymentMode', title: 'Payment Mode' },
        { name: 'company', title: 'Company' },
        { name: 'outstandingBalance', title: 'Outstanding' },
        { name: 'visitRefNo', title: 'Visit Ref No.' },
        { name: 'referralCompany', title: 'Referral Company' },
        { name: 'referralPerson', title: 'Referral Person' },
        { name: 'referralRemarks', title: 'Referral Remarks' },
        { name: 'Action', title: 'Action' },
      ],
      leftColumns: [
        'visitStatus',
      ],
      columnExtensions: [
        { columnName: 'visitStatus', type: 'status' },
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
    },
  }

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

  onViewPatientDashboardClick = () => {
    router.push('/reception/queue/patientdashboard')
  }

  Cell = (props) => {
    // const { column, row, classes, ...restProps } = props
    const { classes, ...tableProps } = props
    const { location } = this.props
    if (tableProps.column.name === 'Action') {
      if (location.path === '/emr/queue')
        return (
          <Table.Cell {...tableProps}>
            <Tooltip
              title={formatMessage({
                id: 'reception.queue.viewPatientDashboard',
              })}
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
      // path === '/queue'
      return (
        <Table.Cell {...tableProps}>
          <Tooltip
            title={formatMessage({
              id: 'reception.queue.viewPatientDashboard',
            })}
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
          {/*
            <Tooltip
              title={formatMessage({ id: 'reception.queue.editVisit' })}
              placement='bottom'
              classes={{ tooltip: classes.tooltip }}
            >
              <div style={{ display: 'inline-block' }}>
                <GridButton
                  row={tableProps.row}
                  Icon={<Edit />}
                  onClick={this.onEditVisitClick}
                />
              </div>
            </Tooltip>
          */}
          <Tooltip
            title={formatMessage({ id: 'reception.queue.cancelVisit' })}
            placement='bottom'
            classes={{ tooltip: classes.tooltip }}
          >
            <div style={{ display: 'inline-block' }}>
              <GridButton
                row={tableProps.row}
                color='danger'
                Icon={<Remove />}
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

  toggleFullscreen = () => {
    const { isFullscreen } = this.state
    this.setState({
      isFullscreen: !isFullscreen,
    })
  }

  render () {
    const { tableParams } = this.state
    const ActionProps = {
      TableCellComponent: withStyles(styles)(this.TableCell),
    }
    const { classes, queueLog } = this.props
    const { isFullscreen } = this.state
    // const { queueListing } = queueLog

    return (
      <div>
        <WithFullscreenModal
          show={isFullscreen}
          onClose={this.toggleFullscreen}
          onConfirm={this.toggleFullscreen}
        >
          <CommonTableGrid2
            height={isFullscreen ? undefined : 600}
            rows={generateRowData()}
            {...tableParams}
            ActionProps={ActionProps}
            FuncProps={{ pager: false }}
          />
        </WithFullscreenModal>

        <Tooltip
          title={formatMessage({ id: 'reception.queue.expandQueueLog' })}
          placement='bottom-start'
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            className={classnames(classes.fullscreenBtn)}
            justIcon
            round
            size='sm'
            color='primary'
            onClick={this.toggleFullscreen}
          >
            <Fullscreen />
          </Button>
        </Tooltip>
      </div>
    )
  }
}

export default withStyles(styles)(DetailsGrid)
