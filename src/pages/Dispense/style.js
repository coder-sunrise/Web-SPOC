const DispenseIndexStyle = (theme) => ({
  root: {
    position: 'relative',
  },
  content: {
    marginTop: theme.spacing(1),
  },
  footerRow: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  orderPanel: {
    marginTop: -theme.spacing(1),
  },
  cdAddButton: {
    position: 'absolute',
    top: 3,
  },
  summaryPanel: {
    marginTop: theme.spacing(2),
  },
  gridRow: {
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
})

export default DispenseIndexStyle
