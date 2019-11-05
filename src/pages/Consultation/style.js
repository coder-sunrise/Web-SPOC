import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

const styles = (theme) => ({
  ...basicStyle(theme),
  root: {
    position: 'relative',
    // overflowY: 'hidden',
  },
  layout: {
    marginLeft: -3,
    marginRight: -3,
    overflowY: 'hidden',
    overflowX: 'hidden',

    // height: 'auto',
  },
  fullscreenWidget: {
    height: 'auto !important',
  },
  layoutOnDrag: {
    paddingBottom: 50,
  },
  container: {
    width: '100%',
  },
  item: {
    width: 100,
    border: '1px solid #ccc',
  },
  hide: {
    display: 'none',
  },
  show: {
    display: 'inherit',
  },
  fullscreen: {
    position: 'initial !important',
    width: '100% !important',
    height: 'auto !important',

    // height: `calc(100vh - ${topHeight}px) !important`,
  },
  block: {
    padding: '4px 2px 0px 2px',
  },
  blockHeader: {
    position: 'sticky',
    textAlign: 'right',
    cursor: 'pointer',
    top: 0,
    zIndex: 2,
    backgroundColor: '#ffffff',
  },
  blockName: {
    lineHeight: '26px',
    fontWeight: 400,
    float: 'left',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  paperRoot: {
    // boxSizing: 'content-box',
    // height: 'calc(100% + 10px)',
    height: '100%',
    overflow: 'hidden',
    // paddingTop: 30,
    // '&> div': {
    //   overflow: 'auto',
    //   // height: '100%',
    // },
    // padding: 10,
  },
  moreWidgetsBtn: {
    position: 'absolute',
    right: -13,
    top: 0,
  },
  actionContainer: {
    position: 'sticky',
    bottom: 0,
    width: '100%',
  },
  fabContainer: {
    position: 'fixed',
    right: -3,
    top: '50%',
    zIndex: 1000,
    '& button': {
      borderRadius: '0px !important',
      borderTopLeftRadius: '3px !important',
      borderBottomLeftRadius: '3px !important',
    },
  },
  widgetPopper: {
    zIndex: 101,
    width: 300,
  },
  iconButton: {
    position: 'absolute',
    top: -3,
    marginLeft: 10,
  },
  actionPanel: {
    direction: 'column',
    justify: 'center',
    alignItems: 'center',
  },
  fabDiv: {
    margin: theme.spacing(2),
  },
})

export default styles
