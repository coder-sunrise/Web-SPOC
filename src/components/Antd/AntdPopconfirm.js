import { Popconfirm } from 'antd'
import ErrorOutline from '@material-ui/icons/ErrorOutline'

export default ({ ...props }) => {
  return (
    <Popconfirm
      okText='Confirm'
      icon={
        <ErrorOutline
          style={{
            position: 'absolute',
            color: 'orange',
            top: 5,
          }}
        />
      }
      title='Are you sure?'
      {...props}
    />
  )
}
