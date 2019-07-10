import React from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
import uiTheme from './uiTheme'
// common component
import { Button } from '@/components'

class Scribble extends React.Component {
  render () {
    return (
      <div>
        <ImageEditor
          includeUI={{
            loadImage: {
              path: 'img/sampleImage.jpg',
              name: 'SampleImage',
            },
            theme: uiTheme,
            menu: [
              'shape',
              'filter',
              'draw',
            ],
            initMenu: 'filter',
            uiSize: {
              width: '1000px',
              height: '700px',
            },
            menuBarPosition: 'left',
          }}
          cssMaxHeight={500}
          cssMaxWidth={700}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics
        />
      </div>
    )
  }
}

export default Scribble
