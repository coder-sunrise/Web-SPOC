import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Tooltip, GridContainer, GridItem, dateFormatLong } from '@/components'
import moment from 'moment'
import { Table, Button } from 'antd'
import { useDispatch } from 'dva'
import customtyles from '../../Style.less'

const ExternalService = props => {
  const { height, medicalCheckupReportingDetails } = props
  const [dataSource, setDataSource] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    if (medicalCheckupReportingDetails.visitID) {
      //queryIndividualCommentHistory()
    }
  }, [medicalCheckupReportingDetails.visitID])
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            dataIndex: 'examinationType',
            title: <div style={{ padding: 4 }}>Service</div>,
            fixed: 'left',
          },
          {
            dataIndex: 'examinationType',
            title: <div style={{ padding: 4 }}>Service Center</div>,
            fixed: 'left',
          },
          {
            dataIndex: 'examinationType',
            title: <div style={{ padding: 4 }}>Attachment</div>,
            fixed: 'left',
            width: 150,
          },
          {
            dataIndex: 'examinationType',
            title: <div style={{ padding: 4 }}>Last Updated Date</div>,
            fixed: 'left',
            width: 150,
          },
          {
            dataIndex: 'examinationType',
            title: <div style={{ padding: 4 }}>Status</div>,
            fixed: 'left',
            width: 80,
          },
        ]}
        scroll={{ y: height - 90 }}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? customtyles.once : customtyles.two
        }}
        className={customtyles.table}
      ></Table>
    </div>
  )
}
export default ExternalService
