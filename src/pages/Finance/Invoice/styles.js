export default (theme) => ({
  searchButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& > i': {
      fontWeight: 100,
      fontSize: '.8rem',
    },
  },
  footerNote: {
    margin: `${theme.spacing(2)}px 0px`,
  },
})
