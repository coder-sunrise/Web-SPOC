import React, { PureComponent, Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'

class RichEditor extends PureComponent {
  constructor (props) {
    super(props)
    // console.log(this.state, props)
    this.editorCfg = {
      toolbar: {
        options: [
          'inline',
          'blockType',
          // 'fontSize',
          'list',
          'textAlign',
          // 'colorPicker',
          // 'link',
          // 'embedded',
          // 'emoji',
          // 'image',
          'remove',
          'history',
        ],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
      },
    }
  }

  render () {
    return <Editor {...this.editorCfg} {...this.props} />
  }
}

export default RichEditor
