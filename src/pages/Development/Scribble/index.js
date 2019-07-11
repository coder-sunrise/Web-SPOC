import React from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
// material ui
import { withStyles } from '@material-ui/core'
// toast ui theme
import uiTheme from './uiTheme'
// common component
import { Button, CardContainer, GridContainer, GridItem } from '@/components'

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
          console.log('start circle_shape')

          const mode = imageEditor.getDrawingMode()
          imageEditor.setDrawingShape('circle', {
            fill: 'transparent',
            stroke: 'blue',
            strokeWidth: 3,
            rx: 10,
            ry: 100,
          })
          imageEditor.startDrawingMode('SHAPE')
          console.log({ imageEditor })
          // if (mode === 'NORMAL') {

          // } else {
          //   imageEditor.stopDrawingMode()
          // }
          // imageEditor.setObjectPosition()
          // if (mode !== 'NORMAL') imageEditor.stopDrawingMode()
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

    return (
      <CardContainer hideHeader>
        <GridContainer
          direction='column'
          justify='space-between'
          alignItems='center'
        >
          <GridItem className={classes.buttonsBar}>
            <input
              type='file'
              id='file'
              ref='fileUploader'
              style={{ display: 'none' }}
              onChange={this.onFileChange}
            />
            <Button
              color='primary'
              variant='outlined'
              onClick={this.uploadImage}
            >
              Upload
            </Button>
            <Button
              color='primary'
              variant='outlined'
              onClick={this.downloadImage}
            >
              Download
            </Button>
          </GridItem>
          <GridItem md={6} className={classes.buttonsBar}>
            <Button
              color='primary'
              size='sm'
              variant='outlined'
              id='undo'
              onClick={this.onActionClick}
            >
              Undo
            </Button>
            <Button
              color='primary'
              size='sm'
              variant='outlined'
              id='redo'
              onClick={this.onActionClick}
            >
              Redo
            </Button>
            <Button
              color='primary'
              size='sm'
              variant='outlined'
              id='reset'
              onClick={this.onActionClick}
            >
              Reset
            </Button>
            <Button
              color='primary'
              size='sm'
              simple={action !== 'circle_shape'}
              id='circle_shape'
              onClick={this.onActionClick}
            >
              Circle Shape
            </Button>

            <Button
              color='primary'
              size='sm'
              id='draw'
              simple={action !== 'draw'}
              onClick={this.onActionClick}
            >
              Draw
            </Button>
          </GridItem>

          <GridItem md={12}>
            <ImageEditor
              ref={this.editorRef}
              includeUI={{
                theme: uiTheme,
                // menu: [
                //   'draw',
                // ],
                uiSize: {
                  width: '1000px',
                  height: '700px',
                },
              }}
              onMousedown={this.handleMousedown}
              onObjectactivated={(props) => {
                console.log('onObjectActivated', { props })
              }}
              // cssMaxHeight={700}
              // cssMaxWidth={700}
              selectionStyle={{
                cornerSize: 20,
                rotatingPointOffset: 70,
              }}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'Scribble' })(Scribble)
