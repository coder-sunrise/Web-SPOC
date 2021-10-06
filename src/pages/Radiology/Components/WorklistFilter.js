import React, { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'antd'
import moment from 'moment'
import Search from '@material-ui/icons/Search'
import { useDispatch, useSelector } from 'dva'
import { VISIT_TYPE } from '@/utils/constants'
import {
  TextField,
  DatePicker,
  Checkbox,
  Select,
  ProgressButton,
  CodeSelect,
  dateFormatLong,
} from '@/components'
import { formatMessage } from 'umi'
import WorlistContext from '../Worklist/WorklistContext'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { showDetails, visitPurpose } = useContext(WorlistContext)
  const { settings } = useSelector(s => s.clinicSettings)

  useEffect(() => {
    handleSearch()
  }, [showDetails])

  const handleSearch = () => {
    const {
      searchValue,
      visitType,
      modality,
      dateFrom,
      dateTo,
      isUrgent,
      isMyPatientOnly,
    } = form.getFieldsValue(true)

    dispatch({
      type: 'radiologyWorklist/query',
      payload: {
        apiCriteria: {
          searchValue: searchValue,
          visitType: visitType
            ? visitType.filter(t => t !== -99).join(',')
            : undefined,
          modality: modality
            ? modality.filter(t => t !== -99).join(',')
            : undefined,
          filterFrom: dateFrom,
          filterTo: dateTo,
          isUrgent: isUrgent,
          isMyPatientOnly: isMyPatientOnly,
        },
      },
    })
  }

  return (
    <Form form={form} layout='inline' initialValues={{}}>
      <Form.Item name='searchValue'>
        <TextField
          label={formatMessage({ id: 'radiology.search.general' })}
          style={{ width: 350 }}
        />
      </Form.Item>
      <Form.Item name='visitType'>
        <CodeSelect
          label='Visit Type'
          code='ctvisitpurpose'
          options={visitPurpose || []}
          style={{ width: 180 }}
          mode='multiple'
          localFilter={item => item.id !== VISIT_TYPE.RETAIL}
        />
      </Form.Item>
      <Form.Item name='modality'>
        <CodeSelect
          mode='multiple'
          style={{ width: 150 }}
          label='Modality'
          code='ctmodality'
          onChange={() => console.log('modality')}
        />
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
      <Form.Item name='isUrgent' style={{ alignSelf: 'flex-end' }}>
        <Checkbox
          style={{ width: 70 }}
          label={formatMessage({ id: 'radiology.search.urgentOnly' })}
        />
      </Form.Item>
      <Form.Item name='isMyPatientOnly' style={{ alignSelf: 'flex-end' }}>
        <Checkbox
          style={{ width: 125 }}
          label={formatMessage({ id: 'radiology.search.myPatientOnly' })}
        />
      </Form.Item>
      <Form.Item style={{ alignSelf: 'flex-end' }}>
        <ProgressButton
          variant='contained'
          color='primary'
          icon={<Search />}
          onClick={() => {
            handleSearch()
          }}
        >
          {formatMessage({ id: 'form.search' })}
        </ProgressButton>
      </Form.Item>
    </Form>
  )
}
