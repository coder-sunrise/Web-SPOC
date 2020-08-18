import React, { useState } from 'react'
import { Table } from 'antd'
import moment from 'moment'
// common components
import { notification, Checkbox } from '@/components'
import { formTypes, formStatus } from '@/utils/codes'
import tablestyles from './TableStyle.less'

export const viewReport = (row) => {
  const type = formTypes.find((o) => parseInt(o.value, 10) === row.type)
  const { downloadConfig } = type
  if (!downloadConfig) {
    notification.error({ message: 'No configuration found' })
    return false
  }
  if (row.id) {
    window.g_app._store.dispatch({
      type: 'report/updateState',
      payload: {
        reportTypeID: downloadConfig.id,
        reportParameters: {
          [downloadConfig.key]: row.id,
          FormCategory: 'CORForm',
          isSaved: true,
        },
      },
    })
  }

  return true
}

export default ({ current }) => {
  const { forms = [] } = current
  const [
    includeVoidForms,
    setIncludeVoidForms,
  ] = useState(false)
  return (
    <div>
      <Checkbox
        label='Include voided forms'
        value={includeVoidForms}
        onChange={() => {
          setIncludeVoidForms(!includeVoidForms)
        }}
      />
      <Table
        size='small'
        bordered
        pagination={false}
        columns={[
          {
            dataIndex: 'typeName',
            title: 'Type',
            render: (text, row) => (
              <a
                onClick={() => {
                  viewReport(row)
                }}
              >
                {text}
              </a>
            ),
          },
          { dataIndex: 'updateByUser', title: 'Last Update By' },
          {
            dataIndex: 'lastUpdateDate',
            title: 'Last Update Time',
            render: (text, row) => (
              <span>{moment(row.lastUpdateDate).format('DD MMM YYYY')}</span>
            ),
          },
          {
            dataIndex: 'statusFK',
            title: 'Status',
            render: (text, row) => {
              const status = formStatus.find((o) => o.value === row.statusFK)
              return <span>{status ? status.name : ''}</span>
            },
          },
        ]}
        dataSource={
          includeVoidForms ? forms : forms.filter((o) => o.statusFK !== 4)
        }
        rowClassName={(record, index) => {
          return index % 2 === 0 ? tablestyles.once : tablestyles.two
        }}
      />
    </div>
  )
}
