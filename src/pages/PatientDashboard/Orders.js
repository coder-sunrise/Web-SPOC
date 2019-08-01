import { CommonTableGrid } from '@/components'

export default ({}) => (
  <CommonTableGrid
    size='sm'
    rows={[
      {
        id: 1,
        type: 'Medication',
        name: 'Biogesic tab 500 mg',
        description: 'Take Twice A Day',
        total: 40,
      },
      {
        id: 2,
        type: 'Medication',
        name: 'AMLODIPINE 5MG',
        description: 'Take 1 Tab/s Every Night For 2 Days',
        total: 40,
      },
      {
        id: 3,
        type: 'Vaccination',
        name: 'ACTACEL Vaccine Injection (0.5 mL)',
        description: 'Vaccination Remarks',
        total: 40,
      },
      {
        id: 4,
        type: 'Vaccination',
        name: 'BOOSTRIX POLIO Vaccine',
        description: 'Vaccination Remarks',
        total: 40,
      },
      {
        id: 5,
        type: 'Service',
        name: 'Consultation Service',
        description: '',
        total: 30,
      },
    ]}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'name', title: 'Name' },
      { name: 'description', title: 'Description' },
      { name: 'total', title: 'Total' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'total', type: 'number', currency: true },
    ]}
  />
)
