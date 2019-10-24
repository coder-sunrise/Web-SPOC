import { CommonTableGrid, Select } from '@/components'

export default ({ current }) => (
  <CommonTableGrid
    size='sm'
    rows={current.orders || []}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'name', title: 'Name' },
      { name: 'description', title: 'Description' },
      { name: 'totalAmount', title: 'Total' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'totalAmount', type: 'number', currency: true },
    ]}
  />
)
