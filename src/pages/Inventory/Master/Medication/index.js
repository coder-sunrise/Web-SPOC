import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { compare } from '@/layouts'
import { CardContainer } from '@/components'
import FilterBar from './FilterBar'
import Grid from '../Grid'
import { status, suppliers, dispUOMs } from '@/utils/codes'

const styles = () => ({})
@connect(({ medication }) => ({
  medication,
}))
@compare('medication')
class Medication extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      tableParas: {
        columns: [
          { name: 'refNo', title: 'Code' },
          { name: 'patientName', title: 'Name' },
          { name: 'supplier', title: 'Supplier' },
          { name: 'category', title: 'Category' },
          { name: 'group', title: 'Group' },
          { name: 'status', title: 'Status' },
          { name: 'dispUOM', title: 'Disp. UOM' },
          { name: 'prescrUOM', title: 'Prescr. UOM' },
          { name: 'disPrescUOM', title: '1 Dis = Prescr. UOM' },
          { name: 'stock', title: 'Stock' },
          { name: 'payments', title: 'Avg Cost Price' },
          { name: 'expenseAmount', title: 'Selling Price' },
          { name: 'Action', title: 'Action' },
        ],
        // selectColumns: [
        //   'supplier',
        //   'dispUOM',
        // ],
        // selectColumnsConfigs: {
        //   supplier: {
        //     options: suppliers,
        //     label: 'Supplier',
        //   },
        //   dispUOM: {
        //     options: dispUOMs,
        //     label: 'DispUOM',
        //   },
        // },
        // currencyColumns: [
        //   'payments',
        //   'expenseAmount',
        // ],
        leftColumns: [],
      },
    }
  }

  render () {
    const { props } = this
    const { classes, ...restProps } = props
    const { tableParas } = this.state
    const colExtensions = [
      { columnName: 'Action', width: 110, align: 'center' },
      { columnName: 'disPrescUOM', type: 'number' },
      { columnName: 'stock', type: 'number' },
      { columnName: 'payments', type: 'number', currency: true },
      { columnName: 'expenseAmount', type: 'number', currency: true },
    ]

    const combineProps = {
      type: 'medication',
      ...restProps,
      tableParas,
      colExtensions,
    }

    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <FilterBar {...restProps} />
        <Grid {...combineProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Medication)
