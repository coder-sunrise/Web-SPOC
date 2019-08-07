import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles } from '@material-ui/core'

import {
  CardContainer,
  CommonHeader,
  GridContainer,
  GridItem,
  CommonTableGrid,
} from '@/components'

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@connect(({ schemes, payers }) => {
  return {
    schemes,
    payers,
  }
})
class AppointmentHistory extends PureComponent {
  state = {
    height: 100,
  }

  tableParas = {
    columns: [
      { name: 'Date', title: 'Date' },
      { name: 'Time', title: 'Time' },
      { name: 'Doctor', title: 'Doctor' },
      { name: 'Status', title: 'Status' },
      { name: 'Reason', title: 'Reason' },
      { name: 'Remarks', title: 'Remarks' },
    ],
  }

  componentDidMount () {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize () {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render () {
    const { classes, schemes, payers, dispatch } = this.props
    const { height } = this.state
    let list = []
    return (
      <CardContainer title={this.titleComponent} hideHeader>
        TBD
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AppointmentHistory)
