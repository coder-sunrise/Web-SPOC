import { primaryColor } from 'mui-pro-jss'

const accordionStyle = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '20px',
  },
  expansionPanel: {
    boxShadow: 'none',
    '&:before': {
      display: 'none !important',
    },
  },
  expansionPanelExpanded: {
    margin: '0 !important',
  },
  expansionPanelSummary: {
    minHeight: 'auto !important',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #ddd',
    padding: '15px 10px 5px 0px',
    // borderTopLeftRadius: '3px',
    // borderTopRightRadius: '3px',
    // color: '#3C4858',
    '&:hover': {
      color: primaryColor,
    },
  },
  expansionPanelSummaryExpaned: {
    color: primaryColor,
    '& $expansionPanelSummaryExpandIcon': {
      [theme.breakpoints.up('md')]: {
        top: 'auto !important',
      },
      transform: 'rotate(180deg)',
      [theme.breakpoints.down('sm')]: {
        top: '10px !important',
      },
    },
  },
  expansionPanelSummaryContent: {
    margin: '0 !important',
  },
  expansionPanelSummaryExpandIcon: {
    [theme.breakpoints.up('md')]: {
      top: 'auto !important',
    },
    transform: 'rotate(0deg)',
    color: 'inherit',
    [theme.breakpoints.down('sm')]: {
      top: '10px !important',
    },
  },
  leftExpansionPanelSummaryExpandIcon: {
    [theme.breakpoints.up('md')]: {
      top: 'auto !important',
    },
    transform: 'rotate(0deg)',
    color: 'inherit',
    [theme.breakpoints.down('sm')]: {
      top: '10px !important',
    },
    marginRight: 0,
  },
  expansionPanelSummaryExpandIconExpanded: {},
  title: {
    // fontSize: '15px',
    fontWeight: 500,
    marginTop: '0',
    marginBottom: '0',
    color: 'inherit',
    width: '100%',
    fontSize: '1em',
  },
  expansionPanelDetails: {
    // padding: '15px 0px 5px',
    padding: '0px',
  },
  reverseRow: {
    flexDirection: 'row-reverse',
  },
  expandIconAtLeft: {
    marginRight: 0,
  },
})

export default accordionStyle
