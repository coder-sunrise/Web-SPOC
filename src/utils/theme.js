import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core'
import primaryColor from '@material-ui/core/colors/indigo'
import secondaryColor from '@material-ui/core/colors/blueGrey'

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
const smallFontSize = '0.9rem'
const largeFontSize = '1.2rem'

const defaultIconWidth = '0.9em'
const smallIconWidth = '0.82em'
const largeIconWidth = '0.95em'

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
  MuiInputAdornment: {
    root: {
      color: fontColor,
      fontSize: '1rem',
      whiteSpace: 'nowrap',
      '& > p': {
        fontWeight: 300,
      },
    },
    positionStart: {
      marginTop: 15,
    },
    positionEnd: {
      marginTop: 15,
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
  },
}

export const defaultTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {},
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
          height: 'auto',
        },
        '& .anticon': {
          fontSize: defaultFontSize,
          color: defaultColor,
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: defaultFontSize,
          height: 'auto',
          // '& .ant-input-number-handler-wrap': {
          //   height: 30,
          //   top: -5,
          // },
        },

        '& .ant-select-remove-icon': {
          fontSize: 'inherit',
        },
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1.1rem',
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
          height: '23px',
          lineHeight: '22px',
        },
      },
      input: {
        padding: '4px 0 1px',
        minHeight: 24,
      },
      multiline: {
        padding: 0,
        '& textarea': {
          position: 'relative',
          top: 6,
          paddingBottom: 5,
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
  },
})

export const smallTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {},
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
          height: 'auto',
        },
        '& .ant-select': {
          fontSize: smallFontSize,
          minHeight: 20,
          padding: '3px 0 0px',
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: smallFontSize,
          height: 'auto',
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
          fontSize: '1rem',
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
        '& .ant-calendar-picker-input': {
          paddingTop: 3,
        },
        '& .ant-select-selection--multiple .ant-select-selection__rendered': {
          height: '21px !important',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginRight: 27,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '20px',
          lineHeight: '20px',
          marginTop: 0,
        },
      },
      input: {
        padding: '2px 0 1px',
        minHeight: 20,
        height: '1rem',
      },
      multiline: {
        padding: 0,
        '& textarea': {
          position: 'relative',
          top: 3,
          paddingBottom: 3,
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
  },
})

export const largeTheme = createMuiTheme({
  palette: {
    ...sharedPalette,
  },
  props: {},
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
          height: 'auto',
        },
        '& .ant-select': {
          fontSize: largeFontSize,
          minHeight: 25,
          padding: '3px 0 0px',
        },
        '& .ant-input-number, .ant-time-picker': {
          fontSize: largeFontSize,
          height: 'auto',
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
          height: '28px !important',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginRight: 30,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '23px',
          lineHeight: '22px',
        },
      },
      input: {
        padding: '6px 0 3px',
        minHeight: 25,
        height: '1rem',
      },
      multiline: {
        padding: 0,
        '& textarea': {
          position: 'relative',
          top: 6,
          paddingBottom: 9,
        },
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: largeFontSize,
        lineHeight: '1rem',
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
  },
})
// console.log(smallTheme)
