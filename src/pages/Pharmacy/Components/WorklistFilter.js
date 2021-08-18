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
          label={formatMessage({ id: 'pharmacy.search.general' })}
          style={{ width: 350 }}
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
              type: 'pharmacyWorklist/query',
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
