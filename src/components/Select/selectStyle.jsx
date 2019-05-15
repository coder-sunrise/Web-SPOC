import { emphasize } from '@material-ui/core/styles/colorManipulator'
import extendedFormsStyle from 'mui-pro-jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx'

const selectStyle = (theme) => ({
  ...extendedFormsStyle,
  disabled: {
    color: 'rgba(0, 0, 0, 0.38)',
    '&:before': {
      borderBottomStyle: 'dotted',
    },
  },
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
    // marginBottom: 1,
  },
  selectRoot: {
    // top: '-3px',
  },
  selectRootWithWrapper: {
    // top: '-4px',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    flex: 1,
    whiteSpace: 'nowrap',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    marginTop: '3px',
    fontSize: '1rem',
  },
  placeholder: {
    position: 'absolute',
    left: 3,
    // fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  menuContainer: {
    maxHeight: 300,
    overflowY: 'auto',
    paddingBottom: 4,
    paddingTop: 4,
    position: 'relative',
    '-webkit-overflow-scrolling': 'touch',
    boxSizing: 'border-box',
  },
  // CustomSelect:{
  //   disabled:{
  //     '&:before':{
  //       borderBottomStyle:'dotted',
  //     },
  //   },
  // },
})

export default selectStyle
