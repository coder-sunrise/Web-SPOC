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

export const modelKey = 'queueLog/'

export const VISIT_STATUS = {
  WAITING: 'WAITING',
  IN_CONS: 'IN CONS',
  PAUSED: 'PAUSED',
  DISPENSE: 'DISPENSE',
  BILLING: 'BILLING',
  ORDER_UPDATED: 'ORDER UPDATED',
  COMPLETED: 'COMPLETED',
  UPCOMING_APPT: 'UPCOMING APPT.',
}

export const filterMap = {
  [StatusIndicator.ALL]: [
    ...Object.keys(VISIT_STATUS).map((key) => VISIT_STATUS[key]),
  ].filter((item) => item !== VISIT_STATUS.UPCOMING_APPT),
  [StatusIndicator.APPOINTMENT]: [
    VISIT_STATUS.UPCOMING_APPT,
  ],
  [StatusIndicator.WAITING]: [
    VISIT_STATUS.WAITING,
  ],
  [StatusIndicator.IN_PROGRESS]: [
    VISIT_STATUS.DISPENSE,
    VISIT_STATUS.IN_CONS,
    VISIT_STATUS.PAUSED,
  ],
  [StatusIndicator.COMPLETED]: [
    VISIT_STATUS.COMPLETED,
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
    label: 'Dispense',
    Icon: Money,
    disabled: false,
  },
  {
    id: 1.1,
    label: 'Bill',
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
