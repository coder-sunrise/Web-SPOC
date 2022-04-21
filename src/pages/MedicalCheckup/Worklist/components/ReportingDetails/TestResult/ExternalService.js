import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import {
  Tooltip,
  GridContainer,
  GridItem,
  dateFormatLongWithTimeNoSec,
  CommonModal,
} from '@/components'
import moment from 'moment'
import { Table, Button } from 'antd'
import { useDispatch } from 'dva'
import { Link } from 'umi'
import { getFileByFileID } from '@/services/file'
import { arrayBufferToBase64 } from '@/components/_medisys/ReportViewer/utils'
import printJS from 'print-js'
import ImagePreviewer from '@/pages/Widgets/AttachmentDocument/FolderContainer/ImagePreviewer'
import customtyles from '../../Style.less'
import { Attachment } from '@/components/_medisys'

const ExternalService = props => {
  const { height, medicalCheckupReportingDetails } = props
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [selectedFile, setSelectedFile] = useState({})
  const [dataSource, setDataSource] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    if (medicalCheckupReportingDetails.visitID) {
      queryExternalService()
    }
  }, [medicalCheckupReportingDetails.visitID])

  const queryExternalService = () => {
    dispatch({
      type: 'medicalCheckupReportingDetails/queryExternalService',
      payload: {
        apiCriteria: {
          visitFK: medicalCheckupReportingDetails.visitID,
        },
      },
    }).then(r => {
      if (r && r.status === '200') setDataSource(r.data.data)
    })
  }

  const onPreview = file => {
    const fileExtension = (file.fileExtension || '').toUpperCase()
    if (fileExtension === 'PDF') {
      getFileByFileID(file.fileIndexFK).then(response => {
        const { data } = response
        const base64Result = arrayBufferToBase64(data)
        printJS({ printable: base64Result, type: 'pdf', base64: true })
      })
    } else if (['JPG', 'JPEG', 'PNG', 'BMP', 'GIF'].includes(fileExtension)) {
      dispatch({
        type: 'imageViewer/updateState',
        payload: {
          attachment: file,
        },
      })
    }
  }
  return (
    <div>
      <Table
        size='small'
        bordered
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            dataIndex: 'serviceName',
            title: <div style={{ padding: 4 }}>Service</div>,
            render: (text, row) => <div style={{ padding: 4 }}>{text}</div>,
          },
          {
            dataIndex: 'serviceCenterName',
            title: <div style={{ padding: 4 }}>Service Center</div>,
            render: (text, row) => <div style={{ padding: 4 }}>{text}</div>,
            width: 180,
          },
          {
            dataIndex: 'result',
            title: <div style={{ padding: 4 }}>Attachment</div>,
            width: 250,
            render: (text, row) => (
              <div style={{ padding: 4 }}>
                {row.labTrackingResults && (
                  <Attachment
                    label='Attachment'
                    attachments={row.labTrackingResults}
                    isReadOnly={true}
                    hideRemarks
                    listOnly={true}
                    simple
                    hiddenDelete
                    fieldName='labTrackingResults'
                  />
                )}
              </div>
            ),
          },
          {
            dataIndex: 'updateDate',
            title: <div style={{ padding: 4 }}>Last Updated Date</div>,
            width: 150,
            render: (text, row) => (
              <div style={{ padding: 4 }}>
                {moment(row.updateDate).format(dateFormatLongWithTimeNoSec)}
              </div>
            ),
          },
          {
            dataIndex: 'status',
            title: <div style={{ padding: 4 }}>Status</div>,
            width: 80,
            render: (text, row) => <div style={{ padding: 4 }}>{text}</div>,
          },
        ]}
        scroll={{ y: height - 80 }}
        rowClassName={(record, index) => {
          return index % 2 === 0 ? customtyles.once : customtyles.two
        }}
        className={customtyles.table}
      ></Table>
    </div>
  )
}
export default ExternalService
