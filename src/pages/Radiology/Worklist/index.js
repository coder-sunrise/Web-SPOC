import React, { Fragment, useState, useEffect, useContext } from 'react'
import ProCard from '@ant-design/pro-card'
import { compose } from 'redux'
import { useSelector, useDispatch, connect } from 'dva'
import {
  RADIOLOGY_WORKITEM_STATUS_TITLE,
  RADIOLOGY_WORKITEM_STATUS,
  RADIOLOGY_WORKLIST_STATUS_COLOR,
} from '@/utils/constants'
import _ from 'lodash'
import { CommonModal } from '@/components'
import RadiologyDetails from './Details'
import { Worklist, WorklistFilter, StatusPanel } from '../Components'
import WorklistContext, { WorklistContextProvider } from './WorklistContext'

const columnsTemplate = [
  {
    backgroundColor:
      RADIOLOGY_WORKLIST_STATUS_COLOR[RADIOLOGY_WORKITEM_STATUS.NEW],
    title: 'New',
    workitems: [],
  },
  {
    backgroundColor:
      RADIOLOGY_WORKLIST_STATUS_COLOR[RADIOLOGY_WORKITEM_STATUS.INPROGRESS],
    title: 'In Progress',
    workitems: [],
  },
  {
    backgroundColor:
      RADIOLOGY_WORKLIST_STATUS_COLOR[
        RADIOLOGY_WORKITEM_STATUS.MODALITYCOMPLETED
      ],
    title: 'Modality Completed',
    workitems: [],
  },
  {
    backgroundColor:
      RADIOLOGY_WORKLIST_STATUS_COLOR[RADIOLOGY_WORKITEM_STATUS.COMPLETED],
    title: 'Completed',
    workitems: [],
  },
  {
    backgroundColor:
      RADIOLOGY_WORKLIST_STATUS_COLOR[RADIOLOGY_WORKITEM_STATUS.CANCELLED],
    title: 'Cancelled',
    workitems: [],
  },
]

const RadiologyWorklist = props => {
  const dispatch = useDispatch()
  const [columns, setColumns] = useState([])
  const entity = useSelector(s => s.radiologyWorklist)

  useEffect(() => {
    if (entity && entity.list) {
      const worklist = entity.list.map(w => ({
        ...w,
        status: RADIOLOGY_WORKITEM_STATUS_TITLE[w.statusFK],
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
      load
      title={
        <div style={{ display: 'flex', alignItems: 'end', paddingBottom: 8 }}>
          <WorklistFilter />
        </div>
      }
      extra={<StatusPanel />}
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
