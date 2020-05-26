import React, { useState } from 'react'
import moment from 'moment'
// material ui
import {
  Button,
  ListItem,
  ListItemText,
  ListItemIcon,
  withStyles,
} from '@material-ui/core'
import { infoColor } from 'mui-pro-jss'
import Info from '@material-ui/icons/Info'
import {
  GridItem,
  GridContainer,
  dateFormatLongWithTimeNoSec,
} from '@/components'
import { NOTIFICATION_TYPE } from '@/utils/constants'

const styles = () => ({
  root: { maxHeight: 100, background: '#f0f8ff' },
  itemContainer: { display: 'flex' },
  messageText: {},
  timestampText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 5,
  },
  itemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 30,
    cursor: 'pointer',
    '&:not(:last-child)': {
      borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
    },
    '&.Mui-disabled': {
      opacity: 1,
      backgroundColor: 'white',
    },
  },
  icon: {
    minWidth: 38,
  },
  titleLinkBtn: {
    paddingLeft: '0px',
    paddingTop: '0px !important',
    textTransform: 'none',
    textAlign: 'left',
  },
  copyBtn: {
    paddingTop: '0px !important',
  },
})

const Content = ({ systemMessage, classes, dispatch }) => {
  let messageTitle = systemMessage.title || ''

  // const icon = ICONS[NOTIFICATION_TYPE.SYSINFO]

  const handleDismiss = () => {
    dispatch({
      type: 'systemMessage/dismiss',
      payload: {
        id: systemMessage.id,
      },
    })
  }

  const handleOpenDetail = () => {
    dispatch({
      type: 'systemMessage/updateState',
      payload: {
        entity: systemMessage,
      },
    })

    dispatch({
      type: 'global/updateState',
      payload: {
        showSystemMessage: true,
      },
    })
  }

  return (
    <ListItem button alignItems='flex-start' className={classes.itemRoot}>
      <ListItemIcon className={classes.icon}>
        <Info style={{ color: infoColor }} />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div className={classes.itemContainer}>
              <Button
                size='sm'
                link
                color='primary'
                className={classes.titleLinkBtn}
                onClick={handleOpenDetail}
              >
                {messageTitle}&nbsp;
              </Button>
            </div>
          </div>
        }
        secondary={
          <GridContainer>
            <GridItem
              md={10}
              style={{
                paddingLeft: 0,
              }}
            >
              <React.Fragment>
                <p className={classes.timestampText}>
                  {moment(systemMessage.timestamp).format(
                    dateFormatLongWithTimeNoSec,
                  )}
                </p>
              </React.Fragment>
            </GridItem>
            {!systemMessage.isRead && !systemMessage.isDismissed ? (
              <GridItem md={2}>
                <Button
                  size='sm'
                  link
                  color='primary'
                  onClick={handleDismiss}
                  className={classes.copyBtn}
                >
                  Dismiss
                </Button>
              </GridItem>
            ) : (
              ''
            )}
          </GridContainer>
        }
      />
    </ListItem>
  )
}

export default withStyles(styles, { name: 'Content' })(Content)
