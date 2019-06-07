import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core'

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

        '& .anticon': {
          fontSize: defaultFontSize,
          color: defaultColor,
        },
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1.1rem',
        },
        '& .ant-select-selection__clear': {
          right: 14,
        },
        '& .ant-calendar-picker-clear': {
          right: 11,
          top: '52%',
        },
        '& .ant-calendar-picker': {
          top: -4,
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
      },
      formControl: {
        transform: 'translate(0, 22px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 3px) scale(0.8)',
      },
    },
    AntdSelect: {
      selectContainer: {
        marginTop: 4,
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
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1rem',
        },
        '& .ant-select-selection__clear': {
          right: 13,
        },
        '& .ant-calendar-picker': {
          fontSize: smallFontSize,
        },
        '& .ant-calendar-picker-input': {
          paddingTop: 3,
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
      },
      formControl: {
        transform: 'translate(0, 11px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, -4px) scale(0.8)',
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
        '& .anticon-close-circle': {
          color: 'rgba(0, 0, 0, 1)',
          fontSize: '1.3rem',
        },
        '& .ant-select-selection__clear': {
          right: 17,
        },
        '& .ant-calendar-picker': {
          fontSize: largeFontSize,
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
      },
      formControl: {
        transform: 'translate(0, 30px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 6px) scale(0.8)',
      },
    },
  },
})
// console.log(smallTheme)
