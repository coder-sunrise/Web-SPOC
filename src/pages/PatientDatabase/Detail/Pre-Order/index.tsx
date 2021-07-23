
import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Tabs } from '@/components'
import PendingPreOrder from './pending'
import HistoryPreOrder from './history'

interface IPreOrderProps {
  patient: any
}

const PreOrder: React.FC<IPreOrderProps> = (props) => {
  const { patient,dispatch } = props
  const { entity} = patient

  const [activeTab, setActiveTab] = useState<string>('1')

  const GetTabOptions = () => {
    const tabs = [
      {
        id: '1',
        name: 'Pending',
        content: <PendingPreOrder {...props} />,
      },
      {
        id: '2',
        name: 'History',
        content: <HistoryPreOrder {...props} />,
      },
    ]
    return tabs
  }
  useEffect(() => {

  }, [patient.entity])

  useEffect(() => {
    dispatch({
        type: 'patientPreOrderItem/query',
        payload: {
          patientProfileFK: entity.id,
          pagesize: 9999,
        },
      })
  }, [])

  return <Tabs
    activeKey={activeTab}
    onChange={(e: string) => setActiveTab(e)}
    options={GetTabOptions()}
  />
}

export default connect(({patientPreOrderItem}) => {
  return {patientPreOrderItem,}
})(PreOrder)