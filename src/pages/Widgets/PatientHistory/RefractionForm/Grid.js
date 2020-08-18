import React from 'react'
import { Table } from 'antd'
import { Checkbox, CodeSelect } from '@/components'
import tablestyles from '../TableStyle.less'
import ODOS from './ODOS'

export default ({ rows = [], selectedRow }) => {
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        dataSource={rows}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
        columns={[
          {
            dataIndex: 'IsSelected',
            title: ' ',
            width: 50,
            render: (text, row) => {
              return (
                <Checkbox
                  onChange={() => {
                    selectedRow(row.id)
                  }}
                />
              )
            },
          },
          {
            dataIndex: 'EyeRefractionTestTypeFK',
            title: 'Select Test',
            width: 130,
            render: (text, row) => (
              <CodeSelect
                code='cteyerefractiontesttype'
                value={row.EyeRefractionTestTypeFK}
                disabled
              />
            ),
          },
          {
            dataIndex: 'OD',
            title: 'OD',
            align: 'center',
            render: (text, row) => <ODOS row={row} columnName='OD' />,
          },
          {
            dataIndex: 'OS',
            title: 'OS',
            align: 'center',
            render: (text, row) => <ODOS row={row} columnName='OS' />,
          },
        ]}
      />
    </div>
  )
}
