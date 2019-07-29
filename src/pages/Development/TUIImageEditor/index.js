import React, { PureComponent, Suspense } from 'react'
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout'
import Loadable from 'react-loadable'
import Loading from '@/components/PageLoading'
import { deepDiffMapper } from '@/utils/cdrss'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import numeral from 'numeral'
import Search from '@material-ui/icons/Search'

import svga from 'tui-image-editor/dist/svg/icon-a.svg'
import svgb from 'tui-image-editor/dist/svg/icon-b.svg'
import svgc from 'tui-image-editor/dist/svg/icon-c.svg'
import svgd from 'tui-image-editor/dist/svg/icon-d.svg'
import imgTest from 'assets/img/wallhaven-490244.jpg'
// console.log(svga, svgb, svga)
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'

import ImageEditor from 'tui-image-editor'
import './image'

import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Fade,
  Divider,
  ClickAwayListener,
} from '@material-ui/core'
import MoreVert from '@material-ui/icons/MoreVert'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import WarningIcon from '@material-ui/icons/Warning'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import {
  CardContainer,
  TextField,
  CodeSelect,
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
  DateRangePicker,
  CheckboxGroup,
  ProgressButton,
  Checkbox,
  BaseInput,
  RadioGroup,
  SizeContainer,
  AntdSelect,
  TimePicker,
  NumberInput,
  Switch,
} from '@/components'
import image from 'assets/img/sidebar-2.jpg'
import { widgets } from '@/utils/widgets'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

const styles = (theme) => ({
  ...basicStyle(theme),
  container: {
    width: '100%',
  },
  item: {
    width: 100,
    border: '1px solid #ccc',
  },
  paper: {
    '&> div': {
      overflow: 'auto',
      height: '100%',
    },
    // padding: 10,
  },
  moreWidgetsBtn: {
    position: 'absolute',
    right: -13,
    top: 0,
  },
  labelClass: {
    label: {
      minWidth: 100,
    },
  },
})

class ControlTest extends PureComponent {
  constructor (props) {
    super(props)
    this.editorRef = React.createRef()
  }

  state = {}

  // componentDidUpdate (prevProps, prevState, snapshot) {
  //   console.log(this.props, prevProps)

  //   console.log(deepDiffMapper.map(this.props, prevProps, true))
  // }

  componentDidMount () {
    const myTheme = {
      'common.bi.image':
        'https://uicdn.toast.com/toastui/img/tui-image-editor-bi.png',
      'common.bisize.width': '251px',
      'common.bisize.height': '21px',
      'common.backgroundImage': './img/bg.png',
      'common.backgroundColor': '#fff',
      'common.border': '1px solid #c1c1c1',

      // header
      'header.backgroundImage': 'none',
      'header.backgroundColor': 'transparent',
      'header.border': '0px',

      // load button
      'loadButton.backgroundColor': '#fff',
      'loadButton.border': '1px solid #ddd',
      'loadButton.color': '#222',
      'loadButton.fontFamily': "'Noto Sans', sans-serif",
      'loadButton.fontSize': '12px',

      // download button
      'downloadButton.backgroundColor': '#fdba3b',
      'downloadButton.border': '1px solid #fdba3b',
      'downloadButton.color': '#fff',
      'downloadButton.fontFamily': "'Noto Sans', sans-serif",
      'downloadButton.fontSize': '12px',

      // main icons
      'menu.normalIcon.path': svgd,
      'menu.normalIcon.name': 'icon-d',
      'menu.activeIcon.path': svgb,
      'menu.activeIcon.name': 'icon-b',
      'menu.disabledIcon.path': svga,
      'menu.disabledIcon.name': 'icon-a',
      'menu.hoverIcon.path': svgc,
      'menu.hoverIcon.name': 'icon-c',
      'menu.iconSize.width': '24px',
      'menu.iconSize.height': '24px',

      // submenu primary color
      'submenu.backgroundColor': 'transparent',
      'submenu.partition.color': '#e5e5e5',

      // submenu icons
      'submenu.normalIcon.path': svgd,
      'submenu.normalIcon.name': 'icon-d',
      'submenu.activeIcon.path': svgb,
      'submenu.activeIcon.name': 'icon-b',
      'submenu.iconSize.width': '32px',
      'submenu.iconSize.height': '32px',

      // submenu labels
      'submenu.normalLabel.color': '#858585',
      'submenu.normalLabel.fontWeight': 'normal',
      'submenu.activeLabel.color': '#000',
      'submenu.activeLabel.fontWeight': 'normal',

      // checkbox style
      'checkbox.border': '1px solid #ccc',
      'checkbox.backgroundColor': '#fff',

      // rango style
      'range.pointer.color': '#333',
      'range.bar.color': '#ccc',
      'range.subbar.color': '#606060',

      'range.disabledPointer.color': '#d3d3d3',
      'range.disabledBar.color': 'rgba(85,85,85,0.06)',
      'range.disabledSubbar.color': 'rgba(51,51,51,0.2)',

      'range.value.color': '#000',
      'range.value.fontWeight': 'normal',
      'range.value.fontSize': '11px',
      'range.value.border': '0',
      'range.value.backgroundColor': '#f5f5f5',
      'range.title.color': '#000',
      'range.title.fontWeight': 'lighter',

      // colorpicker style
      'colorpicker.button.border': '0px',
      'colorpicker.title.color': '#000',
    }

    // create an instance
    this.editorInstance = new ImageEditor('#tui-image-editor-container', {
      includeUI: {
        // loadImage: {
        //   path: 'img/timg.jpg',
        //   name: 'SampleImage',
        // },
        theme: myTheme,
        // menu: [
        //   'shape',
        //   'filter',
        // ],
        initMenu: 'draw',
        uiSize: {
          // width: '1000px',
          height: '85vh',
        },
        menuBarPosition: 'bottom',
      },
      cssMaxHeight: document.documentElement.clientHeight * 0.7,
      // cssMaxWidth=document.documentElement.clientWidth
      // selectionStyle={{
      //   cornerSize: 20,
      //   rotatingPointOffset: 70,
      // }}
      usageStatistics: false,
    })

    this.editorInstance
      // .loadImageFromURL(
      //   'http://4.bp.blogspot.com/-o1oh1rmLyeU/T0XYgtt2r3I/AAAAAAAAAhY/0mMkhCBwNkg/s400/green_grass.png',
      //   'lena',
      // )
      .loadImageFromURL(imgTest, 'test')
      .then((result) => {
        console.log({ result })
        console.log(this.editorInstance.getCanvasSize())

        this.editorInstance.clearUndoStack()
        this.editorInstance.ui.initializeImgUrl = imgTest
        this.editorInstance.ui.activeMenuEvent()
        this.editorInstance.ui.resizeEditor({
          imageSize: {
            oldWidth: result.oldWidth,
            oldHeight: result.oldHeight,
            newWidth: result.newWidth,
            newHeight: result.newHeight,
          },
          // uiSize: {
          //   width: result.newWidth - 50 + 'px',
          //   height: result.newHeight + 'px',
          // },
        })
        // console.log(editorInstance.getCanvasSize())
        // editorInstance.resizeCanvasDimension({
        //   width: result.newWidth,
        //   height: result.newHeight,
        // })
        // console.log(editorInstance.getCanvasSize())
        // console.log(editorInstance._graphics.canvasImage.width)
        // console.log(editorInstance._graphics.canvasImage.height)
        // this.redrawCanvas(editorInstance)
        // console.log(editorInstance.getCanvasSize())
      })
      .catch((error) => {
        console.log({ error })
      })
  }

  // redrawCanvas (editorInstance) {
  //   const myDimensions = this.calculateAspectRatioFit(
  //     editorInstance._graphics.canvasImage.width,
  //     editorInstance._graphics.canvasImage.height,
  //     Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  //     Math.max(document.documentElement.clientHeight, window.innerHeight || 0) *
  //       0.75,
  //   )

  //   this.resizeCanvas(myDimensions.height, myDimensions.width)
  // }

  // calculateAspectRatioFit (srcWidth, srcHeight, maxWidth, maxHeight) {
  //   const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  //   return { width: srcWidth * ratio, height: srcHeight * ratio }
  // }

  // resizeCanvas (height, width) {
  //   const editorInstance = this.editorRef.current.getInstance()

  //   editorInstance.resizeCanvasDimension({ width: width, height: height })
  //   const container = document.getElementsByClassName(
  //     'tui-image-editor-canvas-container',
  //   )
  //   container[0].style.height = height + 'px'
  //   container[0].style.width = width + 'px'
  //   container[0].style['margin-left'] = 'auto'
  //   container[0].style['margin-right'] = 'auto'
  // }

  render () {
    const { props, state } = this
    const { classes, theme, ...resetProps } = this.props
    console.log(this.props)

    return (
      <CardContainer hideHeader>
        <div id='tui-image-editor-container' />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ControlTest)
