import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { Menu, Dropdown } from 'antd'

import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
  MenuItem,
  Popper,
  Fade,
  ClickAwayListener,
  Divider,
  Fab,
  Slide,
  Tooltip,
} from '@material-ui/core'
import MoreHoriz from '@material-ui/icons/MoreHoriz'
import MoreVert from '@material-ui/icons/MoreVert'
import Clear from '@material-ui/icons/Clear'
import Add from '@material-ui/icons/Add'
import Edit from '@material-ui/icons/Edit'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import CompareArrows from '@material-ui/icons/CompareArrows'

const widgets = [
  {
    id: '1',
    name: 'Clinical Notes',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ClinicalNotes'),
      loading: Loading,
    }),
    disabled: true,
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
    toolbarAddon: (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>Upload Attachment</Menu.Item>
            <Menu.Divider />
            <Menu.Item>Add Scribble Notes</Menu.Item>
          </Menu>
        }
        trigger={[
          'click',
        ]}
      >
        <IconButton style={{ float: 'left' }}>
          <MoreHoriz />
        </IconButton>
      </Dropdown>
    ),
  },
  {
    id: '2',
    name: 'Diagnosis',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Diagnosis'),
      loading: Loading,
    }),
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
    toolbarAddon: (
      <Tooltip title='Add Diagnosis'>
        <IconButton
          style={{ float: 'left' }}
          onClick={() => {
            window.g_app._store.dispatch({
              type: 'diagnosis/updateState',
              payload: {
                shouldAddNew: true,
              },
            })
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    ),
  },
  {
    id: '3',
    name: 'Consultation Document',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ConsultationDocument'),
      loading: Loading,
    }),
    layoutConfig: {},
    toolbarAddon: (
      <Tooltip title='Add Consultation Document'>
        <IconButton
          style={{ float: 'left' }}
          onClick={() => {
            window.g_app._store.dispatch({
              type: 'consultationDocument/updateState',
              payload: {
                showModal: true,
              },
            })
          }}
        >
          <Add />
        </IconButton>
      </Tooltip>
    ),
  },
  {
    id: '4',
    name: 'Patient History',
    component: Loadable({
      loader: () => import('@/pages/Widgets/PatientHistory'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {
        padding: 5,
      },
    },
  },
  {
    id: '5',
    name: 'Orders',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Orders'),
      loading: Loading,
      // render (loaded, props) {
      //   console.log(loaded, props)
      //   let Component = loaded.default
      //   return <Component {...props} />
      // },
    }),
    layoutConfig: {
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: '6',
    name: 'Result History',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ResultHistory'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {},
    },
  },
  {
    id: '1001',
    name: 'Test Widget',
    component: Loadable({
      loader: () => import('@/pages/Widgets/TestWidget'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {},
    },
  },
  {
    id: '1002',
    name: 'Dental Chart',
    component: Loadable({
      loader: () => import('@/pages/Widgets/DentalChartDemo'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {
        height: 'calc(100% - 36px)',
      },
    },
  },
]

module.exports = {
  widgets,
  ...module.exports,
}
