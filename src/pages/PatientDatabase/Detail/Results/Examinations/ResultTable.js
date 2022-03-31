import { Table } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox } from '@/components'

export const ResultTable = props => {
  const { data } = props
  const defaultColumns = [
    {
      title: 'Test Panel Item',
      dataIndex: 'TestPanelItem',
    },
    {
      title: 'Result',
      dataIndex: 'FinalResult',
      width: 150,
      render: (text, row) => {
        if (row.ShouldFlag) {
          return (
            <span style={{ color: 'red' }}>
              <span style={{ marginRight: 10, display: 'inline-block' }}>
                {text}
              </span>
              <span>*</span>
            </span>
          )
        } else {
          return <span>{text}</span>
        }
      },
    },
    {
      title: 'Raw Data',
      width: 150,
      dataIndex: 'ResultBeforeInterpretation',
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      width: 150,
    },
    {
      title: 'Reference Range',
      width: 250,
      dataIndex: 'ReferenceRangeDescription',
    },
  ]
  const [showRawData, setShowRowData] = useState(false)
  const [columns, setColumns] = useState(defaultColumns)
  useEffect(() => {
    if (showRawData) {
      setColumns(defaultColumns)
    } else {
      setColumns(
        defaultColumns.filter(t => t.dataIndex != 'ResultBeforeInterpretation'),
      )
    }
  }, [showRawData])

  return (
    <div>
      <Table
        columns={columns}
        className='customizedAntTable'
        pagination={false}
        dataSource={data.resultDetails}
        bordered
        size='small'
        title={() => {
          return (
            <p>
              <h5 style={{ display: 'inline-block', fontWeight: 'bold' }}>
                Result
              </h5>
              <Checkbox
                style={{
                  display: 'inline-block',
                  marginLeft: 10,
                  marginRight: 10,
                }}
                label='Display Raw Data'
                simple
                onChange={e => {
                  setShowRowData(e.target.value)
                }}
              />
              Last Verified By:
              <span style={{ display: 'inline-block', marginLeft: 10 }}>
                {data.lastVerifiedBy}
              </span>
            </p>
          )
        }}
        footer={() => {
          return (
            <div>
              {data.internalRemarks && (
                <p>
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginRight: 10,
                    }}
                  >
                    Internal Remarks:{' '}
                  </span>
                  {data.internalRemarks}
                </p>
              )}
              {data.reportRemarks && (
                <p>
                  <span
                    style={{
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginRight: 10,
                    }}
                  >
                    Report Remarks:{' '}
                  </span>
                  {data.reportRemarks}
                </p>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
