import React, { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'antd'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import { CLINICAL_ROLE } from '@/utils/constants'
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
  IconButton,
  Popover,
  Tooltip,
  VisitTypeSelect,
} from '@/components'
import { formatMessage } from 'umi'
import WorklistContext from '../Worklist/WorklistContext'

const DateFilterInfo = () => {
  const [showDateFilterInfo, setShowDateFilterInfo] = useState(false)
  return (
    <Popover
      icon={null}
      visible={showDateFilterInfo}
      placement='topLeft'
      content={
        <div style={{ width: 280 }}>
          <p>
            All states filter using "Order Created date" except Completed state
            filter using "Reporting Completed date"
          </p>
        </div>
      }
    >
      <IconButton
        size='small'
        style={{ alignSelf: 'flex-end', marginRight: 16, marginBottom: 8 }}
        onMouseOver={() => setShowDateFilterInfo(true)}
        onMouseOut={() => setShowDateFilterInfo(false)}
      >
        <InfoCircleOutlined />
      </IconButton>
    </Popover>
  )
}

export const WorklistFilter = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { doctorprofile = [] } = useSelector(s => s.codetable)
  const { detailsId, filterWorklist } = useContext(WorklistContext)
  const clinicianProfile = useSelector(
    state => state.user.data.clinicianProfile,
  )

  useEffect(() => {
    if (!detailsId) {
      handleSearch()
    }
  }, [detailsId])

  const handleSearch = () => {
    const filter = form.getFieldsValue(true)
    filterWorklist(filter)
  }

  return (
    <Form form={form} layout='inline' initialValues={{}}>
      <Form.Item name='searchValue'>
        <TextField
          label={formatMessage({ id: 'radiology.search.general' })}
          style={{ width: 280 }}
        />
      </Form.Item>
      <Form.Item name='visitType' initialValue={[-99]}>
        <VisitTypeSelect
          label='Visit Type'
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
      <Form.Item name='modality' initialValue={[-99]}>
        <CodeSelect
          mode='multiple'
          style={{ width: 165 }}
          label='Modality'
          code='ctmodality'
          maxTagPlaceholder='Modalities'
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
        noStyle
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
      <DateFilterInfo />
      <Form.Item name='visitDoctor' initialValue={[-99]}>
        <Tooltip
          placement='right'
          title='Select "All" will retrieve active and inactive doctors'
        >
          <Select
            label={formatMessage({ id: 'radiology.search.visitDoctor' })}
            options={doctorprofile.map(item => ({
              value: item.id,
              name: item.clinicianProfile.name,
            }))}
            style={{ width: 170 }}
            mode='multiple'
            maxTagCount={0}
            maxTagPlaceholder='Visit Doctor'
          />
        </Tooltip>
      </Form.Item>
      <Form.Item name='isUrgent' style={{ alignSelf: 'flex-end' }}>
        <Checkbox
          style={{ width: 65 }}
          label={formatMessage({ id: 'radiology.search.urgentOnly' })}
        />
      </Form.Item>
      {clinicianProfile.userProfile?.role?.clinicRoleFK ===
        CLINICAL_ROLE.RADIOGRAPHER && (
        <Form.Item name='isMyPatientOnly' style={{ alignSelf: 'flex-end' }}>
          <Checkbox
            style={{ width: 95 }}
            label={formatMessage({ id: 'radiology.search.myPatientOnly' })}
          />
        </Form.Item>
      )}
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
