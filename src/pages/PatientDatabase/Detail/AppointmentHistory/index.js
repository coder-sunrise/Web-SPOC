import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles } from '@material-ui/core'

import schemesModal from '../models/schemes'
import payersModal from '../models/payers'

import { CardContainer, CommonHeader, GridContainer, GridItem, CommonTableGrid2 } from '@/components'



window.g_app.replaceModel(schemesModal)
window.g_app.replaceModel(payersModal)

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 'calc(100vh - 80px)',
  },
})

@connect(({ schemes, payers }) => {
  return ({
    schemes,
    payers,
  })
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
    ]
  }

  componentDidMount() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  onReset() {
    console.log('Schemes-onReset', this)
  }

  resize() {
    if (this.divElement) {
      const height = this.divElement.clientHeight
      if (height > 0) {
        this.setState({ height: height > 0 ? height / 2 - 144 : 300 })
      }
    }
  }

  render() {
    const { classes, schemes, payers, dispatch } = this.props
    const { height } = this.state
    let list = []
    return (
      <CardContainer title={this.titleComponent} hideHeader>
        <GridContainer
          alignItems='flex-start'>
          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} >
            Previous Appointment
  </h4></GridItem>
          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <CommonTableGrid2
              rows={list}
              {...this.tableParas}
            />
          </GridItem>
          <GridItem xs md={12}>  <h4 className={classes.cardIconTitle} style={{ marginTop: 20 }}>
            Current & Future Appintment
  </h4></GridItem>
          <GridItem xs md={12} style={{ marginTop: 8 }}>
            <CommonTableGrid2
              rows={list}
              {...this.tableParas}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(AppointmentHistory)

