import { Tabs } from 'antd'

const { TabPane } = Tabs
export default ({ options, ...props }) => {
  return (
    <Tabs
      type='card'
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
            style={{
              border: '1px solid #e8e8e8',
              padding: 8,
            }}
          >
            {o.content}
          </TabPane>
        )
      })}
    </Tabs>
  )
}
