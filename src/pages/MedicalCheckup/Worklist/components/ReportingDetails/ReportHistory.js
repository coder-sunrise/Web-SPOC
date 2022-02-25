import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import { compose } from 'redux'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import { Button, Table } from 'antd'
import customtyles from '../Style.less'

const styles = theme => ({})

const ReportHistory = props => {
  const {
    loading,
    patient,
    medicalCheckupReportingDetails,
    dispatch,
    user,
  } = props
  const height = window.innerHeight
  const [selectedRow, setSelectedRow] = useState(undefined)
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
              title: <div style={{ padding: 4 }}>Name</div>,
            },
            {
              dataIndex: 'status',
              title: <div style={{ padding: 4 }}>Status</div>,
            },
            {
              dataIndex: 'versionNumber',
              title: <div style={{ padding: 4 }}>Version Number</div>,
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
        <Button size='samll' type='danger'>
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
