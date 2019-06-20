import React, { PureComponent, Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'

const STYLES = (theme) => {
  return {
    wrapper: {},
    editor: {
      minHeight: 200,
    },
  }
}

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
    const { classes, ...resetProps } = this.props
    return (
      <Editor
        wrapperClassName={classnames({
          [classes.wrapper]: true,
          [this.wrapperClassName]: true,
        })}
        editorClassName={classnames({
          [classes.editor]: true,
          [this.editorClassName]: true,
        })}
        {...this.editorCfg}
        {...this.props}
      />
    )
  }
}

export default withStyles(STYLES, { name: 'RichEditor', withTheme: true })(
  RichEditor,
)
