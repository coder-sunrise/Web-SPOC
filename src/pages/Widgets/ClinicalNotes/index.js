import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { RichEditor, withFormikExtend, FastField } from '@/components'

import model from './models'

console.log(1)
window.g_app.replaceModel(model)

@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))
@withFormikExtend({
  mapPropsToValues: ({ clinicalnotes }) => {
    return clinicalnotes.entity || clinicalnotes.default
  },
  validationSchema: Yup.object().shape({
    type: Yup.string().required(),
    to: Yup.string().when('type', {
      is: (val) => val !== '2',
      then: Yup.string().required(),
    }),
    from: Yup.string().required(),
    date: Yup.date().required(),
    subject: Yup.string().required(),

    // 3->MC

    days: Yup.number().when('type', {
      is: (val) => val === '3',
      then: Yup.number().required(),
    }),
    fromto: Yup.array().when('type', {
      is: (val) => val === '3',
      then: Yup.array().of(Yup.date()).min(2).required(),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'WidgetClinicalNotes',
})
class ClinicalNotes extends PureComponent {
  // constructor (props) {
  //   super(props)
  //   // console.log(this.state, props)
  // }

  render () {
    console.log(this.props.values)
    return (
      <div>
        {/* <h6>Clinical Notes</h6> */}
        <FastField
          name='clinicalNotes'
          render={(args) => {
            return <RichEditor label='Clinical Notes' {...args} />
          }}
        />

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
