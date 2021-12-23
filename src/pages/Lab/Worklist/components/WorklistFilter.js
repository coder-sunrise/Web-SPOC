import React, { useState, useContext, useEffect } from 'react'
import { Form, Card } from 'antd'
import { formatMessage } from 'umi'
import { useDispatch, useSelector } from 'dva'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import moment from 'moment'
import Search from '@material-ui/icons/Search'
import Refresh from '@material-ui/icons/Refresh'
import { CLINICAL_ROLE, PRIORITIES } from '@/utils/constants'
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
  Button,
} from '@/components'
import WorklistContext from '../WorklistContext'
import { StatusButtons } from './StatusButtons'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const { isAnyModelOpened, getVisitTypes } = useContext(WorklistContext)
  const [refreshDate, setRefreshDate] = useState(moment())
  const dispatch = useDispatch()

  const { settings } = useSelector(s => s.clinicSettings)
  const { doctorprofile = [] } = useSelector(s => s.codetable)
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
    dispatch({
      force: true,
      type: 'codetable/fetchCodes',
      payload: {
        code: 'doctorprofile',
        filter: {
          'clinicianProfile.isActive': true,
        },
      },
    })
  }, [])

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
      priority,
      visitDoctor,
      dateFrom,
      dateTo,
    } = form.getFieldsValue(true)

    dispatch({
      type: 'labWorklist/query',
      payload: {
        apiCriteria: {
          searchValue: searchValue,
          visitType: visitType
            ? visitType.filter(t => t !== -99).join(',')
            : undefined,
          priority: priority
            ? priority.filter(t => t !== -99).join(',')
            : undefined,
          visitDoctor: visitDoctor
            ? visitDoctor.filter(t => t !== -99).join(',')
            : undefined,
          filterFrom: dateFrom,
          filterTo: moment(dateTo)
            .endOf('day')
            .formatUTC(false),
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
              options={doctorprofile.map(item => ({
                value: item.id,
                name: item.clinicianProfile.name,
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
              options={PRIORITIES}
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
          <div
            style={{
              display: 'inline-flex',
              flexGrow: 1,
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: '0.8rem',
                  minWidth: 80,
                }}
              >
                Last Refresh:
              </p>
              <p style={{ color: '#1890f8', fontSize: '0.9rem' }}>
                {refreshDate.format('HH:mm')}
              </p>
            </div>
            <Button
              color='primary'
              justIcon
              style={{
                height: 26,
              }}
              onClick={() => handleSearch()}
            >
              <Refresh />
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  )
}
