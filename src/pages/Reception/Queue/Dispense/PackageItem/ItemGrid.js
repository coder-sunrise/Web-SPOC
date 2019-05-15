import React, { PureComponent } from 'react'
// material ui
import { Paper } from '@material-ui/core'
// dev grid
import {
  Grid as DevGrid,
  VirtualTable,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui'
import {
  QtyTypeProvider,
  NumberTypeProvider,
  CommonTableGrid2,
} from '@/components'

const COLUMNS = [
  { name: 'item', title: 'Item' },
  { name: 'price', title: 'Price' },
  { name: 'quantity', title: 'Quantity' },
  { name: 'subtotal', title: 'Subtotal' },
  { name: 'consumed', title: 'Consumed' },
]

const CURRENCY_COLUMNS = [
  'price',
  'subtotal',
]
const QTY_COLUMNS = [
  'quantity',
  'consumed',
]
const COLUMN_EXTENSIONS = [
  { columnName: 'item', width: 500, align: 'left' },
  { columnName: 'price', type: 'number', currency: true },
  { columnName: 'quantity', type: 'number' },
  { columnName: 'subtotal', type: 'number', currency: true },
  { columnName: 'consumed', type: 'number' },
]
const ROWS = [
  {
    item: 'Package 1 - packge item 01',
    price: 250,
    quantity: 2,
    subtotal: 500,
    consumed: 1,
  },
]

const FuncProps = { page: false }

class ItemGrid extends PureComponent {
  render () {
    return (
      <div className='bottomSpacing'>
        {/*
          <DevGrid rows={ROWS} columns={COLUMNS}>
            <NumberTypeProvider for={CURRENCY_COLUMNS} />
            <QtyTypeProvider for={QTY_COLUMNS} />
            <VirtualTable height={300} columnExtensions={COLUMN_EXTENSIONS} />
            <TableHeaderRow />
          </DevGrid>
        */}
        <CommonTableGrid2
          height={300}
          rows={ROWS}
          columns={COLUMNS}
          columnExtensions={COLUMN_EXTENSIONS}
          FuncProps={FuncProps}
        />
      </div>
    )
  }
}

export default ItemGrid
