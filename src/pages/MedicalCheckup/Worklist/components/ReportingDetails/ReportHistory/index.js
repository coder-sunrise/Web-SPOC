import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import { Table } from 'antd'
import {
  dateFormatLongWithTimeNoSec,
  Button,
  Tooltip,
  Popconfirm,
  CommonModal,
  dateFormatLong,
} from '@/components'
import Print from '@material-ui/icons/Print'
import Undo from '@material-ui/icons/Undo'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
import { MEDICALCHECKUP_REPORTSTATUS } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { commonDataReaderTransform } from '@/utils/utils'
import { getReportContext } from '@/services/report'
import VerifyForm from './VerifyForm'
import customtyles from '../../Style.less'

const styles = theme => ({
  cell: {
    padding: 4,
  },
  toDo: {
    fontSize: 12,
    lineHeight: '17px',
    width: 17,
    textAlign: 'center',
  },
})

const ReportHistory = props => {
  const [showVerifyForm, setShowVerifyForm] = useState(false)
  const [verifyRow, setVerifyRow] = useState(false)

  const {
    patient,
    medicalCheckupReportingDetails,
    dispatch,
    user,
    onClose,
    refreshMedicalCheckup,
    classes,
    handlePreviewReport,
  } = props

  const height = window.innerHeight
  const updateReportStatus = (row, status, verifyRemarks) => {
    dispatch({
      type: 'medicalCheckupReportingDetails/updateReportStatus',
      payload: {
        ...row,
        status,
        verifyRemarks,
      },
    }).then(r => {
      refreshMedicalCheckup()
    })
  }

  const onVerificationSave = value => {
    updateReportStatus(verifyRow, value.status, value.verifyRemarks)
    setShowVerifyForm(false)
  }

  const userProfileFK = user.data.clinicianProfile.userProfile.id

  const printReport = async row => {
    dispatch({
      type: 'medicalCheckupReportingDetails/queryReportData',
      payload: {
        id: row.id,
      },
    }).then(response => {
      if (response && response.status === '200') {
        const {
          patientInfo = [],
          basicExamination = [],
          visualAcuity = [],
          intraocularPressure = [],
          audiometry = [],
          individualComment = [],
          summaryComment = [],
          labTestPanel = [],
          reportContext = [],
          reportingDoctor = [],
        } = response.data
        const printData = {
          PatientInfo: patientInfo.map(p => ({
            ...p,
            patientAge: p.patientAge ? `${p.patientAge} yrs` : '',
            patientDOB: p.patientDOB
              ? moment(p.patientDOB).format(dateFormatLong)
              : '',
            visitDate: p.visitDate
              ? moment(p.visitDate).format(dateFormatLong)
              : '',
            currentDate: p.currentDate
              ? moment(p.currentDate).format(dateFormatLong)
              : '',
            lastDate: p.lastDate
              ? moment(p.lastDate).format(dateFormatLong)
              : '',
            beforeLastDate: p.beforeLastDate
              ? moment(p.beforeLastDate).format(dateFormatLong)
              : '',
          })),
          BasicExamination: basicExamination,
          VisualAcuity: visualAcuity,
          IntraocularPressure: intraocularPressure,
          Audiometry: audiometry,
          IndividualComment: individualComment,
          SummaryComment: summaryComment,
          LabTestPanel: labTestPanel,
          ReportingDoctor: reportingDoctor,
          ReportContext: reportContext.map(o => {
            const {
              customLetterHeadHeight = 0,
              isDisplayCustomLetterHead = false,
              standardHeaderInfoHeight = 0,
              isDisplayStandardHeader = false,
              footerInfoHeight = 0,
              isDisplayFooterInfo = false,
              footerDisclaimerHeight = 0,
              isDisplayFooterInfoDisclaimer = false,
              ...restProps
            } = o
            return {
              customLetterHeadHeight,
              isDisplayCustomLetterHead,
              standardHeaderInfoHeight,
              isDisplayStandardHeader,
              footerInfoHeight,
              isDisplayFooterInfo,
              footerDisclaimerHeight,
              isDisplayFooterInfoDisclaimer,
              ...restProps,
            }
          }),
        }
        const payload = [
          {
            ReportId: 93,
            Copies: 1,
            ReportData: JSON.stringify({
              ...commonDataReaderTransform(printData),
            }),
          },
        ]
        handlePreviewReport(JSON.stringify(payload))
      }
    })
  }
  return (
    <div style={{ padding: '0px 8px' }}>
      <div style={{ height: height - 270 }}>
        <Table
          size='small'
          bordered
          pagination={false}
          dataSource={
            medicalCheckupReportingDetails.entity.medicalCheckupReport
          }
          columns={[
            {
              dataIndex: 'reportType',
              width: 130,
              title: <div className={classes.cell}>Type</div>,
              render: (text, row) => {
                return <div className={classes.cell}>{row.reportType}</div>
              },
            },
            {
              dataIndex: 'versionNumber',
              width: 70,
              align: 'center',
              title: <div className={classes.cell}>Version</div>,
              render: (text, row) => {
                return <div className={classes.cell}>{row.versionNumber}</div>
              },
            },
            {
              dataIndex: 'generateDate',
              width: 130,
              title: <div className={classes.cell}>Generate Date</div>,
              render: (text, row) => {
                return (
                  <div className={classes.cell}>
                    {moment(row.generateDate).format(
                      dateFormatLongWithTimeNoSec,
                    )}
                  </div>
                )
              },
            },
            {
              dataIndex: 'generateByUser',
              title: <div className={classes.cell}>Generate By</div>,
              render: (text, row) => {
                const name = `${
                  hasValue(row.generateByUserTitle) &&
                  row.generateByUserTitle.trim().length
                    ? `${row.generateByUserTitle}.`
                    : ''
                }${row.generateByUser}`
                return <div className={classes.cell}>{name}</div>
              },
            },
            {
              dataIndex: 'verifyDate',
              width: 130,
              title: <div className={classes.cell}>Verify Date</div>,
              render: (text, row) => {
                return (
                  <div className={classes.cell}>
                    {row.verifyDate
                      ? moment(row.verifyDate).format(
                          dateFormatLongWithTimeNoSec,
                        )
                      : ''}
                  </div>
                )
              },
            },
            {
              dataIndex: 'verifyByUser',
              title: <div className={classes.cell}>Verify By</div>,
              render: (text, row) => {
                const name = `${
                  hasValue(row.verifyByUserTitle) &&
                  row.verifyByUserTitle.trim().length
                    ? `${row.verifyByUserTitle}.`
                    : ''
                }${row.verifyByUser || ''}`
                return <div className={classes.cell}>{name}</div>
              },
            },
            {
              dataIndex: 'verifyRemarks',
              title: <div className={classes.cell}>Remarks</div>,
              render: (text, row) => {
                return row.status ===
                  MEDICALCHECKUP_REPORTSTATUS.PENDINGVERIFY ? (
                  ''
                ) : (
                  <div className={classes.cell}>{row.verifyRemarks || '-'}</div>
                )
              },
            },
            {
              dataIndex: 'status',
              width: 130,
              align: 'center',
              title: <div className={classes.cell}>Verification Status</div>,
              render: (text, row) => {
                return (
                  <div className={classes.cell} style={{ fontStyle: 'italic' }}>
                    {row.status}
                  </div>
                )
              },
            },
            {
              dataIndex: 'action',
              width: 80,
              title: <div className={classes.cell}>Action</div>,
              render: (text, row, index) => {
                return (
                  <div className={classes.cell}>
                    {row.status !== MEDICALCHECKUP_REPORTSTATUS.REJECT && (
                      <Tooltip title='Print'>
                        <Button
                          color='primary'
                          size='sm'
                          justIcon
                          onClick={() => printReport(row)}
                        >
                          <Print />
                        </Button>
                      </Tooltip>
                    )}
                    {row.status ===
                      MEDICALCHECKUP_REPORTSTATUS.PENDINGVERIFY && (
                      <Tooltip title='To do'>
                        <Button
                          color='primary'
                          size='sm'
                          justIcon
                          onClick={() => {
                            setVerifyRow(row)
                            setShowVerifyForm(true)
                          }}
                        >
                          <span className={classes.toDo}>TD</span>
                        </Button>
                      </Tooltip>
                    )}
                    {false &&
                      row.status ===
                        MEDICALCHECKUP_REPORTSTATUS.PENDINGVERIFY &&
                      userProfileFK === row.generateByUserFK && (
                        <Popconfirm
                          title='Are you sure?'
                          onConfirm={() => {
                            setTimeout(() => {
                              updateReportStatus(
                                row,
                                MEDICALCHECKUP_REPORTSTATUS.DISCARD,
                              )
                            }, 1)
                          }}
                        >
                          <Tooltip title='Discard'>
                            <Button color='danger' size='sm' justIcon>
                              <Undo />
                            </Button>
                          </Tooltip>
                        </Popconfirm>
                      )}
                  </div>
                )
              },
            },
          ]}
          scroll={{ y: height - 300 }}
          rowClassName={(record, index) => {
            return index % 2 === 0 ? customtyles.once : customtyles.two
          }}
          className={customtyles.table}
        ></Table>
      </div>
      <div style={{ textAlign: 'right', marginTop: 6 }}>
        <Button size='sm' color='danger' onClick={onClose}>
          Close
        </Button>
      </div>
      <CommonModal
        open={showVerifyForm}
        title='Report Verification'
        onClose={() => {
          setShowVerifyForm(false)
        }}
        maxWidth='sm'
        observe='VerifyForm'
      >
        <VerifyForm onVerificationSave={onVerificationSave} />
      </CommonModal>
    </div>
  )
}

export default withWebSocket()(
  compose(
    withStyles(styles),
    connect(({ medicalCheckupReportingDetails, user }) => ({
      medicalCheckupReportingDetails,
      user,
    })),
  )(ReportHistory),
)
