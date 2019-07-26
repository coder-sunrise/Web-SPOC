import React from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'

// import '@syncfusion/reporting-react/Scripts/reports/ej.reporting.react.min'
// import './create-react-class.min'

// material ui
import { withStyles } from '@material-ui/core'
import { baseUrl } from '@/utils/request'
// toast ui theme
import uiTheme from './uiTheme'
// common component
import {
  Button,
  CodeSelect,
  CardContainer,
  GridContainer,
  GridItem,
} from '@/components'

const styles = (theme) => ({
  buttonsBar: {
    margin: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
})

class Scribble extends React.Component {
  editorRef = React.createRef()

  state = {
    action: 'shape',
  }

  componentDidMount () {
    // const script = document.createElement('script')

    // script.src = 'https://use.typekit.net/foobar.js'
    // script.async = true

    // document.body.appendChild(script)

    // eslint-disable-line
    $(function () {
      $('#reportViewerContainer').ejReportViewer({
        reportServiceUrl:
          'http://js.syncfusion.com/ejservices/api/ReportViewer',
        // reportServerUrl: 'http://js.syncfusion.com/ejservices',
        // reportServiceUrl: '/api/ReportViewer',
        processingMode: ej.ReportViewer.ProcessingMode.Remote,
        reportPath: 'GroupingAgg.rdl',
        exportSettings: {
          exportOptions:
            ej.ReportViewer.ExportOptions.Html |
            ej.ReportViewer.ExportOptions.Pdf,
        },
      })

      // $('#reportViewerContainer').ejReportViewer({
      //   dataSources: [
      //     {
      //       name: 'PatientDeposit',
      //       values: [
      //         {
      //           DepositDate: '2017-01-04',
      //           PatientName: 'Med 400 Package',
      //           Remarks: null,
      //           DepositAmount: 2,
      //           DepositModeDisplayValue: 'Cash',
      //           SessionNo: '030117-06',
      //         },
      //         {
      //           DepositDate: '2017-01-04',
      //           PatientName: 'Med 400 Package',
      //           Remarks: 'Remarks',
      //           DepositAmount: 1,
      //           DepositModeDisplayValue: 'Cash',
      //           SessionNo: '030117-06',
      //         },
      //         {
      //           DepositDate: '2017-01-11',
      //           PatientName: 'Medisave 400 Package',
      //           Remarks: null,
      //           DepositAmount: 1,
      //           DepositModeDisplayValue: 'Cash',
      //           SessionNo: '110117-02',
      //         },
      //       ],
      //     },
      //   ],
      //   reportServiceUrl: `${baseUrl}/ReportViewerAPI`,
      //   processingMode: ej.ReportViewer.ProcessingMode.remote,
      //   reportPath: '~/resources/Report/BusinessTransactionMainReport_A4.rdlc',
      //   ajaxBeforeLoad: onAjaxRequest,
      // })
    })
    function getQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = location.search.substr(1).match(reg)
      if (r !== null) return decodeURI(r[2])
      return null
    }
    function onAjaxRequest (args) {
      //Passing custom parameter data to server
      var param = ''
      var from = getQueryString('ListingFrom')
      if (from != null) {
        param = '"ListingFrom":"' + from + '"'
      }
      var to = getQueryString('ListingTo')
      if (to != null) {
        if (param != '') {
          param += ','
        }
        param += '"ListingTo":"' + to + '"'
      }
      if (param != '') args.data = '{' + param + '}'
      console.log({ args })
    }

    console.log($('#reportViewerContainer'))
  }

  uploadImage = () => {
    // this.refs.fileUploader.click()

    const editorInstance = this.editorRef.current.getInstance()
    editorInstance
      .loadImageFromURL(
        'http://4.bp.blogspot.com/-o1oh1rmLyeU/T0XYgtt2r3I/AAAAAAAAAhY/0mMkhCBwNkg/s400/green_grass.png',
        'lena',
      )
      .then((result) => {
        console.log({ result })
        editorInstance.ui.resizeEditor({
          imageSize: {
            oldWidth: result.oldWidth,
            oldHeight: result.oldHeight,
            newWidth: result.newWidth,
            newHeight: result.newHeight,
          },
          uiSize: { width: 1000, height: 1000 },
        })
      })
      .catch((error) => {
        console.log({ error })
      })
  }

  onFileChange = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    const editorInstance = this.editorRef.current.getInstance()
    console.log({ editorInstance })

    // editorInstance.loadImageFromFile(file, 'test').then((result) => {
    //   // Change the image size and ui size, and change the affected ui state together.
    //   editorInstance.ui.resizeEditor({
    //     imageSize: {
    //       oldWidth: result.oldWidth,
    //       oldHeight: result.oldHeight,
    //       newWidth: result.newWidth,
    //       newHeight: result.newHeight,
    //     },
    //     uiSize: { width: 1000, height: 1000 },
    //   })
    //   // Apply the ui state while preserving the previous attribute (for example, if responsive Ui)
    //   // editorInstance.ui.resizeEditor()
    // })
  }

  onActionClick = (event) => {
    const { currentTarget } = event

    const imageEditor = this.editorRef.current.getInstance()

    switch (currentTarget.id) {
      case 'draw':
        this.setState({ action: currentTarget.id })
        imageEditor.changeCursor('crosshair')
        break
      case 'circle_shape':
        this.setState({ action: currentTarget.id })
        imageEditor.changeCursor('crosshair')
        imageEditor.setBrush({
          width: 12,
          color: '#000',
        })
        break
      case 'undo':
        imageEditor.undo()
        break
      case 'redo':
        imageEditor.redo()
        break
      case 'reset':
        imageEditor.clearObjects()
        break
      default:
        break
    }
  }

  handleMousedown = (event, originPointer) => {
    const { action } = this.state
    const imageEditor = this.editorRef.current.getInstance()

    switch (action) {
      case 'draw': {
        console.log('start draw')
        const success = imageEditor.startDrawingMode('FREE_DRAWING')
        console.log({ imageEditor, mode: imageEditor.getDrawingMode() })
        break
      }
      case 'circle_shape':
        {
          const mode = imageEditor.getDrawingMode()
          imageEditor.setDrawingShape('circle', {
            fill: 'transparent',
            stroke: 'blue',
            strokeWidth: 3,
            rx: 10,
            ry: 100,
          })
          imageEditor.startDrawingMode('SHAPE')
        }
        break
      default:
        break
    }
  }

  downloadImage = () => {
    const imageEditor = this.editorRef.current.getInstance()
    const dataurl = imageEditor.toDataURL()
    console.log({ imageEditor, dataurl })
  }

  render () {
    const { action } = this.state
    const { classes } = this.props

    const myExtScript = require('./reportViewer')

    return (
      <CardContainer hideHeader>
        {/* <EJ.ReportViewer
          id='groupingReportViewer'
          reportServiceUrl='http://js.syncfusion.com/ejservices/api/ReportViewer'
          processingMode='remote'
          reportPath='GroupingAgg.rdl'
        /> */}
        <div
          id='reportViewerContainer'
          style={{ height: '70vh', width: '100%' }}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'Scribble' })(Scribble)
