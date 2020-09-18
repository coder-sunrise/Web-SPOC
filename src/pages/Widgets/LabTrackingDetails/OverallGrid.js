import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import { Edit, Print } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip } from '@/components'
import PatientResultButton from './PatientResultPrintBtn'

class OverallGrid extends PureComponent {
  configs = {
    columns: [
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'patientAccountNo', title: 'Acc. No' },
      { name: 'patientName', title: 'Patient name' },
      { name: 'doctorName', title: 'Doctor' },
      { name: 'serviceName', title: 'Service Name' },
      { name: 'supplierName', title: 'Supplier' },
      { name: 'caseTypeDisplayValue', title: 'Case Type' },
      { name: 'caseDescriptionDisplayValue', title: 'Case Description' },
      { name: 'orderedDate', title: 'Ordered Date' },
      { name: 'estimateReceiveDate', title: 'Est. Receive Date' },
      { name: 'receivedDate', title: 'Received Date' },
      { name: 'labTrackingStatusDisplayValue', title: 'Status' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'visitDate', type: 'date' },
      { columnName: 'estimateReceiveDate', type: 'date' },
      { columnName: 'orderedDate', type: 'date' },
      { columnName: 'receivedDate', type: 'date' },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: (row) => {
          const { clinicSettings, handlePrintClick } = this.props
          const readOnly = !row.patientIsActive

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
    const { dispatch, labTrackingDetails } = this.props
    const { list } = labTrackingDetails
    const readOnly = !row.patientIsActive

    if (readOnly) return

    dispatch({
      type: 'labTrackingDetails/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  render () {
    return (
      <CommonTableGrid
        type='labTrackingDetails'
        onRowDoubleClick={this.editRow}
        {...this.configs}
      />
    )
  }
}

export default OverallGrid
