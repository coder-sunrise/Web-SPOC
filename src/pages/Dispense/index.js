import React, { PureComponent } from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, SizeContainer, NumberInput } from '@/components'
// sub component
import Banner from '@/pages/PatientDashboard/Banner'
// utils
import { LoadingWrapper } from '@/components/_medisys'
import Main from './Main'
import EditOrder from './EditOrder'
import style from './style'
import { VISIT_TYPE } from '@/utils/constants'
import { getOrdersData } from '@/pages/Consultation/utils'

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
    forms,
    codetable,
    user,
  }) => ({
    loading,
    dispense,
    visitRegistration,
    consultation,
    consultationDocument,
    orders,
    patient: patient.entity || {},
    clinicSettings,
    forms,
    codetable,
    user,
  }),
)
class Dispense extends PureComponent {
  constructor(props) {
    super(props)
    this.getCodeTables()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({
      type: 'orders/reset',
    })
    // reset dispense screen load count
    dispatch({
      type: 'dispense/updateState',
      payload: {
        loadCount: 0,
        shouldRefreshOrder: false,
        entity: null,
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

  getCodeTables = () => {
    const { dispatch } = this.props
    Promise.all([
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'inventoryconsumable',
          force: true,
          temp: true,
        },
      }),
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'ctservice',
          force: true,
          temp: true,
        },
      }),
    ]).then(r => {
      dispatch({
        type: 'dispense/updateState',
        payload: {
          queryCodeTablesDone: true,
        },
      })
    })
  }

  render() {
    const {
      classes,
      dispense,
      loading,
      patient,
      orders,
      visitRegistration,
    } = this.props
    const { editingOrder } = dispense
    const { rows } = orders
    const { entity = {} } = visitRegistration
    const { visit = {} } = entity

    return (
      <div
        className={classes.root}
        style={{
          backgroundColor: 'white',
          marginBottom: 0,
          paddingBottom: 8,
        }}
      >
        <LoadingWrapper loading={loading.models.dispense}>
          <Banner
            from='Dispense'
            editingOrder={
              editingOrder || visit.visitPurposeFK === VISIT_TYPE.OTC
            }
            extraCmt={this.getExtraComponent}
            isRetail={visit.visitPurposeFK === VISIT_TYPE.OTC}
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
