import React, { useState } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
import { ListItem, ListItemText, withStyles, Divider } from '@material-ui/core'
import { Button, Popover, SizeContainer, Tooltip } from '@/components'
import { AppNotificationContent } from '@/components/_medisys'
import { sendNotification } from '@/utils/realtime'
import { compose } from 'redux'
import { APPNOTIFICATION_SCHEMA } from '@/utils/constants'
import appNotification from '@/models/appNotification'

const styles = theme => ({
  popoverContainer: {
    textAlign: 'left',
    width: 600,
    minHeight: 300,
    maxHeight: 600,
  },
})

const AppNotificationPopover = ({
  user,
  notifications,
  classes,
  dispatch,
  title,
  source,
  sourceRecordId,
  doctor,//: { userFK = 0, name = '' } = {},
  buttonProps,
}) => {
  const [show, setShow] = useState(false)
  const [newNotification, setNewNotification] = useState(null)

  const isDoctorRole =
    user.data.clinicianProfile.userProfile.role?.clinicRoleFK === 1

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
      isAcknowledgeRequired:
        user.data.clinicianProfile.userProfile.role.clinicRoleFK == 1, //1 is Doctor
      isAcknowledged: undefined,
      acknowledgeDate: undefined,
    }
    setNewNotification(notice)
  }

  const handleItemAcknowledge = row => {
    var notification = {
      ...row,
      isAcknowledged: true,
      acknowledgeDate: moment().formatUTC(false),
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
    dispatch({ type: 'appNotification/queryNotifications' }).then(r => {
      if (r.status == 200) {
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
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      visible={show}
      onVisibleChange={() => setShow(!show)}
      content={
        show && (
          <div className={classes.popoverContainer}>
            <SizeContainer size='sm'>
              <div style={{ marginRight: 8 }}>
                {newNotification && (
                  <AppNotificationContent
                    key={0}
                    dispatch={dispatch}
                    notification={newNotification}
                    currentUserFK={user.data.id}
                    {...actions}
                  />
                )}
                {notifications.map((notification, index) => (
                  <AppNotificationContent
                    key={index}
                    dispatch={dispatch}
                    notification={notification}
                    currentUserFK={user.data.id}
                    {...actions}
                  />
                ))}
              </div>
            </SizeContainer>
            <Button size='sm' color='primary' onClick={handleItemNew}>
              New Message
            </Button>
          </div>
        )
      }
    >
      <Tooltip title={title}>
        <Button color='primary' {...buttonProps} onClick={queryNotifications}>
          {title}
        </Button>
      </Tooltip>
    </Popover>
  )
}

export default compose(
  withStyles(styles, { name: 'AppNotificationPopover' }),
  connect(({ user, appNotification }) => ({
    user: user,
    notifications: appNotification.notifications || [],
  })),
)(AppNotificationPopover)
