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
@connect(({ pack }) => ({
  pack,
}))
@compare('pack')
class Pack extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      tableParas: {
        columns: [
          { name: 'refNo', title: 'Code' },
          { name: 'patientName', title: 'Name' },
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
      { columnName: 'payments', type: 'number', currency: true },
      { columnName: 'expenseAmount', type: 'number', currency: true },
    ]

    const combineProps = {
      type: 'pack',
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

export default withStyles(styles)(Pack)
