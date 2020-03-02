import { primaryColor } from 'mui-pro-jss'
import color from 'color'

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
    // backgroundColor: 'transparent',
    borderBottom: '1px solid #ddd',
    padding: '10px 15px 10px 0px',
    // borderTopLeftRadius: '3px',
    // borderTopRightRadius: '3px',
    // color: '#3C4858',
    '&:hover': {
      color: primaryColor,
      background: color(primaryColor).lighten(0.7).hex(),
      boxShadow:
        '0 14px 26px -12px rgba(28, 26, 124, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(28, 26, 124, 0.2)',
    },
    color: primaryColor,
    background: color(primaryColor).lighten(0.9).hex(),
  },
  expansionPanelSummaryExpaned: {
    color: primaryColor,
    background: color(primaryColor).lighten(0.7).hex(),
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
    paddingLeft: theme.spacing(1.5),
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
    // paddingBottom: theme.spacing(1),
  },
  reverseRow: {
    flexDirection: 'row-reverse',
  },
  expandIconAtLeft: {
    marginRight: 0,
  },
})

export default accordionStyle
