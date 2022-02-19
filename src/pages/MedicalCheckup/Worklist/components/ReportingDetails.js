import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core'
import Banner from '@/pages/PatientDashboard/Banner'
import { LoadingWrapper } from '@/components/_medisys'

const styles = theme => ({})

const ReportingDetails = ({
  loading,
  patient,
  medicalCheckupWorklist,
  dispatch,
  height,
}) => {
  useEffect(() => {
    if (medicalCheckupWorklist.patientProfileFK) {
      dispatch({
        type: 'patient/query',
        payload: {
          id: medicalCheckupWorklist.patientProfileFK,
        },
      })
    }
  }, [medicalCheckupWorklist.patientProfileFK])

  const banner = document.getElementById('patientBanner')
  const contentHeight = (height || 0) - (banner?.offsetHeight || 0)
  return (
    <div>
      <LoadingWrapper loading={loading.models.medicalCheckupWorklist}>
        <div style={{ padding: 8, marginTop: -20 }}>
          <Banner
            from='Pharmacy'
            patientInfo={patient}
            editingOrder={false}
            activePreOrderItems={[]}
            isRetail={false}
          />
        </div>
        <div
          style={{ overflowY: 'scroll', overflowX: 'hidden' }}
          style={{ height: contentHeight }}
        ></div>
      </LoadingWrapper>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ patient, loading, medicalCheckupWorklist }) => ({
    patient: patient.entity || {},
    loading,
    medicalCheckupWorklist,
  })),
)(ReportingDetails)
