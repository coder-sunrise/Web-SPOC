import { Table } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox } from '@/components'
import moment from 'moment'

export const SpecimenTable = props => {
  const { data } = props
  const defaultColumns = [
    {
      title: '#',
      width: 40,
      dataIndex: 'accesionNo',
      align: 'center',
      render: (text, row, index) => {
        return <span>{index + 1}</span>
      },
    },
    {
      title: 'Accession No',
      dataIndex: 'accesionNo',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 200,
      render: (text, row, index) => {
        return <span>{text ? text : '-'}</span>
      },
    },
    {
      title: 'Specimen Type',
      dataIndex: 'specimenType',
    },
  ]
  const [columns, setColumns] = useState(defaultColumns)

  const specimenData = [
    {
      accesionNo: data.accesionNo,
      category: data.category,
      specimenType: data.specimenType,
    },
  ]
  return (
    <div>
      <Table
        className='customizedAntTable'
        columns={columns}
        pagination={false}
        dataSource={specimenData}
        bordered
        size='small'
        title={() => {
          return (
            <p style={{ marginTop: 10 }}>
              <span
                style={{
                  display: 'inline-block',
                  color: '#4255bd',
                  fontSize: 14,
                  fontWeight: '500',
                }}
              >
                Specimen Details
              </span>
            </p>
          )
        }}
      />
    </div>
  )
}
