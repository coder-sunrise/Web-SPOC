import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import $ from 'jquery'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import { widgets } from '@/utils/widgets'
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
  Drawer,
} from '@material-ui/core'
import MoreVert from '@material-ui/icons/MoreVert'
import Clear from '@material-ui/icons/Clear'
import Settings from '@material-ui/icons/Settings'
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
  confirm,
  SizeContainer,
  Popconfirm,
} from '@/components'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'

import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'

const sizes = [
  'lg',
  'md',
  'sm',
]
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }

const ResponsiveGridLayout = WidthProvider(Responsive)
// let layout = {
//   lg: [
//     { i: 'a', x: 0, y: 0, w: 12, h: 6, static: true }, // static: true
//     { i: 'b', x: 0, y: 0, w: 6, h: 2 }, // minW: 2, maxW: 4
//     { i: 'c', x: 6, y: 0, w: 6, h: 2 },
//   ],
// }
// console.log(basicStyle)
const styles = (theme) => ({
  ...basicStyle(theme),
  root: {
    position: 'relative',
  },
  hide: {
    display: 'none',
  },
  layout: {
    marginLeft: -2,
    marginRight: -3,
    marginBottom: 30,
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
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  blockName: {
    lineHeight: '30px',
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
})

const getLayoutRowHeight = () => (window.innerHeight - headerHeight - 107) / 6
// let myConfig = JSON.parse(localStorage.getItem('myConfig') || '{}')
// if (Object.values(myConfig).length === 0) {
//   myConfig = pageDefaultWidgets
// }

let lasActivedWidgetId = null
let lasActivedWidget = null

@connect(({ consultation, global }) => ({
  consultation,
  global,
}))
class Consultation extends PureComponent {
  constructor (props) {
    super(props)
    this.container = React.createRef()
    // console.log(this.container)
    // console.log(window.innerHeight)
    this.delayedResize = _.debounce(this.resize, 1000)
    window.addEventListener('resize', this.delayedResize)
    this.delayedChangeLayout = _.debounce(this.changeLayout, 1000)

    // console.log(localStorage.getItem('consultationLayout'))
    // console.log(JSON.parse(localStorage.getItem('consultationLayout') || '{}'))

    this.pageDefaultWidgets = [
      {
        id: '1',
        config: {
          lg: { x: 0, y: 0, w: 6, h: 6, minH: 3, minW: 4, static: true },
          md: { x: 0, y: 0, w: 5, h: 6, minH: 3, minW: 3, static: true },
        },
      },
      {
        id: '2',
        config: {
          lg: { x: 6, y: 0, w: 6, h: 4, minH: 3, minW: 4 },
          md: { x: 5, y: 0, w: 5, h: 4, minH: 3, minW: 3 },
        },
      },
      {
        id: '3',
        config: {
          lg: { x: 6, y: 4, w: 6, h: 2, minH: 2, minW: 4 },
          md: { x: 5, y: 4, w: 5, h: 2, minH: 2, minW: 3 },
        },
      },
      {
        id: '4',
        config: {
          lg: { x: 0, y: 6, w: 6, h: 6, minH: 3, minW: 4 },
          md: { x: 0, y: 6, w: 5, h: 6, minH: 3, minW: 3 },
        },
      },
      {
        id: '5',
        config: {
          lg: { x: 6, y: 6, w: 6, h: 6, minH: 3, minW: 4 },
          md: { x: 5, y: 6, w: 5, h: 6, minH: 3, minW: 3 },
        },
      },
    ]
    let defaultLayout

    if (!localStorage.getItem('consultationLayout')) {
      defaultLayout = this.getDefaultLayout()
    } else {
      defaultLayout = JSON.parse(localStorage.getItem('consultationLayout'))
    }
    // console.log(defaultLayout)
    if (!defaultLayout.widgets) {
      defaultLayout = this.getDefaultLayout()
    }

    this.state = {
      mode: 'edit',
      breakpoint: 'lg',
      rowHeight: getLayoutRowHeight(),
      menuOpen: false,
      collapsed: global.collapsed,
      currentLayout: defaultLayout,
    }
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { global } = nextProps
  //   // console.log(value)
  //   if (global.collapsed !== preState.collapsed) {
  //     return {
  //       collapsed: global.collapsed,
  //       currentLayout: _.cloneDeep(preState.currentLayout),
  //     }
  //   }

  //   return null
  // }

  componentDidMount () {
    // create an instance
    // console.log(this.props)
    // const { global } = this.props
    // $(window).trigger('resize')
    // console.log($(this.container.current).width())
    // console.log($(this.container.current).innerWidth())
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.delayedResize)
  }

  resize = (e) => {
    // console.log(e)
    this.setState({
      rowHeight: getLayoutRowHeight(),
    })
  }

  showWidgetManagePanel = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      menuOpen: true,
    })
  }

  closeWidgetManagePanel = () => {
    this.setState({
      anchorEl: null,
      menuOpen: false,
    })
  }

  removeWidget = (widgetId) => {
    const { currentLayout } = this.state

    const layout = {
      widgets: _.reject(currentLayout.widgets, (w) => w === widgetId),
    }
    sizes.forEach((s) => {
      layout[s] = currentLayout[s]
      if (layout[s]) {
        layout[s] = layout[s].filter((o) => o.i !== widgetId)
      }
    })
    this.changeLayout(layout)
  }

  addWidget = (widgetId) => {
    const { currentLayout } = this.state
    const layout = _.cloneDeep(currentLayout)
    layout.widgets.push(widgetId)
    // console.log(currentLayout)
    sizes.forEach((s) => {
      const widget = this.pageDefaultWidgets.find((o) => o.id === widgetId) || {
        config: {},
      }
      if (layout[s]) {
        const n = {
          h: 4,
          w: 6,
          minH: 3,
          minW: 4,
          x: 0,
          i: widgetId,
          ...widget.config[s],
          y: Infinity,
        }
        layout[s].push(n)
        console.log(n)
      }
    })
    this.changeLayout(layout)
  }

  updateWidget = (ids, changes) => {
    const keys = Object.keys(changes)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      console.log(key)
      if (changes[key]) {
        this.addWidget(key)
      } else {
        this.removeWidget(key)
      }
    }
    // const { currentLayout } = this.state
    // const widgets = this.getDefaultLayout().widgets.filter(
    //   (o) => ids.indexOf(o.id) >= 0,
    // )
    // console.log(widgets)
    // const sizes = [
    //   'lg',
    //   'md',
    //   'sm',
    // ]
    // const layout = {
    //   widgets,
    // }
    // sizes.forEach((s) => {
    //   layout[s] = currentLayout[s]
    // })
    // this.changeLayout(layout)
  }

  changeLayout = (layout) => {
    this.setState(
      {
        currentLayout: layout,
      },
      () => {
        localStorage.setItem('consultationLayout', JSON.stringify(layout))
      },
    )
  }

  getDefaultLayout = () => {
    const defaultWidgets = _.cloneDeep(this.pageDefaultWidgets)
    return {
      widgets: defaultWidgets.map((o) => o.id),
      lg: defaultWidgets.map((o) => ({
        ...o.config.lg,
        i: o.id,
      })),
      md: defaultWidgets.map((o) => ({
        ...o.config.md,
        i: o.id,
      })),
    }
  }

  generateConfig = (id) => {
    const { classes, ...resetProps } = this.props
    const { elevation } = this.state
    return {
      elevation: 1,
      classes: {
        root: classes.paperRoot,
      },
      className: 'widget-container',
      onMouseEnter: this.onMouseEnter,

      // onMouseOut: (e) => {
      //   console.log(e.target)

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

  toggleDrawer = (event) => {
    this.setState((prevState) => ({ openDraw: !prevState.openDraw }))
  }

  compareNodeLayoutChange = (a, b) => {
    for (let index = 0; index < a.length; index++) {
      const a1 = a[index]
      const b1 = b[index]
      if (a1.h !== b1.h) return false
      if (a1.w !== b1.w) return false
      if (a1.x !== b1.x) return false
      if (a1.y !== b1.y) return false
    }
    return true
  }

  onMouseEnter = (e) => {
    // console.log(e.target)
    // console.log(cfg, e.target)
    // console.log($(e.target).parent('.widget-container')[0])
    // elevation[cfg.id] = 3
    // this.setState({ elevation })
    // if (lasActivedWidgetId === id) return
    if (lasActivedWidget) {
      lasActivedWidget.css('overflow', 'hidden')
    }
    lasActivedWidget = $($(e.target).parents('.widget-container')[0])
    if (lasActivedWidget.length > 0) {
      lasActivedWidget.css('overflow', 'auto')
    }
  }

  // // eslint-disable-next-line camelcase
  // UNSAFE_componentWillReceiveProps (nextProps) {
  //   const { global } = nextProps
  //   // console.log(value)
  //   if (global.collapsed !== this.state.collapsed) {
  //     this.setState({
  //       collapsed: global.collapsed,
  //       // currentLayout: _.cloneDeep(preState.currentLayout),
  //     })
  //     this.forceUpdate()
  //   }
  // }

  render () {
    const { props, state } = this
    const { classes, theme, dispatch, consultation, ...resetProps } = this.props
    const { currentLayout } = state
    // console.log(props)
    // console.log(currentLayout)
    const layoutCfg = {
      className: classes.layout,
      rowHeight: state.rowHeight,
      layouts: currentLayout,
      breakpoints,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      useCSSTransforms: false,
      margin: [
        1,
        1,
      ],
      draggableCancel: '.non-dragable',
      draggableHandle: '.dragable',
      isResizable: this.state.mode === 'edit',
      onBreakpointChange: (newBreakpoint, newCols) => {
        this.setState({
          breakpoint: newBreakpoint,
        })
        console.log('onBreakpointChange', newBreakpoint, newCols)
      },
      onLayoutChange: (_currentLayout, allLayouts) => {
        // console.log(
        //   'onLayoutChange',
        //   _currentLayout,
        //   allLayouts,
        //   allLayouts[this.state.breakpoint],
        //   this.state.currentLayout[this.state.breakpoint],
        //   allLayouts[this.state.breakpoint] ===
        //     this.state.currentLayout[this.state.breakpoint],
        //   _.isEqual(
        //     allLayouts[this.state.breakpoint],
        //     this.state.currentLayout[this.state.breakpoint],
        //   ),
        //   _.isEqualWith(
        //     allLayouts[this.state.breakpoint],
        //     this.state.currentLayout[this.state.breakpoint],
        //     (a, b) => {
        //       for (let index = 0; index < a.length; index++) {
        //         const a1 = a[index]
        //         const b1 = b[index]
        //         if (a1.h !== b1.h) return false
        //         if (a1.w !== b1.w) return false
        //         if (a1.x !== b1.x) return false
        //         if (a1.y !== b1.y) return false
        //       }
        //       return true
        //     },
        //   ),
        // )
        // localStorage.setItem('consultationLayout', JSON.stringify(allLayouts))
        if (
          !_.isEqualWith(
            allLayouts[this.state.breakpoint],
            this.state.currentLayout[this.state.breakpoint],
            this.compareNodeLayoutChange,
          )
        ) {
          console.log('onLayoutChange')
          this.delayedChangeLayout(allLayouts)
        }
      },
      onWidthChange: (containerWidth, margin, cols, containerPadding) => {
        console.log(
          'onWidthChange',
          containerWidth,
          margin,
          cols,
          containerPadding,
        )
      },
    }
    // console.log(state.currentLayout)
    return (
      <div className={classes.root} ref={this.container}>
        <Banner
          extraCmt={
            <div style={{ textAlign: 'center', paddingTop: 16 }}>
              <p>Total Invoice</p>
              <h5>{NumberFormatter(210)}</h5>
              <SizeContainer size='sm'>
                <Button color='danger'>Discard</Button>
                <ProgressButton color='info' icon={null}>
                  Save Changes
                </ProgressButton>
                <ProgressButton color='primary' icon={null}>
                  Sign Off
                </ProgressButton>
              </SizeContainer>
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
          {state.currentLayout.widgets.map((id) => {
            const w = widgets.find((o) => o.id === id)
            if (!w) return <div />
            const cfgs = state.currentLayout[state.breakpoint]
            const cfg = cfgs.find((o) => o.i === id)
            // console.log(cfg)
            const LoadableComponent = w.component
            // console.log(o)
            return (
              <div className={classes.block} key={id}>
                <Paper {...this.generateConfig(id)}>
                  {this.state.mode === 'edit' && (
                    <div className={`${classes.blockHeader} dragable`}>
                      <div>
                        <span className={classes.blockName}>{w.name}</span>
                        {w.toolbarAddon}
                        <Tooltip title='Replace'>
                          <IconButton
                            aria-label='Replace'
                            className={classes.margin}
                            size='small'
                            disabled={cfg.static}
                          >
                            <CompareArrows />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title='Full-screen'>
                        <IconButton
                          aria-label='Full-screen'
                          className={classes.margin}
                          size='small'
                        >
                          <Fullscreen />
                        </IconButton>
                      </Tooltip> */}
                        <Popconfirm
                          title='Do you want to remove this widget?'
                          onConfirm={() => this.removeWidget(id)}
                        >
                          <Tooltip title='Delete'>
                            <IconButton
                              aria-label='Delete'
                              className={classes.margin}
                              size='small'
                              disabled={cfg.static}
                            >
                              <Clear />
                            </IconButton>
                          </Tooltip>
                        </Popconfirm>

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
                    <SizeContainer size='sm'>
                      <LoadableComponent />
                    </SizeContainer>
                  </div>
                </Paper>
              </div>
            )
          })}
        </ResponsiveGridLayout>

        <div className={classes.fabContainer}>
          <Slide direction='up' in={this.state.mode === 'edit'} mountOnEnter>
            <div>
              <Fab
                color='secondary'
                className={classes.fab}
                style={{ marginRight: 8 }}
                variant='extended'
                size='small'
                onClick={this.toggleDrawer}
              >
                <Settings />
              </Fab>
            </div>
          </Slide>
        </div>
        <Drawer
          anchor='right'
          open={this.state.openDraw}
          onClose={this.toggleDrawer}
        >
          <CheckboxGroup
            style={{
              margin: theme.spacing(2),
            }}
            label='Manage Widgets'
            vertical
            simple
            value={currentLayout.widgets}
            valueField='id'
            textField='name'
            options={widgets}
            onChange={(e, s) => {
              // console.log(e)
              // dispatch({
              //   type: 'consultation/updateState',
              //   payload: {
              //     selectedWidgets: e.target.value,
              //   },
              // })
              // console.log(e.target.value, s)
              this.updateWidget(e.target.value, s)
            }}
          />
          <Divider />
          <div
            style={{
              padding: theme.spacing(2),
            }}
          >
            <Button
              onClick={() => {
                this.changeLayout(this.getDefaultLayout())
              }}
              color='danger'
              size='sm'
            >
              Reset
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Consultation)
