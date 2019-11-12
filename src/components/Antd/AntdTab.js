import { Tabs } from 'antd'

const { TabPane } = Tabs
export default ({ options, tabStyle, ...props }) => {
  return (
    <Tabs
      type='card'
      // animated={false}
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
