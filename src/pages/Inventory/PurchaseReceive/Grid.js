import React, { PureComponent } from 'react'
import { CommonTableGrid, Button, Tooltip } from '@/components'
import { podoStatus } from '@/utils/codes'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { ContextMenuOptions } from './variables'
import {
  notification,
  GridContainer,
  GridItem,
  CommonModal,
} from '@/components'
import { formatMessage } from 'umi/locale'

class Grid extends PureComponent {
  state = {
    selectedRows: [],
  }

  onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        notification.info({ message: 'Edit' })
        // this.props.handleEditVisitClick({
        //   visitID: row.id,
        // })
        break
      case '1':
        const { dispatch, purchasingReceiving } = this.props
        const { list } = purchasingReceiving
        dispatch({
          type: 'purchasingReceiving/updateState',
          payload: {
            showDuplicatePOModal: true,
            entity: list.find((o) => o.id === row.id),
          },
        })
        //notification.info({ message: 'Duplocate PO' })
        //router.push(`/reception/queue/dispense/${row.visitRefNo}`)
        break
      case '2':
        notification.info({ message: 'Print' })
        //this.deleteQueueConfirmation(row)
        break
      default:
        break
    }
  }

  handleSelectionChange = (selection) => {
    this.setState({ selectedRows: selection })
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='purchasingReceiving'
        // onRowDoubleClick={this.editRow}
        selection={this.state.selectedRows}
        onSelectionChange={this.handleSelectionChange}
        FuncProps={{
          selectable: true,
          selectConfig: { showSelectAll: true },
        }}
        columns={[
          { name: 'poNo', title: 'PO No' },
          { name: 'poDate', title: 'PO Date' },
          { name: 'expectedDeliveryDate', title: 'Expected Delivery Date' },
          { name: 'status', title: 'Status' },
          { name: 'total', title: 'total' },
          { name: 'outstanding', title: 'Outstanding' },
          { name: 'remarks', title: 'Remarks' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          {
            columnName: 'poDate',
            type: 'date',
            format: 'DD MMM YYYY',
          },
          {
            columnName: 'expectedDeliveryDate',
            type: 'date',
            format: 'DD MMM YYYY',
          },
          { columnName: 'total', type: 'number', currency: true },
          { columnName: 'outstanding', type: 'number', currency: true },
          {
            columnName: 'status',
            sortingEnabled: false,
          },
          {
            columnName: 'action',
            align: 'center',
            render: (row) => {
              return (
                <Tooltip title='More Actions'>
                  <div style={{ display: 'inline-block' }}>
                    <GridButton
                      row={row}
                      onClick={this.onContextButtonClick}
                      contextMenuOptions={ContextMenuOptions}
                    />
                  </div>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
