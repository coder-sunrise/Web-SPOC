import { Tabs } from 'antd'
import withStyles from '@material-ui/core/styles/withStyles'
// import { classes } from 'istanbul-lib-coverage'

const { TabPane } = Tabs

const STYLES = (theme) => {
  return {
    main: {},
  }
}
const AntdTab = ({ classes, options, tabStyle, ...props }) => {
  return (
    <Tabs
      type='card'
      // animated={false}
      className={classes.main}
      tabBarStyle={{
        paddingLeft: 8,
        top: 1,
        position: 'relative',
        margin: 0,
      }}
      {...props}
    >
      {options.map((o) => {
        return (
          <TabPane
            tab={o.name}
            key={o.id}
            disabled={o.disabled}
            style={
              tabStyle || {
                // border: '1px solid #e8e8e8',
                padding: 8,
              }
            }
          >
            {o.content}
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default withStyles(STYLES, { name: 'Tabs', withTheme: true })(AntdTab)
