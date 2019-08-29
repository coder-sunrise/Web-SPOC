// material ui icons
import Edit from '@material-ui/icons/Edit'
import Duplicate from '@material-ui/icons/FileCopy'
import Print from '@material-ui/icons/Print'

export const ContextMenuOptions = [
  {
    id: 0,
    label: 'Edit',
    Icon: Edit,
    disabled: false,
  },
  {
    id: 1,
    label: 'Duplicate PO',
    Icon: Duplicate,
    disabled: false,
  },
  { isDivider: true },
  {
    id: 2,
    label: 'Print',
    Icon: Print,
    disabled: false,
  },
]
