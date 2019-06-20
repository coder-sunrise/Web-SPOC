import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'
import { Remove, Apps } from '@material-ui/icons'
import { NavPills ,
  CommonTableGrid,
  CommonTableGrid2,
  Tooltip,
  Button,
, GridContainer, GridItem } from '@/components'

import DetailPanel from '../../Details/Detail'
import Pricing from '../../Details/Pricing'
import Stock from '../../Details/Stock'

// dev grid
import { Table } from '@devexpress/dx-react-grid-material-ui'

const Cell = (props) => {
  const { column, onShowDetails, onConfirmDelete } = props

  if (column.name === 'Action') {
    return (
      <Table.Cell {...props}>
        <Tooltip title='Delete Doctor Expense' placement='bottom-start'>
          <Button
            size='sm'
            onClick={onConfirmDelete}
            justIcon
            round
            color='danger'
          >
            <Remove />
          </Button>
        </Tooltip>
      </Table.Cell>
    )
  }
  return <Table.Cell {...props} />
}

const styles = () => ({})
@connect(({ pack }) => ({
  pack,
}))
@compare('pack')
class Grid extends PureComponent {
  constructor (props) {
    super(props)
  }

  GetData () {
    const { type, ...restProps } = this.props
    let rowData = []
    switch (type) {
      case 'Medication':
        rowData = [
          {
            Medication: 'Panadol',
            Quantity: 1.0,
            UnitPrice: 5.0,
            Amount: 5.0,
          },
          {
            Medication: 'Paracetemo',
            Quantity: 1.0,
            UnitPrice: 10.0,
            Amount: 10.0,
          },
        ]
        break
      case 'Vaccination':
        rowData = [
          {
            Vaccination: 'BCG',
            Quantity: 1.0,
            UnitPrice: 5.0,
            Amount: 5.0,
          },
        ]
      default:
        break
    }

    return rowData
  }

  render () {
    const { classes, theme, type, ...restProps } = this.props
    const { pack } = restProps
    const TableCell = (p) => Cell({ ...p })
    const TableColumns = {
      columns: [
        { name: type, title: type },
        { name: 'Quantity', title: 'Quantity' },
        { name: 'UnitPrice', title: 'UnitPrice' },
        { name: 'Amount', title: 'Amount' },
      ],
    }
    return (
      <GridContainer>
        <GridItem xs={10} />
        <GridItem xs={2}>
          <p>Package Price: $404:00</p>
        </GridItem>
        <GridItem xs={12} style={{ marginBottom: '10px' }}>
          <CommonTableGrid2
            {...TableColumns}
            rows={this.GetData()}
            FuncProps={{ pager: false }}
            ActionProps={{ TableCellComponent: TableCell }}
          />
        </GridItem>
        <GridItem xs={10} />
        <GridItem xs={2}>
          <p>Subtotal: $45:00</p>
        </GridItem>
      </GridContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Grid)
