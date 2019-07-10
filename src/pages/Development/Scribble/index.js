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
            theme: uiTheme,
            menu: [
              'shape',
              'draw',
            ],
            initMenu: 'draw',
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
        />
      </div>
    )
  }
}

export default Scribble
