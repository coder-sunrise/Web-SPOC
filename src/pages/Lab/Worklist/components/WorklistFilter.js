import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card } from 'antd'
import { StatusButtons } from './StatusButtons'
import { formatMessage } from 'umi'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import { CLINICAL_ROLE } from '@/utils/constants'
import moment from 'moment'
import Search from '@material-ui/icons/Search'
import { useDispatch, useSelector } from 'dva'
import {
  TextField,
  DatePicker,
  Checkbox,
  Select,
  ProgressButton,
  CodeSelect,
  dateFormatLong,
  IconButton,
  Popover,
} from '@/components'
import WorklistContext from '../WorklistContext'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const { isAnyModelOpened, getVisitTypes } = useContext(WorklistContext)
  const [refreshDate, setRefreshDate] = useState(moment())
  const dispatch = useDispatch()

  const { settings } = useSelector(s => s.clinicSettings)
  const clinicianProfile = useSelector(
    state => state.user.data.clinicianProfile,
  )

  const { autoRefreshRadiologyWorklistInterval = 30 } = settings

  const timer = React.useRef(null)

  const startTimer = () => {
    timer.current = setInterval(() => {
      handleSearch()
    }, autoRefreshRadiologyWorklistInterval * 1000)
  }

  const stopTimer = () => {
    clearInterval(timer.current)
  }

  useEffect(() => {
    if (isAnyModelOpened) {
      stopTimer()
    } else {
      handleSearch()
      startTimer()
    }

    return () => clearInterval(timer.current)
  }, [isAnyModelOpened])

  const handleSearch = () => {
    const {
      searchValue,
      visitType,
      modality,
      dateFrom,
      dateTo,
      isMyPatientOnly,
    } = form.getFieldsValue(true)

    dispatch({
      type: 'labWorklist/query',
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
          filterTo: moment(dateTo)
            .endOf('day')
            .formatUTC(false),

          clinicianProfileId: isMyPatientOnly ? clinicianProfile.id : undefined,
        },
      },
    }).then(val => {
      if (val) {
        setRefreshDate(moment())
      }
    })
  }

  return (
    <Card>
      <Form form={form} layout='inline' initialValues={{}}>
        <div style={{ display: 'flex', width: '100%' }}>
          <Form.Item name='searchValue'>
            <TextField
              label={formatMessage({ id: 'radiology.search.general' })}
              style={{ width: 350 }}
            />
          </Form.Item>
          <Form.Item name='visitDoctor' initialValue={[-99]}>
            <Select
              label='Visit Doctor'
              options={getVisitTypes().map(item => ({
                value: item.id,
                ...item,
              }))}
              style={{ width: 170 }}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Visit Doctor'
            />
          </Form.Item>
          <Form.Item name='priority' initialValue={[-99]}>
            <Select
              label='Priority'
              options={getVisitTypes().map(item => ({
                value: item.id,
                ...item,
              }))}
              style={{ width: 170 }}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Priority'
            />
          </Form.Item>
          <Form.Item name='visitType' initialValue={[-99]}>
            <Select
              label='Visit Type'
              options={getVisitTypes().map(item => ({
                value: item.id,
                ...item,
              }))}
              style={{ width: 170 }}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Visit Types'
            />
          </Form.Item>

          <Form.Item
            name='dateFrom'
            initialValue={moment(moment().toDate()).formatUTC()}
          >
            <DatePicker
              style={{ width: 100 }}
              label={formatMessage({ id: 'radiology.search.dateFrom' })}
            />
          </Form.Item>
          <Form.Item
            name='dateTo'
            initialValue={moment()
              .endOf('day')
              .formatUTC(false)}
          >
            <DatePicker
              bordered={true}
              label={formatMessage({ id: 'radiology.search.dateTo' })}
              style={{ width: 100 }}
            />
          </Form.Item>

          <Form.Item style={{ alignSelf: 'center' }}>
            <ProgressButton
              variant='contained'
              color='primary'
              icon={<Search />}
              size='small'
              onClick={() => {
                handleSearch()
              }}
            >
              {formatMessage({ id: 'form.search' })}
            </ProgressButton>
          </Form.Item>
        </div>
        {/* <Form.Item> <StatusButtons /> </Form.Item>*/}
      </Form>
    </Card>
  )
}
