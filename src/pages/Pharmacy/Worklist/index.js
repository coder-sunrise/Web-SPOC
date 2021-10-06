import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { Icon } from 'antd'
import { useSelector, useDispatch, connect } from 'dva'
import { PharmacyWorkitemStatus } from '@/utils/constants'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import _ from 'lodash'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import { HistoryOutlined } from '@ant-design/icons'
import { CommonModal, Button, Tooltip } from '@/components'
import { Worklist } from '@/pages/Radiology/Components'
import { WorklistContextProvider } from '@/pages/Radiology/Worklist/WorklistContext'
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
  const [refreshDate, setRefreshDate] = useState(moment())
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    dispatch({
      type: 'pharmacyWorklist/query',
    })
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
          const visitGroupListing = _.orderBy(
            w.visitGroupListing.map(l => {
              const age = l.dob ? calculateAgeFromDOB(l.dob) : 0
              let gender = '-'
              if (l.genderFK === 1) {
                gender = 'F'
              } else if (l.genderFK === 2) {
                gender = 'M'
              }
              return {
                queueNo: l.queueNo,
                name: l.patientName,
                gender,
                age: `${age} ${age > 1 ? 'Yrs' : 'Yr'}`,
                orderQueueNo: parseFloat(l.queueNo)
              }
            }),
            ['orderQueueNo'],
            ['asc'],
          )
          return {
            ...w,
            status: PharmacyWorkitemStatus[w.statusFK],
            visitGroupListing,
          }
        })
      const mapped = columnsTemplate.map(item => {
        let filterItems = worklist.filter(w => w.status === item.title)
        if (item.title === 'Completed') {
          filterItems = _.orderBy(filterItems,
            ['updateDate'],
            ['desc'])
        } else if (item.title === 'New') {
          filterItems = _.orderBy(filterItems,
            ['paymentDate', 'generateDate'],
            ['asc'])
        }
        else {
          filterItems = _.orderBy(filterItems,
            ['paymentDate', 'updateDate'],
            ['asc'])
        }
        return {
          ...item,
          workitems: filterItems,
        }
      })

      setColumns(mapped)
    }
  }, [entity, filterValue])

  const refreshClick = () => {
    dispatch({
      type: 'pharmacyWorklist/query',
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
        <Worklist columns={columns} worklistType='Pharmacy' />
        <PharmacyDetails refreshClick={refreshClick} />
      </ProCard>

      <div>
        <div
          style={{
            position: 'absolute',
            top: 25,
            right: 175,
            width: 300,
            textAlign: 'right',
          }}
        >
          <p style={{ fontWeight: 600 }}>Now Serving:</p>
          <Tooltip title='1.0(genery)'>
            <p
              style={{
                color: '#1890f8',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                marginTop: 4,
              }}
            >
              1.0(genery)
            </p>
          </Tooltip>
        </div>

        <Tooltip title=''>
          <span
            className='material-icons'
            style={{
              color: 'gray',
              position: 'absolute',
              top: 22,
              right: 143,
              width: 26,
              height: 26,
            }}
            onClick={event => { }}
          >
            history
          </span>
        </Tooltip>

        <div style={{ position: 'absolute', top: 25, right: 50 }}>
          <p style={{ fontWeight: 600 }}>Last Refresh:</p>
          <p style={{ color: '#1890f8', marginTop: 4 }}>
            {' '}
            {refreshDate.format('HH:mm')}
          </p>
        </div>

        <Button
          color='primary'
          justIcon
          style={{
            position: 'absolute',
            top: 22,
            right: 10,
            width: 26,
            height: 26,
          }}
          onClick={refreshClick}
        >
          <Refresh />
        </Button>
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
