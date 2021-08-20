import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { useSelector, useDispatch, connect } from 'dva'
import { PharmacyWorkitemStatus } from '@/utils/constants'
import Refresh from '@material-ui/icons/Refresh'
import moment from 'moment'
import _ from 'lodash'
import { CommonModal, Button } from '@/components'
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

  useEffect(() => {
    dispatch({
      type: 'pharmacyWorklist/query',
    })
  }, [])

  useEffect(() => {
    if (entity && entity.list) {
      const worklist = entity.list.map(w => ({
        ...w,
        status: PharmacyWorkitemStatus[w.statusFK],
      }))

      const mapped = columnsTemplate.map(item => ({
        ...item,
        workitems: worklist.filter(w => w.status === item.title),
      }))

      setColumns(mapped)
    }
  }, [entity])

  return (
    <div style={{ position: 'relative', height: '100%', }}>
    <ProCard
      style={{
        height: '100%',
      }}
      gutter={[16, 16]}
      title={<WorklistFilter />}
    >
        <Worklist columns={columns} worklistType='Pharmacy' />
      <PharmacyDetails />
    </ProCard>
      <div style={{ position: 'absolute', right: 0, top: 50 }}>
        <div style={{ marginRight: 20 }}>
          <span style={{ color: '#1890f8' }}>Last Refresh: {moment().format('HH:mm')}</span>
          <Button color='primary' justIcon style={{ margin: '0px 6px' }}><Refresh /></Button>
          <span style={{ fontWeight: 500 }}>Now Serving:</span><span style={{ color: '#1890f8' }}>1.0(genery)</span></div>
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