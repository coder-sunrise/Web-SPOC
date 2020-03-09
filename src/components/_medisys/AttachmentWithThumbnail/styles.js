const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  noPadding: {
    paddingLeft: '0px !important',
    paddingRight: '0px !important',
  },
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  attachmentLabel: {
    fontSize: '0.9rem',
    fontWeight: 300,
    marginRight: theme.spacing(1),
  },
  attachmentItem: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  chip: {
    // marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: 2,
    '& > span': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  notUploaded: {
    '& > a': {
      color: '#999',
    },
  },
  uploadBtn: {
    marginBottom: theme.spacing(1),
  },
})

export default styles
