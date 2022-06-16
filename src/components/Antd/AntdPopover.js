import { Popover } from 'antd'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

export default ({
  icon = (
    <ErrorOutline
      style={{
        color: 'orange',
        top: 15,
      }}
    />
  ),
  children,
  content,
  title,
  ...props
}) => {
  const getTitle = () => {
    if (title) {
      return (
        <div style={{ display: 'flex' }}>
          {icon !== null || icon !== undefined ? icon : ''}
          {title}
        </div>
      )
    }
  }

  return (
    <Popover
      getPopupContainer={node => node.parentNode || document.body}
      content={<div>{content}</div>}
      trigger='click'
      {...props}
      title={getTitle()}
    >
      {children}
    </Popover>
  )
}
