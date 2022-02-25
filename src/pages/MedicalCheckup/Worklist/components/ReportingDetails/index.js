import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import Banner from '@/pages/PatientDashboard/Banner'
import { LoadingWrapper } from '@/components/_medisys'
import SummaryComment from './SummaryComment'
import TestResult from './TestResult'
import ReportHistory from './ReportHistory'
import { Button } from 'antd'
import { Link, history } from 'umi'
import {
  GridContainer,
  GridItem,
  SizeContainer,
  CommonModal,
} from '@/components'

const styles = theme => ({
  commentContainer: {
    '& > div:last-child': {
      //float: 'right',
      visibility: 'hidden',
    },
    '&:hover': {
      '& > div:last-child': {
        visibility: 'visible',
      },
    },
  },
})

const ReportingDetails = props => {
  const {
    loading,
    patient,
    medicalCheckupReportingDetails,
    dispatch,
    user,
    onClose = () => {},
  } = props
  const height = window.innerHeight
  const banner = document.getElementById('patientBanner')
  const contentHeight = (height || 0) - (banner?.offsetHeight || 0) - 105
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [showReportHistory, setShowReportHistory] = useState(false)

  const generateReport = reportType => {
    dispatch({
      type: 'medicalCheckupReportingDetails/generateReport',
      payload: {
        medicalCheckupWorkitemFK: medicalCheckupReportingDetails.entity.id,
        reportType,
      },
    }).then(r => {
      refreshMedicalCheckup()
    })
  }

  const toggleReportHistory = () => {
    const target = !showReportHistory
    setShowReportHistory(target)
  }

  const querySummaryCommentHistory = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/querySummaryCommentHistory',
      payload: {
        apiCriteria: {
          patientProfileFK: medicalCheckupReportingDetails.patientID,
          visitFK: medicalCheckupReportingDetails.visitID,
        },
      },
    })
  }

  const queryIndividualCommentHistory = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/queryIndividualCommentHistory',
      payload: {
        apiCriteria: {
          patientProfileFK: medicalCheckupReportingDetails.patientID,
          visitFK: medicalCheckupReportingDetails.visitID,
        },
      },
    })
  }

  const refreshMedicalCheckup = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/query',
      payload: {
        id: medicalCheckupReportingDetails.medicalCheckupWorkitemId,
      },
    })
  }
  return (
    <div>
      <LoadingWrapper loading={loading.models.medicalCheckupReportingDetails}>
        <div style={{ marginTop: '-20px' }}>
          <Banner
            from='MedicalCheckup'
            patientInfo={patient}
            editingOrder={false}
            activePreOrderItems={[]}
            isRetail={false}
          />
        </div>
        <SizeContainer size='sm'>
          <div
            style={{
              border: '1px solid #CCCCCC',

              backgroundColor: 'white',
            }}
          >
            <GridContainer style={{ height: contentHeight }}>
              <GridItem md={7} style={{ padding: 0 }}>
                <TestResult
                  {...props}
                  height={contentHeight}
                  selectedLanguage={selectedLanguage}
                  querySummaryCommentHistory={querySummaryCommentHistory}
                  queryIndividualCommentHistory={queryIndividualCommentHistory}
                  refreshMedicalCheckup={refreshMedicalCheckup}
                />
              </GridItem>
              <GridItem md={5} style={{ padding: 0 }}>
                <SummaryComment
                  {...props}
                  height={contentHeight}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  querySummaryCommentHistory={querySummaryCommentHistory}
                  queryIndividualCommentHistory={queryIndividualCommentHistory}
                  refreshMedicalCheckup={refreshMedicalCheckup}
                />
              </GridItem>
            </GridContainer>
            <div
              style={{
                position: 'relative',
                padding: '0px 8px',
                margin: '10px 0px',
              }}
            >
              <Link>
                <span
                  style={{
                    display: 'block',
                    textDecoration: 'underline',
                  }}
                  onClick={e => {
                    e.preventDefault()
                    toggleReportHistory()
                  }}
                >
                  {`Report History (${medicalCheckupReportingDetails.entity
                    ?.medicalCheckupReport?.length || 0})`}
                </span>
              </Link>
              <div style={{ position: 'absolute', right: 3, top: 0 }}>
                <Button
                  size='small'
                  type='danger'
                  style={{ margin: '0px 5px' }}
                  onClick={onClose}
                >
                  Back To List
                </Button>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0px 5px' }}
                  onClick={() => {
                    generateReport('Temporary Report')
                  }}
                >
                  Generate Temporary Report
                </Button>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0px 5px' }}
                  onClick={() => {
                    generateReport('Final Report')
                  }}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </SizeContainer>
      </LoadingWrapper>
      <CommonModal
        open={showReportHistory}
        title='Report History'
        onClose={toggleReportHistory}
        onConfirm={toggleReportHistory}
        maxWidth='md'
        observe='ReportHistory'
        overrideLoading
      >
        <ReportHistory />
      </CommonModal>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ patient, loading, medicalCheckupReportingDetails, user }) => ({
    patient: patient.entity || {},
    loading,
    medicalCheckupReportingDetails,
    user,
  })),
)(ReportingDetails)
