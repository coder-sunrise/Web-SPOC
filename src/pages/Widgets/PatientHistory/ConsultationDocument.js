import { CommonTableGrid } from '@/components'
import { printRow } from '../ConsultationDocument'

export default ({ current }) => {

  return (
    <CommonTableGrid
      size='sm'
      rows={current.documents || []}
      columns={[
        { name: 'type', title: 'Type' },
        { name: 'subject', title: 'Subject' },
        { name: 'from', title: 'From' },
      ]}
      FuncProps={{ pager: false }}
      columnExtensions={[
        {
          columnName: 'subject',
          type: 'link',
          linkField: 'href',
          onClick: printRow,
        },
        {
          columnName: 'from',
          render: (r) => {
            return `${r.from.clinicianProfile.title} ${r.from.clinicianProfile
              .name}`
          },
        },
      ]}
    />
  )
}
