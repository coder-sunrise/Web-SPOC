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
import { futureApptTableParams, previousApptTableParams } from './variables'
import { Delete } from '@material-ui/icons'

const PreOrder = ({ setFieldValue, values }) => {
  const { currentAppointment: { appointmentPreOrderItem = [] } } = values
  return <div>
    <div style={{ margin: '6px 0px' }}>Pre-Order Actualization</div>
    <CommonTableGrid
      size='sm'
      rows={appointmentPreOrderItem.filter(x => !x.isDeleted)}
      FuncProps={{ pager: false }}
      columns={[
        { name: 'category', title: 'Category' },
        { name: 'itemName', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'orderBy', title: 'Order By' },
        { name: 'orderDate', title: 'Order Date & Time' },
        { name: 'remarks', title: 'Remarks' },
        { name: 'amount', title: 'Amount' },
        { name: 'hasPaid', title: 'Paid' },
        { name: 'action', title: 'Action' },
      ]}
      columnExtensions={[
        { columnName: 'category', sortingEnabled: false, width: 120 },
        { columnName: 'itemName', sortingEnabled: false },
        {
          columnName: 'quantity', sortingEnabled: false, width: 120, render: row => {
            const { quantity, dispenseUOM = '' } = row
            return `${numeral(quantity).format(
              qtyFormat,
            )} ${dispenseUOM}`
          },
        },
        { columnName: 'orderBy', sortingEnabled: false },
        { columnName: 'orderDate', sortingEnabled: false, type: 'date', showTime: true, width: 180 },
        { columnName: 'remarks', sortingEnabled: false },
        { columnName: 'amount', sortingEnabled: false, type: 'currency', width: 90 },
        { columnName: 'hasPaid', sortingEnabled: false, width: 50, render: (row) => row.hasPaid ? 'Yes' : 'No' },
        {
          columnName: 'action', width: 60, render: (row) => {
            return <Button size='sm'
              justIcon
              color='danger'
              onClick={() => {
                var item = appointmentPreOrderItem.find(po => po.actualizedPreOrderItemFK === row.actualizedPreOrderItemFK)
                if (item) {
                  if (item.id) {
                    item.isDeleted = true
                  }
                  else { appointmentPreOrderItem = [...appointmentPreOrderItem.filter(po.actualizedPreOrderItemFK !== row.actualizedPreOrderItemFK)] }
                }
                setFieldValue("currentAppointment.appointmentPreOrderItem", [...appointmentPreOrderItem])
              }}>
              <Delete />
            </Button>
          }
        },
      ]}
    />
  </div>
}

export default PreOrder