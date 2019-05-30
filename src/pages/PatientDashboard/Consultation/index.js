import React, { PureComponent, Suspense } from 'react'
import _ from 'lodash'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading/index'
import { getUniqueId } from '@/utils/utils'
import { Affix } from 'antd'
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Fade,
  ClickAwayListener,
  Divider,
  Fab,
  Slide,
  Tooltip,
} from '@material-ui/core'
import MoreVert from '@material-ui/icons/MoreVert'
import Clear from '@material-ui/icons/Clear'
import Add from '@material-ui/icons/Add'
import Edit from '@material-ui/icons/Edit'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import CompareArrows from '@material-ui/icons/CompareArrows'

import {
  CardContainer,
  TextField,
  Button,
  CommonHeader,
  CommonModal,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  notification,
  Select,
  DatePicker,
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  NumberFormatter,
} from '@/components'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'

import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'

const widgets = [
  {
    id: 1,
    name: 'Clinical Notes',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ClinicalNotes'),
      loading: Loading,
    }),
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: 2,
    name: 'Diagnosis',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Diagnosis'),
      loading: Loading,
    }),
    layoutConfig: {
      minW: 12,
      minH: 10,
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: 3,
    name: 'Consultation Document',
    component: Loadable({
      loader: () => import('@/pages/Widgets/ConsultationDocument'),
      loading: Loading,
    }),
    layoutConfig: {},
  },
  {
    id: 4,
    name: 'Patient History',
    component: Loadable({
      loader: () => import('@/pages/Widgets/PatientHistory'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {
        padding: '0 5px',
      },
    },
  },
  {
    id: 5,
    name: 'Orders',
    component: Loadable({
      loader: () => import('@/pages/Widgets/Orders'),
      loading: Loading,
    }),
    layoutConfig: {
      style: {
        padding: '0 5px',
      },
    },
  },
]

const ResponsiveGridLayout = WidthProvider(Responsive)
// let layout = {
//   lg: [
//     { i: 'a', x: 0, y: 0, w: 12, h: 6, static: true }, // static: true
//     { i: 'b', x: 0, y: 0, w: 6, h: 2 }, // minW: 2, maxW: 4
//     { i: 'c', x: 6, y: 0, w: 6, h: 2 },
//   ],
// }
const styles = (theme) => ({
  ...basicStyle(theme),
  root: {
    position: 'relative',
  },
  layout: {
    marginLeft: -2,
    marginRight: -3,
  },
  container: {
    width: '100%',
  },
  item: {
    width: 100,
    border: '1px solid #ccc',
  },
  block: {
    padding: '4px 2px 0px 2px',
  },
  blockHeader: {
    position: 'sticky',
    textAlign: 'right',
    cursor: 'pointer',
    top: 0,
    zIndex: 100,
    backgroundColor: '#ffffff',
  },
  blockName: {
    position: 'absolute',
    left: 7,
    lineHeight: '30px',
    fontWeight: 400,
  },
  paperRoot: {
    // boxSizing: 'content-box',
    // height: 'calc(100% + 10px)',
    height: '100%',
    overflow: 'auto',
    // paddingTop: 30,
    '&> div': {
      overflow: 'auto',
      // height: '100%',
    },
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
    bottom: 10,
    right: 10,
    zIndex: 1000,
    '&> button': {
      marginLeft: 10,
    },
  },
})

const pageDefaultWidgets = [
  {
    id: '00001',
    key: 'a',
    widgetFk: 1,
    config: {
      lg: { i: 'a', x: 0, y: 0, w: 6, h: 6, static: true },
      md: { i: 'a', x: 0, y: 0, w: 5, h: 6, static: true },
    },
  },
  {
    id: '00002',
    key: 'b',
    widgetFk: 2,
    config: {
      lg: { i: 'b', x: 6, y: 0, w: 6, h: 4 },
      md: { i: 'b', x: 5, y: 0, w: 5, h: 4 },
    },
  },
  {
    id: '00003',
    key: 'c',
    widgetFk: 3,
    config: {
      lg: { i: 'c', x: 6, y: 4, w: 6, h: 2 },
      md: { i: 'c', x: 5, y: 4, w: 5, h: 2 },
    },
  },
  {
    id: '00004',
    key: 'd',
    widgetFk: 4,
    config: {
      lg: { i: 'd', x: 0, y: 6, w: 6, h: 6 },
      md: { i: 'd', x: 0, y: 6, w: 5, h: 6 },
    },
  },
  {
    id: '00005',
    key: 'e',
    widgetFk: 5,
    config: {
      lg: { i: 'e', x: 6, y: 6, w: 6, h: 6 },
      md: { i: 'e', x: 5, y: 6, w: 5, h: 6 },
    },
  },
]
const getLayoutRowHeight = () => (window.innerHeight - headerHeight - 106) / 6
let myConfig = JSON.parse(localStorage.getItem('myConfig') || '{}')
if (Object.values(myConfig).length === 0) {
  myConfig = pageDefaultWidgets
}

class Consultation extends PureComponent {
  constructor (props) {
    super(props)
    this.container = React.createRef()
    // console.log(this.container)
    // console.log(window.innerHeight)
    // console.log(props)
    this.state = {
      mode: 'default',
      rowHeight: getLayoutRowHeight(),
    }
    this.delayedResize = _.debounce(this.resize, 1000)
    window.addEventListener('resize', this.delayedResize)
  }

  componentDidMount () {
    // create an instance
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.delayedResize)
  }

  resize = (e) => {
    console.log(e)
    this.setState({
      rowHeight: getLayoutRowHeight(),
    })
  }

  title = () => {
    const { anchorEl, menuOpen } = this.state
    const { theme } = this.props
    const ITEM_HEIGHT = 48
    const uid = getUniqueId()
    const handleClose = () => {
      this.setState({
        anchorEl: null,
        menuOpen: false,
      })
    }
    return (
      <div>
        <IconButton
          aria-label='More'
          aria-owns={this.state.menuOpen ? uid : undefined}
          aria-haspopup='true'
          onClick={(event) => {
            this.setState({
              anchorEl: event.currentTarget,
              menuOpen: true,
            })
          }}
          className={this.props.classes.moreWidgetsBtn}
        >
          <MoreVert />
        </IconButton>
        <Popper
          id={uid}
          anchorEl={anchorEl}
          open={menuOpen}
          transition
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <ClickAwayListener onClickAway={handleClose}>
                <Paper
                  style={{
                    paddingLeft: theme.spacing.unit * 2,
                    paddingTop: theme.spacing.unit,
                  }}
                >
                  <CheckboxGroup
                    label='Selected Widgets'
                    vertical
                    simple
                    defaultValue={[
                      '1',
                    ]}
                    valueField='id'
                    textField='name'
                    options={widgets}
                    onChange={(e) => {
                      console.log(e)
                    }}
                  />
                </Paper>
              </ClickAwayListener>
            </Fade>
          )}
        </Popper>
      </div>
    )
  }

  generateConfig = (cfg) => {
    const { classes, ...resetProps } = this.props
    const { elevation } = this.state
    return {
      elevation: 1,
      classes: {
        root: classes.paperRoot,
      },
      // onMouseOver: (e) => {
      //   // console.log(cfg, e)
      //   // elevation[cfg.id] = 3
      //   // this.setState({ elevation })
      // },
      // onMouseOut: (e) => {
      //   // elevation[cfg.id] = 0
      //   // this.setState({ elevation })
      // },
    }
  }

  toggleMode = () => {
    this.setState((prevState) => ({
      mode: prevState.mode === 'default' ? 'edit' : 'default',
    }))
  }

  render () {
    const { props, state } = this
    const { classes, ...resetProps } = this.props

    const layoutCfg = {
      className: classes.layout,
      rowHeight: state.rowHeight,
      layouts: {
        lg: pageDefaultWidgets.map((o) => o.config.lg),
        md: pageDefaultWidgets.map((o) => o.config.md),
      },
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      useCSSTransforms: false,
      margin: [
        1,
        1,
      ],
      draggableCancel: '.non-dragable',
      draggableHandle: '.dragable',
      isResizable: this.state.mode == 'edit',
      onBreakpointChange: (newBreakpoint, newCols) => {
        console.log(newBreakpoint, newCols)
      },
      onLayoutChange: (currentLayout, allLayouts) => {
        localStorage.setItem('consultationLayout', JSON.stringify(allLayouts))
      },
    }
    return (
      <div className={classes.root} ref={this.container}>
        <Banner
          extraCmt={
            <div style={{ textAlign: 'center', paddingTop: 16 }}>
              <p>Total Invoice</p>
              <h5>{NumberFormatter(210)}</h5>
              <div>
                <Button size='sm' color='danger'>
                  Discard
                </Button>
                <ProgressButton size='sm' color='primary' icon={null}>
                  Save Changes
                </ProgressButton>
                <ProgressButton size='sm' color='primary' icon={null}>
                  Sign Off
                </ProgressButton>
              </div>
            </div>
          }
          {...this.props}
        />

        {/* <CardContainer
          hideHeader
          style={{
            marginLeft: 5,
            marginRight: 5,
          }}
          title={this.title}
        >
          
        </CardContainer> */}
        <ResponsiveGridLayout {...layoutCfg}>
          {pageDefaultWidgets.map((o) => {
            const w = widgets.find((wg) => wg.id === o.widgetFk)
            const LoadableComponent = w.component
            return (
              <div className={classes.block} {...o}>
                <Paper {...this.generateConfig(o)}>
                  {this.state.mode === 'edit' && (
                    <div className={`${classes.blockHeader} dragable`}>
                      <div>
                        <span className={classes.blockName}>{w.name}</span>
                        <Tooltip title='Replace'>
                          <IconButton
                            aria-label='Replace'
                            className={classes.margin}
                            size='small'
                          >
                            <CompareArrows />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Full-screen'>
                          <IconButton
                            aria-label='Full-screen'
                            className={classes.margin}
                            size='small'
                          >
                            <Fullscreen />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete'>
                          <IconButton
                            aria-label='Delete'
                            className={classes.margin}
                            size='small'
                          >
                            <Clear />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title='Exit full-screen'>
                          <IconButton
                            aria-label='Exit full-screen'
                            className={classes.margin}
                            size='small'
                          >
                            <FullscreenExit />
                          </IconButton>
                        </Tooltip> */}
                      </div>
                      <Divider light />
                    </div>
                  )}
                  <div className='non-dragable' style={w.layoutConfig.style}>
                    <LoadableComponent />
                  </div>
                </Paper>
              </div>
            )
          })}
          {/* <Paper key='a' {...paperCfg}>
            <LoadableComponent />
          </Paper>
          <Paper key='b' {...paperCfg}>
            b
          </Paper>
          <Paper key='c' {...paperCfg}>
            c
          </Paper> */}
        </ResponsiveGridLayout>
        {/* <Paper
          elevation={0}
          className={`${classes.actionContainer} ${classes.actionBtn}`}
        >
          <ProgressButton onClick={props.handleSubmit} />
          
        </Paper> */}
        <div className={classes.fabContainer}>
          {this.state.mode === 'default' && (
            <Fab
              color='primary'
              className={classes.fab}
              onClick={this.toggleMode}
            >
              <Edit />
            </Fab>
          )}
          {this.state.mode === 'edit' && (
            <Slide direction='up' in={this.state.mode === 'edit'} mountOnEnter>
              <div>
                <Fab
                  color='primary'
                  className={classes.fab}
                  style={{ marginRight: 8 }}
                >
                  <Add />
                </Fab>
                <Fab
                  color='danger'
                  className={classes.fab}
                  onClick={this.toggleMode}
                >
                  <Clear />
                </Fab>
              </div>
            </Slide>
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Consultation)
