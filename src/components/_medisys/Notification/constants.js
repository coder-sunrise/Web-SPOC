import Info from '@material-ui/icons/Info'
import Settings from '@material-ui/icons/Settings'
import {
  primaryColor,
  dangerColor,
  successColor,
  roseColor,
  infoColor,
  warningColor,
} from 'mui-pro-jss'
import { NOTIFICATION_TYPE, APPNOTIFICATION_SCHEMA } from '@/utils/constants'

export const TITLE = {
  [NOTIFICATION_TYPE.QUEUE]: 'Q. No.',
  [NOTIFICATION_TYPE.CODETABLE]: '',
  [NOTIFICATION_TYPE.ERROR]: '',
}

export const COLOR = {
  [NOTIFICATION_TYPE.QUEUE]: '#f0f8ff',
  [NOTIFICATION_TYPE.CODETABLE]: '#f0f8ff',
  [NOTIFICATION_TYPE.ERROR]: '#ffc7ce',
}

export const TYPES = [
  // {
  //   id: 1,
  //   name: 'Queue',
  // },
  {
    id: APPNOTIFICATION_SCHEMA.LAB.id,
    name: APPNOTIFICATION_SCHEMA.LAB.name,
  },
  {
    id: APPNOTIFICATION_SCHEMA.RADIOLOGY.id,
    name: APPNOTIFICATION_SCHEMA.RADIOLOGY.name,
  },
  // {
  //   id: APPNOTIFICATION_SCHEMA.PHARMACY.id,
  //   name: APPNOTIFICATION_SCHEMA.PHARMACY.name,
  // },
  {
    id: APPNOTIFICATION_SCHEMA.MC.id,
    name: APPNOTIFICATION_SCHEMA.MC.name,
  },
  // {
  //   id: 2,
  //   name: 'Setting',
  // },
  {
    id: 3,
    name: 'Error',
    excludeBadgeCount: true,
  },
  // {
  //   id: 4,
  //   name: 'System Info',
  // },
]

export const ICONS = {
  [NOTIFICATION_TYPE.QUEUE]: <Info style={{ color: infoColor }} />,
  [NOTIFICATION_TYPE.CODETABLE]: <Settings style={{ color: infoColor }} />,
  [NOTIFICATION_TYPE.ERROR]: <Info style={{ color: dangerColor }} />,
}
