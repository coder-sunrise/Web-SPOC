import React, { PureComponent } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { qtyFormat } from '@/utils/config'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import { CommonTableGrid, Button } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'
import Authorized from '@/utils/Authorized'
import { LoadingWrapper } from '@/components/_medisys'
import { APPOINTMENT_STATUSOPTIONS } from '@/utils/constants'
import { InventoryTypes } from '@/utils/codes'
import { futureApptTableParams, previousApptTableParams } from './variables'
import { Delete } from '@material-ui/icons'

const PreOrder = ({ values, deletePreOrderItem, disabled }) => {
  const { currentAppointment: { appointmentPreOrderItem = [] } } = values
  return <div>
    <div style={{ margin: '6px 0px' }}>Pre-Order Actualization</div>
    <CommonTableGrid
      forceRender
      size='sm'
      rows={appointmentPreOrderItem.filter(x => !x.isDeleted).map(appt => {
        const { quantity, dispenseUOM = '' } = appt
        const displayQty = `${numeral(quantity).format(qtyFormat,)} ${dispenseUOM}`
        return {
          ...appt,
          disabled,
          orderDateDisplay: moment(appt.orderDate).format('DD MMM YYYY HH:mm'),
          displayQty,
          hasPaid: appt.hasPaid ? 'Yes' : 'No',
        }
      })}
      FuncProps={{ pager: false }}
      getRowId={(row) => row.actualizedPreOrderItemFK}
      columns={[
        { name: 'preOrderItemType', title: 'Type' },
        { name: 'itemName', title: 'Name' },
        { name: 'displayQty', title: 'Order Qty.' },
        { name: 'orderByUser', title: 'Order By' },
        { name: 'orderDateDisplay', title: 'Order Date' },
        { name: 'remarks', title: 'Remarks' },
        { name: 'amount', title: 'Amount' },
        { name: 'hasPaid', title: 'Paid' },
        { name: 'action', title: 'Action' },
      ]}
      columnExtensions={[
        { columnName: 'preOrderItemType', sortingEnabled: false, width: 120 },
        { columnName: 'itemName', sortingEnabled: false },
        { columnName: 'displayQty', sortingEnabled: false, width: 120 },
        { columnName: 'orderByUser', sortingEnabled: false },
        { columnName: 'orderDateDisplay', sortingEnabled: false, width: 140 },
        { columnName: 'remarks', sortingEnabled: false },
        { columnName: 'amount', sortingEnabled: false, type: 'currency', width: 90 },
        { columnName: 'hasPaid', sortingEnabled: false, width: 50 },
        {
          columnName: 'action', width: 60, render: (row) => {
            return <Authorized authority='patientdatabase.modifypreorder.actualizepreorder'>
              <Button size='sm'
                justIcon
                color='danger'
                disabled={row.disabled}
                onClick={() => {
                  if (deletePreOrderItem) {
                    deletePreOrderItem(row.actualizedPreOrderItemFK)
                  }
                }}>
                <Delete />
              </Button>
            </Authorized>
          }
        },
      ]}
    />
  </div>
}

export default PreOrder