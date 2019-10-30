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
      {
        columnName: 'type',

        render: (row) => {
          return (
            <div>
              {row.type}
              {row.isExternalPrescription === true ? <span> (Ext.) </span> : ''}
            </div>
          )
        },
      },
      { columnName: 'totalAmount', type: 'number', currency: true },
    ]}
  />
)
