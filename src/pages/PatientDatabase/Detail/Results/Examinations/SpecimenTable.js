import { Table } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox } from '@/components'
import moment from 'moment'

export const SpecimenTable = props => {
  const { data } = props
  const defaultColumns = [
    {
      title: 'Accession No',
      dataIndex: 'accesionNo',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 200,
    },
    {
      title: 'Specimen Type',
      width: 200,
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
            <p>
              <h5 style={{ display: 'inline-block', fontWeight: 'bold' }}>
                Specimen Details
              </h5>
            </p>
          )
        }}
      />
    </div>
  )
}
