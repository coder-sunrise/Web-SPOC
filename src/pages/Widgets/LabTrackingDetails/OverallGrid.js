import React, { PureComponent } from 'react'
import { Edit } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip } from '@/components'
import PatientResultButton from './PatientResultPrintBtn'

class OverallGrid extends PureComponent {
  configs = {
    columns: [
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'patientAccountNo', title: 'Acc. No' },
      { name: 'referreceNo', title: 'Ref. No' },
      { name: 'patientName', title: 'Patient name' },
      { name: 'visitPurposeFK', title: 'Visit Type' },
      {
        name: 'doctorProfileFKNavigation.ClinicianProfile.Name',
        title: 'Doctor',
      },
      { name: 'serviceName', title: 'Service Name' },
      { name: 'serviceCenterName', title: 'Service Center Name' },
      { name: 'supplierName', title: 'Supplier' },
      { name: 'orderedDate', title: 'Ordered Date' },
      { name: 'estimateReceiveDate', title: 'Est. Receive Date' },
      { name: 'receivedDate', title: 'Received Date' },
      { name: 'labTrackingStatusDisplayValue', title: 'Status' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'visitDate', type: 'date', width: 100 },
      { columnName: 'referreceNo', width: 90 },
      { columnName: 'patientAccountNo', width: 100 },
      { columnName: 'patientName', width: 180 },
      { columnName: 'estimateReceiveDate', type: 'date', width: 130 },
      { columnName: 'orderedDate', type: 'date', width: 100 },
      { columnName: 'receivedDate', type: 'date', width: 105 },
      { columnName: 'serviceName', width: 200 },
      { columnName: 'serviceCenterName', width: 200 },
      { columnName: 'supplierName', width: 150 },
      { columnName: 'labTrackingStatusDisplayValue', width: 80 },
      { columnName: 'remarks', width: 200 },
      {
        columnName: 'doctorProfileFKNavigation.ClinicianProfile.Name',
        width: 150,
        render: row => {
          return (
            <Tooltip title={row.doctorName}>
              <span>{row.doctorName}</span>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'visitPurposeFK',
        width: 80,
        render: row => {
          const { visitPurpose } = this.props
          var pupose = visitPurpose.find(x => x.id === row.visitPurposeFK)
          return (
            <Tooltip title={pupose.displayValue}>
              <span>{pupose.code}</span>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: row => {
          const {
            clinicSettings,
            handlePrintClick,
            disabledByAccessRight,
          } = this.props
          const readOnly = disabledByAccessRight

          return (
            <React.Fragment>
              <PatientResultButton
                row={row}
                clinicSettings={clinicSettings}
                handlePrint={handlePrintClick}
              />
              <Tooltip title='Edit Patient Lab Result' placement='bottom'>
                <Button
                  disabled={readOnly}
                  size='sm'
                  onClick={() => {
                    this.editRow(row)
                  }}
                  justIcon
                  color='primary'
                  style={{ marginRight: 0 }}
                >
                  <Edit />
                </Button>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ],
  }

  editRow = (row, e) => {
    const { dispatch, labTrackingDetails, disabledByAccessRight } = this.props
    const { list } = labTrackingDetails
    const readOnly = disabledByAccessRight

    if (readOnly) return

    dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: true,
        entity: list.find(o => o.id === row.id),
      },
    })
  }

  render() {
    const { height } = this.props
    return (
      <CommonTableGrid
        type='labTrackingDetails'
        onRowDoubleClick={this.editRow}
        TableProps={{
          height,
        }}
        {...this.configs}
      />
    )
  }
}

export default OverallGrid
