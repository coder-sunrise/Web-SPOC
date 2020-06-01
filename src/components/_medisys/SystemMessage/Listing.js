import color from 'color'
import React from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
// material ui
import { withStyles, Divider } from '@material-ui/core'
import AddAlertIcon from '@material-ui/icons/AddAlert'
// common components
import { hoverColor } from 'mui-pro-jss'
import { Button, Tabs } from '@/components'
import moment from 'moment'

// sub components
import Content from './Content'
import { systemMessageTypes } from './variables'

const styles = (theme) => ({
  root: {
    // width: '100%',
    // minWidth: 400,
    // maxWidth: 500,
  },
  tabMain: {
    padding: 0,
    margin: 0,
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

@connect(({ systemMessage }) => ({ systemMessage }))
class SystemMessageList extends React.Component {
  render () {
    const { dispatch, systemMessage, classes } = this.props
    const { list = [] } = systemMessage
    const rootClass = classnames({
      [classes.root]: true,
      [classes.listRoot]: list.length > 0,
      [classes.emptyRoot]: list.length === 0,
    })

    const handelLoadMore = (msgTypeId) => {
      const pagination = systemMessage[`pagination${msgTypeId}`]
      const { current = 0, pageSize, totalRecords } = pagination
      dispatch({
        type: 'systemMessage/queryList',
        payload: {
          // lgt_EffectiveEndDate: moment().formatUTC(false),
          lst_EffectiveStartDate: moment().formatUTC(false),
          pagesize: 3,
          typeId: msgTypeId,
          systemMessageTypeFK: msgTypeId,
          current: current + 1,
          sorting: [
            { columnName: 'createDate', direction: 'desc' },
          ],
        },
      })
    }

    if (list.length > 0) {
      return (
        <div>
          <Tabs
            type='line'
            tabPosition='left'
            tabBarStyle={{
              padding: 0,
              top: 1,
              position: 'relative',
              margin: 0,
            }}
            className={classes.tabMain}
            tabStyle={{ padding: 0, marginLeft: -20 }}
            options={systemMessageTypes.map((o) => {
              const msgList = list.filter((m) => m.systemMessageTypeFK === o.id)
              const newMsgCount = msgList.filter((m) => !m.isRead)
              const pagination = systemMessage[`pagination${o.id}`]

              const { current = 1, pageSize = 0, totalRecords = 0 } =
                pagination || {}
              const isEnableLoadMore = current * pageSize < totalRecords

              return {
                ...o,
                // name: `${o.name} ${newMsgCount > 0 ? `(${newMsgCount})` : ''}`,
                name: (
                  <div
                    style={{
                      width: '150px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      marginLeft: -25,
                      textAlign: 'left',
                      display: 'table',
                    }}
                  >
                    <div
                      style={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        width: 30,
                      }}
                    >
                      {o.icon}
                    </div>
                    <div
                      style={{ display: 'table-cell', verticalAlign: 'middle' }}
                    >
                      <p>{o.name}</p>
                    </div>
                  </div>
                ),
                content: (
                  <div>
                    <div className={rootClass}>
                      {msgList.map((n, index) => (
                        <Content
                          key={`systemMessages-${o.id}-${index}`}
                          systemMessage={n}
                          dispatch={dispatch}
                        />
                      ))}
                    </div>
                    {isEnableLoadMore ? (
                      <div style={{ textAlign: 'center' }}>
                        <Button
                          size='sm'
                          link
                          color='primary'
                          onClick={() => {
                            handelLoadMore(o.id)
                          }}
                        >
                          load more
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ),
              }
            })}
          />
        </div>
      )
    }
    return (
      <div className={rootClass}>
        <p style={{ margin: 'auto' }}>You have viewed all system messages</p>
      </div>
    )
  }
}
export default withStyles(styles, { name: 'SystemMessageList' })(
  SystemMessageList,
)
