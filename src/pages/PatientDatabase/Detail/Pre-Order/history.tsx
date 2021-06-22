
import { Breadcrumb } from 'antd'
import React, { useState, useRef } from 'react'
import { useIntl, Link } from 'umi'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles } from '@material-ui/styles'
import { Tabs } from '@/components'

interface IHistoryPreOrderProps {

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

const HistoryPreOrder: React.FC<IHistoryPreOrderProps> = (props) => {
  // const { breadcrumb, classes } = props
  const { formatMessage } = useIntl()

  return <></>
}

export default HistoryPreOrder
// export default withStyles(styles)(PreOrder)