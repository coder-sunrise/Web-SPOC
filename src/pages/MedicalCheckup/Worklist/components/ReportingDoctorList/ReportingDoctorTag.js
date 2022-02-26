import React, { useState } from 'react'
// material ui
import { Link } from 'umi'
import { withStyles } from '@material-ui/core'
import { useSelector } from 'dva'
import {
  Tooltip,
  Button,
  Popover,
  IconButton,
  MultipleTextField,
} from '@/components'
import { CheckOutlined } from '@ant-design/icons'
import { REPORTINGDOCTOR_STATUS } from '@/utils/constants'
import { Message } from '@material-ui/icons'

const styles = theme => ({
  panel: {
    float: 'left',
    width: 120,
    fontWeight: 400,
    letterSpacing: 'inherit',
    borderRadius: '3px',
    margin: '1px 8px 1px 0px',
    padding: '2px',
    color: 'white',
    cursor: 'hand',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

const ReportingDoctorTag = ({
  medicalCheckupDoctor,
  classes,
  isShowMessage = false,
  updateReportingDoctor = () => {},
}) => {
  const [messages, setMessages] = useState([])
  const [isNewMessage, setIsNewMessage] = useState(false)
  const [message, setMessage] = useState(undefined)
  const user = useSelector(st => st.user)
  const searchMessage = () => {
    if (!isShowMessage) return
    setMessages([
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
      { content: 'aaaaaa' },
    ])
  }
  let reportingDoctorColor = '#CC0033'
  if (
    medicalCheckupDoctor.status === REPORTINGDOCTOR_STATUS.COMMENTDONE ||
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
      <div style={{ position: 'relative' }} onClick={searchMessage}>
        {medicalCheckupDoctor.status == 'Verified' && (
          <Tooltip title='Verified'>
            <Button
              color='success'
              size='small'
              style={{ position: 'absolute', top: 0, left: 2 }}
              justIcon
            >
              <CheckOutlined />
            </Button>
          </Tooltip>
        )}
        <Tooltip title={name}>
          <div
            className={classes.text}
            style={{
              paddingLeft: medicalCheckupDoctor.status == 'Verified' ? 30 : 0,
            }}
          >
            {name}
          </div>
        </Tooltip>
      </div>
    )
  }

  const messageComment = item => {
    return (
      <div
        style={{
          margin: '4px 0px',
          border: '1px solid #cccccc',
          padding: 2,
        }}
      >
        {item.content}
        <div style={{ position: 'relative' }}>
          <div>To: G.lian</div>
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            From: Jhon, 10 Jan 2020 17:10
          </div>
        </div>
      </div>
    )
  }

  const sendMessage = () => {}

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
          {medicalCheckupDoctor.status === REPORTINGDOCTOR_STATUS.VERIFIED && (
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
                    REPORTINGDOCTOR_STATUS.NEW,
                  )
                }}
              >
                Return to Doctor
              </span>
            </Link>
          )}
          {medicalCheckupDoctor.status ===
            REPORTINGDOCTOR_STATUS.COMMENTDONE && (
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
                Verify Comments
              </span>
            </Link>
          )}
        </div>
      </div>
    )
  }
  return (
    <div
      className={classes.panel}
      style={{
        backgroundColor: reportingDoctorColor,
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
