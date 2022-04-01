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
  Tooltip,
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

  const { autoRefreshMedicalCheckupWorklistInterval = 30 } = settings

  const timer = React.useRef(null)

  const startTimer = () => {
    timer.current = setInterval(() => {
      handleSearch()
    }, autoRefreshMedicalCheckupWorklistInterval * 1000)
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
      startTimer()
    }

    return () => clearInterval(timer.current)
  }, [isAnyWorklistModelOpened])

  const handleSearch = () => {
    const {
      searchValue,
      isOnlyUrgent,
      isMyPatient,
      visitDoctor,
      dateFrom,
      dateTo,
    } = form.getFieldsValue(true)

    dispatch({
      type: 'medicalCheckupWorklist/query',
      payload: {
        apiCriteria: {
          searchValue: searchValue,
          isOnlyUrgent,
          isMyPatient,
          visitDoctor:
            visitDoctor && !visitDoctor.includes(-99)
              ? visitDoctor.join(',')
              : undefined,
          filterFrom: dateFrom,
          filterTo: dateTo
            ? moment(dateTo)
                .endOf('day')
                .formatUTC(false)
            : undefined,
        },
      },
    }).then(val => {
      if (val) {
        setRefreshDate(moment())
      }
    })
  }

  const clinicRoleFK = clinicianProfile.userProfile?.role?.clinicRoleFK
  return (
    <Card bordered={false}>
      <Form form={form} layout='inline' initialValues={{}}>
        <div style={{ display: 'flex', width: '100%' }}>
          <Form.Item name='searchValue'>
            <TextField
              label='Patient Name, Acc. No., Patient Ref. No.'
              style={{ width: 350 }}
            />
          </Form.Item>
          <Form.Item name='visitDoctor' initialValue={[-99]}>
            <Tooltip
              placement='right'
              title='Select "All" will retrieve active and inactive doctors'
            >
              <Select
                label='Visit Doctor'
                options={doctorprofile.map(item => ({
                  value: item.id,
                  name: item.clinicianProfile.name,
                }))}
                style={{ width: 180 }}
                mode='multiple'
                maxTagCount={0}
                maxTagPlaceholder='Visit Doctor'
              />
            </Tooltip>
          </Form.Item>

          <Form.Item name='dateFrom'>
            <DatePicker style={{ width: 140 }} label='Visit Date From' />
          </Form.Item>
          <Form.Item name='dateTo'>
            <DatePicker
              bordered={true}
              label='Visit Date To'
              style={{ width: 140, marginRight: 20 }}
            />
          </Form.Item>

          <Form.Item name='isOnlyUrgent' initialValue={false}>
            <Checkbox simple label='Urgent' style={{ marginTop: 25 }} />
          </Form.Item>

          {clinicRoleFK === 1 && (
            <Form.Item name='isMyPatient' initialValue={false}>
              <Checkbox simple label='My Patient' style={{ marginTop: 25 }} />
            </Form.Item>
          )}

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
          <div style={{ position: 'absolute', top: 12, right: 40 }}>
            <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>Last Refresh:</p>
            <span>
              <p style={{ color: '#1890f8', marginTop: 4, fontSize: '0.9rem' }}>
                {refreshDate.format('HH:mm')}
              </p>
              <Button
                color='primary'
                justIcon
                style={{
                  position: 'absolute',
                  top: 20,
                  left: 80,
                  width: 26,
                  height: 26,
                }}
                onClick={handleSearch}
              >
                <Refresh />
              </Button>
            </span>
          </div>
        </div>
      </Form>
    </Card>
  )
}
