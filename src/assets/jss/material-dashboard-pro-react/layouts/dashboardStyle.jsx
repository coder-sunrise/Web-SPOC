// ##############################
// // // App styles
// #############################

import {
  drawerWidth,
  drawerMiniWidth,
  transition,
  containerFluid,
} from "mui-pro-jss"

const appStyle = theme => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh",
    "&:after": {
      display: "table",
      clear: "both",
      content: '" "',
    },
  },
  mainPanel: {
    transitionProperty: "top, bottom, width",
    transitionDuration: ".2s, .2s, .35s",
    transitionTimingFunction: "linear, linear, ease",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch",
  },
  content: {
    padding: '15px 5px',
    marginTop: '60px',
    minHeight: 'calc(100vh - 142px)',
  },
  container: { ...containerFluid },
  map: {
    marginTop: "70px",
  },
  mainPanelSidebarMini: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerMiniWidth}px)`,
    },
  },
  mainPanelWithPerfectScrollbar: {
    overflow: "hidden !important",
  },
})

export default appStyle
