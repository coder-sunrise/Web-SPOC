import { Table } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Checkbox, Button, Tooltip } from '@/components'
import { useSelector } from 'dva'
import { Tag } from 'antd'
import moment from 'moment'
import { CheckCircleOutlined } from '@ant-design/icons'
export const ResultTable = props => {
  const { data, acknowledge } = props
  const defaultColumns = [
    {
      title: '#',
      width: 40,
      align: 'center',
      dataIndex: 'TestPanelItem',
      render: (text, row, index) => {
        return <span>{index + 1}</span>
      },
    },
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
      render: (text, row, index) => {
        return <span>{text ? text : '-'}</span>
      },
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      width: 150,
      render: (text, row, index) => {
        return <span>{text ? text : '-'}</span>
      },
    },
    {
      title: 'Reference Range',
      width: 250,
      dataIndex: 'ReferenceRangeDescription',
      render: (text, row, index) => {
        return <span>{text ? text : '-'}</span>
      },
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

  const user = useSelector(st => st.user)
  const clinicRoleFK =
    user?.data?.clinicianProfile?.userProfile?.role?.clinicRoleFK
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h5 style={{ display: 'inline-block', fontWeight: '500' }}>
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
              </div>
              <div>
                {!data.isAcknowledged &&
                  data.status == 6 &&
                  clinicRoleFK === 1 && (
                    <div>
                      <Button
                        color='primary'
                        size='sm'
                        onClick={() => {
                          acknowledge(data.id)
                        }}
                      >
                        Acknowledge
                      </Button>{' '}
                    </div>
                  )}
                {data.isAcknowledged && (
                  <Tooltip
                    title={`Acknowledged by ${
                      data.acknowledgedByUserTitle
                        ? data.acknowledgedByUserTitle + '. '
                        : ''
                    }${data.acknowledgedByUser} on ${moment(
                      data.acknowledgeDate,
                    ).format('DD MMM YYYY HH:mm')}`}
                  >
                    <Tag icon={<CheckCircleOutlined />} color='success'>
                      Acknowledged
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          )
        }}
        footer={() => {
          return (
            <div>
              {data.internalRemarks && (
                <p>
                  <span
                    style={{
                      fontWeight: '500',
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
                      fontWeight: '500',
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
