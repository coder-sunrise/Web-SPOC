import React from 'react'
import ReactDOM from 'react-dom'
import { Table, Badge, Menu, Dropdown, Space } from 'antd'
import { useSelector } from 'dva'
import {
  DownOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons'

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
)

export const WorklistGrid = () => {
  const entity = useSelector(s => s.labWorklist)

  console.log('WorklistGrid.entity', entity)

  const expandedRowRender = () => {
    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status='success' />
            Finished
          </span>
        ),
      },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size='middle'>
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ]

    const data = []
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name but long long long long name',
        upgradeNum: 'Upgraded: 56',
      })
    }
    return <Table columns={columns} dataSource={data} pagination={false} />
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    // { title: "Platform", dataIndex: "platform", key: "platform" },
    // { title: "Version", dataIndex: "version", key: "version" },
    // { title: "Upgraded", dataIndex: "upgradeNum", key: "upgradeNum" },
    // { title: "Creator", dataIndex: "creator", key: "creator" },
    { title: 'Date', align: 'right', dataIndex: 'createdAt', key: 'createdAt' },
    //{ title: "Action", align:'right', key: "operation", render: () => <a>Publish</a> }
  ]

  const data = []
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: 'Mister Blue',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt:
        'Biochemistry: 2, Serology/Immunology: 0, Hematology: 1, Urinalysisi: 0, Swab: 1, Faeces: 0',
    })
  }

  return (
    <Table
      className='components-table-demo-nested'
      columns={columns}
      expandable={{ expandedRowRender }}
      //defaultExpandAllRows={true}
      expandedRowKeys={[0, 1]}
      showHeader={false}
      dataSource={data}
      expandIcon={({ expanded, onExpand, record }) =>
        expanded ? (
          <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
        ) : (
          <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
        )
      }
    />
  )
}
