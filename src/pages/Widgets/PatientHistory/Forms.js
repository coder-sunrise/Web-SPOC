import React, { useState } from 'react'
// common components
import { CommonTableGrid, notification, Checkbox } from '@/components'
import { formTypes, formStatus } from '@/utils/codes'

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
      <CommonTableGrid
        size='sm'
        rows={includeVoidForms ? forms : forms.filter((o) => o.statusFK !== 4)}
        columns={[
          { name: 'typeName', title: 'Type' },
          { name: 'updateByUser', title: 'Last Update By' },
          { name: 'lastUpdateDate', title: 'Last Update Time' },
          { name: 'statusFK', title: 'Status' },
        ]}
        FuncProps={{ pager: false }}
        columnExtensions={[
          {
            columnName: 'typeName',
            type: 'link',
            linkField: 'href',
            onClick: (row) => viewReport(row),
          },
          {
            columnName: 'statusFK',
            type: 'select',
            options: formStatus,
          },
          {
            columnName: 'lastUpdateDate',
            type: 'date',
            showTime: true,
          },
        ]}
      />
    </div>
  )
}
