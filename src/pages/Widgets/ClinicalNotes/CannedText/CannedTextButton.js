import React, { useState } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import color from 'color'
// material ui
import { Divider, withStyles } from '@material-ui/core'
import History from '@material-ui/icons/History'
import Settings from '@material-ui/icons/Settings'
import ListAlt from '@material-ui/icons/ListAlt'
import NavigateNext from '@material-ui/icons/NavigateNext'
// common components
import { primaryColor } from 'mui-pro-jss'
import { Button, Popover, Tooltip, TextField } from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import { CANNED_TEXT_TYPE_FIELD_NAME } from './utils'
import Authorized from '@/utils/Authorized'

const styles = theme => ({
  item: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: color(primaryColor)
        .lighten(0.9)
        .hex(),
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
    width: 300,
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
  arrowRight: {
    float: 'right',
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
  user,
}) => {
  const [show, setShow] = useState(false)
  const [showCannedText, setShowCannedText] = useState(false)

  const [filterCannedText, setFilterCannedText] = useState('')

  const fieldName = CANNED_TEXT_TYPE_FIELD_NAME[cannedTextTypeFK]

  let list = cannedText[fieldName] || []
  list = [
    ..._.orderBy(
      list.filter(o => o.ownedByUserFK === user.id),
      ['sortOrder', 'title'],
      ['asc'],
    ),
    ..._.orderBy(
      list.filter(o => o.ownedByUserFK !== user.id),
      ['title'],
      ['asc'],
    ),
  ]

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

  const onListItemClick = selectedCannedText => {
    handleSelectCannedText(selectedCannedText)
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

  const debouncedAction = _.debounce(
    e => {
      setFilterCannedText(e.target.value)
    },
    100,
    {
      leading: true,
      trailing: false,
    },
  )

  const accessRight = Authorized.check('settings.cannedtext') || {
    rights: 'hidden',
  }
  const showSettingButton = accessRight.rights === 'enable'

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
            <div
              className={classes.item}
              onClick={handlePreviousVisitNoteClick}
            >
              <History />
              <span>Previous Notes</span>
            </div>
            <Popover
              icon={null}
              placement='right'
              trigger='hover'
              visible={showCannedText}
              content={
                <div className={classes.popoverContainer}>
                  <TextField
                    label='Filter Canned Text'
                    onChange={e => {
                      debouncedAction(e)
                    }}
                  />
                  <div className={classes.listContainer}>
                    {list
                      .filter(
                        item =>
                          item.title
                            .toUpperCase()
                            .indexOf(filterCannedText.toUpperCase()) >= 0,
                      )
                      .map(item => {
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
                  {showSettingButton && (
                    <div>
                      {' '}
                      <Divider className={classes.divider} />
                      <div
                        className={classes.item}
                        onClick={handleSettingClick}
                      >
                        <Settings />
                        <span>Settings</span>
                      </div>
                    </div>
                  )}
                </div>
              }
            >
              <div
                className={classes.item}
                onMouseEnter={showCannedTextPopover}
              >
                <ListAlt />
                <span>Canned Text</span>
                <NavigateNext className={classes.arrowRight} />
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

const Connected = connect(({ cannedText, loading, user }) => ({
  cannedText,
  loading: loading.effects[ 'cannedText/query' ],
  user: user.data,
}))(CannedTextButton)

export default withStyles(styles, { name: 'CannedTextButton' })(Connected)
