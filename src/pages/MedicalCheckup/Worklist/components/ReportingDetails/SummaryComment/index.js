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
  Tooltip,
  Popconfirm,
} from '@/components'
import { Badge, Button, Table } from 'antd'
import { TranslateOutlined } from '@material-ui/icons'
import { Divider } from '@material-ui/core'
import { DeleteFilled, EditFilled, CopyOutlined } from '@ant-design/icons'
import customtyles from '../../Style.less'
import CommentDetails from './SummaryCommentDetails'
import CommentVerification from '../CommentVerification'
import ReportingDoctorTag from '../../ReportingDoctorList'
import { mergeClasses } from '@material-ui/styles'
import { REPORTINGDOCTOR_STATUS } from '@/utils/constants'

const SummaryComment = props => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    height,
    medicalCheckupReportingDetails,
    querySummaryCommentHistory,
    queryIndividualCommentHistory,
    refreshMedicalCheckup,
    user,
  } = props
  const [showVerification, setShowVerification] = useState(false)
  const [commentOption, setCommentOption] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      medicalCheckupReportingDetails.patientID &&
      medicalCheckupReportingDetails.visitID
    ) {
      querySummaryCommentHistory()
    }
  }, [
    medicalCheckupReportingDetails.visitID,
    medicalCheckupReportingDetails.patientID,
  ])

  useEffect(() => {
    setData(medicalCheckupReportingDetails.summaryCommentList)
  }, [selectedLanguage, medicalCheckupReportingDetails.summaryCommentList])

  const showCommentVerification = () => {
    toggleCommentVerification()
  }
  const toggleCommentVerification = () => {
    const target = !showVerification
    setShowVerification(target)
  }

  const confirmCommentVerification = () => {
    querySummaryCommentHistory()
    queryIndividualCommentHistory()
    refreshMedicalCheckup()
    toggleCommentVerification()
  }

  const editComment = row => {
    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        summaryCommentEntity: { ...row },
      },
    })
  }
  const deleteComment = row => {
    dispatch({
      type: 'medicalCheckupReportingDetails/deleteSummaryComment',
      payload: {
        id: row.id,
      },
    }).then(r => {
      if (r) {
        querySummaryCommentHistory()
        refreshMedicalCheckup()
      }
    })
  }

  const setData = queryData => {
    const { classes } = props
    const data = _.orderBy(queryData, ['visitDate'], ['desc'])
    let options = []
    data.forEach((item, index) => {
      const commentList = item.medicalCheckupSummaryComment || []
      let columns = [
        {
          dataIndex: 'comment',
          title: <div style={{ padding: 4 }}>Comment</div>,
          render: (text, row) => {
            const showValue = row[
              `${
                selectedLanguage === 'EN' ? 'englishComment' : 'japaneseComment'
              }`
            ] || <span>&nbsp;</span>
            return (
              <div
                style={{
                  position: 'relative',
                  padding: '4px',
                }}
                className={classes.commentContainer}
              >
                <Tooltip title={showValue}>
                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {showValue}
                  </div>
                </Tooltip>
                <div style={{ position: 'absolute', right: 0, top: 0 }}>
                  <Tooltip title='Copy Comment'>
                    <IconButton
                      size='small'
                      color='primary'
                      onClick={() => {
                        copyComment(row.id)
                      }}
                    >
                      <CopyOutlined />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )
          },
        },
      ]
      if (index === 0) {
        columns.push({
          dataIndex: 'action',
          title: <div style={{ padding: 4 }}> Action</div>,
          align: 'center',
          width: 80,
          render: (text, row) => {
            return (
              <div style={{ padding: 4 }}>
                <Tooltip title='Edit Summary Comment'>
                  <Button
                    size='small'
                    type='primary'
                    style={{ marginRight: 5 }}
                    icon={<EditFilled />}
                    onClick={() => editComment(row)}
                  ></Button>
                </Tooltip>
                <Popconfirm
                  title='Are you sure?'
                  onConfirm={() => {
                    setTimeout(() => {
                      deleteComment(row)
                    }, 1)
                  }}
                >
                  <Tooltip title='Delete Summary Comment'>
                    <Button
                      size='small'
                      type='danger'
                      style={{ marginRight: 5 }}
                      icon={<DeleteFilled />}
                    ></Button>
                  </Tooltip>
                </Popconfirm>
              </div>
            )
          },
        })
      }
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
            columns={columns}
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

  const onSaveComment = () => {
    querySummaryCommentHistory()
    refreshMedicalCheckup()

    dispatch({
      type: 'medicalCheckupReportingDetails/updateState',
      payload: {
        summaryCommentEntity: undefined,
      },
    })
  }

  const copyComment = id => {
    dispatch({
      type: 'medicalCheckupReportingDetails/copyComment',
      payload: {
        medicalCheckupWorkitemFK: medicalCheckupReportingDetails.entity.id,
        sourceCommentFK: id,
        commentType: 'Summary',
      },
    }).then(r => {
      querySummaryCommentHistory()
      refreshMedicalCheckup()
    })
  }

  const isShowMarkAsCommentsDone = () => {
    if (user.data.clinicianProfile.userProfile.role?.clinicRoleFK === 1) {
      const currentDoctor = (
        medicalCheckupReportingDetails.entity?.medicalCheckupWorkitemDoctor ||
        []
      ).find(
        item =>
          item.userProfileFK === user.data.clinicianProfile.userProfile.id,
      )
      if (
        currentDoctor &&
        currentDoctor.status !== REPORTINGDOCTOR_STATUS.COMMENTDONE
      ) {
        return true
      }
    }
    return false
  }

  const activeReportingDoctors = () => {
    if (user.data.clinicianProfile.userProfile.role?.clinicRoleFK === 1) {
      return (
        medicalCheckupReportingDetails.entity?.medicalCheckupWorkitemDoctor ||
        []
      ).filter(
        item =>
          item.userProfileFK === user.data.clinicianProfile.userProfile.id,
      )
    }
    return medicalCheckupReportingDetails.entity?.medicalCheckupWorkitemDoctor
  }

  const onCommentAsDone = () => {
    const currentDoctor = (
      medicalCheckupReportingDetails.entity?.medicalCheckupWorkitemDoctor || []
    ).find(
      item => item.userProfileFK === user.data.clinicianProfile.userProfile.id,
    )
    updateReportingDoctor(currentDoctor, REPORTINGDOCTOR_STATUS.COMMENTDONE)
  }

  const updateReportingDoctor = (reportingDoctor, status) => {
    dispatch({
      type: 'medicalCheckupReportingDetails/updateReportingDoctor',
      payload: {
        ...reportingDoctor,
        status,
      },
    }).then(r => {
      refreshMedicalCheckup()
    })
  }
  const getNonVerifyCount = () => {
    const {
      medicalCheckupIndividualComment = [],
      medicalCheckupSummaryComment = [],
    } = medicalCheckupReportingDetails.entity || {}

    return (
      medicalCheckupIndividualComment.filter(item => !item.isVerified).length +
      medicalCheckupSummaryComment.filter(item => !item.isVerified).length
    )
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
            count={getNonVerifyCount()}
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
          {isShowMarkAsCommentsDone() && (
            <Link style={{ display: 'inline-block', marginLeft: 8 }}>
              <span
                style={{
                  display: 'block',
                  textDecoration: 'underline',
                }}
                onClick={e => {
                  e.preventDefault()
                  onCommentAsDone()
                }}
              >
                Mark As Comments Done
              </span>
            </Link>
          )}
        </div>

        <div style={{ position: 'absolute', right: 0, top: 4 }}>
          <ReportingDoctorTag
            medicalCheckupDoctor={activeReportingDoctors()}
            isShowMessage
            isShowLabel
            label='Doctor(s):'
            updateReportingDoctor={updateReportingDoctor}
          />
        </div>
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
        <CommentDetails {...props} saveComment={onSaveComment} />
      </div>
      <CommonModal
        open={showVerification}
        title='Comment Verification'
        onClose={toggleCommentVerification}
        onConfirm={confirmCommentVerification}
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
