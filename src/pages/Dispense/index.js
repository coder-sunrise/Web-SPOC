import React, { Component } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import { Button, GridContainer, GridItem } from '@/components'
// sub component
// import PatientBanner from './components/PatientBanner'
import PatientBanner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from './DispenseDetails'
import style from './style'
// utils
import { getAppendUrl } from '@/utils/utils'
// model
import model from './models/dispense'

window.g_app.replaceModel(model)

@connect(({ dispense }) => ({ dispense }))
class Dispense extends Component {
  makePayment = () => {
    const { dispatch, dispense } = this.props
    const { patientInfo } = dispense
    dispatch({
      type: 'dispense/closeDispenseModal',
    })
    const parameters = {
      pid: patientInfo.id,
      md2: 'bill',
    }
    router.push(getAppendUrl(parameters, '/reception/queue'))
    // this.props.history.push(`${location.pathname}/billing`)
  }

  render () {
    const { classes, dispense } = this.props

    return (
      <div className={classes.root}>
        <PatientBanner style={{}} patientInfo={dispense.patientInfo} />
        <GridContainer direction='column' className={classes.content}>
          <GridItem justify='flex-end' container>
            <Button color='info' size='sm' disabled>
              <Refresh />
              Refresh
            </Button>
            <Button color='primary' size='sm' disabled>
              <Print />
              Print All Label
            </Button>
            <Button color='primary' size='sm' disabled>
              <Print />
              Print Label
            </Button>
          </GridItem>
          <DispenseDetails />
          <GridItem justify='flex-end' container className={classes.footerRow}>
            <Button color='success' size='sm' disabled>
              Save Dispense
            </Button>
            <Button color='primary' size='sm' disabled>
              Edit Order
            </Button>
            <Button color='primary' size='sm' onClick={this.makePayment}>
              Make Payment
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
