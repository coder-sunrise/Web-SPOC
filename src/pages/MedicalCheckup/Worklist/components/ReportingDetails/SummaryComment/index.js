import React, { useState, useEffect } from 'react'
import { Link } from 'umi'
import { useDispatch } from 'dva'
import moment from 'moment'
import {
  CodeSelect,
  GridContainer,
  GridItem,
  IconButton,
  CommonModal,
  Tabs,
  Switch,
  dateFormatLong,
} from '@/components'
import { Badge, Button, Table } from 'antd'
import { TranslateOutlined } from '@material-ui/icons'
import { Divider } from '@material-ui/core'
import { DeleteFilled, EditFilled, CopyOutlined } from '@ant-design/icons'
import customtyles from '../../Style.less'
import CommentDetails from './SummaryCommentDetails'
import CommentVerification from '../CommentVerification'

const SummaryComment = props => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    height,
    medicalCheckupReportingDetails,
  } = props
  const [showVerification, setShowVerification] = useState(false)
  const [commentOption, setCommentOption] = useState([])
  const dispatch = useDispatch()
  const showCommentVerification = () => {
    toggleCommentVerification()
  }
  const toggleCommentVerification = () => {
    const target = !showVerification
    setShowVerification(target)
  }
  useEffect(() => {
    if (
      medicalCheckupReportingDetails.patientID &&
      medicalCheckupReportingDetails.visitID
    ) {
      querySummaryCommentHistory(
        medicalCheckupReportingDetails.patientID,
        medicalCheckupReportingDetails.visitID,
      )
    }
  }, [
    medicalCheckupReportingDetails.visitID,
    medicalCheckupReportingDetails.patientID,
  ])
  const querySummaryCommentHistory = (patientProfileFK, visitFK) => {
    dispatch({
      type: 'medicalCheckupReportingDetails/querySummaryCommentHistory',
      payload: {
        apiCriteria: { patientProfileFK, visitFK },
      },
    }).then(response => {
      if (response && response.status === '200') {
        setData(response.data.data)
      }
    })
  }
  const setData = summaryComment => {
    const data = _.orderBy(summaryComment, ['visitDate'], ['desc'])
    let options = []
    data.forEach((item, index) => {
      const commentList = item.summaryComments || []
      options.push({
        id: index,
        name:
          index === 0
            ? 'Current'
            : moment(item.visitDate).format(dateFormatLong),
        content: (
          <Table
            size='small'
            bordered
            pagination={false}
            dataSource={commentList}
            columns={[
              {
                dataIndex: 'comment',
                title: <div style={{ padding: 4 }}>Comment</div>,
                render: (text, row) => {
                  return (
                    <div
                      style={{
                        position: 'relative',
                        padding: '4px 20px 4px 4px',
                      }}
                    >
                      <div>{row.comment}</div>
                      <div
                        style={{ position: 'absolute', right: '-8px', top: 0 }}
                      >
                        <Tooltip title='Copy Comment'>
                          <IconButton size='small' color='primary'>
                            <CopyOutlined />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  )
                },
              },
              {
                dataIndex: 'action',
                title: <div style={{ padding: 4 }}> Action</div>,
                align: 'center',
                width: 80,
                render: () => {
                  return (
                    <div style={{ padding: 4 }}>
                      <Tooltip title='Edit Summary Comment'>
                        <Button
                          size='small'
                          type='primary'
                          style={{ marginRight: 5 }}
                          icon={<EditFilled />}
                        ></Button>
                      </Tooltip>
                      <Tooltip title='Delete Summary Comment'>
                        <Button
                          size='small'
                          type='danger'
                          style={{ marginRight: 5 }}
                          icon={<DeleteFilled />}
                        ></Button>
                      </Tooltip>
                    </div>
                  )
                },
              },
            ]}
            scroll={{ y: height - 320 }}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? customtyles.once : customtyles.two
            }}
            className={customtyles.table}
          ></Table>
        ),
      })
    })
    setCommentOption(options)
  }
  return (
    <div
      style={{
        border: '1px solid #CCCCCC',
        height,
      }}
    >
      <div
        style={{
          backgroundColor: '#CCCC',
          position: 'relative',
          padding: '8px',
        }}
      >
        <div style={{ position: 'relative' }}>
          <span style={{ fontWeight: 'bold' }}>Summary Comment</span>
          <Badge
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
            }}
            size='small'
            onClick={showCommentVerification}
            count={1}
          >
            <IconButton
              style={{
                color: 'white',
                backgroundColor: '#4255bd',
                marginLeft: 8,
              }}
            >
              <TranslateOutlined style={{ width: 16, height: 16 }} />
            </IconButton>
          </Badge>
          <Link style={{ display: 'inline-block', marginLeft: 8 }}>
            <span
              style={{
                display: 'block',
                textDecoration: 'underline',
              }}
              onClick={e => {
                //this.openNonClaimableHistory()
              }}
            >
              Mark AS Comments Done
            </span>
          </Link>
        </div>

        <div style={{ position: 'absolute', right: 8, top: 4 }}>Doctor:</div>
      </div>
      <div style={{ height: height - 230 }}>
        <Tabs
          options={commentOption}
          tabBarStyle={{ paddingRight: 8 }}
          tabBarExtraContent={
            <Switch
              checkedChildren='EN'
              checkedValue='EN'
              unCheckedChildren='JP'
              unCheckedValue='JP'
              label=''
              value={selectedLanguage}
              onChange={setSelectedLanguage}
            />
          }
        />
      </div>
      <Divider style={{ marginTop: 4 }} />
      <div>
        <CommentDetails />
      </div>
      <CommonModal
        open={showVerification}
        title='Comment Verification'
        onClose={toggleCommentVerification}
        onConfirm={toggleCommentVerification}
        maxWidth='lg'
        observe='CommentVerification'
        overrideLoading
      >
        <CommentVerification />
      </CommonModal>
    </div>
  )
}
export default SummaryComment
