export default (theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(2),
    overflow: 'hidden',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  midButtonGroup: {
    textAlign: 'center',
  },
  rightButtonGroup: {
    textAlign: 'right',
  },
  previousPageBtn: {
    marginRight: '0px !important',
  },
  pageNumber: {
    display: 'inline-block',
    maxWidth: '200px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    '& span': {
      // display: 'inline-block',
      fontSize: '1rem',
    },
  },
  reportContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '100%',
    minHeight: '85vh',
    // maxHeight: '88vh',
    overflow: 'scroll',
    marginTop: theme.spacing(1),
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.28)',
  },
  page: {
    padding: 8,
  },
})
