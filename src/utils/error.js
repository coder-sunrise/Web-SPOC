import { notification } from '@/components'

const Error = (message, status) => {
  return {
    message,
    status,
  }
}

export const showErrorNotification = (header, message) => {
  notification.destroy()
  notification.error({
    message: (
      <div>
        <h4>{header}</h4>
        <p>{message}</p>
      </div>
    ),
    duration: 0,
  })
}

export default Error
