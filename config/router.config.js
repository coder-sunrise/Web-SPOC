const routes = [
  // // user
  // {
  //   path: '/user',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     { path: '/user', redirect: '/user/login' },
  //     { path: '/user/login', component: './User/Login' },
  //     { path: '/user/register', component: './User/Register' },
  //     { path: '/user/register-result', component: './User/RegisterResult' },
  //   ],
  // },
  //
  // login
  {
    path: '/login',
    component: './Login',
    hideInMenu: true,
  },
  //
  // CMS
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: [
      'src/pages/Authorized',
    ],
    authority: [
      { name: 'admin', rights: 'enable' },
      { name: 'user', rights: 'enable' },
      { name: 'guest', rights: 'enable' },
      { name: 'tester', rights: 'enable' },
    ],
    routes: [
      // Main Landing Page.
      { path: '/', redirect: '/reception/queue' },
      // Reception
      {
        path: '/reception',
        icon: 'local_hospital',
        name: 'reception',
        routes: [
          {
            path: '/reception/queue',
            name: 'queue',
            component: './Reception/Queue',
            mini: 'QE',
            exact: true,
          },
          {
            path: '/reception/queue/dispense/:visitRefNo',
            name: 'dispense',
            hideInMenu: true,
            exact: true,
            component: './Dispense',
          },
          {
            path: '/reception/queue/dispense/:visitRefNo/billing',
            name: 'billing',
            hideInMenu: true,
            exact: true,
            component: './Dispense/Billing',
          },
          {
            path: '/reception/appointment',
            name: 'appointment',
            mini: 'AP',
            component: './Reception/BigCalendar',
          },
          {
            hideInMenu: true,
            path: '/reception/queue/patientdashboard',
            name: 'patientdashboard',
            component: './PatientDashboard',
          },
          {
            path: '/reception/queue/patientdashboard/consultation/:id',
            name: 'consultation',
            hideInMenu: true,
            component: './PatientDashboard/Consultation',
          },
        ],
      },
      //
      // Patient Database
      {
        path: '/patientdb',
        icon: 'group',
        name: 'patient',
        routes: [
          // {
          //   path: '/patientdb/new',
          //   name: 'new',
          //   mini: 'NP',
          //   component: './PatientDatabase/New',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/patientdb/new/personal',
          //       name: 'Personal Info',
          //       // component: './PatientDatabase/Personal',
          //     },
          //     {
          //       path: '/patientdb/new/emergency',
          //       name: 'Emergency Contact',
          //       // component: './PatientDatabase/EmergencyContact',
          //     },
          //     {
          //       path: '/patientdb/new/allergies',
          //       name: 'Allergies',
          //       // component: './PatientDatabase/Allergies',
          //     },
          //     {
          //       path: '/patientdb/new/schemes',
          //       name: 'Schemes',
          //       // component: './PatientDatabase/Schemes',
          //     },
          //   ],
          // },
          {
            path: '/patientdb/search',
            name: 'search',
            mini: 'SP',
            component: './PatientDatabase/Search',
          },
        ],
      },
      //
      // SMS
      {
        path: '/communication',
        icon: 'sms',
        name: 'communication',
        system: 'CMS',
        routes: [
          {
            path: '/communication/sms',
            name: 'sms',
            component: './sms',
          },
          // {
          //   path: '/sms/adhoc',
          //   name: 'Adhoc',
          //   // component: './sms/adhoc',
          // },
        ],
      },
      //
      // Inventory
      {
        path: '/inventory',
        icon: 'kitchen',
        name: 'inventory',
        // component: './inventory',
        routes: [
          {
            path: '/inventory/master',
            name: 'master',
            component: './Inventory/Master',
            mini: 'IM',
          },
          {
            path: '/inventory/master/consumable',
            name: 'consumable.detail',
            hideInMenu: true,
            component: './Inventory/Master/Consumable/Details',
          },
          {
            path: '/inventory/master/medication',
            name: 'medication.detail',
            hideInMenu: true,
            component: './Inventory/Master/Medication/Details',
          },
          {
            path: '/inventory/master/vaccination',
            name: 'vaccination.detail',
            hideInMenu: true,
            component: './Inventory/Master/Vaccination/Details',
          },
          {
            path: '/inventory/master/package',
            name: 'package.detail',
            hideInMenu: true,
            component: './Inventory/Master/Package/Details',
          },
          // {
          //   path: '/inventory/pd',
          //   name: 'pd',
          //   // component: './Inventory/PurchaseReceving',
          //   mini: 'PD',
          // },
          // {
          //   path: '/inventory/pd/detail',
          //   name: 'pd.detail',
          //   hideInMenu: true,
          //   component: './Inventory/PurchaseDelivery/Detail',
          // },
        ],
      },
      //
      // Test Component

      //
      // Finance
      {
        path: '/finance',
        icon: 'attach_money',
        name: 'finance',
        routes: [
          {
            path: '/finance/invoice',
            name: 'invoice/list',
            component: './Finance/Invoice',
            mini: 'IP',
            exact: true,
          },
          {
            path: '/finance/invoice/:invoiceNo',
            name: 'invoice/detail',
            hideInMenu: true,
            component: './Finance/Invoice/Details',
          },
          {
            path: '/finance/note',
            name: 'credit/debitnote',
            hideInMenu: true,
            // component: './Finance/CreditDebitNote',
            mini: 'CD',
          },
          {
            path: '/finance/billing',
            name: 'corporate-billing',
            mini: 'CB',
            exact: true,
            // component: './Finance/CorporateBilling',
          },
          {
            path: '/finance/billing/:companyName',
            name: 'corporate-billing/detail',
            hideInMenu: true,
            // component:
            //   './Finance/CorporateBilling/Detail/CorporateBillingDetail',
          },
          {
            path: '/finance/deposit',
            name: 'deposit',
            mini: 'DP',
            // component: './Finance/Deposit',
          },
          {
            path: '/finance/deposit/:depositNo',
            name: 'invoice/detail',
            hideInMenu: true,
            // component: './Finance/Deposit/Detail/index.js',
          },
          {
            path: '/finance/statement',
            name: 'statement',
            mini: 'ST',
            component: './Finance/Statement',
          },
          {
            path: '/finance/statement/details/:statementNo',
            name: 'statement/details',
            hideInMenu: true,
            component: './Finance/Statement/Details/StatementDetails',
          },
          {
            path: '/finance/expense',
            name: 'doctor-expense',
            mini: 'DE',
            exact: true,
            component: './Finance/DoctorExpense',
          },
          {
            path: '/finance/scheme',
            name: 'scheme',
            mini: 'SC',
            component: './Finance/Scheme',
          },
          {
            path: '/finance/scheme/details',
            name: 'scheme/detail',
            hideInMenu: true,
            component: './Finance/Scheme/Details',
          },
        ],
      },
      // Forms
      {
        path: '/forms',
        icon: 'assignment',
        name: 'forms',
        hideInMenu: true,
        // component: './Forms',
      },
      // Forms
      //
      // Lab Report
      {
        path: '/labsresult',
        icon: 'poll',
        name: 'labsresult',
        // component: '',
      },
      // Lab Report
      //
      // Report
      {
        path: '/report',
        icon: 'library_books',
        name: 'report',
        component: './Report',
      },
      // Report
      //
      // Human Resource
      {
        path: '/human-resource',
        icon: 'perm_identity',
        name: 'humanResource',
        hideInMenu: true,
        // component: '',
      },
      // Human Resource
      //
      // Claim Submission
      {
        path: '/claim-submission',
        icon: 'receipt',
        name: 'claimSubmission',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/claim-submission',
            name: 'chas',
            component: './ClaimSubmission',
          },
          {
            path: '/claim-submission/chas',
            name: 'chas',
            component: './ClaimSubmission/chas',
          },
          {
            path: '/claim-submission/chas/invoice/:invoiceNo',
            name: 'patientInvoice',
            hideInMenu: true,
            component: './Finance/Invoice/Details',
          },
          {
            path: '/claim-submission/medisave',
            name: 'medisave',
            component: './ClaimSubmission/medisave',
          },
          {
            path: '/claim-submission/medisave/invoice/:invoiceNo',
            name: 'patientInvoice',
            hideInMenu: true,
            component: './Finance/Invoice/Details',
          },
        ],
      },
      // Claim Submission
      //
      // Settings
      {
        path: '/setting',
        icon: 'settings',
        name: 'setting',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/setting',
            name: 'setting',
            component: './Setting',
            // hideInMenu: true,
          },
          {
            path: '/setting/clinicinfo',
            name: 'clinicinfo',
            component: './Setting/ClinicInfo',
          },
          {
            path: '/setting/service',
            name: 'service',
            component: './Setting/Service',
          },
          {
            path: '/setting/room',
            name: 'room',
            component: './Setting/Room',
          },
          {
            path: '/setting/clinicbreakhour',
            name: 'clinicbreakhour',
            component: './Setting/ClinicBreakHour',
          },
          {
            path: '/setting/publicholiday',
            name: 'publicholiday',
            component: './Setting/PublicHoliday',
          },
          {
            path: '/setting/participantrole',
            name: 'participantrole',
            component: './Setting/ParticipantRole',
          },
          {
            path: '/setting/roomblock',
            name: 'roomblock',
            component: './Setting/RoomBlock',
          },
          {
            path: '/setting/doctorblock',
            name: 'doctorblock',
            component: './Setting/DoctorBlock',
          },
          {
            path: '/setting/userprofile',
            name: 'userprofile',
            component: './Setting/UserProfile',
          },
          {
            path: '/setting/userprofile/new',
            name: 'newuserprofile',
            component: './Setting/UserProfile/Details',
          },
          {
            path: '/setting/userprofile/:id',
            name: 'edituserprofile',
            component: './Setting/UserProfile/Details',
          },
          {
            path: '/setting/userrole',
            name: 'userrole',
            component: './Setting/UserRole',
          },
          {
            path: '/setting/revenuecategory',
            name: 'revenuecategory',
            component: './Setting/RevenueCategory',
          },
          {
            path: '/setting/consumableuom',
            name: 'consumableuom',
            component: './Setting/ConsumableUOM',
          },
          {
            path: '/setting/medicationUOM',
            name: 'medicationUOM',
            component: './Setting/MedicationUOM',
          },
          {
            path: '/setting/medicationgroup',
            name: 'medicationgroup',
            component: './Setting/MedicationGroup',
          },
          {
            path: '/setting/consumablegroup',
            name: 'consumablegroup',
            component: './Setting/ConsumableGroup',
          },
          {
            path: '/setting/medicationdosage',
            name: 'medicationdosage',
            component: './Setting/MedicationDosage',
          },
          {
            path: '/setting/clinicoperationhour',
            name: 'clinicoperationhour',
            component: './Setting/ClinicOperationHour',
          }, 
          {
            path: '/setting/gstsetup',
            name: 'gstsetup',
            component: './Setting/GST',
          },
          

          
        ],
      },
      // Settings
      {
        hideInMenu: process.env.NODE_ENV === 'production',
        path: '/development',
        name: 'Development',
        routes: [
          {
            path: '/development/control',
            name: 'Control',
            mini: 'C',
            component: './Development/Control',
          },
          // {
          //   path: '/development/imageeditor',
          //   name: 'TUIImageEditor',
          //   mini: 'IE',
          //   component: './Development/TUIImageEditor',
          // },
          {
            path: '/development/imageeditor2',
            name: 'LCImageEditor',
            mini: 'CA',
            component: './Development/LCImageEditor',
          },
          {
            path: '/development/scribble',
            name: 'Scribble',
            mini: 'CA',
            component: './Development/Scribble',
          },
          {
            path: '/development/reportviewer',
            name: 'Report Sample',
            mini: 'RS',
            component: './Development/Report',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
]
export default routes
