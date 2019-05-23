import { standardRowHeight } from 'assets/jss'

const inputStyle = (theme) => ({
  label: {
    '& .ant-form-item-label': {
      pointerEvents: 'none',
      position: 'absolute',
      top: 4,
      left: 5,
      zIndex: 999,
      paddingBottom: 0,
      transform: 'translate(0, 28px) scale(1)',
    },
    '& .ant-form-item-label > label': {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '1rem',
    },
  },
  labelFocused: {
    '& .ant-form-item-label > label': {
      color: theme.palette.primary.main,
    },
  },
  labelShrink: {
    '& .ant-form-item-label': {
      transform: 'translate(0, 5px) scale(0.8)',
      transformOrigin: 'top left',
    },
  },
  labelAnimation: {
    '& .ant-form-item-label': {
      transition: `color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms`,
    },
  },
})

export default inputStyle
