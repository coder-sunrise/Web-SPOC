import color from 'color'
import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles, Divider } from '@material-ui/core'
// common components
import { hoverColor } from 'mui-pro-jss'
import { Button } from '@/components'
// sub components
import Content from './Content'

const styles = (theme) => ({
  root: {
    // width: '100%',
    // minWidth: 400,
    // maxWidth: 500,
  },
  emptyRoot: {
    minHeight: 290,
    maxHeight: 290,
    display: 'flex',
    justifyContent: 'center',
  },
  listRoot: {
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: color(hoverColor).lighten(0.05).hex(),
  },
  footer: {
    textAlign: 'center',
    padding: theme.spacing(),
    // display: 'flex',
    // justifyContent: 'center',
    // borderTop: 'solid 1px #DCDCDC',
  },
  buttonLink: { margin: 'auto' },
})

const SystemMessageList = ({
  dispatch,
  systemMessages = [],
  classes,
  type,
}) => {
  // const clearNotification = () => {
  //   dispatch({
  //     type: 'header/clearNotification',
  //     payload: {
  //       type,
  //     },
  //   })
  // }
  // const readNotification = () => {
  //   dispatch({
  //     type: 'header/readNotification',
  //     payload: {
  //       type,
  //     },
  //   })
  // }
  const rootClass = classnames({
    [classes.root]: true,
    [classes.listRoot]: systemMessages.length > 0,
    [classes.emptyRoot]: systemMessages.length === 0,
  })
  if (systemMessages.length > 0) {
    return (
      <div>
        <div className={rootClass}>
          {systemMessages.map((n, index) => (
            <Content
              key={`systemMessages-${index}`}
              systemMessage={n}
              dispatch={dispatch}
            />
          ))}
        </div>
        {/* <Divider />
        <div className={classes.footer}>
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={readNotification}
          >
            Make all as read
          </Button>
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={clearNotification}
          >
            Clear
          </Button>
        </div> */}
      </div>
    )
  }
  return (
    <div className={rootClass}>
      <p style={{ margin: 'auto' }}>You have viewed all system messages</p>
    </div>
  )
}

export default withStyles(styles, { name: 'SystemMessageList' })(
  SystemMessageList,
)
