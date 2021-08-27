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
    title: 'Dispensed',
    workitems: []
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
      const worklist = entity.list.filter(w => w.patientReferenceNo.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0
        || w.patientAccountNo.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0
        || w.name.toUpperCase().indexOf(filterValue.toUpperCase()) >= 0).map(w => ({
        ...w,
        status: PharmacyWorkitemStatus[w.statusFK],
      }))

      const mapped = columnsTemplate.map(item => ({
        ...item,
        workitems: worklist.filter(w => w.status === item.title),
      }))

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
    (e) => {
      setFilterValue(e.target.value)
    },
    100,
    {
      leading: true,
      trailing: false,
    },
  )
  return (
    <div style={{ position: 'relative', height: '100%', }}>
      <ProCard
        style={{
          height: '100%',
        }}
        gutter={[16, 16]}
        title={<WorklistFilter valueChange={debouncedAction} filterValue={filterValue} />}
      >
        <Worklist columns={columns} worklistType='Pharmacy' />
        <PharmacyDetails refreshClick={refreshClick} />
      </ProCard>

      <div>
        <div style={{ position: 'absolute', top: 25, right: 175, width: 300, textAlign: 'right' }}>
          <p style={{ fontWeight: 500 }}>Now Serving:</p>
          <Tooltip title='1.0(genery)'>
            <p style={{
              color: '#1890f8',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              marginTop: 4
            }}>1.0(genery)</p>
          </Tooltip>
        </div>

        <Tooltip title=''>
          <span
            className='material-icons'
            style={{ color: 'gray', position: 'absolute', top: 22, right: 143, width: 26, height: 26 }}
            onClick={event => {
            }}
          >
            history
          </span>
        </Tooltip>

        <div style={{ position: 'absolute', top: 25, right: 50 }}>
          <p style={{ fontWeight: 500 }}>Last Refresh:</p>
          <p style={{ color: '#1890f8', marginTop: 4 }}> {refreshDate.format('HH:mm')}</p>
        </div>

        <Button color='primary' justIcon
          style={{ position: 'absolute', top: 22, right: 10, width: 26, height: 26 }}
          onClick={refreshClick}><Refresh /></Button>
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