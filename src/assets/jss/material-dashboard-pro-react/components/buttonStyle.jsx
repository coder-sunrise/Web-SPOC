// ##############################
// // // Button styles
// #############################
import color from 'color'
import {
  grayColor,
  roseColor,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  hexToRgb,
} from 'mui-pro-jss'

const disabled = {
  opacity: '0.4',
  pointerEvents: 'none',
}
const buttonStyle = {
  button: {
    minHeight: 'auto',
    minWidth: 'auto',
    // backgroundColor: grayColor,
    // color: '#FFFFFF',
    boxShadow:
      '0px 1px 5px 0px rgba(153, 153, 153, 0.14), 0px 2px 2px 0px rgba(153, 153, 153, 0.2), 0px 3px 1px -2px rgba(153, 153, 153, 0.12)',
    border: 'none',
    borderRadius: '3px',
    position: 'relative',
    padding: '9px 20px',
    margin: 0, // ".3125rem 1px",
    marginRight: 8,
    fontSize: '1rem',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: '0',
    willChange: 'box-shadow, transform',
    transition:
      'box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1.5',
    textAlign: 'center',
    // whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    '&:hover': {
      // color: '#FFFFFF',
      // backgroundColor: grayColor,
      boxShadow:
        '0 14px 26px -12px rgba(153, 153, 153, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(153, 153, 153, 0.2)',
    },
    '& .fab,& .fas,& .far,& .fal,& .material-icons': {
      position: 'relative',
      display: 'inline-block',
      top: '0',
      marginTop: '-1em',
      marginBottom: '-1em',
      fontSize: '1.1rem',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    '& svg': {
      position: 'relative',
      display: 'inline-block',
      // top: '-1px',
      width: '20px',
      height: '20px',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    '& > span': {
      lineHeight: '20px',
    },
    '&$justIcon': {
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        marginTop: '0px',
        position: 'absolute',
        width: '100%',
        transform: 'none',
        left: '0px',
        top: '0px',
        height: '100%',
        lineHeight: '41px',
        fontSize: '20px',
      },
    },
    '&:disabled': disabled,
  },
  fullWidth: {
    width: '100%',
  },
  outlined: {
    border: '1px solid #d9d9d9',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
      borderColor: primaryColor,
      color: primaryColor,
    },
    // borderWidth: 1,
  },
  contained: {
    color: '#ffffff',
    backgroundColor: grayColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(grayColor).darken(0.2).hex(),
    },
  },
  primary: {
    boxShadow:
      '0px 1px 5px 0px rgba(28, 26, 124,0.2), 0px 2px 2px 0px rgba(28, 26, 124,0.14), 0px 3px 1px -2px rgba(28, 26, 124,0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(28, 26, 124, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(28, 26, 124, 0.2)',
    },
  },
  containedprimary: {
    backgroundColor: primaryColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(primaryColor).darken(0.2).hex(),
    },
  },
  outlinedprimary: {
    color: primaryColor,
    '&:hover': {
      backgroundColor: color(primaryColor).lighten(0.8).hex(),
    },
  },
  info: {
    boxShadow:
      '0px 1px 5px 0px rgba(0, 188, 212, 0.14), 0px 2px 2px 0px rgba(0, 188, 212, 0.2), 0px 3px 1px -2px rgba(0, 188, 212, 0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(0, 188, 212, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 188, 212, 0.2)',
    },
  },
  containedinfo: {
    backgroundColor: infoColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(infoColor).darken(0.2).hex(),
    },
  },
  outlinedinfo: {
    color: infoColor,
    '&:hover': {
      backgroundColor: color(infoColor).lighten(0.8).hex(),
    },
  },
  success: {
    boxShadow:
      '0px 1px 5px 0px rgba(76, 175, 80, 0.14), 0px 2px 2px 0px rgba(76, 175, 80, 0.2), 0px 3px 1px -2px rgba(76, 175, 80, 0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(76, 175, 80, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(76, 175, 80, 0.2)',
    },
  },
  containedsuccess: {
    backgroundColor: successColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(successColor).darken(0.2).hex(),
    },
  },
  outlinedsuccess: {
    color: successColor,
    '&:hover': {
      backgroundColor: color(successColor).lighten(0.8).hex(),
    },
  },
  warning: {
    boxShadow:
      '0px 1px 5px 0px rgba(255, 152, 0, 0.14), 0px 2px 2px 0px rgba(255, 152, 0, 0.2), 0px 3px 1px -2px rgba(255, 152, 0, 0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(255, 152, 0, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(255, 152, 0, 0.2)',
    },
  },
  containedwarning: {
    backgroundColor: warningColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(warningColor).darken(0.2).hex(),
    },
  },
  outlinedwarning: {
    color: warningColor,
    '&:hover': {
      backgroundColor: color(warningColor).lighten(0.8).hex(),
    },
  },
  danger: {
    boxShadow:
      '0px 1px 5px 0px rgba(244, 67, 54, 0.14), 0px 2px 2px 0px rgba(244, 67, 54, 0.2), 0px 3px 1px -2px rgba(244, 67, 54, 0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(244, 67, 54, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(244, 67, 54, 0.2)',
    },
  },
  containeddanger: {
    backgroundColor: dangerColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(dangerColor).darken(0.2).hex(),
    },
  },
  outlineddanger: {
    color: dangerColor,
    '&:hover': {
      backgroundColor: color(dangerColor).lighten(0.8).hex(),
    },
  },
  rose: {
    boxShadow:
      '0px 1px 5px 0px rgba(233, 30, 99, 0.14), 0px 2px 2px 0px rgba(233, 30, 99, 0.2), 0px 3px 1px -2px rgba(233, 30, 99, 0.12)',
    '&:hover': {
      boxShadow:
        '0 14px 26px -12px rgba(233, 30, 99, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(233, 30, 99, 0.2)',
    },
  },
  containedrose: {
    backgroundColor: roseColor,
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color(roseColor).darken(0.2).hex(),
    },
  },
  outlinedrose: {
    color: roseColor,
    '&:hover': {
      backgroundColor: color(roseColor).lighten(0.8).hex(),
    },
  },
  white: {
    '&,&:focus,&:hover': {
      backgroundColor: '#FFFFFF',
      color: grayColor,
    },
    '&:hover:not($simple):not($link):not($transparent)': {
      backgroundColor: color('#ffffff').darken(0.05).hex(),
    },
  },
  twitter: {
    backgroundColor: '#55acee',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(85, 172, 238, 0.14), 0px 2px 2px 0px rgba(85, 172, 238, 0.2), 0px 3px 1px -2px rgba(85, 172, 238, 0.12)',
    '&:hover,&:visited': {
      backgroundColor: '#55acee',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(85, 172, 238, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(85, 172, 238, 0.2)',
    },
  },
  facebook: {
    backgroundColor: '#3b5998',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(59, 89, 152, 0.14), 0px 2px 2px 0px rgba(59, 89, 152, 0.2), 0px 3px 1px -2px rgba(59, 89, 152, 0.12)',
    '&:hover': {
      backgroundColor: '#3b5998',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(59, 89, 152, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(59, 89, 152, 0.2)',
    },
  },
  google: {
    backgroundColor: '#dd4b39',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(221, 75, 57, 0.14), 0px 2px 2px 0px rgba(221, 75, 57, 0.2), 0px 3px 1px -2px rgba(221, 75, 57, 0.12)',
    '&:hover': {
      backgroundColor: '#dd4b39',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(221, 75, 57, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(221, 75, 57, 0.2)',
    },
  },
  linkedin: {
    backgroundColor: '#0976b4',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(9, 118, 180, 0.14), 0px 2px 2px 0px rgba(9, 118, 180, 0.2), 0px 3px 1px -2px rgba(9, 118, 180, 0.12)',
    '&:hover': {
      backgroundColor: '#0976b4',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(9, 118, 180, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(9, 118, 180, 0.2)',
    },
  },
  pinterest: {
    backgroundColor: '#cc2127',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(204, 33, 39, 0.14), 0px 2px 2px 0px rgba(204, 33, 39, 0.2), 0px 3px 1px -2px rgba(204, 33, 39, 0.12)',
    '&:hover': {
      backgroundColor: '#cc2127',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(204, 33, 39, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(204, 33, 39, 0.2)',
    },
  },
  youtube: {
    backgroundColor: '#e52d27',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(229, 45, 39, 0.14), 0px 2px 2px 0px rgba(229, 45, 39, 0.2), 0px 3px 1px -2px rgba(229, 45, 39, 0.12)',
    '&:hover': {
      backgroundColor: '#e52d27',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(229, 45, 39, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(229, 45, 39, 0.2)',
    },
  },
  tumblr: {
    backgroundColor: '#35465c',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(53, 70, 92, 0.14), 0px 2px 2px 0px rgba(53, 70, 92, 0.2), 0px 3px 1px -2px rgba(53, 70, 92, 0.12)',
    '&:hover': {
      backgroundColor: '#35465c',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(53, 70, 92, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(53, 70, 92, 0.2)',
    },
  },
  github: {
    backgroundColor: '#333333',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(51, 51, 51, 0.14), 0px 2px 2px 0px rgba(51, 51, 51, 0.2), 0px 3px 1px -2px rgba(51, 51, 51, 0.12)',
    '&:hover': {
      backgroundColor: '#333333',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(51, 51, 51, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(51, 51, 51, 0.2)',
    },
  },
  behance: {
    backgroundColor: '#1769ff',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(23, 105, 255, 0.14), 0px 2px 2px 0px rgba(23, 105, 255, 0.2), 0px 3px 1px -2px rgba(23, 105, 255, 0.12)',
    '&:hover': {
      backgroundColor: '#1769ff',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(23, 105, 255, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(23, 105, 255, 0.2)',
    },
  },
  dribbble: {
    backgroundColor: '#ea4c89',
    color: '#fff',
    boxShadow:
      '0px 1px 5px 0px rgba(234, 76, 137, 0.14), 0px 2px 2px 0px rgba(234, 76, 137, 0.2), 0px 3px 1px -2px rgba(234, 76, 137, 0.12)',
    '&:hover': {
      backgroundColor: '#ea4c89',
      color: '#fff',
      boxShadow:
        '0 14px 26px -12px rgba(234, 76, 137, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(234, 76, 137, 0.2)',
    },
  },
  reddit: {
    backgroundColor: '#ff4500',
    color: ' #fff',
    boxShadow:
      '0px 1px 5px 0px rgba(255, 69, 0, 0.14), 0px 2px 2px 0px rgba(255, 69, 0, 0.2), 0px 3px 1px -2px rgba(255, 69, 0, 0.12)',
    '&:hover': {
      backgroundColor: '#ff4500',
      color: ' #fff',
      boxShadow:
        '0 14px 26px -12px rgba(255, 69, 0, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(255, 69, 0, 0.2)',
    },
  },
  simple: {
    '&': {
      color: '#FFFFFF',
      background: 'transparent',
      boxShadow: 'none',
    },
    '&:focus,&:hover': {
      background: 'transparent',
      backgroundColor: '#fff',
    },
    '&$primary': {
      '&,&:focus,&:hover,&:visited': {
        color: primaryColor,
        background: 'inherit',
      },
    },
    '&$info': {
      '&,&:focus,&:hover,&:visited': {
        color: infoColor,
      },
    },
    '&$success': {
      '&,&:focus,&:hover,&:visited': {
        color: successColor,
      },
    },
    '&$warning': {
      '&,&:focus,&:hover,&:visited': {
        color: warningColor,
      },
    },
    '&$rose': {
      '&,&:focus,&:hover,&:visited': {
        color: roseColor,
      },
    },
    '&$danger': {
      '&,&:focus,&:hover,&:visited': {
        color: dangerColor,
      },
    },
    '&$twitter': {
      '&,&:focus,&:hover,&:visited': {
        color: '#55acee',
      },
    },
    '&$facebook': {
      '&,&:focus,&:hover,&:visited': {
        color: '#3b5998',
      },
    },
    '&$google': {
      '&,&:focus,&:hover,&:visited': {
        color: '#dd4b39',
      },
    },
    '&$linkedin': {
      '&,&:focus,&:hover,&:visited': {
        color: '#0976b4',
      },
    },
    '&$pinterest': {
      '&,&:focus,&:hover,&:visited': {
        color: '#cc2127',
      },
    },
    '&$youtube': {
      '&,&:focus,&:hover,&:visited': {
        color: '#e52d27',
      },
    },
    '&$tumblr': {
      '&,&:focus,&:hover,&:visited': {
        color: '#35465c',
      },
    },
    '&$github': {
      '&,&:focus,&:hover,&:visited': {
        color: '#333333',
      },
    },
    '&$behance': {
      '&,&:focus,&:hover,&:visited': {
        color: '#1769ff',
      },
    },
    '&$dribbble': {
      '&,&:focus,&:hover,&:visited': {
        color: '#ea4c89',
      },
    },
    '&$reddit': {
      '&,&:focus,&:hover,&:visited': {
        color: '#ff4500',
      },
    },
  },
  transparent: {
    '&,&:focus,&:hover': {
      color: 'inherit',
      background: 'transparent',
      boxShadow: 'none',
    },
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.08)',
    },
  },
  disabled,
  lg: {
    padding: '1.125rem 2.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.333333',
    borderRadius: '0.2rem',
  },
  sm: {
    padding: '3px 10px !important',
    fontSize: '0.7rem !important',
    lineHeight: '1.5',
    borderRadius: '0.2rem',
  },
  round: {
    borderRadius: '30px !important',
  },
  block: {
    width: '100% !important',
  },
  link: {
    paddingLeft: 0,
    paddingRight: 0,
    '&,&:hover,&:focus': {
      backgroundColor: 'transparent',
      color: '#0645AD',
      boxShadow: 'none',
    },
    '&:hover,&:focus': {
      textDecoration: 'underline',
    },
  },
  noUnderline: {
    '&:hover,&:focus': {
      textDecoration: 'none',
    },
  },
  bigview: {
    borderRadius: '10px !important',
    // border: '1px solid black',
    '& > span': {
      display: 'block',
      textAlign: 'center',
      // fontSize: '12px',
    },
    '& svg': {
      width: 50,
      height: 50,
      background: 'transparent',
      display: 'block',
      margin: '0 auto',
    },
  },

  justIcon: {
    // paddingLeft: '12px',
    // paddingRight: '12px',
    padding: '3px !important',
    fontSize: '20px',
    // height: '41px',
    // minWidth: '41px',
    // width: '41px',
    '& .fab,& .fas,& .far,& .fal,& svg,& .material-icons': {
      marginRight: '0px',
    },
    '&$lg': {
      height: '57px',
      minWidth: '57px',
      width: '57px',
      lineHeight: '56px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '32px',
        lineHeight: '56px',
      },
      '& svg': {
        width: '32px',
        height: '32px',
      },
    },
    '&$sm': {
      height: '24px',
      minWidth: '24px',
      width: '24px',
      '& .fab,& .fas,& .far,& .fal,& .material-icons': {
        fontSize: '15px',
        lineHeight: '23px',
      },
      '& svg': {
        width: '18px',
        height: '18px',
      },
    },
  },
  pureIcon: {
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: 24,
    height: 24,
  },
}

export default buttonStyle
