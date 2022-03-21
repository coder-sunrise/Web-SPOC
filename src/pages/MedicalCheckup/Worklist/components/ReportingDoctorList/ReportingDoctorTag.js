import React, { useState } from 'react'
// material ui
import { Link } from 'umi'
import { withStyles } from '@material-ui/core'
import { useSelector } from 'dva'
import moment from 'moment'
import {
  Tooltip,
  Button,
  Popover,
  IconButton,
  MultipleTextField,
  dateFormatLongWithTimeNoSec,
} from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { REPORTINGDOCTOR_STATUS } from '@/utils/constants'
import { Message } from '@material-ui/icons'
import { Tag } from 'antd'
import Authorized from '@/utils/Authorized'

const styles = theme => ({
  tag: {
    width: 120,
    margin: '1px 8px 1px 0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: 2,
  },
  messageComment: {
    margin: '4px 0px',
    border: '1px solid #cccccc',
    padding: 2,
  },
})

const ReportingDoctorTag = ({
  medicalCheckupDoctor,
  classes,
  isShowMessage = false,
  updateReportingDoctor = () => {},
  isEditEnable = true,
}) => {
  const [messages, setMessages] = useState([])
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [message, setMessage] = useState(undefined)
  const user = useSelector(st => st.user)
  const searchMessage = () => {
    if (!isShowMessage) return
    setMessages([
      { content: 'aaaaaa', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'bbbbbbbbbbbbbb', from: 'AA', to: 'BB', sendSate: moment() },
      {
        content: 'ccccccccccccccccccc',
        from: 'AA',
        to: 'BB',
        sendSate: moment(),
      },
      { content: 'ddddddddddddd', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'eeeeeeeeeeeeeee', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'fffffffffffffff', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'hhhhhhhhhhh', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'tttttttttttttttt', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'sssssssssssssss', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'rrrrrrrrrrrrrrr', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'llllllllllllll', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'vvvvvvvvv', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'ddd', from: 'AA', to: 'BB', sendSate: moment() },
      { content: 'rrrrrrrrr', from: 'AA', to: 'BB', sendSate: moment() },
    ])
  }
  let reportingDoctorColor = '#CC0033'
  if (
    medicalCheckupDoctor.status === REPORTINGDOCTOR_STATUS.COMMENTVERIFYING ||
    medicalCheckupDoctor.status === REPORTINGDOCTOR_STATUS.VERIFIED
  ) {
    reportingDoctorColor = '#33CC00'
  }
  const title =
    medicalCheckupDoctor.title && medicalCheckupDoctor.title.trim().length
      ? `${medicalCheckupDoctor.title}.`
      : ''
  const name = `${title}${medicalCheckupDoctor.name}`
  const isDoctor =
    user.data.clinicianProfile.userProfile.role?.clinicRoleFK === 1

  const getDoctorTag = () => {
    return (
      <div>
        <Tooltip title={name}>
          <Tag
            icon={
              medicalCheckupDoctor.status == 'Verified' ? (
                <CheckOutlined />
              ) : (
                undefined
              )
            }
            className={classes.tag}
            style={{ cursor: isShowMessage ? 'pointer' : 'default' }}
            color={reportingDoctorColor}
            onClick={searchMessage}
          >
            {name}
          </Tag>
        </Tooltip>
      </div>
    )
  }

  const messageComment = item => {
    return (
      <div className={classes.messageComment}>
        <div style={{ fontWeight: 600 }}>{item.content}</div>
        <div style={{ position: 'relative' }}>
          <div>{`To: ${item.from}`}</div>
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            {`From: ${item.to}, ${moment(item.sendSate).format(
              dateFormatLongWithTimeNoSec,
            )}`}
          </div>
        </div>
      </div>
    )
  }

  const sendMessage = () => {
    searchMessage()
  }

  const isRevertCommentEnable = () => {
    if (!isEditEnable) return false
    const revertCommentAccessRight = Authorized.check(
      'medicalcheckupworklist.revertcommenttodoctor',
    ) || {
      rights: 'hidden',
    }
    if (revertCommentAccessRight.rights !== 'enable') return false
    return true
  }

  const isVerifyCommentEnable = () => {
    if (!isEditEnable) return false
    const verifyCommentAccessRight = Authorized.check(
      'medicalcheckupworklist.markcommentasverified',
    ) || {
      rights: 'hidden',
    }
    if (verifyCommentAccessRight.rights !== 'enable') return false
    return true
  }

  const getPopoverContent = () => {
    let toUserName = 'All PRO'
    if (!isDoctor) {
      toUserName = name
    }
    return (
      <div style={{ width: 600 }}>
        <div style={{ fontWeight: 'bold' }}>Message Thread</div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {messages.map(item => {
            return messageComment(item)
          })}
        </div>
        {isNewMessage && (
          <div style={{ marginTop: 6 }}>
            <div>{`To: ${toUserName}`}</div>
            <MultipleTextField
              maxLength={2000}
              autoSize={{ minRows: 4, maxRows: 4 }}
              value={message}
              onChange={e => {
                setMessage(e.target.value)
              }}
            />
            <div style={{ textAlign: 'Right' }}>
              <Link style={{ display: 'inline-block' }}>
                <span
                  style={{
                    display: 'block',
                    textDecoration: 'underline',
                    marginRight: 10,
                    color: 'red',
                  }}
                  onClick={e => {
                    e.preventDefault()
                    setIsNewMessage(false)
                    setMessage(undefined)
                  }}
                >
                  Cancel
                </span>
              </Link>
              <Link style={{ display: 'inline-block' }}>
                <span
                  style={{
                    display: 'block',
                    textDecoration: 'underline',
                  }}
                  onClick={e => {
                    e.preventDefault()
                    sendMessage()
                  }}
                >
                  Save
                </span>
              </Link>
            </div>
          </div>
        )}
        <div style={{ marginTop: 6 }}>
          <IconButton color='primary' justIcon size='sm'>
            <Message />
          </IconButton>
          <Link style={{ display: 'inline-block' }}>
            <span
              style={{
                display: 'block',
                textDecoration: 'underline',
                marginRight: 10,
              }}
              onClick={e => {
                e.preventDefault()
                if (!isNewMessage) {
                  setIsNewMessage(true)
                }
              }}
            >
              New Message
            </span>
          </Link>
          {isRevertCommentEnable() && (
            <Link style={{ display: 'inline-block' }}>
              <span
                style={{
                  display: 'block',
                  textDecoration: 'underline',
                  marginRight: 10,
                }}
                onClick={e => {
                  e.preventDefault()
                  updateReportingDoctor(
                    medicalCheckupDoctor,
                    REPORTINGDOCTOR_STATUS.NEW,
                  )
                }}
              >
                Revert Comment to Doctor
              </span>
            </Link>
          )}
          {medicalCheckupDoctor.status ===
            REPORTINGDOCTOR_STATUS.COMMENTVERIFYING &&
            isVerifyCommentEnable() && (
              <Link style={{ display: 'inline-block' }}>
                <span
                  style={{
                    display: 'block',
                    textDecoration: 'underline',
                  }}
                  onClick={e => {
                    e.preventDefault()
                    updateReportingDoctor(
                      medicalCheckupDoctor,
                      REPORTINGDOCTOR_STATUS.VERIFIED,
                    )
                  }}
                >
                  Mark Comment as Verified
                </span>
              </Link>
            )}
        </div>
      </div>
    )
  }
  return (
    <div
      style={{
        float: 'left',
      }}
    >
      {isShowMessage ? (
        <Popover
          icon={null}
          trigger='click'
          placement='bottomRight'
          content={getPopoverContent()}
        >
          {getDoctorTag()}
        </Popover>
      ) : (
        getDoctorTag()
      )}
    </div>
  )
}
export default withStyles(styles, { name: 'ReportingDoctorTag' })(
  ReportingDoctorTag,
)
