// material ui icons
import Edit from '@material-ui/icons/Edit'
import Money from '@material-ui/icons/AttachMoney'
import Delete from '@material-ui/icons/Delete'
import Person from '@material-ui/icons/Person'
import Book from '@material-ui/icons/LibraryBooks'
import Play from '@material-ui/icons/PlayArrow'
import PlayCircle from '@material-ui/icons/PlayCircleOutlineOutlined'

export const StatusIndicator = {
  ALL: 'all',
  APPOINTMENT: 'appointment',
  WAITING: 'waiting',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
}

export const visitStatusCode = [
  'WAITING',
  'APPOINTMENT',
  'TO DISPENSE',
  'IN CONS',
  'PAUSED',
  'PAID',
  'OVERPAID',
  'COMPLETED',
]

export const modelKey = 'queueLog/'

export const filterMap = {
  [StatusIndicator.ALL]: [
    ...visitStatusCode,
  ].filter((item) => item !== 'APPOINTMENT'),
  [StatusIndicator.APPOINTMENT]: [
    'APPOINTMENT',
  ],
  [StatusIndicator.WAITING]: [
    'WAITING',
  ],
  [StatusIndicator.IN_PROGRESS]: [
    'TO DISPENSE',
    'IN CONS',
    'PAUSED',
  ],
  [StatusIndicator.COMPLETED]: [
    'PAID',
    'OVERPAID',
    'COMPLETED',
  ],
}

export const AppointmentContextMenu = [
  {
    id: 8,
    label: 'Register Visit',
    Icon: Edit,
    disabled: true,
  },
  {
    id: 9,
    label: 'Register Patient',
    Icon: Person,
    disabled: false,
  },
]

export const ContextMenuOptions = [
  {
    id: 0,
    label: 'Edit Visit',
    Icon: Edit,
    disabled: false,
  },
  {
    id: 1,
    label: 'Dispense & Bill',
    Icon: Money,
    disabled: false,
  },
  {
    id: 2,
    label: 'Delete Visit',
    Icon: Delete,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 3,
    label: 'Patient Profile',
    Icon: Person,
    disabled: false,
  },
  {
    id: 4,
    label: 'Patient Dashboard',
    Icon: Book,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 5,
    label: 'Start Consultation',
    Icon: Play,
    disabled: false,
  },
  {
    id: 6,
    label: 'Resume Consultation',
    Icon: PlayCircle,
    disabled: true,
  },
  {
    id: 7,
    label: 'Edit Consultation',
    Icon: Edit,
    disabled: true,
  },
]
