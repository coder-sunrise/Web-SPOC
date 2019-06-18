// ##############################
// // // Badge component styles
// #############################

import {
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
} from 'mui-pro-jss'

const badgeStyle = {
  badge: {
    borderRadius: '12px',
    padding: '6px 12px',
    textTransform: 'uppercase',
    fontSize: '.75rem',
    width: '100%',
    fontWeight: '700',
    lineHeight: '1',
    color: '#fff',
    textAlign: 'center',
    verticalAlign: 'baseline',
    display: 'inline-block',
  },
  primary: {
    backgroundColor: primaryColor,
  },
  warning: {
    backgroundColor: warningColor,
  },
  danger: {
    backgroundColor: dangerColor,
  },
  success: {
    backgroundColor: successColor,
  },
  info: {
    backgroundColor: infoColor,
  },
  rose: {
    backgroundColor: roseColor,
  },
  gray: {
    backgroundColor: grayColor,
  },
}

export default badgeStyle
