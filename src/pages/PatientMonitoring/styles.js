export default (theme) => ({
  root: {
    width: '250px',
    height: '250px',
    margin: theme.spacing(1),
    display: 'inline-block',
  },
  warning: {
    background: '#faad14',
  },
  baseIndicator: {
    display: 'inline-block',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    marginRight: theme.spacing(1),
  },
  redIndicator: {
    background: '#cf1322',
  },
  greenIndicator: {
    background: '#389e0d',
  },
  centerize: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bed: {
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
  label: {
    fontWeight: 500,
  },
  blink: {
    animation: '$blinker 1.5s infinite ease-in-out',
  },
  bedBlinker: {
    animation: '$bedBlinker 1.5s infinite ease-in-out',
  },
  '@keyframes blinker': {
    '50%': {
      opacity: 0,
    },
  },
  '@keyframes bedBlinker': {
    '50%': {
      background: 'white',
    },
  },
})
