import React, { useState } from 'react'
import { Form, Button } from 'antd'
import Search from '@material-ui/icons/Search'
import { useDispatch } from 'dva'
import {
  TextField,
  DatePicker,
  Checkbox,
  Select,
  ProgressButton,
} from '@/components'
import { formatMessage } from 'umi'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  return (
    <Form form={form} layout='inline' initialValues={{}}>
      <Form.Item name='searchValue'>
        <TextField
          label={formatMessage({ id: 'radiology.search.general' })}
          style={{ width: 350 }}
        />
      </Form.Item>
      <Form.Item name='visitType'>
        <Select label='Visit Type' options={[]} style={{ width: 150 }} />
      </Form.Item>
      <Form.Item name='modality'>
        <Select label='Modality' options={[]} style={{ width: 150 }} />
      </Form.Item>
      <Form.Item name='dateFrom'>
        <DatePicker
          style={{ width: 100 }}
          label={formatMessage({ id: 'radiology.search.dateFrom' })}
        />
      </Form.Item>
      <Form.Item name='dateTo'>
        <DatePicker
          bordered={true}
          label={formatMessage({ id: 'radiology.search.dateTo' })}
          style={{ width: 100 }}
        />
      </Form.Item>
      <Form.Item name='isOnlyToday' style={{ alignSelf: 'flex-end' }}>
        <Checkbox
          style={{ width: 70 }}
          label={formatMessage({ id: 'radiology.search.todayOnly' })}
        />
      </Form.Item>
      <Form.Item name='isUrgentOnly' style={{ alignSelf: 'flex-end' }}>
        <Checkbox
          style={{ width: 100 }}
          label={formatMessage({ id: 'radiology.search.urgentOnly' })}
        />
      </Form.Item>
      <Form.Item style={{ alignSelf: 'flex-end' }}>
        <ProgressButton
          variant='contained'
          color='primary'
          icon={<Search />}
          onClick={() => {
            const { searchValue } = form.getFieldsValue(true)
            dispatch({
              type: 'radiologyWorklist/query',
              payload: {
                apiCriteria: searchValue ? { searchValue } : undefined,
              },
            })
          }}
        >
          {formatMessage({ id: 'form.search' })}
        </ProgressButton>
      </Form.Item>
    </Form>
  )
}
