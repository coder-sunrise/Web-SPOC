import React, { useState } from 'react'
import { connect } from 'dva'
import color from 'color'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import History from '@material-ui/icons/History'
import Settings from '@material-ui/icons/Settings'
import ListAlt from '@material-ui/icons/ListAlt'
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
  onPrevDoctorNoteClick,
  loading,
}) => {
  const [
    show,
    setShow,
  ] = useState(false)
  const [
    showCannedText,
    setShowCannedText,
  ] = useState(false)

  const fieldName = CANNED_TEXT_TYPE_FIELD_NAME[cannedTextTypeFK]

  const list = cannedText[fieldName] || []

  const toggleVisibleChange = () => {
    setShow(!show)
    if (show) {
      setShowCannedText(false)
    }
  }

  const toggleCannedTextVisibleChange = () => {
    setShowCannedText(!showCannedText)
  }

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
    toggleCannedTextVisibleChange()
  }

  const handleSettingClick = () => {
    toggleVisibleChange()
    toggleCannedTextVisibleChange()
    onSettingClick()
  }
  const showCannedTextPopover = () => {
    setShowCannedText(true)
  }
  const handlePreviousVisitNoteClick = () => {
    toggleVisibleChange()
    onPrevDoctorNoteClick(cannedTextTypeFK)
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
            <div className={classes.item} onClick={handlePreviousVisitNoteClick}>
              <History />
              <span>Previous Notes</span>
            </div>
            <Popover
              icon={null}
              placement="right"
              trigger="hover"
              visible={showCannedText}
              content={
                <div className={classes.popoverContainer}>
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
                  <Divider className={classes.divider} />
                  <div className={classes.item} onClick={handleSettingClick}>
                    <Settings />
                    <span>Settings</span>
                  </div>
                </div>
              }
            >
              <div className={classes.item} onMouseEnter={showCannedTextPopover}>
                <ListAlt />
                <span>Canned Text</span>
              </div>
            </Popover>
          </div>
        </LoadingWrapper>
      }
    >
      <Button color='info' onClick={handleMainButtonClick}>
        Load From
      </Button>
    </Popover>
  )
}

const Connected = connect(({ cannedText, loading }) => ({
  cannedText,
  loading: loading.effects['cannedText/query'],
}))(CannedTextButton)

export default withStyles(styles, { name: 'CannedTextButton' })(Connected)
