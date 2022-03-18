import React, { Component } from 'react'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
import { FastField } from 'formik'
import { ListItem, ListItemText, withStyles } from '@material-ui/core'
import { Input } from 'antd'
import { Button, TextField } from '@/components'
import { Done, Replay } from '@material-ui/icons'
import moment from 'moment'
import { Link } from 'umi'

const { TextArea } = Input
const dateTimeFormat = 'DD MMM YYYY HH:mm:ss'
const formatDateTime = datetime =>
  datetime ? moment(datetime).format(dateTimeFormat) : undefined

const styles = theme => ({
  buttonLink: { margin: 'auto' },
  itemContainer: { display: 'flex' },
  itemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    cursor: 'pointer',
    '&:not(:last-child)': {
      borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
    },
    '&.Mui-disabled': {
      opacity: 1,
      backgroundColor: 'white',
    },
  },
  timestampText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 5,
  },
})

class AppNotificationContent extends Component {
  state = {
    internalContent: undefined,
  }

  render() {
    const {
      notification,
      actions,
      classes,
      dispatch,
      currentUserFK,
      onAddNew,
      onCancel,
      onSave,
      onAcknowledge,
    } = this.props
    const {
      isNew,
      isAcknowledgeRequired,
      isAcknowledged,
      acknowledgeDate,
      content,
      fromUserFK,
      fromUser,
      toUserFK,
      toUser,
      generateDate,
    } = notification

    const { internalContent = content } = this.state

    return (
      <div>
        <div>
          {isNew ? (
            <div>
              <p>{`To: ${toUser}`}</p>
              <TextArea
                value={internalContent}
                onChange={e => {
                  this.setState({ internalContent: e.target.value })
                }}
                readOnly={!isNew}
                autoSize={{ minRows: 1, maxRows: 99 }}
              />
            </div>
          ) : (
            <p>{internalContent}</p>
          )}
        </div>
        <div>
          {isNew ? (
            <span>
              <Button
                className={classes.buttonLink}
                link
                size='sm'
                onClick={() => onCancel(notification)}
              >
                Cancel
              </Button>
              <Button
                className={classes.buttonLink}
                link
                size='sm'
                onClick={() => {
                  if (!internalContent?.trim()) return
                  onSave({ ...notification, content: internalContent })
                  this.setState({ internalContent: '' })
                }}
              >
                Save
              </Button>
            </span>
          ) : (
            <span>
              {isAcknowledgeRequired && (
                <Button
                  justIcon
                  color={isAcknowledged ? 'success' : 'action'}
                  onClick={e => {
                    e.stopPropagation()
                    console.log('acknoledge button click')
                    onAcknowledge(notification)
                  }}
                  title={formatDateTime(acknowledgeDate)}
                  disabled={!(currentUserFK != fromUserFK && !isAcknowledged)}
                >
                  <Done />
                </Button>
              )}
              <span className={classes.timestampText}>
                {`${
                  currentUserFK == fromUserFK
                    ? `To: ${toUser}`
                    : `From: ${fromUser}`
                }, ${formatDateTime(generateDate)}`}
              </span>
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AppNotificationContent' })(
  AppNotificationContent,
)
