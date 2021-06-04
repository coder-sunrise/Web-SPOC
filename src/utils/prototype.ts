

import {getLocale} from 'umi'
import moment from 'moment';
import type { LongDateFormatSpec } from 'moment';

// fix antd moment bug and make our own format standard
const locale = getLocale()
moment.updateLocale(locale.substring(0,locale.indexOf('-')), {
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD-MMM-YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'DD-MMM-YYYY HH:mm',
    lll: 'DD-MM-YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
});

type F = LongDateFormatSpec | string;
type DurationUnit='year'|'month'|'week'|'day'|'hour'|'second';

declare global {
  interface String {
    format: (
      f?: F,
      options?: {
        empty: string;
      },
    ) => string;

    toDate: () => Date;
  }

  interface Date {
    duration:(unit:DurationUnit)=>number
  }
}

// eslint-disable-next-line no-extend-native
String.prototype.format1 = function format(f = 'LLL', { empty } = { empty: '-' }) {
  const m = moment(this as string);
  if (!m.isValid()) return empty;
  console.log(m,f)
  return m.format(f as string);
};

// eslint-disable-next-line no-extend-native
String.prototype.toDate = function date() {
  // @ts-ignore
  return new Date(this);
};
// eslint-disable-next-line no-extend-native
Date.prototype.duration = function format(unit:DurationUnit) {
  const value =moment.duration(moment().diff(this))
  switch (unit) {
    case 'year':
      return value.asYears();
    case 'month':
      return value.asMonths();  
      case 'week':
        return value.asWeeks();  
        case 'day':
          return value.asDays();  
          case 'hour':
            return value.asHours();  
            case 'second':
              return value.asSeconds();  
    default:
      return 0
  }
};

