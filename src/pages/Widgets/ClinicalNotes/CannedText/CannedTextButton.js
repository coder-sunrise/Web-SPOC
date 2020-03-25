import React, { useState } from 'react'
import { connect } from 'dva'
import color from 'color'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import Settings from '@material-ui/icons/Settings'
// common components
import { primaryColor } from 'mui-pro-jss'
import { Button, Popover, Tooltip } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import { CANNED_TEXT_TYPE_FIELD_NAME } from './utils'

const styles = (theme) => ({
  item: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: color(primaryColor).lighten(0.9).hex(),
    },
    '& > svg': {
      marginRight: theme.spacing(1),
    },
    '& > span': {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
  },
  popoverContainer: {
    width: 200,
    textAlign: 'left',
  },
  listContainer: {
    maxHeight: 300,
    overflowY: 'auto',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

const ListItem = ({ classes, title, onClick }) => {
  return (
    <Tooltip title={title}>
      <div className={classes.item} onClick={onClick}>
        <span>{title}</span>
      </div>
    </Tooltip>
  )
}

const CannedTextButton = ({
  dispatch,
  classes,
  cannedText,
  cannedTextTypeFK,
  onSettingClick,
  handleSelectCannedText,
  onCannedTextClick,
  loading,
}) => {
  const [
    show,
    setShow,
  ] = useState(false)

  const fieldName = CANNED_TEXT_TYPE_FIELD_NAME[cannedTextTypeFK]

  const list = cannedText[fieldName] || []

  const toggleVisibleChange = () => setShow(!show)

  const handleMainButtonClick = () => {
    if (cannedTextTypeFK && !show) {
      dispatch({
        type: 'cannedText/query',
        payload: cannedTextTypeFK,
      })
    }

    onCannedTextClick()
  }

  const onListItemClick = (selectedCannedText) => {
    handleSelectCannedText(selectedCannedText)
    toggleVisibleChange()
  }

  const handleSettingClick = () => {
    toggleVisibleChange()
    onSettingClick()
  }

  return (
    <Popover
      icon={null}
      trigger='click'
      placement='bottom'
      visible={show}
      onVisibleChange={toggleVisibleChange}
      content={
        <LoadingWrapper loading={loading}>
          <div className={classes.popoverContainer}>
            <div className={classes.item} onClick={handleSettingClick}>
              <Settings />
              <span>Settings</span>
            </div>
            <Divider className={classes.divider} />
            <div className={classes.listContainer}>
              {list.map((item) => {
                const handleClick = () => onListItemClick(item)
                return (
                  <ListItem
                    key={`cannedText-${item.id}`}
                    classes={classes}
                    onClick={handleClick}
                    {...item}
                  />
                )
              })}
            </div>
          </div>
        </LoadingWrapper>
      }
    >
      <Button color='info' onClick={handleMainButtonClick}>
        Canned Text
      </Button>
    </Popover>
  )
}

const Connected = connect(({ cannedText, loading }) => ({
  cannedText,
  loading: loading.effects['cannedText/query'],
}))(CannedTextButton)

export default withStyles(styles, { name: 'CannedTextButton' })(Connected)
