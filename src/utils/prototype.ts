import { getLocale } from 'umi'
import moment from 'moment'

// fix antd moment bug and make our own format standard
const locale = getLocale()
moment.updateLocale(locale.substring(0, locale.indexOf('-')), {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MMM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'DD-MMM-YYYY HH:mm',
    lll: 'DD-MM-YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
})
