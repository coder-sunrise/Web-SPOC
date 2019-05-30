import React, { Component } from 'react'
import { connect } from 'dva'
import { Editor } from 'react-draft-wysiwyg'

import model from './models'

window.g_app.replaceModel(model)

@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))
class ClinicalNotes extends Component {
  render () {
    const editorCfg = {
      toolbar: {
        options: [
          'inline',
          'blockType',
          // 'fontSize',
          'list',
          'textAlign',
          // 'colorPicker',
          'link',
          'embedded',
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
    return (
      <div>
        <h6>Clinical Notes</h6>
        <Editor {...editorCfg} />

        <h6 style={{ marginTop: 10 }}>Chief Complaints</h6>
        <Editor {...editorCfg} />

        <h6 style={{ marginTop: 10 }}>Plan</h6>
        <Editor {...editorCfg} />

        <h6 style={{ marginTop: 10 }}>Attachment</h6>
        <p>
          <a>Attachment001.xlsx</a>
        </p>
        <p>
          <a>Attachment002.pdf</a>
        </p>
        <p>
          <a>Attachment003.docx</a>
        </p>
        <p>
          <a>Scribble 01</a>
        </p>
      </div>
    )
  }
}

export default ClinicalNotes
