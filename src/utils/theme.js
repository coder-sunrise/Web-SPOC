import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core'
import color from 'color'

import primaryColor from '@material-ui/core/colors/indigo'
import secondaryColor from '@material-ui/core/colors/blueGrey'
import { standardRowHeight, smallRowHeight, largeRowHeight } from 'assets/jss'
import {
  // primaryColor,
  // secondaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
  hoverColor,
} from 'mui-pro-jss'

const defaultFontSize = '1rem'
const smallFontSize = '0.85rem'
const largeFontSize = '1.2rem'

const defaultIconWidth = '1.2rem'
const smallIconWidth = '1rem'
const largeIconWidth = '1.5rem'

const defaultButton = {
  padding: '8px 18px !important',
  fontSize: `${defaultFontSize} !important`,
  lineHeight: 1.5,
  borderRadius: '3px !important',
}
const smallButton = {
  padding: '3px 10px !important',
  fontSize: `${smallFontSize} !important`,
  lineHeight: 1.5,
  borderRadius: '0.2rem !important',
}
const largetButton = {
  padding: '12px 25px !important',
  fontSize: `${largeFontSize} !important`,
  lineHeight: 1.5,
  borderRadius: '5px !important',
}

const defaultColor = 'rgba(0, 0, 0, 0.54)'

const sharedFormControlLabel = {
  label: {
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
  },
  labelPlacementStart: {
    marginLeft: 0,
  },
}
const sharedInputAdornmentRoot = {
  color: fontColor,
  // fontSize: '1rem',
  height: 'auto',
  whiteSpace: 'nowrap',
  // '& > p': {
  //   fontWeight: 300,
  // },
}
const sharedPalette = {
  primary: primaryColor,
  secondary: secondaryColor,
}
const sharedOverrides = {
  // CustomInputWrapper: {
  //   labelRoot: {
  //     zIndex: 1,
  //   },
  // },
  NavPills: {
    contentWrapper: {
      marginLeft: 1,
      marginRight: 1,
    },
  },
  MuiBadge: {
    badge: {
      right: 8,
    },
  },
  MuiDrawer: {
    paper: {
      overflowX: 'hidden',
    },
  },
  MuiTypography: {
    body1: {
      fontSize: '1em',
    },
    colorTextSecondary: {
      color: 'currentColor',
    },
  },
  MuiInput: {
    underline: {
      '&:hover:not($disabled):not($focused):not($error):before': {
        borderBottomWidth: '1px',
      },
      '&:after': {
        // borderBottomColor: primaryColor,
        // borderBottomWidth:'1px',
      },
      // "&:before": {
      //   borderBottom: '10px solid rgba(0, 0, 0, 0.42)',
      // },
      '&$focused': {
        '&:after': {
          transform: 'scaleX(1) !important',
        },
      },
    },
  },
  // RadioGroup: {
  //   label: {
  //     fontSize: 'inherit',
  //     fontWeight: 'inherit',
  //   },
  // },
  MuiGrid: {
    'direction-xs-column': {
      '& > div': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  MuiIconButton: {
    root: {
      padding: 3,
      color: 'rgba(0, 0, 0, 0.8)',
      fontSize: '1.2rem',
      borderRadius: 4,
    },
  },
  MuiTouchRipple: {
    child: {
      borderRadius: 4,
    },
  },
  MuiList: {
    root: {
      color: primaryColor,
    },
  },
  MuiListItem: {
    button: {
      '&:hover,&:focus': {
        backgroundColor: hoverColor,
      },
    },
    root: {
      '&$selected': {
        backgroundColor: color(hoverColor).lighten(0.05).hex(),
      },
      '&$selected:hover': {
        backgroundColor: hoverColor,
      },
    },
  },
  MuiTooltip: {
    tooltip: {
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow:
        '0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)',
    },
  },
}

export const defaultTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {
    rowHeight: standardRowHeight,
    size: 'md',
  },
  overrides: {
    ...sharedOverrides,

    MuiFormControlLabel: {
      ...sharedFormControlLabel,
      root: {
        marginLeft: -10,
      },
    },
    MuiSvgIcon: {
      root: {
        width: defaultIconWidth,
        height: defaultIconWidth,
      },
    },
    PrivateSwitchBase: {
      root: {
        margin: '0px 6px',
        padding: 1,
      },
    },
    MuiFormControl: {
      root: {
        margin: '5px 0 5px 0',
        paddingTop: 0,
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: defaultFontSize,
        '& .ant-input': {
          height: '1em',
        },
        '& .ant-switch': {
          fontSize: smallFontSize,
        },
        '& .ant-switch-loading-icon, .ant-switch:after': {
          width: 20,
          height: 20,
          borderRadius: 3,
          top: 1,
        },
        '& .anticon': {
          fontSize: defaultFontSize,
          color: defaultColor,
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: defaultFontSize,
        },

        '& .ant-select-remove-icon': {
          fontSize: 'inherit',
        },
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1.1em',
        },
        '& .ant-select-selection__clear': {
          right: 14,
          top: 12,
        },
        '& .ant-calendar-picker-clear': {
          right: 11,
          top: '52%',
        },

        '& .ant-select-selection--single': {
          marginTop: 4,
        },
        '& .ant-select-selection--single .ant-select-selection__clear': {
          top: 5,
        },
        '& .ant-select-selection--multiple .ant-select-selection__rendered': {
          height: '28px !important',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginRight: 28,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '25px',
          lineHeight: '24px',
        },
        '& .Mui-disabled .anticon': {
          display: 'none',
        },
      },

      input: {
        padding: '4px 0 1px',
        minHeight: 24,
        height: '1em',
      },
      multiline: {
        padding: 0,
        '& textarea:first-of-type': {
          position: 'relative',
          marginBottom: 5,
          top: 7,
        },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: defaultFontSize,
        fontWeight: 300,
      },
      formControl: {
        transform: 'translate(0, 22px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 3px) scale(0.8)',
        fontWeight: 'inherit',
      },
    },
    MuiInputAdornment: {
      root: {
        ...sharedInputAdornmentRoot,
        marginTop: 3,
        '& svg': {
          top: 3,
          position: 'relative',
        },
        '& > p': {
          fontSize: defaultFontSize,
        },
        '& > div': {
          width: '16px !important',
          height: '16px !important',
        },
      },
    },
    MuiButton: {
      contained: defaultButton,
      outlined: {
        ...defaultButton,
        padding: '7px 17px !important',
      },
    },
    RichEditor: {
      wrapper: {
        '& .rdw-editor-toolbar': {
          zoom: '90%',
        },
      },
    },
  },
})

export const smallTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {
    rowHeight: smallRowHeight,
    size: 'sm',
  },
  overrides: {
    ...sharedOverrides,

    MuiFormControlLabel: {
      ...sharedFormControlLabel,
      root: {
        marginLeft: -7,
      },
    },
    MuiSvgIcon: {
      root: {
        width: smallIconWidth,
        height: smallIconWidth,
      },
    },
    PrivateSwitchBase: {
      root: {
        margin: '0px 4px',
        padding: 0,
      },
    },
    MuiFormControl: {
      root: {
        margin: '3px 0 3px 0',
        paddingTop: 0,
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: smallFontSize,
        '& .ant-input': {
          height: '1em',
        },
        '& .ant-switch': {
          fontSize: smallFontSize,
        },
        '& .ant-switch-loading-icon, .ant-switch:after': {
          width: 16,
          height: 16,
          borderRadius: 3,
          top: 1,
        },
        '& .ant-select': {
          fontSize: smallFontSize,
          minHeight: 20,
          // padding: '1px 0 0px',
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: smallFontSize,
        },
        '& .anticon': {
          fontSize: smallFontSize,
          color: defaultColor,
        },
        '& .ant-select-remove-icon': {
          fontSize: 'inherit',
        },
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1em',
        },
        '& .ant-select-selection__clear': {
          right: 13,
          top: 8,
        },
        '& .ant-select-selection--single .ant-select-selection__clear': {
          top: 6,
        },
        '& .ant-calendar-picker': {
          fontSize: smallFontSize,
        },
        // '& .ant-calendar-picker-input': {
        //   paddingTop: 3,
        // },
        '& .ant-select-selection--multiple .ant-select-selection__rendered': {
          height: '22px !important',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginRight: 27,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '22px',
          lineHeight: '22px',
          marginTop: 0,
        },
      },
      input: {
        padding: '3px 0 0px',
        minHeight: 20,
        height: '1em',
      },
      multiline: {
        padding: 0,
        '& textarea:first-of-type': {
          position: 'relative',
          marginBottom: 3,
          top: 5,
        },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: smallFontSize,
        lineHeight: '0.95rem',
        fontWeight: 300,
      },
      formControl: {
        transform: 'translate(0, 20px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 3px) scale(0.8)',
        fontWeight: 'inherit',
      },
    },
    MuiInputAdornment: {
      root: {
        ...sharedInputAdornmentRoot,
        marginTop: 2,
        '& svg': {
          top: 3,
          position: 'relative',
        },
        '& > p': {
          fontSize: smallFontSize,
        },
        '& > div': {
          width: '12px !important',
          height: '12px !important',
        },
      },
    },
    MuiButton: {
      contained: smallButton,
      outlined: {
        ...smallButton,
        padding: '2px 9px !important',
      },
    },
    RichEditor: {
      wrapper: {
        '& .rdw-editor-toolbar': {
          zoom: '70%',
        },
      },
    },
  },
})

export const largeTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {
    rowHeight: largeRowHeight,
    size: 'lg',
  },
  overrides: {
    ...sharedOverrides,

    MuiFormControlLabel: {
      ...sharedFormControlLabel,
      root: {
        marginLeft: -12,
      },
    },
    MuiSvgIcon: {
      root: {
        width: largeIconWidth,
        height: largeIconWidth,
      },
    },
    PrivateSwitchBase: {
      root: {
        margin: '0px 8px',
        padding: 1,
      },
    },
    MuiFormControl: {
      root: {
        margin: '6px 0 5px 0',
        paddingTop: 4,
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: largeFontSize,
        '& .ant-input': {
          height: '1em',
        },
        '& .ant-switch': {
          fontSize: largeFontSize,
        },
        '& .ant-switch-loading-icon, .ant-switch:after': {
          width: 21,
          height: 21,
          borderRadius: 3,
          top: 1,
        },
        '& .ant-select': {
          fontSize: largeFontSize,
          minHeight: 25,
          // padding: '3px 0 0px',
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: largeFontSize,
        },
        '& .anticon': {
          fontSize: largeFontSize,
          color: defaultColor,
        },
        '& .ant-select-remove-icon': {
          fontSize: 'inherit',
        },
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1.3rem',
        },
        '& .ant-select-selection__clear': {
          right: 17,
          top: 10,
        },
        '& .ant-select-selection--single .ant-select-selection__clear': {
          top: 5,
        },
        '& .ant-calendar-picker': {
          fontSize: largeFontSize,
        },
        '& .ant-select-selection--multiple .ant-select-selection__rendered': {
          height: '30px !important',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginRight: 30,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '27px',
          lineHeight: '26px',
        },
      },
      input: {
        padding: '6px 0 3px',
        minHeight: 25,
        height: '1em',
      },
      multiline: {
        padding: 0,
        '& textarea:first-of-type': {
          position: 'relative',
          marginBottom: 9,
          top: 8,
        },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: largeFontSize,
        lineHeight: '1em',
        fontWeight: 300,
      },
      formControl: {
        transform: 'translate(0, 30px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 6px) scale(0.8)',
        fontWeight: 'inherit',
      },
    },
    MuiInputAdornment: {
      root: {
        ...sharedInputAdornmentRoot,
        marginTop: 5,
        '& svg': {
          top: 2,
          position: 'relative',
        },
        '& > p': {
          fontSize: largeFontSize,
        },
        '& > div': {
          width: '20px !important',
          height: '20px !important',
        },
      },
    },
    MuiButton: {
      contained: largetButton,
      outlined: {
        ...largetButton,
        padding: '11px 24px !important',
      },
    },
  },
})
// console.log(smallTheme)
