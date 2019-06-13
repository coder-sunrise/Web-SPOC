import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import { RichEditor } from '@/components'

import model from './models'

window.g_app.replaceModel(model)

@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))
class ClinicalNotes extends PureComponent {
  // constructor (props) {
  //   super(props)
  //   // console.log(this.state, props)
  // }

  render () {
    return (
      <div>
        <h6>Clinical Notes</h6>
        <RichEditor />

        <h6 style={{ marginTop: 10 }}>Chief Complaints</h6>
        <RichEditor />

        <h6 style={{ marginTop: 10 }}>Plan</h6>
        <RichEditor />

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
