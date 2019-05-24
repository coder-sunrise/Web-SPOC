import { CommonTableGrid2 } from '@/components'

export default ({ h3, header, body }) => (
  <CommonTableGrid2
    height={400}
    rows={[]}
    columns={[
      { name: 'patientRefNo', title: 'Type' },
      { name: 'patientName', title: 'Name' },
      { name: 'invoiceNo', title: 'Description' },
      { name: 'copay', title: 'Total' },
    ]}
    FuncProps={{ pager: false, selectable: true }}
    // columnExtensions={columnExtensions}
  />
)
