import { AddAlert, NewReleases } from '@material-ui/icons'

export const systemMessageTypes = [
  {
    id: 1,
    name: 'Service Announcement',
    icon: <AddAlert justIcon size='sm' />,
  },
  {
    id: 2,
    name: 'Release Log',
    icon: <NewReleases justIcon size='sm' />,
  },
]
