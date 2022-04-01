import { Table } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox } from '@/components'
import moment from 'moment'

export const OrderDetailsTable = props => {
  const { data } = props
  const defaultColumns = [
    {
      title: '#',
      align: 'center',
      width: 40,
      dataIndex: 'ServiceName',
      render: (text, row, index) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: 'Service',
      dataIndex: 'ServiceName',
      width: 200,
    },
    {
      title: 'Test Panel',
      dataIndex: 'TestPanels',
    },
    {
      title: 'Priority',
      width: 100,
      dataIndex: 'Priority',
    },
    {
      title: 'Order Date',
      dataIndex: 'CreateDate',
      width: 150,
      render: text => {
        return <span>{moment(text).format('DD MMM YYYY HH:mm')}</span>
      },
    },
    {
      title: 'Instructions',
      width: 300,
      dataIndex: 'Instruction',
    },
    {
      title: 'Remarks',
      width: 300,
      dataIndex: 'Remark',
    },
  ]
  const [columns, setColumns] = useState(defaultColumns)

  return (
    <div>
      <Table
        className='customizedAntTable'
        columns={columns}
        pagination={false}
        dataSource={data.orderDetails}
        bordered
        size='small'
        title={() => {
          return (
            <p>
              <h5 style={{ display: 'inline-block', fontWeight: '500' }}>
                Order Details
              </h5>
            </p>
          )
        }}
      />
    </div>
  )
}
