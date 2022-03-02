import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import { Table } from 'antd'
import { dateFormatLongWithTimeNoSec, Button, Tooltip } from '@/components'
import {
  CheckOutlined,
  PrinterOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons'
import { hasValue } from '@/pages/Widgets/PatientHistory/config'
import { MEDICALCHECKUP_REPORTSTATUS } from '@/utils/constants'
import customtyles from '../Style.less'

const styles = theme => ({})

const ReportHistory = props => {
  const {
    loading,
    patient,
    medicalCheckupReportingDetails,
    dispatch,
    user,
    onClose,
    refreshMedicalCheckup,
  } = props
  const height = window.innerHeight
  const verifyReport = row => {
    dispatch({
      type: 'medicalCheckupReportingDetails/verifyReport',
      payload: {
        ...row,
      },
    }).then(r => {
      refreshMedicalCheckup()
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
              title: <div style={{ padding: 4 }}>Type</div>,
              render: (text, row) => {
                return <div style={{ padding: 4 }}>{row.reportType}</div>
              },
            },
            {
              dataIndex: 'versionNumber',
              width: 70,
              align: 'center',
              title: <div style={{ padding: 4 }}>Version</div>,
              render: (text, row) => {
                return <div style={{ padding: 4 }}>{row.versionNumber}</div>
              },
            },
            {
              dataIndex: 'generateDate',
              width: 130,
              title: <div style={{ padding: 4 }}>Generate Date</div>,
              render: (text, row) => {
                return (
                  <div style={{ padding: 4 }}>
                    {moment(row.generateDate).format(
                      dateFormatLongWithTimeNoSec,
                    )}
                  </div>
                )
              },
            },
            {
              dataIndex: 'generateByUser',
              title: <div style={{ padding: 4 }}>Generate By User</div>,
              render: (text, row) => {
                const name = `${
                  hasValue(row.generateByUserTitle) &&
                  row.generateByUserTitle.trim().length
                    ? `${row.generateByUserTitle}.`
                    : ''
                }${row.generateByUser}`
                return <div style={{ padding: 4 }}>{name}</div>
              },
            },
            {
              dataIndex: 'verifyDate',
              width: 130,
              title: <div style={{ padding: 4 }}>Verify Date</div>,
              render: (text, row) => {
                return (
                  <div style={{ padding: 4 }}>
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
              title: <div style={{ padding: 4 }}>Verify By User</div>,
              render: (text, row) => {
                const name = `${
                  hasValue(row.verifyByUserTitle) &&
                  row.verifyByUserTitle.trim().length
                    ? `${row.verifyByUserTitle}.`
                    : ''
                }${row.verifyByUser || ''}`
                return <div style={{ padding: 4 }}>{name}</div>
              },
            },
            {
              dataIndex: 'action',
              width: 105,
              title: <div style={{ padding: 4 }}>Action</div>,
              render: (text, row, index) => {
                return (
                  <div style={{ padding: 4 }}>
                    {row.status === MEDICALCHECKUP_REPORTSTATUS.VERIFIED && (
                      <Tooltip title='Verified'>
                        <Button color='success' size='sm' justIcon>
                          <CheckOutlined />
                        </Button>
                      </Tooltip>
                    )}
                    {index === 0 &&
                      row.status !== MEDICALCHECKUP_REPORTSTATUS.VERIFIED && (
                        <Tooltip title='To do'>
                          <Button
                            color='primary'
                            size='sm'
                            justIcon
                            onClick={() => {
                              verifyReport(row)
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                lineHeight: '17px',
                                width: 17,
                                textAlign: 'center',
                              }}
                            >
                              TD
                            </span>
                          </Button>
                        </Tooltip>
                      )}
                    <Tooltip title='Print'>
                      <Button color='primary' size='sm' justIcon>
                        <PrinterOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title='Download'>
                      <Button color='primary' size='sm' justIcon>
                        <CloudDownloadOutlined />
                      </Button>
                    </Tooltip>
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
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ medicalCheckupReportingDetails }) => ({
    medicalCheckupReportingDetails,
  })),
)(ReportHistory)
