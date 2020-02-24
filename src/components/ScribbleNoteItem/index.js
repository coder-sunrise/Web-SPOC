import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
import color from 'color'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common components
import { primaryColor } from 'mui-pro-jss'
// material ui

import Add from '@material-ui/icons/Add'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { LoadingWrapper } from '@/components/_medisys'

// common components
import {
  GridContainer,
  GridItem,
  Button,
  Popper,
  Popover,
  Tooltip,
} from '@/components'

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

@connect(({ scriblenotes }) => ({
  scriblenotes,
}))
class ScribbleNoteItem extends React.Component {
  state = {
    open: false,
  }

  toggleVisibleChange = () =>
    this.setState((ps) => {
      return {
        open: !ps.open,
      }
    })

  render () {
    const {
      classes,
      scriblenotes,
      category,
      arrayName,
      categoryIndex,
      scribbleNoteUpdateState,
      scribbleNoteArray = [],
    } = this.props

    return (
      <Popover
        icon={null}
        trigger='click'
        placement='bottom'
        visible={this.state.open}
        onVisibleChange={this.toggleVisibleChange}
        content={
          <div className={classes.popoverContainer}>
            <div
              className={classes.item}
              onClick={() => {
                scribbleNoteUpdateState(category, arrayName, categoryIndex, '')

                window.g_app._store.dispatch({
                  type: 'scriblenotes/updateState',
                  payload: {
                    entity: '',
                    showScribbleModal: true,
                    editEnable: false,
                  },
                })
                this.toggleVisibleChange()
              }}
            >
              <Add />
              <span>New</span>
            </div>
            <Divider className={classes.divider} />
            <div className={classes.listContainer}>
              {scribbleNoteArray.map((item, i) => {
                return (
                  <ListItem
                    key={`scribble-${item.id}`}
                    title={item.subject}
                    classes={classes}
                    onClick={() => {
                      this.toggleVisibleChange()
                      if (item.scribbleNoteLayers) {
                        scribbleNoteUpdateState(
                          category,
                          arrayName,
                          categoryIndex,
                          item,
                        )

                        window.g_app._store.dispatch({
                          type: 'scriblenotes/updateState',
                          payload: {
                            selectedIndex: i,
                            showScribbleModal: true,
                            editEnable: true,
                            entity: item,
                          },
                        })
                      } else {
                        window.g_app._store
                          .dispatch({
                            type: 'scriblenotes/query',
                            payload: {
                              id: item.id,
                            },
                          })
                          .then((v) => {
                            scribbleNoteUpdateState(
                              category,
                              arrayName,
                              categoryIndex,
                              v,
                            )

                            const newArrayItems = [
                              ...scriblenotes[category][arrayName],
                            ]
                            newArrayItems[i].scribbleNoteLayers =
                              v.scribbleNoteLayers

                            this.props.dispatch({
                              type: 'scriblenotes/updateState',
                              payload: {
                                ...scriblenotes,
                                [category]: {
                                  [arrayName]: newArrayItems,
                                },
                              },
                            })

                            window.g_app._store.dispatch({
                              type: 'scriblenotes/updateState',
                              payload: {
                                selectedIndex: i,
                                showScribbleModal: true,
                                editEnable: true,
                                entity: v,
                              },
                            })
                          })
                      }
                    }}
                    {...item}
                  />
                )
              })}
            </div>
          </div>
        }
      >
        <Button color='info'>Scribble Note</Button>
      </Popover>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ScribbleNoteItem)
