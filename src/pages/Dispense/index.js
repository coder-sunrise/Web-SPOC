import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, SizeContainer, NumberInput } from '@/components'
// sub component
import Banner from '@/pages/PatientDashboard/Banner'
import Main from './Main'
import EditOrder from './EditOrder'

import style from './style'
// utils
import { LoadingWrapper } from '@/components/_medisys'

@connect(
  ({
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient,
    clinicSettings,
    loading,
  }) => ({
    loading,
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient: patient.entity,
    clinicSettings,
  }),
)
class Dispense extends PureComponent {
  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch({
      type: 'orders/reset',
    })
    // reset dispense screen load count
    dispatch({
      type: 'dispense/updateState',
      payload: {
        loadCount: 0,
      },
    })
  }

  getExtraComponent = () => {
    const { dispense, orders } = this.props
    const { totalWithGST, editingOrder } = dispense

    if (!editingOrder) return null
    let amount = 0
    if (editingOrder) {
      const { summary } = orders
      if (summary) {
        amount = summary.totalWithGST
      }
    } else {
      amount = totalWithGST
    }
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
            <NumberInput text currency value={amount} />
          </span>
        </h4>
      </GridContainer>
    )
  }

  render () {
    const { classes, dispense, loading } = this.props
    const { editingOrder } = dispense
    return (
      <div className={classes.root}>
        <LoadingWrapper loading={loading.models.dispense}>
          <Banner
            patientInfo={dispense.patientInfo}
            extraCmt={this.getExtraComponent()}
          />
          <SizeContainer size='sm'>
            <React.Fragment>
              {!editingOrder ? (
                <Main {...this.props} />
              ) : (
                <EditOrder {...this.props} />
              )}
            </React.Fragment>
          </SizeContainer>
        </LoadingWrapper>
      </div>
    )
  }
}

export default withStyles(style, { name: 'DispenseIndex' })(Dispense)
