import React, { useState, useContext, useEffect } from 'react'
import { Form, Card } from 'antd'
import { formatMessage } from 'umi'
import { useDispatch, useSelector } from 'dva'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import moment from 'moment'
import Search from '@material-ui/icons/Search'
import Refresh from '@material-ui/icons/Refresh'
import { CLINICAL_ROLE, PRIORITY_OPTIONS, VISIT_TYPE } from '@/utils/constants'
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
  VisitTypeSelect,
} from '@/components'
import WorklistContext from '../WorklistContext'

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const { isAnyWorklistModelOpened } = useContext(WorklistContext)
  const [refreshDate, setRefreshDate] = useState(moment())
  const dispatch = useDispatch()

  const { settings } = useSelector(s => s.clinicSettings)
  const { doctorprofile = [] } = useSelector(s => s.codetable)
  const clinicianProfile = useSelector(
    state => state.user.data.clinicianProfile,
  )

  const { autoRefreshLabWorklistInterval = 30 } = settings

  const timer = React.useRef(null)

  const startTimer = () => {
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      handleSearch()
    }, autoRefreshLabWorklistInterval * 1000)
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
    handleSearch()
  }, [])

  useEffect(() => {
    if (isAnyWorklistModelOpened) {
      stopTimer()
    } else {
      handleSearch()
    }

    return () => {
      console.log('Clean up Lab WorklistFilter')
      stopTimer()
    }
  }, [isAnyWorklistModelOpened])

  const handleSearch = () => {
    stopTimer()
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
          visitDoctor:
            visitDoctor && !visitDoctor.includes(-99)
              ? visitDoctor.join(',')
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
      startTimer()
    })
  }

  return (
    <Card bordered={false}>
      <Form form={form} layout='inline' initialValues={{}}>
        <div style={{ display: 'flex', width: '100%' }}>
          <Form.Item name='searchValue'>
            <TextField
              label={formatMessage({ id: 'lab.search.general' })}
              style={{ width: 350 }}
            />
          </Form.Item>
          <Form.Item name='visitDoctor' initialValue={[-99]}>
            <Select
              label={formatMessage({ id: 'lab.search.visitDoctor' })}
              options={doctorprofile.map(item => ({
                value: item.id,
                name: item.clinicianProfile.name,
              }))}
              style={{ width: 180 }}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Visit Doctor'
            />
          </Form.Item>
          <Form.Item name='priority' initialValue={[]}>
            <Select
              label={formatMessage({ id: 'lab.search.priority' })}
              options={PRIORITY_OPTIONS}
              style={{ width: 170 }}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Priority'
            />
          </Form.Item>
          <Form.Item name='visitType' initialValue={[-99]}>
            <VisitTypeSelect
              label={formatMessage({ id: 'lab.search.visittype' })}
              mode='multiple'
              maxTagCount={0}
              maxTagPlaceholder='Visit Types'
              style={{ width: 170 }}
              localFilter={item => {
                return item.id !== VISIT_TYPE.OTC
              }}
              allowClear={true}
            />
          </Form.Item>

          <Form.Item
            name='dateFrom'
            initialValue={moment(moment().toDate()).formatUTC()}
          >
            <DatePicker
              style={{ width: 100 }}
              label={formatMessage({ id: 'lab.search.dateFrom' })}
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
              label={formatMessage({ id: 'lab.search.dateTo' })}
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
