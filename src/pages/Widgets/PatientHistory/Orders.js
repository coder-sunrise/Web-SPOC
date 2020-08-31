import { Table } from 'antd'
import numeral from 'numeral'
import { currencySymbol } from '@/utils/config'
import tablestyles from './PatientHistoryStyle.less'

export default ({ current }) => {
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          { dataIndex: 'type', title: 'Type', width: 180 },
          { dataIndex: 'name', title: 'Name' },
          {
            dataIndex: 'description',
            title: 'Description',
            render: (text) => (
              <div
                style={{
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {text}
              </div>
            ),
          },
          {
            dataIndex: 'totalAmount',
            title: 'Total',
            width: 120,
            align: 'right',
            render: (text, row) => (
              <div
                style={{
                  color: 'darkBlue',
                  fontWeight: 500,
                }}
              >
                {`${currencySymbol}${numeral(row.totalAmount || 0).format(
                  '0,0.00',
                )}`}
              </div>
            ),
          },
        ]}
        dataSource={current.orders || []}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
      />
    </div>
  )
}
