import React, { useState } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Link } from 'umi'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
import { ListItem, ListItemText, withStyles, Divider } from '@material-ui/core'
import { Button, Popover, SizeContainer, Tooltip } from '@/components'
import { AppNotificationContent } from '@/components/_medisys'
import { sendNotification } from '@/utils/realtime'
import { compose } from 'redux'
import { APPNOTIFICATION_SCHEMA } from '@/utils/constants'
import appNotification from '@/models/appNotification'

const styles = theme => ({})

const AppNotificationPopover = ({
  user,
  classes,
  dispatch,
  title,
  source,
  sourceRecordId,
  doctor,
  buttonProps,
  children,
  exactControl,
  isMessageThreadEnable,
}) => {
  const [show, setShow] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [newNotification, setNewNotification] = useState(null)

  const isDoctorRole =
    user.data.clinicianProfile.userProfile.role?.clinicRoleFK === 1 //1 is Doctor

  const handleItemNew = () => {
    const notice = {
      isNew: true,
      source: source,
      sourceRecordId: sourceRecordId,
      content: '',
      fromUser: user.data.clinicianProfile.name,
      fromUserFK: user.data.id,
      generateDate: moment().formatUTC(false),

      toUserFK: isDoctorRole ? undefined : doctor.userFK,
      toUser: isDoctorRole ? 'All PRO' : doctor.name,
      isRead: false,
      readDate: undefined,
      isAcknowledgeRequired: isDoctorRole,
      isAcknowledged: undefined,
      acknowledgeDate: undefined,
    }
    setNewNotification(notice)
  }

  const handleItemAcknowledge = row => {
    var notification = {
      ...row,
      isRead: true,
      isAcknowledged: true,
      // acknowledgeDate: moment().formatUTC(false),
    }
    dispatch({
      type: 'appNotification/upsert',
      payload: notification,
    }).then(r => {
      if (r === 204) queryNotifications()
    })
  }

  const handleItemCancel = () => {
    setNewNotification(null)
  }

  const handleItemSave = notification => {
    dispatch({
      type: 'appNotification/create',
      payload: notification,
    }).then(r => {
      if (r.status == 200) {
        handleItemCancel()
        queryNotifications()
      }
    })
  }

  const queryNotifications = () => {
    dispatch({
      type: 'appNotification/queryNotifications',
      payload: { doctorUserFK: doctor.userFK, source, sourceRecordId },
    }).then(r => {
      if (r.status == 200) {
        setNotifications(r.data)
        setShow(true)
      }
    })
  }

  const actions = {
    onAddNew: handleItemNew,
    onAcknowledge: handleItemAcknowledge,
    onCancel: handleItemCancel,
    onSave: handleItemSave,
  }

  return (
    <Popover
      icon={null}
      trigger='click'
      placement='bottomRight'
      visible={show}
      onVisibleChange={() => setShow(!show)}
      content={
        <div style={{ width: 600 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '1rem' }}>Message Thread</div>
            {isMessageThreadEnable && (
              <Link style={{ position: 'absolute', right: 0, top: 0 }}>
                <span
                  style={{
                    display: 'block',
                    textDecoration: 'underline',
                    marginRight: 10,
                  }}
                  onClick={e => {
                    e.preventDefault()
                    handleItemNew()
                  }}
                >
                  + New Message
                </span>
              </Link>
            )}
          </div>
          <div style={{ maxHeight: 500, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <AppNotificationContent
                key={index}
                dispatch={dispatch}
                notification={notification}
                currentUserFK={user.data.id}
                customeStyle={{
                  margin: '4px 0px',
                  border: '1px solid #cccccc',
                  padding: 4,
                }}
                {...actions}
              />
            ))}
          </div>
          {newNotification && (
            <div style={{ marginTop: 8 }}>
              <AppNotificationContent
                key={0}
                dispatch={dispatch}
                notification={newNotification}
                currentUserFK={user.data.id}
                {...actions}
              />
            </div>
          )}
          {notifications.length === 0 && !newNotification && (
            <div style={{ marginTop: 8 }}>No Message</div>
          )}
          {exactControl ? exactControl() : ''}
        </div>
      }
    >
      <Tooltip title={title}>
        <div
          onClick={() => {
            if (show) return
            queryNotifications()
          }}
        >
          {children}
        </div>
      </Tooltip>
    </Popover>
  )
}

export default compose(
  withStyles(styles, { name: 'AppNotificationPopover' }),
  connect(({ user }) => ({
    user: user,
  })),
)(AppNotificationPopover)
