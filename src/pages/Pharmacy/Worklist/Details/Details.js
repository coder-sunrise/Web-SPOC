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

const styles = theme => ({
  ...style,
  contentPanel: {
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
})

const Details = props => {
  const { patient, classes, pharmacyDetails, dispatch } = props
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
    }),
  ),
)(Details)
