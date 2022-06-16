import { Popconfirm } from 'antd'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

export default ({ ...props }) => {
  return (
    <Popconfirm
      // global effect?
      // getPopupContainer={node => node.parentNode || document.body}
      okText='Confirm'
      icon={
        <ErrorOutline
          style={{
            position: 'absolute',
            color: 'orange',
            top: 7,
          }}
        />
      }
      title='Are you sure?'
      {...props}
    />
  )
}
