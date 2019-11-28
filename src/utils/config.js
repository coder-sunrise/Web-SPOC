import numeral from 'numeral'
import { formatMessage, setLocale, getLocale } from 'umi/locale'
// import my from 'moment/locale/my'
import moment from 'moment'
import 'moment/locale/ms-my'
import 'moment/locale/zh-cn'

const defaultNumberalConfig = {
  delimiters: {
    thousands: ',',
    decimal: '.',
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't',
  },
  ordinal (number) {
    let b = number % 10
    return ~~((number % 100) / 10) === 1
      ? 'th'
      : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th'
  },
  currency: {
    symbol: '$',
  },
}
const countrySettings = [
  {
    value: 'Singapore',
    name: 'Singapore',
    code: 'sg',
    numberal: () => {
      try {
        numeral.register('locale', 'sg', {
          ...defaultNumberalConfig,
          currency: {
            symbol: '$',
          },
        })
        numeral.locale('sg')
      } catch (error) {}
    },
    moment: () => {
      moment.defineLocale('sg', {
        parentLocale: 'en',
        longDateFormat: {
          LT: 'hh:mm A',
          LTS: 'hh:mm:ss A',
          L: 'DD MM YYYY',
          LL: 'DD MMM YYYY',
          LLL: 'DD MMM YYYY hh:mm A',
          LLLL: 'DD MMMM YYYY  hh:mm:ss A',
        },
      })
    },
  },
  {
    value: 'Malaysia',
    name: 'Malaysia',
    code: 'ms-my',
    numberal: () => {
      try {
        numeral.register('locale', 'my', {
          ...defaultNumberalConfig,

          currency: {
            symbol: 'RM',
          },
        })
        numeral.locale('my')
      } catch (error) {}
    },
    moment: () => {
      moment.locale('ms-my')
    },
  },
]
// console.log(1)
let countrySetting
const initClinicSettings = () => {
  const clinicSettings =
    JSON.parse(sessionStorage.getItem('clinicSettings')) || {}
  countrySetting =
    countrySettings.find((o) => o.value === clinicSettings.applicationLocale) ||
    {}

  if (countrySetting.code) {
    if (countrySetting.numberal) {
      countrySetting.numberal()
    }
    if (countrySetting.moment) countrySetting.moment()

    // moment.updateLocale(countrySetting.code, {
    //   longDateFormat: {
    //     LT: 'HH:mm',
    //     LTS: 'HH:mm:ss',
    //     L: 'DD/MM/YYYY',
    //     LL: 'D MMMM YYYY',
    //     LLL: 'D MMMM YYYY HH:mm',
    //     LLLL: 'DD/MM/YYYY',
    //   },
    // })
    // moment.locale(countrySetting.code)
    // console.log(2)
    // console.log(3, moment.locale(), getLocale())
  }
}
module.exports = {
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
  },
  currencyFormat: '0,0.00',
  percentageFormat: '0.00%',
  currencySymbol: '$',
  qtyFormat: '0.0',
  conuntry: countrySetting,
  initClinicSettings,
}
