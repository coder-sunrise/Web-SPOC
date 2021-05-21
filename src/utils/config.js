import numeral from 'numeral'
import { formatMessage, setLocale, getLocale } from 'umi'
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
  ordinal(number) {
    let b = number % 10
    return ~~((number % 100) / 10) === 1
      ? 'th'
      : b === 1
      ? 'st'
      : b === 2
      ? 'nd'
      : b === 3
      ? 'rd'
      : 'th'
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
      moment.locale('en')
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
      moment.locale('en')
    },
  },
]
// console.log(1)
// console.log(moment.locale(), getLocale())
let countrySetting
let clinicSettings
export const initClinicSettings = () => {
  clinicSettings = JSON.parse(localStorage.getItem('clinicSettings')) || {}
  countrySetting =
    countrySettings.find(o => o.value === clinicSettings.locale) || {}
  // console.log(countrySettings, clinicSettings.applicationLocale)
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

export const filterType = {
  eql: 'eql', // 'Equals',
  neql: 'neql', // 'Not Equals',
  lgt: 'lgt', // 'Larger than',
  lst: 'lst', // 'Lesser than',
  lgteql: 'lgteql', // 'Lager tan and euquals to',
  lsteql: 'lsteql', // 'Lesser than and equals to',
  like: 'like', // 'Equivalent to like ‘%{criteria}%',
  in: 'in', // 'Equivalent to in ({criteria list}), criteria list shall be separate by | as delimiter',
}

export const valueType = {
  i: 'Int32',
  b: 'Boolean',
  g: 'Object',
}

export const regex = {
  date: /^\d{4}[.-]\d{2}[.-]\d{2}.?\d{0,2}.?\d{0,2}.?\d{0,2}.?\d{0,3}.?$/,
}

export const format = {
  datetime: 'DD-MMM-YYYY HH:mm',
  datepicker: 'DD/MM/YYYY',
  datepickerWithTime: 'DD/MM/YYYY HH:mm:ss',
  standardDatetime: 'YYYY-MM-DD HH:mm:ss.SSS Z',
  standardDate: 'YYYY-MM-DD',
}

export const modal = {}
export const style = {
  gutter: 10,
}
export const form = {
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
}
export const grid = {
  colProps: {
    style: {
      marginBottom: 10,
    },
  },
}
export const validation = {
  required: {
    required: true,
    message: 'This field is required',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'This is not a valid email',
  },
}
export const currencyFormat = '0,0.00'
export const percentageFormat = '0.00%'
export const currencySymbol = '$'
export const qtyFormat = '0.0'
export const numberFormat = '0,0'
export const conuntry = countrySetting
export const getClinic = () => {
  if (!clinicSettings) {
    initClinicSettings()
  }
  return clinicSettings
}
