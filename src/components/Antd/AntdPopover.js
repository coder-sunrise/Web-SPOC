import { Popover } from 'antd'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

export default ({
  icon = (
    <ErrorOutline
      style={{
        position: 'absolute',
        color: 'orange',
        top: 15,
      }}
    />
  ),
  children,
  content,
  ...props
}) => {
  return (
    <Popover
      content={
        <div>
          {icon}
          {content}
        </div>
      }
      trigger='click'
      {...props}
    >
      {children}
    </Popover>
  )
}
