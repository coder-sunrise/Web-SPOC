const DispenseIndexStyle = theme => ({
  root: {
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  editOrderRoot: {
    '& h5': {
      marginTop: theme.spacing(2),
    },
  },
  content: {
    marginTop: theme.spacing(1),
    overflowX: 'hidden!important',
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
})

export default DispenseIndexStyle
