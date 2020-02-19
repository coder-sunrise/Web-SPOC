import { NOTIFICATION_TYPE } from '@/utils/constants'

export const TITLE = {
  [NOTIFICATION_TYPE.QUEUE]: '[Queue] Q. No.',
  [NOTIFICATION_TYPE.CODETABLE]: '[Setting]',
  [NOTIFICATION_TYPE.ERROR]: '[ERROR]',
}

export const COLOR = {
  [NOTIFICATION_TYPE.QUEUE]: '#f0f8ff',
  [NOTIFICATION_TYPE.CODETABLE]: '#f0f8ff',
  [NOTIFICATION_TYPE.ERROR]: '#ffc7ce',
}
