import React, { PureComponent, Suspense } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import $ from 'jquery'
import classnames from 'classnames'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Yup from '@/utils/yup'
import { widgets } from '@/utils/widgets'
import { getUniqueId } from '@/utils/utils'
import Authorized from '@/utils/Authorized'
import AuthorizedContext from '@/components/Context/Authorized'

import { Menu, Dropdown } from 'antd'
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  IconButton,
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
import MoreHoriz from '@material-ui/icons/MoreHoriz'
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
  withFormikExtend,
} from '@/components'
import { standardRowHeight, headerHeight } from 'mui-pro-jss'

import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

// import PatientSearch from '@/pages/PatientDatabase/Search'
// import PatientDetail from '@/pages/PatientDatabase/Detail'
import Banner from '../Banner'
import InvoiceAdjustment from './InvoiceAdjustment'

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const sizes = Object.keys(breakpoints)

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
    // overflowY: 'hidden',
  },
  layout: {
    marginLeft: -3,
    marginRight: -3,
    // height: 'auto',
  },
  layoutOnDrag: {
    marginBottom: 200,
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
})

let lasActivedWidget = null

@connect(({ consultation, global }) => ({
  consultation,
  global,
}))
@withFormikExtend({
  mapPropsToValues: ({ consultation = {} }) => {
    return consultation.entity || consultation.default
  },
  validationSchema: Yup.object().shape(
    {
      // type: Yup.string().required(),
      // to: Yup.string().when('type', {
      //   is: (val) => val !== '2',
      //   then: Yup.string().required(),
      // }),
      // from: Yup.string().required(),
      // date: Yup.date().required(),
      // subject: Yup.string().required(),
      // // 3->MC
      // days: Yup.number().when('type', {
      //   is: (val) => val === '3',
      //   then: Yup.number().required(),
      // }),
      // fromto: Yup.array().when('type', {
      //   is: (val) => val === '3',
      //   then: Yup.array().of(Yup.date()).min(2).required(),
      // }),
    },
  ),

  handleSubmit: (values, { props }) => {
    const { dispatch, history, consultation } = props
    dispatch({
      type: 'consultation/sign',
      payload: values,
    }).then(() => {
      history.push(
        `/reception/queue/patientdashboard?qid=${consultation.queueID}&v=${Date.now()}`,
      )
    })
  },
  displayName: 'ConsultationPage',
})
class Consultation extends PureComponent {
  constructor (props) {
    super(props)
    this.container = React.createRef()
    this.layoutContainer = React.createRef()
    // console.log(this.container)
    // console.log(window.innerHeight)
    this.delayedResize = _.debounce(this.resize, 1000)
    window.addEventListener('resize', this.delayedResize)
    this.delayedChangeLayout = _.debounce(this.changeLayout, 1000)
    this.delayedShowBottomPadding = _.debounce((e) => {
      if (
        Math.abs(
          window.mainPanel.scrollHeight -
            window.mainPanel.scrollTop -
            window.mainPanel.clientHeight,
        ) < 10
      ) {
        $(this.layoutContainer.current).addClass(
          this.props.classes.layoutOnDrag,
        )
        $(window.mainPanel).scrollTop($(window.mainPanel).scrollTop() + 5)
      }
    }, 1000)
    this.delayedHideBottomPadding = _.debounce((e) => {
      $(this.layoutContainer.current).removeClass(
        this.props.classes.layoutOnDrag,
      )
    }, 1000)
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
      // {
      //   id: '1002',
      //   config: {
      //     lg: { x: 0, y: 12, w: 12, h: 6, minH: 3, minW: 6 },
      //     md: { x: 0, y: 12, w: 10, h: 6, minH: 3, minW: 5 },
      //   },
      // },
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

    this.widgetMenu = (
      <Menu>
        {widgets.map((o) => {
          const cfg = defaultLayout.lg.find((m) => m.i === o.id) || {}

          return (
            <Menu.Item
              key={o.id}
              disabled={cfg.static}
              onClick={(e) => {
                // console.log(this.state.currentLayout)
                // console.log(e.domEvent.target)
                // console.log(this.state.replaceWidget)
                if (e.key === this.state.replaceWidget) return false
                const layout = _.cloneDeep(this.state.currentLayout)
                for (let index = 0; index < sizes.length; index++) {
                  const breakpoint = sizes[index]
                  if (layout[breakpoint]) {
                    const target = layout[breakpoint].find((m) => m.i === e.key)
                    let starter = layout[breakpoint].find(
                      (m) => m.i === this.state.replaceWidget,
                    )
                    if (target) {
                      target.i = this.state.replaceWidget
                      starter.i = e.key
                    } else {
                      starter.i = e.key
                      if (
                        layout.widgets.find(
                          (m) => m === this.state.replaceWidget,
                        )
                      )
                        layout.widgets = _.reject(
                          layout.widgets,
                          (m) => m === this.state.replaceWidget,
                        )

                      if (!layout.widgets.find((m) => m === e.key)) {
                        layout.widgets.push(e.key)
                      }
                      // layout[breakpoint]=_.reject(layout[breakpoint])
                    }

                    // console.log(target, starter)
                  }
                }
                // console.log(layout)
                this.changeLayout(layout)
              }}
            >
              {o.name}
            </Menu.Item>
          )
        })}
      </Menu>
    )

    this.state = {
      mode: 'edit',
      breakpoint: 'lg',
      rowHeight: this.getLayoutRowHeight(),
      showInvoiceAdjustment: false,
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
    // $('.react-resizable-handle').on('mouseover',)
    const { consultation, dispatch } = this.props
    // console.log(this.props)
    $(this.layoutContainer.current)
      .on(
        'mouseenter',
        '.react-resizable-handle',
        this.delayedShowBottomPadding,
      )
      .on(
        'mouseleave',
        '.react-resizable-handle',
        this.delayedHideBottomPadding,
      )
    // if (consultation) {
    //   if (consultation.consultationID) {
    //     dispatch({
    //       type: 'consultation/query',
    //       payload: consultation.consultationID,
    //     })
    //   } else if (consultation.visitFK) {
    //     dispatch({
    //       type: 'consultation/newConsultation',
    //       payload: consultation.visitFK,
    //     })
    //   }
    // }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps', this.props, nextProps)
    // console.log(
    //   nextProps.consultation,
    //   nextProps.consultation.consultationID,
    //   this.props.consultation.consultationID !==
    //     nextProps.consultation.consultationID,
    // )
    if (
      nextProps.consultation &&
      nextProps.consultation.entity &&
      Object.values(nextProps.values).length === 0
    ) {
      nextProps.resetForm(nextProps.consultation.entity)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.delayedResize)
    $(window.mainPanel).css('overflow', 'auto')
  }

  resize = (e) => {
    // console.log(e)
    this.setState({
      rowHeight: this.getLayoutRowHeight(),
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
        // console.log(n)
      }
    })
    this.changeLayout(layout)
  }

  updateWidget = (ids, changes) => {
    const keys = Object.keys(changes)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      // console.log(key)
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
    const r = {
      widgets: defaultWidgets.map((o) => o.id),
    }
    sizes.forEach((s) => {
      r[s] = defaultWidgets.map((o) => ({
        ...o.config[s],
        i: o.id,
      }))
    })
    return r
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

  onFullScreenClick = (id) => () => {
    sessionStorage.setItem(
      'tempLayout',
      JSON.stringify(this.state.currentLayout),
    )
    this.setState(
      {
        fullScreenWidget: id,
      },
      () => {
        $(window.mainPanel).css('overflow', 'hidden').scrollTop(0)
      },
    )
  }

  onExitFullScreenClick = () => {
    $(window.mainPanel).css('overflow', 'auto')
    this.setState({
      fullScreenWidget: undefined,
      currentLayout: JSON.parse(sessionStorage.getItem('tempLayout')),
    })
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

  getLayoutRowHeight = () => {
    const topHeight = (this.props.height ? 0 : headerHeight) + 130
    // console.log(
    //   this.props,
    //   (this.props.height || window.innerHeight - topHeight) / 6,
    //   ((this.props.height || window.innerHeight) - topHeight) / 6,
    // )

    return ((this.props.height || window.innerHeight) - topHeight) / 6
  }

  getLayoutWidgets = () => {
    const { state, props } = this
    const { classes, height } = props
    // console.log(state.currentLayout)

    const layoutCfg = {
      className: classes.layout,
      rowHeight: state.rowHeight,
      layouts: state.currentLayout,
      breakpoints,
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      useCSSTransforms: false,
      preventCollision: !!this.state.fullScreenWidget,
      margin: [
        2,
        2,
      ],
      draggableCancel: '.non-dragable',
      draggableHandle: '.dragable',
      isResizable: this.state.mode === 'edit',
      onBreakpointChange: (newBreakpoint, newCols) => {
        this.setState({
          breakpoint: newBreakpoint,
        })
        // console.log('onBreakpointChange', newBreakpoint, newCols)
      },
      onLayoutChange: (_currentLayout, allLayouts) => {
        // console.log(window.mainPanel)
        if (
          !this.state.fullScreenWidget &&
          !_.isEqualWith(
            allLayouts[this.state.breakpoint],
            this.state.currentLayout[this.state.breakpoint],
            this.compareNodeLayoutChange,
          )
        ) {
          // console.log('onLayoutChange')
          this.delayedChangeLayout(allLayouts)
        }
      },
      onWidthChange: (containerWidth, margin, cols, containerPadding) => {
        // console.log(
        //   'onWidthChange',
        //   containerWidth,
        //   margin,
        //   cols,
        //   containerPadding,
        // )
      },
      onResizeStart: (e) => {
        // $(this.layoutContainer.current).addClass(classes.layoutOnDrag)
        // console.log($(this.layoutContainer.current), classes.layoutOnDrag)
      },
      onResizeStop: (e) => {
        // $(this.layoutContainer.current).removeClass(classes.layoutOnDrag)
      },
    }
    // console.log(state.rowHeight)
    return (
      <div
        ref={this.layoutContainer}
        style={{
          height: height ? this.props.height - 116 : 'auto',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginTop: 1,
        }}
      >
        <ResponsiveGridLayout {...layoutCfg}>
          {state.currentLayout.widgets.map((id) => {
            const w = widgets.find((o) => o.id === id)
            if (!w) return <div />
            const cfgs = state.currentLayout[state.breakpoint]
            const cfg = cfgs.find((o) => o.i === id)
            // console.log(cfg, id)

            if (!cfg) return <div key={id} />
            const LoadableComponent = w.component
            return (
              <div
                className={classnames({
                  [classes.block]: true,
                  [classes.fullscreen]: state.fullScreenWidget === id,
                  [classes.hide]: state.fullScreenWidget !== id,
                  [classes.show]:
                    !state.fullScreenWidget || state.fullScreenWidget === id,
                })}
                key={id}
              >
                <Paper {...this.generateConfig(id)}>
                  {this.state.mode === 'edit' && (
                    <div className={`${classes.blockHeader} dragable`}>
                      <div>
                        <span className={classes.blockName}>{w.name}</span>
                        {w.toolbarAddon}
                        {!state.fullScreenWidget && (
                          <React.Fragment>
                            <Tooltip title='Full-screen'>
                              <IconButton
                                aria-label='Full-screen'
                                size='small'
                                onClick={this.onFullScreenClick(id)}
                              >
                                <Fullscreen />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Replace'>
                              <Dropdown
                                overlay={this.widgetMenu}
                                trigger={[
                                  'click',
                                ]}
                                currentWidgetId={id}
                                disabled={cfg.static}
                                onVisibleChange={(visible) => {
                                  if (visible)
                                    this.setState({
                                      replaceWidget: id,
                                    })
                                }}
                              >
                                <IconButton aria-label='Replace' size='small'>
                                  <CompareArrows />
                                </IconButton>
                              </Dropdown>
                            </Tooltip>

                            <Popconfirm
                              title='Do you want to remove this widget?'
                              onConfirm={() => this.removeWidget(id)}
                            >
                              <Tooltip title='Delete'>
                                <IconButton
                                  aria-label='Delete'
                                  size='small'
                                  disabled={cfg.static}
                                >
                                  <Clear />
                                </IconButton>
                              </Tooltip>
                            </Popconfirm>
                          </React.Fragment>
                        )}
                        {state.fullScreenWidget === id && (
                          <Tooltip title='Exit full-screen'>
                            <IconButton
                              aria-label='Exit full-screen'
                              size='small'
                              onClick={this.onExitFullScreenClick}
                            >
                              <FullscreenExit />
                            </IconButton>
                          </Tooltip>
                        )}
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
      </div>
    )
  }

  toggleInvoiceAdjustment = () => {
    this.setState((prevState) => ({
      showInvoiceAdjustment: !prevState.showInvoiceAdjustment,
    }))
  }

  pauseConsultation = () => {
    const { dispatch, values, history, consultation } = this.props
    dispatch({
      type: 'consultation/pause',
      payload: values,
    }).then((r) => {
      if (r) {
        notification.success({
          message: 'Consultation paused',
        })
        dispatch({
          type: 'consultation/query',
          payload: values.id,
        }).then(() => {
          history.push(
            `/reception/queue/patientdashboard?qid=${consultation.queueID}`,
          )
        })
      }
    })
  }

  resumeConsultation = () => {
    const { dispatch, values, history, consultation, resetForm } = this.props
    dispatch({
      type: 'consultation/resume',
      payload: consultation.visitID,
    }).then((r) => {
      if (r) {
        resetForm(r)
        notification.success({
          message: 'Consultation resumed',
        })
      }
    })
  }

  discardConsultation = () => {
    const { dispatch, values, history, consultation, resetForm } = this.props
    console.log('delete', values)
    if (values.id) {
      dispatch({
        type: 'consultation/delete',
        payload: values.id,
      }).then((r) => {
        if (r) {
          history.push(
            `/reception/queue/patientdashboard?qid=${consultation.queueID}&v=${Date.now()}`,
          )
        }
      })
    }
  }

  render () {
    const { props, state } = this
    const {
      history,
      classes,
      theme,
      dispatch,
      values,
      consultation = {},
      ...resetProps
    } = this.props
    const { currentLayout } = state
    const { entity } = consultation
    console.log(values)
    // console.log(currentLayout)

    // console.log(state.currentLayout)
    return (
      <div className={classes.root} ref={this.container}>
        {true && (
          <Banner
            style={{}}
            extraCmt={
              <div style={{ textAlign: 'center', paddingTop: 16 }}>
                <p style={{ position: 'relative' }}>
                  Total Invoice
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item onClick={this.toggleInvoiceAdjustment}>
                          Add Invoice Adjustment
                        </Menu.Item>
                        <Menu.Divider />

                        <Menu.Item>Absorb GST</Menu.Item>
                      </Menu>
                    }
                    trigger={[
                      'click',
                    ]}
                  >
                    <IconButton className={classes.iconButton}>
                      <MoreHoriz />
                    </IconButton>
                  </Dropdown>
                </p>
                <h5>{NumberFormatter(210)}</h5>
                <SizeContainer size='sm'>
                  {values.status !== 'Paused' && (
                    <Popconfirm onConfirm={this.discardConsultation}>
                      <ProgressButton color='danger'>Discard</ProgressButton>
                    </Popconfirm>
                  )}
                  {values.status !== 'Paused' && (
                    <ProgressButton
                      onClick={this.pauseConsultation}
                      color='info'
                      icon={null}
                    >
                      Pause
                    </ProgressButton>
                  )}
                  {values.status === 'Paused' && (
                    <ProgressButton
                      onClick={this.resumeConsultation}
                      color='info'
                      icon={null}
                    >
                      Resume
                    </ProgressButton>
                  )}
                  <ProgressButton
                    color='primary'
                    onClick={this.props.handleSubmit}
                    icon={null}
                  >
                    Sign Off
                  </ProgressButton>
                </SizeContainer>
              </div>
            }
            {...this.props}
          />
        )}
        {/* <CardContainer
          hideHeader
          style={{
            marginLeft: 5,
            marginRight: 5,
          }}
          title={this.title}
        >
          
        </CardContainer> */}
        <AuthorizedContext.Provider
          value={{
            view: {
              name: 'consultation.view',
              rights: values.status === 'Paused' ? 'disable' : 'enable',
            },
            edit: {
              name: 'consultation.edit',
              rights: values.status === 'Paused' ? 'disable' : 'enable',
            },
          }}
        >
          {this.getLayoutWidgets()}
        </AuthorizedContext.Provider>
        {!state.fullScreenWidget && (
          <React.Fragment>
            <div className={classes.fabContainer}>
              <Slide
                direction='up'
                in={this.state.mode === 'edit'}
                mountOnEnter
              >
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
          </React.Fragment>
        )}
        <CommonModal
          open={this.state.showInvoiceAdjustment}
          title='Add Invoice Adjustment'
          maxWidth='sm'
          bodyNoPadding
          onClose={() => this.toggleInvoiceAdjustment()}
          onConfirm={() => this.toggleInvoiceAdjustment()}
        >
          <InvoiceAdjustment />
        </CommonModal>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Consultation)
