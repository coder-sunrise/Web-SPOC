import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core'
import { secondaryColor } from 'mui-pro-jss'
const defaultFontSize = '1rem'
const smallFontSize = '0.9rem'
const largeFontSize = '1.2rem'

const defaultColor = 'rgba(0, 0, 0, 0.54)'
const sharedClasses = {
  // CustomInputWrapper: {
  //   labelRoot: {
  //     zIndex: 1,
  //   },
  // },
}
export const defaultTheme = createMuiTheme({
  props: {},
  overrides: {
    ...sharedClasses,

    MuiFormControl: {
      root: {
        paddingTop: 15,
        '& .ant-input': {
          height: 'auto',
        },
        '& .anticon': {
          fontSize: defaultFontSize,
          color: defaultColor,
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
        '& .ant-calendar-picker': {
          top: 3,
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
          marginRight: 28,
        },
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: defaultFontSize,
      },
      input: {
        padding: '4px 0 1px',
        minHeight: 24,
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
  props: {},
  overrides: {
    ...sharedClasses,
    MuiFormControl: {
      root: {
        paddingTop: 6,
        '& .ant-input': {
          height: 'auto',
        },
        '& .ant-select': {
          fontSize: smallFontSize,
          minHeight: 20,
          padding: '3px 0 0px',
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
          marginRight: 27,
        },
        '& .ant-select-selection--multiple > ul > li, .ant-select-selection--multiple .ant-select-selection__rendered > ul > li': {
          height: '21px',
          lineHeight: '21px',
          marginTop: 0,
        },
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: smallFontSize,
      },
      input: {
        padding: '2px 0 1px',
        minHeight: 20,
        height: '1rem',
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: smallFontSize,
        lineHeight: '0.95rem',
        fontWeight: 300,
      },
      formControl: {
        transform: 'translate(0, 11px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, -4px) scale(0.8)',
        fontWeight: 'inherit',
      },
    },
  },
})

export const largeTheme = createMuiTheme({
  props: {},
  overrides: {
    ...sharedClasses,
    MuiFormControl: {
      root: {
        paddingTop: 20,
        '& .ant-input': {
          height: 'auto',
        },
        '& .ant-select': {
          fontSize: largeFontSize,
          minHeight: 25,
          padding: '3px 0 0px',
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
          marginRight: 30,
        },
      },
    },
    MuiInputBase: {
      root: {
        alignItems: 'start',
        fontSize: largeFontSize,
      },
      input: {
        padding: '6px 0 3px',
        minHeight: 25,
        height: '1rem',
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
