import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { useSelector, useDispatch, connect } from 'dva'
import { RadiologyWorkitemStatus } from '@/utils/constants'
import _ from 'lodash'
import { CommonModal } from '@/components'
import RadiologyDetails from './Details'
import { Worklist, WorklistFilter, StatusPanel } from '../Components'
import WorklistContext, { WorklistContextProvider } from './WorklistContext'

const columnsTemplate = [
  {
    backgroundColor: '#009933',
    title: 'New',
    workitems: [],
  },
  {
    backgroundColor: '#960',
    title: 'In Progress',
    workitems: [],
  },
  {
    backgroundColor: '#099',
    title: 'Modality Completed',
    workitems: [],
  },
  { backgroundColor: '#366', title: 'Completed', workitems: [] },
  {
    backgroundColor: '#797979',
    title: 'Cancelled',
    workitems: [],
  },
]

const RadiologyWorklist = props => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState([])
  const entity = useSelector(s => s.radiologyWorklist)

  useEffect(() => {
    dispatch({
      type: 'radiologyWorklist/query',
    })
  }, [])

  useEffect(() => {
    if (entity && entity.list) {
      const worklist = entity.list.map(w => ({
        ...w,
        status: RadiologyWorkitemStatus[w.statusFK],
      }))

      const mapped = columnsTemplate.map(item => ({
        ...item,
        workitems: worklist.filter(w => w.status === item.title),
      }))

      setColumns(mapped)
    }
  }, [entity])

  return (
    <ProCard
      style={{
        height: '100%',
      }}
      gutter={[16, 16]}
      title={
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <WorklistFilter />
          <StatusPanel />
        </div>
      }
    >
      <Worklist columns={columns} />
      <RadiologyDetails {...props} />
    </ProCard>
  )
}

const RadiologyWorklistWithProvider = props => (
  <WorklistContextProvider>
    <RadiologyWorklist {...props}></RadiologyWorklist>
  </WorklistContextProvider>
)

export default RadiologyWorklistWithProvider
