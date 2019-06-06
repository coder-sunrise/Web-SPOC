import { standardRowHeight } from 'assets/jss'

// const inputStyle = (theme) => ({
//   label: {
//     '& .ant-form-item-label': {
//       pointerEvents: 'none',
//       position: 'absolute',
//       top: 4,
//       left: 5,
//       zIndex: 999,
//       paddingBottom: 0,
//       transform: 'translate(0, 28px) scale(1)',
//     },
//     '& .ant-form-item-label > label': {
//       color: 'rgba(0, 0, 0, 0.54)',
//       fontSize: '1rem',
//     },
//   },
//   labelFocused: {
//     '& .ant-form-item-label > label': {
//       color: theme.palette.primary.main,
//     },
//   },
//   labelShrink: {
//     '& .ant-form-item-label': {
//       transform: 'translate(0, 5px) scale(0.8)',
//       transformOrigin: 'top left',
//     },
//   },
//   labelAnimation: {
//     '& .ant-form-item-label': {
//       transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
//     },
//   },
// })

const inputStyle = (theme) => ({
  control: {
    position: 'relative',
    paddingTop: '24px',
    transformOrigin: 'top left',
  },
  controlNoLabel: {
    paddingTop: '0px !important',
  },
  controlUnderline: {
    '& .antdwrapper:after': {
      transform: 'scaleX(1) !important',
    },
  },
  label: {
    pointerEvents: 'none',
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.54)',
    top: 0,
    left: 0,
    zIndex: 999,
    paddingBottom: 0,
    // transform: 'translate(0, 30px) scale(1)',
  },
  mediumLabel: {
    fontSize: '1rem',
    transform: 'translate(0, 30px) scale(1)',
  },
  largeLabel: {
    fontSize: '1.2rem',
    transform: 'translate(0, 26px) scale(1)',
  },
  smallLabel: {
    fontSize: '0.875rem',
    transform: 'translate(0, 31px) scale(1)',
  },
  noLabel: {
    display: 'none',
  },
  labelFocused: {
    color: theme.palette.primary.main,
  },
  labelShrink: {
    transform: 'translate(0, 7px) scale(0.8)',
    transformOrigin: 'top left',
  },
  labelAnimation: {
    transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
  },
  inputError: {
    color: `${theme.palette.error.main} !important`,
  },
  underlineError: {
    '& .antdwrapper:after': {
      borderBottomColor: theme.palette.error.main,
    },
  },
  helpText: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '0.75rem',
    margin: 0,
    marginTop: 4,
    minHeight: '1em',
    lineHeight: '1em',
    textAlign: 'left',
  },
  hiddenHelpText: {
    display: 'none',
  },
})

export default inputStyle
