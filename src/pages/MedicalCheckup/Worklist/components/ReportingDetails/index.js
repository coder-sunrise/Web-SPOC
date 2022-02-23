import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core'
import Banner from '@/pages/PatientDashboard/Banner'
import { LoadingWrapper } from '@/components/_medisys'
import SummaryComment from './SummaryComment'
import TestResult from './TestResult'
import { Button } from 'antd'
import { Link, history } from 'umi'
import { GridContainer, GridItem, SizeContainer } from '@/components'

const styles = theme => ({})

const ReportingDetails = props => {
  const { loading, patient, medicalCheckupReportingDetails, dispatch } = props
  const height = window.innerHeight
  const banner = document.getElementById('patientBanner')
  const contentHeight = (height || 0) - (banner?.offsetHeight || 0) - 105
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  return (
    <div>
      <LoadingWrapper loading={loading.models.medicalCheckupReportingDetails}>
        <Banner
          from='MedicalCheckup'
          patientInfo={patient}
          editingOrder={false}
          activePreOrderItems={[]}
          isRetail={false}
        />
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
                />
              </GridItem>
              <GridItem md={5} style={{ padding: 0 }}>
                <SummaryComment
                  {...props}
                  height={contentHeight}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
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
                    //this.openNonClaimableHistory()
                  }}
                >
                  {`Report History (${2})`}
                </span>
              </Link>
              <div style={{ position: 'absolute', right: 3, top: 0 }}>
                <Button
                  size='small'
                  type='danger'
                  style={{ margin: '0px 5px' }}
                  onClick={e => {
                    dispatch({
                      type: 'medicalCheckupReportingDetails/updateState',
                      payload: {
                        visitID: undefined,
                        patientID: undefined,
                        medicalCheckupWorkitemId: undefined,
                        individualCommentEntity: undefined,
                      },
                    })
                    history.push(`/medicalcheckup/worklist`)
                  }}
                >
                  Back To List
                </Button>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0px 5px' }}
                >
                  Generate Temporary Report
                </Button>
                <Button
                  size='small'
                  type='primary'
                  style={{ margin: '0px 5px' }}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </SizeContainer>
      </LoadingWrapper>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ patient, loading, medicalCheckupReportingDetails }) => ({
    patient: patient.entity || {},
    loading,
    medicalCheckupReportingDetails,
  })),
)(ReportingDetails)
