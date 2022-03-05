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
} from '@/components'
import {
  CheckOutlined,
  PrinterOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import Undo from '@material-ui/icons/Undo'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
import { MEDICALCHECKUP_REPORTSTATUS } from '@/utils/constants'
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
    loading,
    patient,
    medicalCheckupReportingDetails,
    dispatch,
    user,
    onClose,
    refreshMedicalCheckup,
    classes,
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
              title: <div className={classes.cell}>Generate By User</div>,
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
              dataIndex: 'status',
              width: 100,
              title: <div className={classes.cell}>Status</div>,
              render: (text, row) => {
                const verifyDate = row.verifyDate
                  ? moment(row.verifyDate).format(dateFormatLongWithTimeNoSec)
                  : ''
                const verifyUser = `${
                  hasValue(row.verifyByUserTitle) &&
                  row.verifyByUserTitle.trim().length
                    ? `${row.verifyByUserTitle}.`
                    : ''
                }${row.verifyByUser || ''}`
                if (row.status === MEDICALCHECKUP_REPORTSTATUS.VERIFIED) {
                  return (
                    <Tooltip
                      title={
                        <div>
                          <div>Verified Date: {verifyDate}</div>
                          <div>Verified By: {verifyUser}</div>
                          <div>Remarks: {row.verifyRemarks}</div>
                        </div>
                      }
                    >
                      <div className={classes.cell}>{row.status}</div>
                    </Tooltip>
                  )
                }
                if (row.status === MEDICALCHECKUP_REPORTSTATUS.REJECT) {
                  return (
                    <Tooltip
                      title={
                        <div>
                          <div>Reject Date: {verifyDate}</div>
                          <div>Reject By: {verifyUser}</div>
                          <div>Remarks: {row.verifyRemarks}</div>
                        </div>
                      }
                    >
                      <div className={classes.cell}>{row.status}</div>
                    </Tooltip>
                  )
                }
                return <div className={classes.cell}>{row.status}</div>
              },
            },
            {
              dataIndex: 'action',
              width: 111,
              title: <div className={classes.cell}>Action</div>,
              render: (text, row, index) => {
                return (
                  <div className={classes.cell}>
                    <Tooltip title='Print'>
                      <Button color='primary' size='sm' justIcon>
                        <PrinterOutlined />
                      </Button>
                    </Tooltip>
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
                    {row.status === MEDICALCHECKUP_REPORTSTATUS.PENDINGVERIFY &&
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
      <div style={{ textAlign: 'right' }}>
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
        overrideLoading
      >
        <VerifyForm onVerificationSave={onVerificationSave} />
      </CommonModal>
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ medicalCheckupReportingDetails, user }) => ({
    medicalCheckupReportingDetails,
    user,
  })),
)(ReportHistory)
