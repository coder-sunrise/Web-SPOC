import React from 'react'
import { Table } from 'antd'
import { TextField, GridItem } from '@/components'
import tablestyles from '../TableStyle.less'
import NearAddODOS from './NearAddODOS'

export default ({ rows = [] }) => {
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        dataSource={[
          rows,
        ]}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        className={tablestyles.table}
        columns={[
          {
            dataIndex: 'NearAdd',
            title: ' ',
            width: 130,
            render: () => {
              return (
                <GridItem>
                  <TextField text value='Near Add:' />
                </GridItem>
              )
            },
          },
          {
            dataIndex: 'OD',
            title: 'OD',
            align: 'center',
            render: (text, row) => <NearAddODOS columnName='OD' row={row} />,
          },
          {
            dataIndex: 'OS',
            title: 'OS',
            align: 'center',
            render: (text, row) => <NearAddODOS columnName='OS' row={row} />,
          },
        ]}
      />
    </div>
  )
}
