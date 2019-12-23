import devRoutes from './router.dev.config'

const _routes = [
  // login
  {
    path: '/user',
    component: '../layouts/LandingLayout',
    routes: [
      {
        path: '/user/login',
        component: './NewLogin',
        hideInMenu: true,
      },
      {
        path: '/user/forgotpassword',
        component: './ForgotPassword',
        hideInMenu: true,
      },
    ],
  },
  // login
  //
  // Main routes
  {
    path: '/',
    component: '../layouts/BasicLayout',
    // Routes: [
    //   'src/pages/Authorized',
    // ],
    // authority: [
    //   { name: 'admin', rights: 'enable' },
    //   { name: 'user', rights: 'enable' },
    //   { name: 'guest', rights: 'enable' },
    //   { name: 'tester', rights: 'enable' },
    // ],
    routes: [
      // Main Landing Page.
      { path: '/', redirect: '/reception/queue' },
      // Reception
      {
        path: '/reception',
        icon: 'local_hospital',
        name: 'reception',
        authority: [
          'reception',
        ],
        specialist: [
          'GP',
          'Dental',
        ],
        routes: [
          {
            path: '/reception/queue',
            name: 'queue',
            component: './Reception/Queue',
            mini: 'QE',
            exact: true,
            authority: [
              'reception/queue',
            ],
          },
          {
            path: '/reception/queue/consultation',
            name: 'consultation',
            observe: 'ConsultationPage',
            hideInMenu: true,
            exact: true,
            component: './Consultation',
          },
          {
            path: '/reception/queue/dispense',
            name: 'dispense',
            observe: 'EditOrder',
            hideInMenu: true,
            exact: true,
            component: './Dispense',
          },
          {
            path: '/reception/queue/billing',
            name: 'billing',
            hideInMenu: true,
            exact: true,
            component: './Billing',
          },
          {
            path: '/reception/appointment',
            name: 'appointment',
            mini: 'AP',
            component: './Reception/Appointment',
            authority: [
              'reception/appointment',
              // { name: 'reception/appointment' },
            ],
          },
          {
            hideInMenu: true,
            path: '/reception/queue/patientdashboard',
            name: 'patientdashboard',
            component: './PatientDashboard',
          },
          // {
          //   path: '/reception/queue/patientdashboard/consultation/:id?',
          //   name: 'consultation',
          //   hideInMenu: true,
          //   component: './PatientDashboard/Consultation',
          // },
        ],
      },
      //
      // Patient Database
      {
        path: '/patientdb',
        icon: 'group',
        name: 'patient',
        authority: [
          'patientdatabase',
        ],
        specialist: [
          'GP',
          'Dental',
        ],
        component: './PatientDatabase/Search',
        // routes: [
        //   // {
        //   //   path: '/patientdb/new',
        //   //   name: 'new',
        //   //   mini: 'NP',
        //   //   component: './PatientDatabase/New',
        //   //   hideChildrenInMenu: true,
        //   //   routes: [
        //   //     {
        //   //       path: '/patientdb/new/personal',
        //   //       name: 'Personal Info',
        //   //       // component: './PatientDatabase/Personal',
        //   //     },
        //   //     {
        //   //       path: '/patientdb/new/emergency',
        //   //       name: 'Emergency Contact',
        //   //       // component: './PatientDatabase/EmergencyContact',
        //   //     },
        //   //     {
        //   //       path: '/patientdb/new/allergies',
        //   //       name: 'Allergies',
        //   //       // component: './PatientDatabase/Allergies',
        //   //     },
        //   //     {
        //   //       path: '/patientdb/new/schemes',
        //   //       name: 'Schemes',
        //   //       // component: './PatientDatabase/Schemes',
        //   //     },
        //   //   ],
        //   // },
        //   {
        //     path: '/patientdb/search',
        //     name: 'search',
        //     mini: 'SP',
        //     component: './PatientDatabase/Search',
        //     authority: [
        //       'patientdatabase',
        //     ],
        //   },
        // ],
      },
      //
      // SMS
      {
        path: '/communication',
        icon: 'sms',
        name: 'communication',
        system: 'CMS',
        authority: [
          'communication',
        ],
        specialist: [
          'GP',
        ],
        routes: [
          {
            path: '/communication/sms',
            name: 'sms',
            component: './sms',
            authority: [
              'communication/sms',
            ],
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
        authority: [
          'inventory',
        ],
        specialist: [
          'GP',
        ],
        routes: [
          {
            path: '/inventory/master',
            name: 'master',
            component: './Inventory/Master',
            authority: [
              'inventory/inventorymaster',
            ],
            mini: 'IM',
          },
          {
            path: '/inventory/master/consumable',
            name: 'consumable.consumable',
            hideInMenu: true,
            component: './Inventory/Master/Consumable/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/editconsumable',
            name: 'consumable.editconsumable',
            hideInMenu: true,
            component: './Inventory/Master/Consumable/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/medication',
            name: 'medication.medication',
            hideInMenu: true,
            component: './Inventory/Master/Medication/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/editmedication',
            name: 'medication.editmedication',
            hideInMenu: true,
            component: './Inventory/Master/Medication/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/vaccination',
            name: 'vaccination.vaccination',
            hideInMenu: true,
            component: './Inventory/Master/Vaccination/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/editvaccination',
            name: 'vaccination.editvaccination',
            hideInMenu: true,
            component: './Inventory/Master/Vaccination/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/package',
            name: 'package.package',
            hideInMenu: true,
            component: './Inventory/Master/Package/Details',
            authority: [
              'inventory/inventorymaster',
            ],
          },
          {
            path: '/inventory/master/editpackage',
            name: 'package.editpackage',
            hideInMenu: true,
            component: './Inventory/Master/Package/Details',
            authority: [
              'inventory/inventorymaster',
            ],
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
          {
            path: '/inventory/pr',
            name: 'pd',
            component: './Inventory/PurchaseReceive',
            authority: [
              'inventory/purchasingandreceiving',
            ],
            mini: 'PR',
          },
          {
            path: '/inventory/pr/pdodetails',
            name: 'pd.detail',
            hideInMenu: true,
            component: './Inventory/PurchaseReceive/Details',
            authority: [
              'inventory/purchasingandreceiving',
            ],
          },
          {
            path: '/inventory/inventoryadjustment',
            name: 'inventoryadjustment',
            component: './Inventory/InventoryAdjustment',
            authority: [
              'inventory/purchasingandreceiving',
            ],
            mini: 'IA',
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
        authority: [
          'finance',
        ],
        specialist: [
          'GP',
        ],
        routes: [
          {
            path: '/finance/invoice',
            name: 'invoice/list',
            component: './Finance/Invoice',
            mini: 'IP',
            exact: true,
            authority: [
              'finance/invoicepayment',
            ],
          },
          {
            path: '/finance/invoice/details',
            name: 'invoice/detail',
            hideInMenu: true,
            component: './Finance/Invoice/Details',
            authority: [
              'finance/invoicepayment',
            ],
          },
          {
            path: '/finance/note',
            name: 'credit/debitnote',
            hideInMenu: true,
            authority: [
              'finance/invoicepayment',
            ],
            // component: './Finance/CreditDebitNote',
            mini: 'CD',
          },
          // {
          //   path: '/finance/billing',
          //   name: 'corporate-billing',
          //   mini: 'CB',
          //   exact: true,
          //   // component: './Finance/CorporateBilling',
          // },
          {
            path: '/finance/billing/:companyName',
            name: 'corporate-billing/detail',
            hideInMenu: true,
            authority: [
              'finance/corporatebilling',
            ],
            // component:
            //   './Finance/CorporateBilling/Detail/CorporateBillingDetail',
          },
          {
            path: '/finance/deposit',
            name: 'deposit',
            mini: 'DP',
            component: './Finance/Deposit',
            authority: [
              'finance/deposit',
            ],
          },
          {
            path: '/finance/deposit/:depositNo',
            name: 'invoice/detail',
            hideInMenu: true,
            component: './Finance/Deposit/Detail/index.js',
            authority: [
              'finance/deposit',
            ],
          },
          {
            path: '/finance/statement',
            name: 'statement',
            mini: 'ST',
            component: './Finance/Statement',
            authority: [
              'finance/statement',
            ],
          },
          {
            path: '/finance/statement/newstatement',
            name: 'statement/newstatement',
            hideInMenu: true,
            component: './Finance/Statement/NewStatement/AddNewStatement',
            authority: [
              'finance/statement',
            ],
          },
          {
            path: '/finance/statement/editstatement',
            name: 'statement/editstatement',
            hideInMenu: true,
            component: './Finance/Statement/NewStatement/AddNewStatement',
            authority: [
              'finance/statement',
            ],
          },
          {
            path: '/finance/statement/details/:id',
            name: 'statement/detail',
            hideInMenu: true,
            component: './Finance/Statement/Details',
            authority: [
              'finance/statement',
            ],
          },
          // {
          //   path: '/finance/expense',
          //   name: 'doctor-expense',
          //   mini: 'DE',
          //   exact: true,
          //   component: './Finance/DoctorExpense',
          // },
          {
            path: '/finance/scheme',
            name: 'scheme',
            mini: 'SC',
            component: './Finance/Scheme',
            authority: [
              'finance/scheme',
            ],
          },
          {
            path: '/finance/scheme/details',
            name: 'scheme/detail',
            hideInMenu: true,
            component: './Finance/Scheme/Details',
            authority: [
              'finance/scheme',
            ],
          },
          {
            path: '/finance/copayer',
            name: 'copayer',
            mini: 'CP',
            component: './Setting/Company',
            authority: [
              'finance/scheme',
            ],
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
      // {
      //   path: '/labsresult',
      //   icon: 'poll',
      //   name: 'labsresult',
      //   // component: '',
      // },
      // Lab Report
      //
      // Report
      {
        path: '/report',
        icon: 'library_books',
        name: 'report',
        hideChildrenInMenu: true,
        authority: [
          'report',
        ],
        specialist: [
          'GP',
        ],
        routes: [
          {
            path: '/report',
            name: 'report',
            component: './Report',
          },
          {
            path: '/report/queuelisting',
            name: 'queueListingReport',
            component: './Report/QueueListing',
          },
          {
            path: '/report/gstreport',
            name: 'gstReport',
            component: './Report/GSTReport',
          },
          {
            path: '/report/medicationmovementreport',
            name: 'medicationMovementReport',
            component: './Report/MedicationMovementReport',
          },
          {
            path: '/report/deposittransactionreport',
            name: 'depositTransactionReport',
            component: './Report/DepositTransactionReport',
          },
          {
            path: '/report/consumablemovementreport',
            name: 'consumableMovementReport',
            component: './Report/ConsumableMovementReport',
          },
          {
            path: '/report/voidcreditnotereport',
            name: 'voidCreditNoteReport',
            component: './Report/VoidCreditNoteReport',
          },
          {
            path: '/report/saleslistingreport',
            name: 'salesListingReport',
            component: './Report/SalesListingReport',
          },
          {
            path: '/report/lowstockconsumablesreport',
            name: 'lowStockConsumablesReport',
            component: './Report/LowStockConsumablesReport',
          },
          {
            path: '/report/lowstockmedicationreport',
            name: 'lowStockMedicationReport',
            component: './Report/LowStockMedicationReport',
          },
          {
            path: '/report/chasclaimreport',
            name: 'viewreport',
            component: './Report/ChasClaimReport',
          },
          {
            path: '/report/creditnotelistingreport',
            name: 'creditNoteListingReport',
            component: './Report/CreditNoteListingReport',
          },
          {
            path: '/report/patientlisting',
            name: 'patientListingReport',
            component: './Report/PatientListing',
          },
          {
            path: '/report/paymentcollection',
            name: 'paymentCollection',
            component: './Report/PaymentCollection',
          },
          {
            path: '/report/outstandingpaymentreport',
            name: 'outstandingPaymentReport',
            component: './Report/OutstandingPaymentReport',
          },
          {
            path: '/report/salesummary',
            name: 'salessummary',
            component: './Report/SalesSummary',
          },
          {
            path: '/report/diagnosistrending',
            name: 'diagnosistrending',
            component: './Report/DiagnosisTrending',
          },
          {
            path: '/report/sessionsummary',
            name: 'sessionsummary',
            component: './Report/SessionSummary',
          },
          {
            path: '/report/sessionsummary/:id',
            name: 'viewreport',
            component: './Report/SessionSummary/Details',
          },
        ],
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
        authority: [
          'claimsubmission',
        ],
        specialist: [
          'GP',
        ],
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
      //
      // Ward Demo
      // {
      //   path: '/wardmanagement',
      //   icon: 'hotel',
      //   name: 'wardmanagement',
      //   hideChildrenInMenu: true,
      //   authority: [
      //     'wardmanagement',
      //   ],
      //   component: './WardManagement/Search',
      // },
      // Claim Submission
      //
      // Settings
      {
        path: '/setting',
        icon: 'settings',
        name: 'setting',
        authority: [
          'settings',
        ],
        specialist: [
          'GP',
          'Dental',
        ],
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
          {
            path: '/setting/generalsetting',
            name: 'generalsetting',
            component: './Setting/GeneralSetting',
          },
          {
            path: '/setting/printoutsetting',
            name: 'printoutsetting',
            component: './Setting/PrintoutSetting',
          },
          // {
          //   path: '/finance/company/1',
          //   name: 'copayer',
          //   component: './Setting/Company',
          // },
          {
            path: '/setting/company/2',
            name: 'supplier',
            component: './Setting/Company',
          },
          {
            path: '/setting/servicecenter',
            name: 'servicecenter',
            component: './Setting/serviceCenter',
          },
          {
            path: '/setting/servicecentercategory',
            name: 'servicecentercategory',
            component: './Setting/serviceCenterCategory',
          },
          {
            path: '/setting/servicecategory',
            name: 'servicecategory',
            component: './Setting/serviceCategory',
          },
          {
            path: '/setting/medicationfrequency',
            name: 'medicationfrequency',
            component: './Setting/medicationFrequency',
          },
          {
            path: '/setting/medicationprecautions',
            name: 'medicationprecautions',
            component: './Setting/medicationPrecautions',
          },
          {
            path: '/setting/medicationconsumptionmethod',
            name: 'medicationconsumptionmethod',
            component: './Setting/medicationConsumptionMethod',
          },
          {
            path: '/setting/smstemplate',
            name: 'smstemplate',
            component: './Setting/SMSTemplate',
          },
          {
            path: '/setting/documenttemplate',
            name: 'documenttemplate',
            component: './Setting/DocumentTemplate',
          },
          {
            path: '/setting/paymentmode',
            name: 'paymentmode',
            component: './Setting/PaymentMode',
          },
          {
            path: '/setting/appointmenttype',
            name: 'appointmenttype',
            component: './Setting/AppointmentType',
          },
        ],
      },
      // Settings
      // Support
      {
        path: '/support',
        icon: 'local_phone',
        name: 'support',
        hideChildrenInMenu: true,
        specialist: [
          'GP',
          'Dental',
        ],
        routes: [
          {
            path: '/support',
            name: 'support',
            component: './Support',
          },
          {
            path: '/support/contactus',
            name: 'contactus',
            component: './support/teamviewer',
          },
          {
            path: '/support/druglabel',
            name: 'druglabel',
            component: './support/druglabel',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  // Main routes
  //
]

const routes =
  process.env.NODE_ENV === 'production'
    ? _routes
    : _routes.map((r, index) => {
        if (index === 1) {
          return {
            ...r,
            routes: [
              devRoutes,
              ...r.routes,
            ],
          }
        }
        return r
      })

export default routes
