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
} from '@/components'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'

import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'

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
    // console.log(props)

    this.delayedResize = _.debounce(this.resize, 1000)
    window.addEventListener('resize', this.delayedResize)
    // console.log(localStorage.getItem('consultationLayout'))
    // console.log(JSON.parse(localStorage.getItem('consultationLayout') || '{}'))

    this.pageDefaultWidgets = [
      {
        id: '00001',
        widgetFk: '1',
        config: {
          lg: { x: 0, y: 0, w: 6, h: 6, static: true },
          md: { x: 0, y: 0, w: 5, h: 6, static: true },
        },
      },
      {
        id: '00002',
        widgetFk: '2',
        config: {
          lg: { x: 6, y: 0, w: 6, h: 4 },
          md: { x: 5, y: 0, w: 5, h: 4 },
        },
      },
      {
        id: '00003',
        widgetFk: '3',
        config: {
          lg: { x: 6, y: 4, w: 6, h: 2 },
          md: { x: 5, y: 4, w: 5, h: 2 },
        },
      },
      {
        id: '00004',
        widgetFk: '4',
        config: {
          lg: { x: 0, y: 6, w: 6, h: 6 },
          md: { x: 0, y: 6, w: 5, h: 6 },
        },
      },
      {
        id: '00005',
        widgetFk: '5',
        config: {
          lg: { x: 6, y: 6, w: 6, h: 6 },
          md: { x: 5, y: 6, w: 5, h: 6 },
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
    if (!defaultLayout.keys) {
      defaultLayout = this.getDefaultLayout()
    }

    this.state = {
      mode: 'edit',
      rowHeight: getLayoutRowHeight(),
      menuOpen: false,
      currentLayout: defaultLayout,
    }
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

  removeWidget = (id) => {
    const { currentLayout } = this.state
    const keys = currentLayout.keys.filter((o) => o !== id)
    const sizes = [
      'lg',
      'md',
      'sm',
    ]
    const layout = {
      keys,
    }
    sizes.forEach((s) => {
      layout[s] = currentLayout[s]
    })
    console.log(layout)
    this.changeLayout(layout)
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
      keys: defaultWidgets.map((o) => o.id),
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
      onMouseEnter: (e) => {
        // console.log(cfg, e.target)
        // console.log($(e.target).parent('.widget-container')[0])
        // elevation[cfg.id] = 3
        // this.setState({ elevation })
        if (lasActivedWidgetId === id) return
        if (lasActivedWidget) {
          lasActivedWidget.css('overflow', 'hidden')
        }
        lasActivedWidget = $($(e.target).parents('.widget-container')[0])
        if (lasActivedWidget.length > 0) {
          lasActivedWidgetId = id
          lasActivedWidget.css('overflow', 'auto')
        }
      },
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
    this.setState({ openDraw: !this.state.openDraw })
  }

  render () {
    const { props, state } = this
    const { classes, theme, dispatch, consultation, ...resetProps } = this.props
    // console.log(props)
    const layoutCfg = {
      className: classes.layout,
      rowHeight: state.rowHeight,
      layouts: state.currentLayout,
      breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      // useCSSTransforms: false,
      margin: [
        1,
        1,
      ],
      draggableCancel: '.non-dragable',
      draggableHandle: '.dragable',
      isResizable: this.state.mode === 'edit',
      onBreakpointChange: (newBreakpoint, newCols) => {
        console.log(newBreakpoint, newCols)
      },
      onLayoutChange: (currentLayout, allLayouts) => {
        console.log(allLayouts)
        // localStorage.setItem('consultationLayout', JSON.stringify(allLayouts))
        this.changeLayout(allLayouts)
      },
    }
    console.log(state.currentLayout)
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
          {state.currentLayout.keys.map((id) => {
            const dw = this.pageDefaultWidgets.find((m) => m.id === id)
            if (!dw) return <div />
            const w = widgets.find((wg) => wg.id === dw.widgetFk)
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
                        <Tooltip title='Delete'>
                          <IconButton
                            aria-label='Delete'
                            className={classes.margin}
                            size='small'
                            onClick={() => {
                              confirm({
                                title: 'Do you want to remove this widget?',
                                onOk: () => {
                                  this.removeWidget(id)
                                },
                              })
                            }}
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
            label='Selected Widgets'
            vertical
            simple
            value={consultation.selectedWidgets}
            valueField='id'
            textField='name'
            options={widgets}
            onChange={(e) => {
              console.log(e)
              dispatch({
                type: 'consultation/updateState',
                payload: {
                  selectedWidgets: e.target.value,
                },
              })
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
