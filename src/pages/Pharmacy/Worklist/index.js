import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { Icon } from 'antd'
import { useSelector, useDispatch, connect } from 'dva'
import { PharmacyWorkitemStatus } from '@/utils/constants'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import _ from 'lodash'
import { HistoryOutlined } from '@ant-design/icons'
import { CommonModal, Button, Tooltip } from '@/components'
import { Worklist } from '../Components'
import WorklistContext, {
  WorklistContextProvider,
} from '@/pages/Radiology/Worklist/WorklistContext'
import PharmacyDetails from './Details'
import { WorklistFilter } from '../Components'
const columnsTemplate = [
  {
    backgroundColor: '#009933',
    title: 'New',
    workitems: [],
  },
  {
    backgroundColor: '#960',
    title: 'Prepared',
    workitems: [],
  },
  {
    backgroundColor: '#099',
    title: 'Verified',
    workitems: [],
  },
  {
    backgroundColor: '#366',
    title: 'Completed',
    workitems: [],
  },
]

const PharmacyWorklist = () => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState([])
  const entity = useSelector(s => s.pharmacyWorklist)
  const clinicSettings = useSelector(s => s.clinicSettings)
  const [refreshDate, setRefreshDate] = useState(moment())
  const [filterValue, setFilterValue] = useState('')
  const { autoRefreshPharmacyWorklistInterval = 60 } =
    clinicSettings.settings || {}
  const timer = React.useRef(null)
  const { pharmacyQueueCallList = [] } = useContext(WorklistContext)
  useEffect(() => {
    dispatch({
      type: 'pharmacyWorklist/query',
      payload: { pagesize: 9999 },
    })
    stopRefreshTimer()
    startRefreshTimer()
    return () => {
      stopRefreshTimer()
    }
  }, [])

  useEffect(() => {
    if (entity && entity.list) {
      const worklist = entity.list
        .filter(
          w =>
            w.patientReferenceNo
              .toUpperCase()
              .indexOf(filterValue.toUpperCase()) >= 0 ||
            w.patientAccountNo
              .toUpperCase()
              .indexOf(filterValue.toUpperCase()) >= 0 ||
            w.name.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0,
        )
        .map(w => {
          return {
            ...w,
            status: PharmacyWorkitemStatus[w.statusFK],
          }
        })
      const mapped = columnsTemplate.map(item => {
        let filterItems = worklist.filter(w => w.status === item.title)
        if (item.title === 'Completed') {
          filterItems = _.orderBy(
            filterItems,
            ['isOrderUpdate', 'updateDate'],
            ['desc', 'desc'],
          )
        } else if (item.title === 'New') {
          filterItems = _.orderBy(
            filterItems,
            ['paymentDate', 'generateDate'],
            ['asc'],
          )
        } else {
          filterItems = _.orderBy(
            filterItems,
            ['isOrderUpdate', 'paymentDate', 'updateDate'],
            ['desc', 'asc', 'asc'],
          )
        }
        return {
          ...item,
          workitems: filterItems,
        }
      })

      setColumns(mapped)
    }
  }, [entity, filterValue])
  const startRefreshTimer = () => {
    timer.current = setInterval(() => {
      refreshClick()
    }, autoRefreshPharmacyWorklistInterval * 1000)
  }

  const stopRefreshTimer = () => {
    clearInterval(timer.current)
  }

  const refreshClick = () => {
    dispatch({
      type: 'pharmacyWorklist/query',
      payload: { pagesize: 9999 },
    })
    setRefreshDate(moment())
  }

  const debouncedAction = _.debounce(
    e => {
      setFilterValue(e.target.value)
    },
    100,
    {
      leading: true,
      trailing: false,
    },
  )

  let nowServing = undefined
  if (pharmacyQueueCallList.length > 0) {
    nowServing = `${pharmacyQueueCallList?.[0]?.qNo}.0 (${pharmacyQueueCallList?.[0]?.patientName})`
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ProCard
        style={{
          height: '100%',
        }}
        gutter={[16, 16]}
        title={
          <WorklistFilter
            valueChange={debouncedAction}
            filterValue={filterValue}
          />
        }
      >
        <Worklist columns={columns} />
        <PharmacyDetails
          refreshClick={refreshClick}
          startRefreshTimer={startRefreshTimer}
          stopRefreshTimer={stopRefreshTimer}
        />
      </ProCard>

      <div>
        <div
          style={{
            position: 'absolute',
            top: 25,
            right: 150,
            width: 200,
          }}
        >
          <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>Now Serving:</p>
          <Tooltip title={nowServing || '-'}>
            <p
              style={{
                color: '#1890f8',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                marginTop: 4,
              }}
            >
              {nowServing || '-'}
            </p>
          </Tooltip>
        </div>
        <div style={{ position: 'absolute', top: 25, right: 50 }}>
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
              onClick={refreshClick}
            >
              <Refresh />
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}

const PharmacyWorklistWithProvider = props => (
  <WorklistContextProvider>
    <PharmacyWorklist {...props}></PharmacyWorklist>
  </WorklistContextProvider>
)
export default PharmacyWorklistWithProvider
