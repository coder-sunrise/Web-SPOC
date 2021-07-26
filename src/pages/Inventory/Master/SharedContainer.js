import { connect } from 'dva'
import { CardContainer } from '@/components'

const SharedContainer = ({ global, children, title, ...rest }) => {
  const height = global.mainDivHeight
  return (
    <CardContainer
      icon={false}
      title={() => <h3 style={{ textAlign: 'center' }}>{title}</h3>}
      {...rest}
      style={
        height > 0
          ? {
              height: height - 95 - 70,
              overflow: 'auto',
              overflowX: 'hidden',
              padding: 4,
            }
          : { padding: 4 }
      }
    >
      {children}
    </CardContainer>
  )
}

export default connect(({ global }) => ({
  global,
}))(SharedContainer)
