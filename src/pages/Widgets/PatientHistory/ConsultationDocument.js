import { Table } from 'antd'
import { viewReport } from '../ConsultationDocument'
import tablestyles from './PatientHistoryStyle.less'

export default ({ current }) => {
  return (
    <Table
      size='small'
      bordered
      pagination={false}
      columns={[
        { dataIndex: 'type', title: 'Type' },
        {
          dataIndex: 'subject',
          title: 'Subject',
          render: (text, row) => (
            <a
              onClick={() => {
                viewReport(row, undefined, true)
              }}
            >
              {row.subject}
            </a>
          ),
        },
        {
          dataIndex: 'from',
          title: 'From',
          render: (text, row) => {
            const title = row.from.clinicianProfile.title
              ? `${row.from.clinicianProfile.title} `
              : ''
            return `${title}${row.from.clinicianProfile.name}`
          },
        },
      ]}
      dataSource={current.documents || []}
      rowClassName={(record, index) => {
        return index % 2 === 0 ? tablestyles.once : tablestyles.two
      }}
      className={tablestyles.table}
    />
  )
}
