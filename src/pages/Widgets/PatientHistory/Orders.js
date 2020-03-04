import { CommonTableGrid, Select } from '@/components'

export default ({ current, codetable }) => (
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
        width: 180,
        render: (row) => {
          return (
            <div>
              {row.type}
              {row.isExternalPrescription === true ? <span> (Ext.) </span> : ''}
            </div>
          )
        },
      },
      {
        columnName: 'description',
        render: (row) => {
          return (
            <div
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {row.description}
            </div>
          )
        },
      },
      { columnName: 'totalAmount', type: 'number', currency: true, width: 120 },
    ]}
  />
)
