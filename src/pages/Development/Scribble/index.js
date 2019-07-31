import React from 'react'
// import 'tui-image-editor/dist/tui-image-editor.css'
// import ImageEditor from '@toast-ui/react-image-editor'

// import '@syncfusion/reporting-react/Scripts/reports/ej.reporting.react.min'
// import './create-react-class.min'

import { Document, Page, pdfjs } from 'react-pdf'
// material ui
import { withStyles } from '@material-ui/core'
import { axiosRequest, baseUrl } from '@/utils/request'
// toast ui theme
import uiTheme from './uiTheme'
// common component
import {
  Button,
  CardContainer,
  GridContainer,
  GridItem,
  CommonModal,
} from '@/components'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const styles = (theme) => ({
  buttonsBar: {
    margin: theme.spacing(2),
    // marginBottom: theme.spacing(2),
  },
})

const BASE64_MARKER = ';base64,'
function _arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File(
    [
      u8arr,
    ],
    filename,
    { type: mime },
  )
}

class Scribble extends React.Component {
  editorRef = React.createRef()

  state = {
    action: 'shape',
    pdfData: '',
    numPages: 1,
    pageNumber: 1,
    loadedPdf: false,
  }

  componentDidMount = () => {
    this.fetchReport()
  }

  fetchReport = async () => {
    const response = await axiosRequest('/api/Report/QueueListing', {
      method: 'POST',
      responseType: 'arraybuffer',
      body: { ListingFrom: '2017-7-1', ListingTo: '2017-7-31' },
    })
    const { data } = response

    const base64 = _arrayBufferToBase64(data)
    const FILE_NAME = 'myCoolFileName.pdf'
    this.setState({
      // pdfData: dataURLtoFile(
      //   `data:application/pdf;headers=filename%3D${FILE_NAME};base64,${base64}`,
      //   'queuelisting.pdf',
      // ),
      pdfData: `data:application/pdf;headers=filename%3D${FILE_NAME};base64,${base64}`,
      loadedPdf: true,
    })
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

  onDocumentLoadSuccess = ({ numPages }) => {
    console.log('on document load success', { numPages })
    this.setState({ numPages, pageNumber: 1 })
  }

  changePage = (offset) =>
    this.setState((prevState) => ({
      pageNumber: prevState.pageNumber + offset,
    }))

  previousPage = () => this.changePage(-1)

  nextPage = () => this.changePage(1)

  closeModal = () => this.setState({ loadedPdf: false })

  render () {
    const { action, pdfData, numPages, pageNumber, loadedPdf } = this.state
    const { classes } = this.props

    //Usage example:
    // var file =
    //   pdfData !== '' ? dataURLtoFile(pdfData, 'Queue Listing Report.pdf') : ''
    // console.log(file)

    return (
      <CardContainer hideHeader>
        <input type='file' onChange={this.onFileChange} />
        <div>
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <button
            type='button'
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
          >
            Previous
          </button>
          <button
            type='button'
            disabled={pageNumber >= numPages}
            onClick={this.nextPage}
          >
            Next
          </button>
        </div>
        <a href={`/${pdfData}`} download>
          Download
        </a>
        <CommonModal
          open={loadedPdf}
          onClose={this.closeModal}
          title='Report'
          maxWidth='lg'
        >
          <CardContainer hideHeader size='sm'>
            <Button onClick={this.previousPage} size='sm' color='primary'>
              Previous
            </Button>
            <Button onClick={this.nextPage} size='sm' color='primary'>
              Next
            </Button>
            <div
              style={{
                width: '100%',
                minHeight: '60vh',
                maxHeight: '75vh',
                overflow: 'auto',
              }}
            >
              <Document
                file={pdfData}
                // renderMode='svg'
                onLoadSuccess={this.onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} width={700} scale={1.5} />
              </Document>
            </div>
          </CardContainer>
        </CommonModal>

        {/*

          <div style={{ minHeight: '70vh' }}>
            <object
              name='QueueListingReport.pdf'
              data={pdfData}
              type='application/pdf'
              aria-label='Document PDF'
              style={{ width: '100%', height: '70vh' }}
            />
          </div>
          
          */}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'Scribble' })(Scribble)
