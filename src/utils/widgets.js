import Loadable from 'react-loadable'
import { Menu, Dropdown } from 'antd'

import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
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
import Loading from '@/components/PageLoading/index'
import { AuthorizedContext, IconButton, Button } from '@/components'

const widgets = [
  {
    id: '1',
    name: 'Clinical Notes',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ClinicalNotes'),
      loading: Loading,
    }),
    model: 'clinicalnotes',

    disabled: true,
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
    toolbarAddon: (
      <AuthorizedContext>
        {(r) => {
          if (r.edit.rights === 'disable') return null
          return (
            // <Dropdown
            //   overlay={
            //     <Menu>
            //       <Menu.Item
            //         onClick={() => {
            //           window.g_app._store.dispatch({
            //             type: 'clinicalnotes/updateState',
            //             payload: {
            //               showAttachmentModal: true,
            //             },
            //           })
            //         }}
            //       >
            //         Upload Attachment
            //       </Menu.Item>
            //     </Menu>
            //   }
            //   trigger={[
            //     'click',
            //   ]}
            // >
            //   <Button
            //     justIcon
            //     round
            //     color='primary'
            //     size='sm'
            //     style={{ float: 'left' }}
            //   >
            //     <MoreVert />
            //   </Button>
            // </Dropdown>
            null
          )
        }}
      </AuthorizedContext>
    ),
  },
  {
    id: '2',
    name: 'Diagnosis',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Diagnosis'),
      loading: Loading,
    }),
    model: 'diagnosis',
    associatedProps: [
      'corDiagnosis',
    ],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
    toolbarAddon: (
      <AuthorizedContext>
        {(r) => {
          if (r.edit.rights === 'disable') return null
          return (
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
          )
        }}
      </AuthorizedContext>
    ),
  },
  {
    id: '3',
    name: 'Consultation Document',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ConsultationDocument'),
      loading: Loading,
    }),
    model: 'consultationDocument',
    layoutConfig: {},
    toolbarAddon: (
      <AuthorizedContext>
        {(r) => {
          if (r.edit.rights === 'disable') return null
          return (
            <Tooltip title='Add Consultation Document'>
              <IconButton
                style={{ float: 'left' }}
                onClick={() => {
                  window.g_app._store.dispatch({
                    type: 'consultationDocument/updateState',
                    payload: {
                      showModal: true,
                      type: '3',
                      entity: undefined,
                    },
                  })
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          )
        }}
      </AuthorizedContext>
    ),
  },
  {
    id: '4',
    name: 'Patient History',
    component: Loadable({
      loader: () => import('@/pages/Widgets/PatientHistory'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget mode='integrated' />
      },
      loading: Loading,
    }),
    model: 'patientHistory',

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
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget mode='consultation' />
      },
      // render (loaded, props) {
      //   console.log(loaded, props)
      //   let Component = loaded.default
      //   return <Component {...props} />
      // },
    }),
    model: 'orders',
    // associatedProps: [
    //   'corOrderAdjustment',
    //   'corService',
    //   'corPrescriptionItem',
    //   'corVaccinationItem',
    // ],
    onRemove: () => {
      window.g_app._store.dispatch({
        type: 'orders/deleteRow',
      })
    },
    layoutConfig: {
      style: {
        padding: '0 5px',
      },
    },
  },
  // {
  //   id: '6',
  //   name: 'Result History',
  //   component: Loadable({
  //     loader: () => import('@/pages/Widgets/ResultHistory'),
  //     loading: Loading,
  //   }),
  //   model: 'resultHistory',
  //   layoutConfig: {
  //     style: {},
  //   },
  // },
  {
    id: '7',
    name: 'Vital Sign',
    component: Loadable({
      loader: () => import('@/pages/Widgets/VitalSign'),
      loading: Loading,
    }),
    model: 'patientVitalSign',
    associatedProps: [
      'corPatientNoteVitalSign',
    ],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
    toolbarAddon: (
      <Tooltip title='Add Vital Sign'>
        <IconButton
          style={{ float: 'left' }}
          onClick={() => {
            window.g_app._store.dispatch({
              type: 'patientVitalSign/updateState',
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
  // {
  //   id: '1002',
  //   name: 'Dental Chart',
  //   component: Loadable({
  //     loader: () => import('@/pages/Widgets/DentalChartDemo'),
  //     loading: Loading,
  //   }),
  //   layoutConfig: {
  //     style: {
  //       height: 'calc(100% - 36px)',
  //     },
  //   },
  // },
]

module.exports = {
  widgets,
  ...module.exports,
}
