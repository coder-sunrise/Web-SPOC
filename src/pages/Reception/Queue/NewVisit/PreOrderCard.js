import ReactDataSheet, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from '@/assets/jss/material-dashboard-pro-react/layouts/basicLayout'
import service from '@/services/patient'
import numeral from 'numeral'
import moment from 'moment'
import {
  TextField,
  GridContainer,
  GridItem,
  CodeSelect,
  CommonModal,
  notification,
  Button,
  Select,
  RadioGroup,
  Tooltip,
} from '@/components'
import Authorized from '@/utils/Authorized'
import { qtyFormat } from '@/utils/config'
import CommonTableGrid from '@/components/CommonTableGrid'
import { ContactSupportOutlined } from '@material-ui/icons'
import { Delete } from '@material-ui/icons'
import { showCurrency } from '@/utils/utils'
const { queryList, query } = service
const styles = theme => ({
  ...basicStyle(theme),
})
@connect(({ clinicSettings, patient }) => ({
  clinicSettings,
  patient,
}))
class PreOrderCard extends PureComponent {
  render() {
    const { values, deletePreOrderItem, isReadOnly } = this.props
    const { visitPreOrderItem = [] } = values

    const actualizePreOrderAccessRight = Authorized.check(
      'patientdatabase.modifypreorder.actualizepreorder',
    ) || { rights: 'hidden' }

    return (
      <div>
        <CommonTableGrid
          forceRender
          size='sm'
          rows={visitPreOrderItem.filter(x => !x.isDeleted)}
          FuncProps={{ pager: false }}
          getRowId={row => row.visitPreOrderItemFK}
          columns={[
            { name: 'preOrderItemType', title: 'Type' },
            { name: 'itemName', title: 'Name' },
            { name: 'quantity', title: 'Order Qty.' },
            { name: 'orderByUser', title: 'Order By' },
            { name: 'orderDate', title: 'Order Date' },
            { name: 'amount', title: 'Total' },
            { name: 'hasPaid', title: 'Paid' },
            { name: 'action', title: 'Action' },
          ]}
          columnExtensions={[
            {
              columnName: 'preOrderItemType',
              sortingEnabled: false,
              width: 120,
            },
            {
              columnName: 'itemName',
              sortingEnabled: false,
              render: row => {
                return (
                  <Tooltip
                    title={
                      <div>
                        {`Code: ${row.code}`}
                        <br />
                        {`Name: ${row.itemName}`}
                      </div>
                    }
                  >
                    <div>{row.itemName}</div>
                  </Tooltip>
                )
              },
            },
            {
              columnName: 'quantity',
              type: 'number',
              precision: 1,
              width: 120,
              sortingEnabled: false,
              render: row => {
                const displayQty = `${numeral(row.quantity).format(
                  '0.0',
                )} ${row.dispenseUOM || ''}`
                return (
                  <Tooltip title={<span>{displayQty}</span>}>
                    <span>{displayQty}</span>
                  </Tooltip>
                )
              },
            },
            {
              columnName: 'orderByUser',
              sortingEnabled: false,
            },
            {
              columnName: 'orderDate',
              sortingEnabled: false,
              type: 'date',
              width: 140,
              render: row => {
                return (
                  <span>
                    {moment(row.orderDate).format('DD MMM YYYY HH:mm')}
                  </span>
                )
              },
            },
            {
              columnName: 'remarks',
              sortingEnabled: false,
            },
            {
              columnName: 'amount',
              width: 80,
              type: 'currency',
              sortingEnabled: false,
              isDisabled: () => true,
              render: row => {
                return row.hasPaid ? showCurrency(row.amount) : '-'
              },
            },
            {
              columnName: 'hasPaid',
              sortingEnabled: false,
              width: 50,
              render: row => (row.hasPaid ? 'Yes' : 'No'),
            },
            {
              columnName: 'action',
              width: 60,
              render: row => {
                return (
                  actualizePreOrderAccessRight.rights === 'enable' &&
                  !isReadOnly && (
                    <Button
                      size='sm'
                      justIcon
                      color='danger'
                      onClick={() => {
                        if (deletePreOrderItem) {
                          deletePreOrderItem(row.actualizedPreOrderItemFK)
                        }
                      }}
                    >
                      <Delete />
                    </Button>
                  )
                )
              },
            },
          ]}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(PreOrderCard)
