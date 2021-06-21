
import { Breadcrumb } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { useIntl, Link } from 'umi'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles } from '@material-ui/styles'
import { Tabs } from '@/components'
import PendingPreOrder from './pending'
import HistoryPreOrder from './history'

interface IPreOrderProps {
  patient: any
}

// const styles = (theme: Theme) => ({
//   breadcrumbtext: {
//     fontSize: '18px',
//     color: 'black',
//   },
//   breadcrumblink: {
//     fontSize: '18px',
//     color: 'black',
//     '&:hover': {
//       color: '#4255bd',
//     },
//   },
// })

const PreOrder: React.FC<IPreOrderProps> = (props) => {
  const { patient } = props
  const { pathname } = window.location
  const { formatMessage } = useIntl()


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

    // console.log(patient)

  }, [patient.entity])

  return <Tabs
    activeKey={activeTab}
    onChange={(e: string) => setActiveTab(e)}
    options={GetTabOptions()}
  />
}

export default PreOrder
// export default withStyles(styles)(PreOrder)