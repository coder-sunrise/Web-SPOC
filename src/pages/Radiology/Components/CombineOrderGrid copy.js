import React, { useEffect, useState, useContext } from 'react'
import { Typography, Input, Table, Radio, Checkbox } from 'antd'

export const CombineOrderGrid = ({ visitWorkItems }) => {
  const columns = [
    {
      title: 'Accession No.',
      dataIndex: 'accessionNo',
      key: 'name',
      width: 100,
    },
    {
      title: 'Examination',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      width: 200,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      align: 'center',
    },
    {
      title: 'Instruction',
      dataIndex: 'instruction',
      key: 'instruction',
      width: 200,
      align: 'center',
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      align: 'center',
    },
    {
      title: 'Combine',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      align: 'center',
      width: 40,
      render: (text, record, index) => {
        return <Checkbox onChange={e => record.isCombined = target.} />
      },
    },
    {
      title: 'Primary',
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      align: 'center',
      width: 40,
      render: (text, record, index) => {
        return <Radio />
      },
    },
  ]
  return (
    <Table
      bordered
      size='small'
      pagination={false}
      columns={columns}
      dataSource={visitWorkItems}
    />
  )
}
