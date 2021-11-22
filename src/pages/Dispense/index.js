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

  getCodeTables = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventorymedication',
        force: true,
        temp: true,
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventoryvaccination',
        force: true,
        temp: true,
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'inventoryconsumable',
        force: true,
        temp: true,
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
        force: true,
        temp: true,
      },
    })
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationunitofmeasurement',
        force: true,
      },
    })

    dispatch({
      type: 'dispense/updateState',
      payload: {
        queryCodeTablesDone: true,
      },
    })
  }

  render() {
    const { classes, dispense, loading, patient } = this.props
    const { editingOrder } = dispense
    return (
      <div className={classes.root}>
        <LoadingWrapper loading={loading.models.dispense}>
          <Banner
            from='Dispense'
            // activePreOrderItem={patient?.listingPreOrderItem?.filter(item => !item.isDeleted) || []}
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
