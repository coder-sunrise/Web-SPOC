
import React, { useState, useRef, useEffect } from 'react'
import { useIntl, Link } from 'umi'
import { Tabs } from '@/components'
import PendingPreOrder from './pending'
import HistoryPreOrder from './history'

interface IPreOrderProps {
  patient: any
}

const PreOrder: React.FC<IPreOrderProps> = (props) => {
  const { patient } = props

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
    // return tabs.filter((f) => checkAccessRight(f.authority))
  }

  useEffect(() => {

  }, [patient.entity])

  return <Tabs
    activeKey={activeTab}
    onChange={(e: string) => setActiveTab(e)}
    options={GetTabOptions()}
  />
}

export default PreOrder