import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
// common components
import { GridContainer, GridItem, Button } from '@/components'

const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 305,
    right: 0,
    top: 25,
  },
  linkBtn: {
    position: 'absolute',
    zIndex: 1,
    left: 410,
    right: 0,
    top: 25,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',

    backgroundColor: theme.palette.background.paper,
  },
})

@connect(({ scriblenotes }) => ({
  scriblenotes,
}))
class ScribbleNoteItem extends React.Component {
  render () {
    const {
      classes,
      scriblenotes,
      category,
      arrayName,
      categoryIndex,
      scribbleNoteUpdateState,
      scribbleNoteArray,
      gridItemWidth,
      editorButtonStyle = {},
    } = this.props
    const rootClass = classnames({
      [classes.editorBtn]: _.isEmpty(editorButtonStyle),
    })
    return (
      <div className={rootClass} style={editorButtonStyle}>
        <Button
          color='info'
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
          }}
        >
          Scribble Note
        </Button>

        <div style={{ display: 'inline-block', position: 'absolute' }}>
          {scribbleNoteArray.length > 0 ? (
            <GridContainer>
              <div
                className={classes.root}
                style={{ width: gridItemWidth, paddingLeft: 20 }}
              >
                <GridList className={classes.gridList} cols={0} cellHeight={20}>
                  {scribbleNoteArray.map((item, i) => {
                    return (
                      <GridListTile key={i} cols={0}>
                        <GridItem>
                          <Button
                            link
                            style={{
                              textDecoration: 'underline',
                              minWidth: 150,
                            }}
                            value={item}
                            onClick={() => {
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
                          >
                            {item.subject}
                          </Button>
                        </GridItem>
                      </GridListTile>
                    )
                  })}
                </GridList>
              </div>
            </GridContainer>
          ) : (
            ' '
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ScribbleNoteItem)
