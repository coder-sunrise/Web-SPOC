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
import WorklistContext from '../Worklist/WorklistContext'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { showDetails, visitPurpose = [] } = useContext(WorklistContext)
  const { settings } = useSelector(s => s.clinicSettings)

  const timer = React.useRef(null)

  const startTimer = () => {
    timer.current = setInterval(() => {
      handleSearch()
    }, 30000)
  }

  const stopTimer = () => {
    clearInterval(timer.current)
  }

  useEffect(() => {
    if (showDetails) {
      stopTimer()
    } else {
      handleSearch()
      startTimer()
    }

    return () => clearInterval(timer.current)
  }, [showDetails])

  const getVisitTypes = () => {
    if (!visitPurpose) return []
    console.log('visitPurpose', visitPurpose)
    return visitPurpose
      .filter(p => p.id !== VISIT_TYPE.OTC)
      .map(c => ({
        name: c.name,
        value: c.id,
        customTooltipField: `Code: ${c.code}\nName: ${c.name}`,
      }))
  }

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
        <Select
          label='Visit Type'
          options={getVisitTypes()}
          style={{ width: 180 }}
          mode='multiple'
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
