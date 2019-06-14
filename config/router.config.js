const routes = [
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
  //
  // CMS
  {
    path: '/',
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
            hideInMenu: true,
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
      // Forms
      {
        path: '/forms',
        icon: 'assignment',
        name: 'forms',
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
        // component: './Report',
      },
      // Report
      //
      // Human Resource
      {
        path: '/human-resource',
        icon: 'perm_identity',
        name: 'humanResource',
        // component: '',
      },
      // Human Resource
      //
      // Settings
      {
        path: '/setting',
        icon: 'settings',
        name: 'setting',
        routes: [
          {
            path: '/setting/clinic-setting',
            mini: 'CS',
            name: 'clinicSetting',
            // component: '',
          },
          {
            path: '/setting/system-setting',
            mini: 'SS',
            name: 'systemSetting',
            // component: '',
          },
          {
            path: '/setting/print-setting',
            mini: 'PS',
            name: 'printSetting',
            // component: '',
          },
        ],
        // component: '',
      },
      // Settings
      {
        hideInMenu: process.env.NODE_ENV === 'production',
        path: '/development',
        name: 'Development',
        routes: [
          {
            path: '/development/masonry',
            name: 'Masonry',
            mini: 'MS',
            component: './Development/Masonry',
          },
          {
            path: '/development/control',
            name: 'Control',
            mini: 'C',
            component: './Development/Control',
          },
          {
            path: '/development/new-calendar',
            name: 'Calendar',
            mini: 'CA',
            // component: './Development/BigCalendar',
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
