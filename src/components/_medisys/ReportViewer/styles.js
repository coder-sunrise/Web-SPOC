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
  reportControl: {
    marginBottom: theme.spacing(1),
  },
  reportContainerWrapper: {
    position: 'relative',
    maxHeight: '70vh',
    overflow: 'auto',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.28)',
  },
  reportContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '70vh',
  },
  page: {
    padding: 8,
  },
})
