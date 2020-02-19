import Loadable from 'react-loadable'
// material ui
import Add from '@material-ui/icons/Add'
// common components
import Loading from '@/components/PageLoading/index'
import { Tooltip, AuthorizedContext, IconButton } from '@/components'
// utils
import { CLINIC_TYPE } from '@/utils/constants'

const clinicInfo = JSON.parse(localStorage.getItem('clinicInfo') || {})
const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo

const widgets = [
  {
    id: '1',
    name: clinicTypeFK === CLINIC_TYPE.GP ? 'Clinical Notes' : 'Dental Notes',
    accessRight: 'queue.consultation.widgets.clinicalnotes',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ClinicalNotes'),
      loading: Loading,
    }),
    model: 'clinicalnotes',
    persist: true,
    disabled: true,
    layoutConfig: {
      minW: 12,
      minH: 7,
      style: {
        padding: '0 5px',
      },
    },
    testProps: {
      test: '123',
    },
    toolbarAddon: (
      <AuthorizedContext>
        {(r) => {
          if (r.rights !== 'enable') return null
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
    accessRight: 'queue.consultation.widgets.diagnosis',
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
    // toolbarAddon: (
    //   <AuthorizedContext>
    //     {(r) => {
    //       if (r.rights !== 'enable') return null
    //       return (
    //         <Tooltip title='Add Diagnosis'>
    //           <IconButton
    //             style={{ float: 'left' }}
    //             className='non-dragable'
    //             onClick={() => {
    //               window.g_app._store.dispatch({
    //                 type: 'diagnosis/updateState',
    //                 payload: {
    //                   shouldAddNew: true,
    //                 },
    //               })
    //             }}
    //           >
    //             <Add />
    //           </IconButton>
    //         </Tooltip>
    //       )
    //     }}
    //   </AuthorizedContext>
    // ),
  },
  {
    id: '3',
    name: 'Consultation Document',
    accessRight: 'queue.consultation.widgets.consultationdocument',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ConsultationDocument'),
      loading: Loading,
    }),
    model: 'consultationDocument',
    layoutConfig: {},

    onRemove: () => {
      window.g_app._store.dispatch({
        type: 'consultationDocument/deleteRow',
      })
    },

    // toolbarAddon: (
    //   <AuthorizedContext>
    //     {(r) => {
    //       if (r && r.rights !== 'enable') return null

    //       return (
    //         <Tooltip title='Add Consultation Document'>
    //           <IconButton
    //             style={{ float: 'left' }}
    //             className='non-dragable'
    //             onClick={() => {
    //               window.g_app._store.dispatch({
    //                 type: 'consultationDocument/updateState',
    //                 payload: {
    //                   showModal: true,
    //                   type: '5',
    //                   entity: undefined,
    //                 },
    //               })
    //             }}
    //           >
    //             <Add />
    //           </IconButton>
    //         </Tooltip>
    //       )
    //     }}
    //   </AuthorizedContext>
    // ),
  },
  {
    id: '4',
    name: 'Patient History',
    accessRight: 'queue.consultation.widgets.patienthistory',
    component: Loadable({
      loader: () => import('@/pages/Widgets/PatientHistory'),
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget mode='integrated' />
      },
      loading: Loading,
    }),
    model: 'patientHistory',
    disableDeleteWarning: true,
    layoutConfig: {
      style: {
        padding: 5,
      },
    },
  },
  {
    id: '5',
    name: 'Orders',
    accessRight: 'queue.consultation.widgets.order',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Orders'),
      loading: Loading,
      render: (loaded, p) => {
        let Cmpnet = loaded.default
        return <Cmpnet {...p} widget />
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
    accessRight: 'queue.consultation.widgets.vitalsign',
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
          className='non-dragable'
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
    id: '21',
    name: 'Dental Chart',
    accessRight: 'queue.consultation.widgets.dentalchart',
    component: Loadable({
      loader: () => import('@/pages/Widgets/DentalChart'),
      loading: Loading,
    }),
    onUnmount: () => {
      window.g_app._store.dispatch({
        type: 'dentalChartComponent/reset',
      })
    },
  },
  {
    id: '8',
    name: 'Attachment',
    accessRight: 'queue.consultation.widgets.attachment',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Attachment'),
      loading: Loading,
    }),
    model: 'attachment',
    associatedProps: [
      'corAttachment',
    ],
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
  },
]

module.exports = {
  widgets,
  ...module.exports,
}
