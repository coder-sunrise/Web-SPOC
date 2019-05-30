export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  //
  // login
  {
    path: '/login',
    component: './Login',
    hideInMenu: true,
  },
  // login
  //
  // EMR
  {
    path: '/emr',
    component: '../layouts/BasicLayout',
    Routes: [
      'src/pages/Authorized',
    ],
    authority: [
      'admin',
      'user',
      'guest',
    ],
    routes: [
      { path: '/emr', redirect: '/emr/queue' },
      // queue
      {
        path: '/emr/queue',
        name: 'queue',
        system: 'emr',
        component: './Reception/Queue',
        icon: 'queue',
        exact: true,
      },
      {
        hideInMenu: true,
        path: '/emr/queue/patientdashboard',
        name: 'patientdashboard',
        component: './PatientDashboard',
      },
      {
        path: '/emr/queue/patientdashboard/consultation/:id',
        name: 'consultation',
        hideInMenu: true,
        component: './PatientDashboard/Consultation',
      },
      {
        path: '/emr/patientdb',
        icon: 'account_box',
        name: 'patientdb',
        // component: '',
      },
      {
        path: '/emr/forms',
        icon: 'assignment',
        name: 'forms',
        // component: '',
      },
      {
        path: '/emr/labsresult',
        icon: 'poll',
        name: 'labsresult',
        // component: '',
      },
      {
        path: '/emr/settings',
        icon: 'settings',
        name: 'settings',
        // component: '',
      },
      // queue
      //
      // patient dashboard
      // {
      //   path: '/emr/patientdashboard',
      //   system: 'EMR',
      //   icon: 'group',
      //   name: 'patientdashboard',
      //   routes: [
      //     {
      //       path: '/emr/patientdashboard',
      //       name: 'patientdashboard',
      //       component: './PatientDashboard',
      //     },
      //     {
      //       path: '/emr/patientdashboard/consultation/:id',
      //       name: 'consultation',
      //       hideInMenu: true,
      //       component: './PatientDashboard/Consultation',
      //     },
      //   ],
      // },
      // patiend dashboard
      //
    ],
  },
  // EMR
  //
  // CMS
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: [ 'src/pages/Authorized' ],
    authority: [ 'admin', 'user', 'guest' ],
    routes: [
      // dashboard
      { path: '/', redirect: '/reception/queue' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        hideInMenu: true,
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
            mini: 'AS',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
            mini: 'MT',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
            mini: 'WK',
          },
        ],
      },
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
            component: './Reception/Queue/Dispense',
          },
          {
            path: '/reception/appointment',
            name: 'appointment',
            mini: 'APT',
            component: './Reception/Appointment',
          } /* ,
          {
            path: '/form/step-form',
            name: 'stepform',
            // component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                // component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                // component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                // component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            // component: './Forms/AdvancedForm',
          }, */,
        ],
      },
      //
      // Patient Database
      {
        path: '/patientdb',
        icon: 'group',
        name: 'patient',
        routes: [
          {
            path: '/patientdb/new',
            name: 'new',
            mini: 'NP',
            component: './PatientDatabase/New',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/patientdb/new/personal',
                name: 'Personal Info',
                // component: './PatientDatabase/Personal',
              },
              {
                path: '/patientdb/new/emergency',
                name: 'Emergency Contact',
                // component: './PatientDatabase/EmergencyContact',
              },
              {
                path: '/patientdb/new/allergies',
                name: 'Allergies',
                // component: './PatientDatabase/Allergies',
              },
              {
                path: '/patientdb/new/schemes',
                name: 'Schemes',
                // component: './PatientDatabase/Schemes',
              },
            ],
          },
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
        path: '/sms',
        icon: 'sms',
        name: 'SMS',
        system: 'CMS',
        routes: [
          {
            path: '/sms',
            name: 'Reminder',
            component: './sms',
            mini: 'RM',
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
            component: './Inventory/Master/Consumable/Detail',
          },
          {
            path: '/inventory/master/medication',
            name: 'medication.detail',
            hideInMenu: true,
            component: './Inventory/Master/Medication/Detail',
          },
          {
            path: '/inventory/master/vaccination',
            name: 'vaccination.detail',
            hideInMenu: true,
            component: './Inventory/Master/Vaccination/Detail',
          },
          {
            path: '/inventory/master/package',
            name: 'package.detail',
            hideInMenu: true,
            component: './Inventory/Master/Package/Detail',
          },
          {
            path: '/inventory/pd',
            name: 'pd',
            // component: './Inventory/PurchaseReceving',
            mini: 'PD',
          },
          {
            path: '/inventory/pd/detail',
            name: 'pd.detail',
            hideInMenu: true,
            component: './Inventory/PurchaseDelivery/Detail',
          },
        ],
      },
      //
      // Test Component
      {
        // hideInMenu: true,
        path: '/development',
        name: 'Development',
        routes: [
          {
            path: '/development/pdf',
            name: 'pdf',
            component: './Development/PDF',
            mini: 'PDF',
          },
          {
            path: '/development/masonry',
            name: 'Masonry',
            mini: 'MS',
            component: './Development/Masonry',
          },
        ],
      },
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
            path: '/finance/invoice/:id',
            name: 'invoice/detail',
            hideInMenu: true,
            component: './Finance/Invoice/Detail',
          },
          {
            path: '/finance/note',
            name: 'credit/debitnote',
            component: './Finance/CreditDebitNote',
            mini: 'CD',
          },
          {
            path: '/finance/billing',
            name: 'corporate-billing',
            mini: 'CB',
            exact: true,
            component: './Finance/CorporateBilling',
          },
          {
            path: '/finance/billing/:companyName',
            name: 'corporate-billing/detail',
            hideInMenu: true,
            component:
              './Finance/CorporateBilling/Detail/CorporateBillingDetail',
          },
          {
            path: '/finance/deposit',
            name: 'deposit',
            mini: 'DP',
            component: './Finance/Deposit',
          },
          {
            path: '/finance/deposit/:depositNo',
            name: 'invoice/detail',
            hideInMenu: true,
            component: './Finance/Deposit/Detail/index.js',
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
            path: '/finance/scheme/:id',
            name: 'scheme/detail',
            hideInMenu: true,
            component: './Finance/Scheme/Detail',
          },
        ],
      },

      //
      // Report
      {
        path: '/report',
        icon: 'library_books',
        name: 'Report',
        // component: './Report',
      },

      {
        path: '/queuelisting',
        system: 'EMR',
        icon: 'local_hospital',
        name: 'queuelisting',
        // component: './QueueListing',
      },
      //
      // EMR
      {
        path: '/patientdashboard',
        system: 'EMR',
        icon: 'group',
        name: 'patientdashboard',
        routes: [
          {
            path: '/patientdashboard',
            name: 'patientdashboard',
            component: './PatientDashboard',
          },
          {
            path: '/patientdashboard/consultation/:id',
            name: 'consultation',
            hideInMenu: true,
            component: './PatientDashboard/Consultation',
          },
        ],
      },
      // EMR
      //
      // // Patient View
      // {
      //   path: '/patient',
      //   icon: 'group',
      //   name: 'patient',
      //   hideInMenu: true,
      //   routes: [
      //     {
      //       path: '/patient/detail',
      //       name: 'Patient Detail',
      //       mini: 'NP',
      //       component: './Patient',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/patientdb/new/personal',
      //           name: 'Personal Info',
      //           // component: './PatientDatabase/Personal',
      //         },
      //         {
      //           path: '/patientdb/new/emergency',
      //           name: 'Emergency Contact',
      //           // component: './PatientDatabase/EmergencyContact',
      //         },
      //         {
      //           path: '/patientdb/new/allergies',
      //           name: 'Allergies',
      //           component: './PatientDatabase/Allergies',
      //         },
      //         {
      //           path: '/patientdb/new/schemes',
      //           name: 'Schemes',
      //           // component: './PatientDatabase/Schemes',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/patientdb/search',
      //       name: 'search',
      //       mini: 'SP',
      //       // component: './PatientDatabase/Search',
      //     },
      //   ],
      // },
      //
      // Human Resource
      // {
      //   path: '/humanresource',
      //   icon: 'humanresource',
      //   name: 'Human Resource',
      //   // component: './HumanResource',
      // },
      // //
      // // Settings
      // {
      //   path: '/settings',
      //   icon: 'Settings',
      //   name: 'Settings',
      //   // component: './Settings',
      // },
      // // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   hideInMenu: true,

      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       // component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       authority: [
      //         'admin',
      //       ],
      //       // component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
]
