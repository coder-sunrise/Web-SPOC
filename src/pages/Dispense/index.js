import React, { Component } from 'react'
import router from 'umi/router'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Print from '@material-ui/icons/Print'
// common component
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  NumberInput,
} from '@/components'
// sub component
import Banner from '@/pages/PatientDashboard/Banner'
import DispenseDetails from './DispenseDetails'
import Main from './Main'
import EditOrder from './EditOrder'

import style from './style'
// utils
import { getAppendUrl } from '@/utils/utils'
// model
@connect(
  ({
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient,
  }) => ({
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient: patient.entity,
  }),
)
class Dispense extends Component {
  getExtraComponent = () => {
    const { classes, dispense, values } = this.props
    const { entity, totalWithGST } = dispense
    return (
      <GridContainer
        // className={classes.actionPanel}
        direction='column'
        justify='space-evenly'
        alignItems='center'
      >
        <h4 style={{ position: 'relative', marginTop: 0 }}>
          Total Invoice
          <span>
            &nbsp;:&nbsp;
            <NumberInput
              text
              currency
              value={totalWithGST || entity.invoice.invoiceTotalAftGST}
            />
          </span>
        </h4>
      </GridContainer>
    )
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
        <SizeContainer size='sm'>
          {!editingOrder ? (
            <Main {...this.props} />
          ) : (
            <EditOrder {...this.props} />
          )}
        </SizeContainer>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
