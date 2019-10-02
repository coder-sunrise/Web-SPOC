const remoteValidator = ({
  rule,
  value,
  callback,
  promise,
  setting = { message: 'This value already being used' },
}) => {
  if (!value) {
    callback()
  } else {
    promise
      .then((response) => {
        const { success, data = {} } = response
        const { entities } = data
        if (success) {
          if (entities.length > 0) {
            callback([
              new Error(setting.message),
            ])
          } else {
            callback()
          }
        }
        callback()
      })
      .catch(() => {
        callback()
      })
  }
}
const proxyPrefix = '/api/v2'
const userSetting = JSON.parse(localStorage.getItem('userSettings')) || {}
module.exports = {
  name: 'CDRSS (BETA) [UAT]',
  prefix: 'cdr',
  proxyPrefix,
  systemName: 'Clinical Diagnostic and Research Support System',
  footerText: ' © 2017 - 2018 Medisys Innovation Pte Ltd. All rights reserved.',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: '',
  // baseURL: 'http://localhost:8000',
  // baseURL: 'http://isharesg.cloudapp.net:9000',
  YQL: [
    'http://www.zuimeitianqi.com',
  ],
  CORS: [
    'http://localhost:9000',
    'http://localhost:9002',
  ],
  openPages: [
    '/login',
    '/submission',
    '/individualform',
    '/register',
    '/resources',
    '/payment',
    '/batch',
  ],
  apiPrefix: '/api/mock',
  urlCryptoJSKey: 'medisys2018',
  refreshTokenTimer: 300, // seconds
  api: {
    // userLogin: '/mock/user/login',
    // userLogin: 'http://localhost:9000/Account/LoginAPI',

    userLogin: `${proxyPrefix}/token`,
    userLogout: `${proxyPrefix}/api/account/logout`,
    userInfo: `${proxyPrefix}/api/account/userinfo`,
    userRegister: `${proxyPrefix}/api/user/userregister`,
    userActive: `${proxyPrefix}/api/user/useractive`,
    userReset: `${proxyPrefix}/api/user/userreset`,
    verifyPassword: `${proxyPrefix}/api/user/verifypassword`,
    userExist: `${proxyPrefix}/api/user/userlist`,
    users: `${proxyPrefix}/api/user/list`,
    user: `${proxyPrefix}/api/user/:id`,
    posts: `${proxyPrefix}/mock/posts`,
    authInfo: `${proxyPrefix}/api/account/userinfo`,
    dashboard: `${proxyPrefix}/api/mock/dashboard`,
    menu: `${proxyPrefix}/api/app/menus`,
    allMenu: `${proxyPrefix}/api/app/allmenus`,
    upload: `${proxyPrefix}/api/app/upload`,
    queryUpload: `${proxyPrefix}/api/app/getuploads`,
    token: `${proxyPrefix}/api/app/token`,
    mantain: `${proxyPrefix}/api/app/info`,
    studies: `${proxyPrefix}/api/study/list`,
    study: `${proxyPrefix}/api/study/one`,
    surveys: `${proxyPrefix}/api/survey/list`,
    survey: `${proxyPrefix}/api/survey/one`,
    surveysImport: `${proxyPrefix}/api/survey/import`,
    surveySharingConfigs: `${proxyPrefix}/api/surveySharingConfig/list`,
    surveySharingConfig: `${proxyPrefix}/api/surveySharingConfig/one`,
    subjects: `${proxyPrefix}/api/subject/list`,
    subject: `${proxyPrefix}/api/subject/:id`,
    codetable: `${proxyPrefix}/api/codetable/:type`,
    studyTemplates: `${proxyPrefix}/api/study/templates`,
    studySurveys: `${proxyPrefix}/api/study/surveys`,
    batchFormRequests: `${proxyPrefix}/api/batchformrequest/list`,
    batchFormRequest: `${proxyPrefix}/api/batchformrequest/one`,
    batchFormRequestAnonymous: `${proxyPrefix}/api/batchformrequest/anonymous`,
    templates: `${proxyPrefix}/api/template/list`,
    template: `${proxyPrefix}/api/template/one`,
    codetablelist: `${proxyPrefix}/api/codetable/list`,
    codetablesetup: `${proxyPrefix}/api/codetable/tablelist`,
    codetablerecord: `${proxyPrefix}/api/codetable`,
    questions: `${proxyPrefix}/api/question/list`,
    question: `${proxyPrefix}/api/question/one`,
    questionSort: `${proxyPrefix}/api/question/sort`,
    tqoption: `${proxyPrefix}/api/templatequestionoption/:title`,
    rules: `${proxyPrefix}/api/rule/list`,
    rule: `${proxyPrefix}/api/rule/one`,
    ruleGetScore: `${proxyPrefix}/api/rule/getscore`,
    permissions: `${proxyPrefix}/api/permission/list`,
    permission: `${proxyPrefix}/api/permission/:id`,
    groups: `${proxyPrefix}/api/group/list`,
    group: `${proxyPrefix}/api/group/:id`,
    permissiongroup: `${proxyPrefix}/api/permissiongroup/:id`,
    demos: `${proxyPrefix}/api/demo/list`,
    demo: `${proxyPrefix}/api/demo/:id`,

    caseForms: `${proxyPrefix}/api/caseform/list`,
    caseForm: `${proxyPrefix}/api/caseform/:id`,
    diagnosisForms: `${proxyPrefix}/api/diagnosis/list`,
    diagnosisResult: `${proxyPrefix}/api/diagnosis/diagnosisresult`,
    diagnosiss: `${proxyPrefix}/api/diagnosis/list`,
    diagnosis: `${proxyPrefix}/api/diagnosis/:id`,
    sessions: `${proxyPrefix}/api/session/list`,
    session: `${proxyPrefix}/api/session/:id`,
    report: {
      caseForm: `${proxyPrefix}/api/report/caseform`,
    },

    projectGroups: `${proxyPrefix}/api/projectGroup/list`,
    studyMembers: `${proxyPrefix}/api/projectGroupUser/list`,
    studyMember: `${proxyPrefix}/api/projectGroupUser/:id`,
    getHMAC: `${proxyPrefix}/api/GetHMAC`,

    // IDN
    patients: `${proxyPrefix}/api/patient/list`,
    patient: `${proxyPrefix}/api/patient/:id`,

    diagnosisAdditionals: `${proxyPrefix}/api/diagnosisAdditional/list`,
    diagnosisAdditional: `${proxyPrefix}/api/diagnosisAdditional/:id`,
    getSessionList: `${proxyPrefix}/api/caseForm/getSessionList`,

    emailNotification: `${proxyPrefix}/api/email/:id`,
    getListWithoutCheckRights: `${proxyPrefix}/api/subject/getListWithoutCheckRights`,
    getIndividualCaseForm: `${proxyPrefix}/api/caseform/getIndividualCaseForm`,
  },

  filterType: {
    eql: 'eql', // 'Equals',
    neql: 'neql', // 'Not Equals',
    lgt: 'lgt', // 'Larger than',
    lst: 'lst', // 'Lesser than',
    lgteql: 'lgteql', // 'Lager tan and euquals to',
    lsteql: 'lsteql', // 'Lesser than and equals to',
    like: 'like', // 'Equivalent to like ‘%{criteria}%',
    in: 'in', // 'Equivalent to in ({criteria list}), criteria list shall be separate by | as delimiter',
  },

  valueType: {
    i: 'Int32',
    b: 'Boolean',
    g: 'Object',
  },

  regex: {
    date: /^\d{4}[.-]\d{2}[.-]\d{2}.?\d{0,2}.?\d{0,2}.?\d{0,2}.?\d{0,3}.?$/,
  },

  format: {
    datetime: 'DD-MMM-YYYY HH:mm',
    datepicker: 'DD/MM/YYYY',
    datepickerWithTime: 'DD/MM/YYYY HH:mm:ss',
    standardDatetime: 'YYYY-MM-DD HH:mm:ss.SSS Z',
    standardDate: 'YYYY-MM-DD',
  },

  modal: {},
  style: {
    gutter: 10,
  },
  form: {
    itemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    },
    gutter: 10,
  },
  grid: {
    colProps: {
      style: {
        marginBottom: 10,
      },
    },
  },
  validation: {
    required: {
      required: true,
      message: 'This field is required',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'This is not a valid email',
    },
    remote: remoteValidator,
  },
  currencyFormat: '0,0.00',
  percentageFormat: '0.00%',
  currencySymbol: '$',
  qtyFormat: '0.0',
  ...userSetting,
}
