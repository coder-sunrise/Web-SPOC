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
import Banner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from './DispenseDetails'
import Main from './Main'
import EditOrder from './EditOrder'

import style from './style'
// utils
import { getAppendUrl } from '@/utils/utils'
// model
@connect(({ dispense, visitRegistration, consultation }) => ({
  dispense,
  visitRegistration,
  consultation,
}))
class Dispense extends Component {
  state = {
    editingOrder: false,
  }

  getExtraComponent = () => {
    return <div>test</div>
  }

  render () {
    const { classes, dispense } = this.props
    const { editingOrder } = dispense
    return (
      <div className={classes.root}>
        <Banner
          style={{}}
          patientInfo={dispense.patientInfo}
          extraCmt={this.getExtraComponent()}
        />
        {!editingOrder ? (
          <Main {...this.props} />
        ) : (
          <EditOrder {...this.props} />
        )}
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
