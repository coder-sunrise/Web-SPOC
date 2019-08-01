import { CommonTableGrid } from '@/components'

export default ({}) => (
  <CommonTableGrid
    size='sm'
    rows={[
      {
        id: 1,
        type: 'Referral Letter',
        subject: 'Referral Letter To Dr Ong',
        from: 'Dr Johnny',
      },
      {
        id: 2,
        type: 'Others',
        subject: 'Vaccination Certificate',
        from: 'Dr Levine',
      },
      {
        id: 3,
        type: 'Memo',
        subject: 'Patient Visit Reminder',
        from: 'Dr Levine',
      },
      {
        id: 4,
        type: 'Medical Certificate',
        subject: '09 May 2019 - 09 May 2019 - 1 Day(s)',
        from: 'Dr Levine',
      },
      {
        id: 5,
        type: 'Certificate of Attendance',
        subject: '09 May 2019 - 09 May 2019 - 1 Day',
        from: 'Dr Levine',
      },
    ]}
    columns={[
      { name: 'type', title: 'Type' },
      { name: 'subject', title: 'Subject' },
      { name: 'from', title: 'From' },
    ]}
    FuncProps={{ pager: false }}
    columnExtensions={[
      { columnName: 'subject', type: 'link', linkField: 'href' },
    ]}
  />
)
