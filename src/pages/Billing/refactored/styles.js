export default (theme) => ({
  gridRow: {
    margin: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,

    '& > h5': {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
  gridActionBtn: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  rightEndBtn: {
    marginRight: 0,
  },
  dangerText: {
    fontWeight: 500,
    color: '#cf1322',
  },
  currencyText: {
    fontWeight: 500,
    color: 'darkblue',
  },
  errorPromptContainer: {
    textAlign: 'center',
    '& p': {
      fontSize: '1rem',
    },
  },
})
