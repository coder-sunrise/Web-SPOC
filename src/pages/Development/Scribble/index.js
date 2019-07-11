import React from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import uiTheme from './uiTheme'
// common component
import { Button, CardContainer, GridContainer, GridItem } from '@/components'

class Scribble extends React.Component {
  editorRef = React.createRef()

  state = {
    action: 'shape',
  }

  onActionClick = (event) => {
    const { currentTarget } = event
    this.setState({ action: currentTarget.id })
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
    // editorInstance
    //   .loadImageFromFile(
    //     'C:\\Users\\zhebin\\Pictures\\england-northumberland-craster-on-the-north-sea-coast-dunstanburgh-K1AAD6.jpg',
    //   )
    //   .then((result) => {
    //     console.log('old : ' + result.oldWidth + ', ' + result.oldHeight)
    //     console.log('new : ' + result.newWidth + ', ' + result.newHeight)
    //   })
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

  render () {
    const { action } = this.state
    return (
      <CardContainer hideHeader>
        <GridContainer justify='center' alignItems='center'>
          <GridItem md={12}>
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
              size='sm'
              simple={action !== 'shape'}
              id='shape'
              onClick={this.onActionClick}
            >
              Shape
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
                // menu: [],
                uiSize: {
                  width: '1000px',
                  height: '700px',
                },
              }}
              cssMaxHeight={700}
              cssMaxWidth={700}
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

export default Scribble
