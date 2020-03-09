import { connect } from 'dva'
import { CardContainer } from '@/components'

const SharedContainer = ({ global, children }) => {
  const height = global.mainDivHeight
  console.log(height)
  return (
    <CardContainer
      hideHeader
      style={
        height > 0 ? (
          {
            height: height - 95 - 70,
            overflow: 'auto',
            overflowX: 'hidden',
            padding: 4,
          }
        ) : (
          { padding: 4 }
        )
      }
    >
      {children}
    </CardContainer>
  )
}

export default connect(({ global }) => ({
  global,
}))(SharedContainer)
