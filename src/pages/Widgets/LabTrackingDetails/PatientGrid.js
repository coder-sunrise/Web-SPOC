import React, { PureComponent } from 'react'
import { Edit } from '@material-ui/icons'
import CommonTableGrid from '@/components/CommonTableGrid'
import { Button, Tooltip } from '@/components'
import PatientResultButton from './PatientResultPrintBtn'
import Authorized from '@/utils/Authorized'

class PatientGrid extends PureComponent {
  configs = {
    columns: [
      { name: 'jobReferenceNo', title: 'Job Ref. No.' },
      { name: 'orderType', title: 'Order Type' },
      { name: 'salesType', title: 'Sales Type' },
      { name: 'frame', title: 'Frame' },
      {
        name: 'rightLensProduct',
        title: 'Lens Product (RE)',
      },
      {
        name: 'leftLensProduct',
        title: 'Lens Product (LE)',
      },
      { name: 'supplier', title: 'Supplier' },
      { name: 'orderedDate', title: 'Date Ordered' },
      { name: 'requiredDate', title: 'Date Required' },
      { name: 'receivedDate', title: 'Date Received' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'status', title: 'Status' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      { columnName: 'jobReferenceNo', width: 120, sortingEnabled: false },
      {
        columnName: 'orderType',
        width: 100,
        sortingEnabled: false,
      },
      {
        columnName: 'salesType',
        width: 100,
        sortingEnabled: false,
      },
      { columnName: 'frame', width: 120, sortingEnabled: false },
      { columnName: 'rightLensProduct', width: 150, sortingEnabled: false },
      { columnName: 'leftLensProduct', width: 150, sortingEnabled: false },
      { columnName: 'supplier', width: 150, sortingEnabled: false },
      { columnName: 'orderedDate', type: 'date', width: 120 },
      { columnName: 'requiredDate', type: 'date', width: 120 },
      { columnName: 'receivedDate', type: 'date', width: 120 },
      {
        columnName: 'remarks',
        width: 200,
        sortingEnabled: false,
      },
      {
        columnName: 'status',
        width: 130,
        sortingEnabled: false,
      },
      {
        columnName: 'action',
        sortingEnabled: false,
        align: 'center',
        width: 100,
        render: row => {
          const { clinicSettings, handlePrintClick } = this.props
          const accessRight = Authorized.check('reception/labtracking') || {
            rights: 'hidden',
          }
          const readOnly = accessRight.rights === 'hidden'

          return (
            <React.Fragment>
              <PatientResultButton row={row} />
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
    leftColumns: ['jobReferenceNo', 'orderType', 'salesType'],
    rightColumns: ['status', 'action'],
  }

  editRow = (row, e) => {
    const { dispatch, readOnly } = this.props
    if (readOnly) return
    dispatch({
      type: 'labTrackingDetails/queryOne',
      payload: {
        id: row.id,
      },
    }).then(r => {
      dispatch({
        type: 'labTrackingDetails/updateState',
        payload: {
          showModal: true,
        },
      })
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

export default PatientGrid
