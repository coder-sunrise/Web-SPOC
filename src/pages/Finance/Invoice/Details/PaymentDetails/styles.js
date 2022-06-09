export default theme => ({
  title: {
    marginBottom: theme.spacing(1),
    fontSize: '1rem',
  },
  container: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  lastContainer: {
    margin: theme.spacing(1),
  },
  popupContainer: {
    maxHeight: '30vh',
    overflow: 'scroll',
  },

  printButton: {
    position: 'absolute',
    left: theme.spacing(2),
  },
  infoButton: {
    position: 'absolute',
    left: theme.spacing(2),
  },
  currency: {
    color: 'darkblue',
    fontWeight: 500,
  },
  rowContainer: {
    paddingLeft: theme.spacing(4),
  },
  errorMessage: {
    color: 'red',
    fontWeight: 500,
  },
  rightIcon: {
    position: 'relative',
    fontWeight: 600,
    color: 'white',
    fontSize: '0.7rem',
    padding: '2px 3px',
    height: 20,
    cursor: 'pointer',
    margin: '0px 1px',
    lineHeight: '16px',
  },
})
