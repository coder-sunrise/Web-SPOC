import React, { useState } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { history } from 'umi'
import { withStyles } from '@material-ui/core'
import { SizeContainer } from '@/components'
import Banner from '@/pages/PatientDashboard/Banner'
import Main from './Main'
import EditOrder from '@/pages/Dispense/EditOrder'
import style from '@/pages/Dispense/style'
import { LoadingWrapper } from '@/components/_medisys'

const styles = theme => ({
  ...style,
  contentPanel: {
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
})

const Details = props => {
  const {
    patient,
    classes,
    pharmacyDetails,
    dispatch,
    loading,
    fromModule,
  } = props
  const [editingOrder, setEditingOrder] = useState(false)
  const closeEditOrder = () => {
    dispatch({
      type: 'pharmacyDetails/query',
      payload: { id: pharmacyDetails.entity.id },
    })
    setEditingOrder(false)
  }
  const banner = document.getElementById('patientBanner')
  const contentHeight = (props.height || 0) - (banner?.offsetHeight || 0)
  return (
    <div>
      <LoadingWrapper
        loading={loading.models.dispense || loading.models.pharmacyDetails}
      >
        <div style={{ padding: 8, marginTop: -20 }}>
          <Banner from='Pharmacy' patientInfo={patient} />
        </div>
        <div className={classes.contentPanel} style={{ height: contentHeight }}>
          <SizeContainer size='sm'>
            <React.Fragment>
              {!editingOrder ? (
                <Main {...props} setEditingOrder={setEditingOrder} />
              ) : (
                <EditOrder
                  from='Pharmacy'
                  {...props}
                  closeEditOrder={closeEditOrder}
                />
              )}
            </React.Fragment>
          </SizeContainer>
        </div>
      </LoadingWrapper>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(
    ({
      patient,
      forms,
      dispense,
      consultation,
      consultationDocument,
      clinicSettings,
      pharmacyDetails,
      orders,
      visitRegistration,
      loading,
    }) => ({
      patient: patient.entity || {},
      forms,
      dispense,
      consultation,
      consultationDocument,
      clinicSettings,
      pharmacyDetails,
      orders,
      visitRegistration,
      loading,
    }),
  ),
)(Details)
