export default (theme) => ({
  boldText: {
    fontWeight: '700',
    marginTop: theme.spacing(1),
  },
  normalText: {
    fontWeight: '400',
    marginTop: theme.spacing(1),
  },
  inActiveText: {
    fontWeight: '600',
    marginTop: theme.spacing(1),
    textDecorationLine: 'line-through',
    color: 'red',
  },
  printInvoiceBtn: {
    float: 'right',
    marginTop: theme.spacing(3),
  },
  hidden: {
    display: 'none',
  },
  container: {
    position: 'relative',
  },
  applySchemeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  editInvoiceButton: {
    position: 'absolute',
    top: 0,
    right: 170,
  },
})
