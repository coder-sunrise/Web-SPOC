const DispenseIndexStyle = (theme) => ({
  content: {
    marginTop: theme.spacing.unit,
  },
  footerRow: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  gridRow: {
    margin: `${theme.spacing.unit}px 0px`,
    '& > h5': {
      padding: theme.spacing.unit,
    },
  },
})

export default DispenseIndexStyle
