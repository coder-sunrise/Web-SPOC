export default (theme) => ({
  payerHeader: {
    '& h4': {
      display: 'inline',
    },
    '& input': {
      fontSize: '1.3em',
    },
  },
  leftAlignText: {
    textAlign: 'left',
  },
  rightAlignText: {
    textAlign: 'right',
  },
  centerText: {
    textAlign: 'center',
  },
  currencyText: { color: 'darkblue', fontWeight: 500 },
  boldText: {
    fontWeight: 'bold',
  },
  paymentTypeContainer: {
    maxHeight: '50vh',
    overflowX: 'auto',
  },
  paymentTypeRow: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  paymentItemHeader: {
    display: 'inline',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  trashBin: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit * 2,
  },
  paymentSummary: {
    textAlign: 'right',
    marginTop: theme.spacing.unit * 2,
    fontSize: '1rem',
  },
  addPaymentActionButtons: {
    textAlign: 'right',
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
})
