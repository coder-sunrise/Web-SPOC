import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import {
  RichEditor,
  withFormikExtend,
  FastField,
  CommonModal,
} from '@/components'
import { Attachment } from '@/components/_medisys'

import UploadAttachment from './UploadAttachment'
import model from './models'

window.g_app.replaceModel(model)

// @withFormikExtend({
//   mapPropsToValues: ({ clinicalnotes }) => {
//     return clinicalnotes.entity || clinicalnotes.default
//   },
//   validationSchema: Yup.object().shape({
//     type: Yup.string().required(),
//     to: Yup.string().when('type', {
//       is: (val) => val !== '2',
//       then: Yup.string().required(),
//     }),
//     from: Yup.string().required(),
//     date: Yup.date().required(),
//     subject: Yup.string().required(),

//     // 3->MC

//     days: Yup.number().when('type', {
//       is: (val) => val === '3',
//       then: Yup.number().required(),
//     }),
//     fromto: Yup.array().when('type', {
//       is: (val) => val === '3',
//       then: Yup.array().of(Yup.date()).min(2).required(),
//     }),
//   }),

//   handleSubmit: () => {},
//   displayName: 'WidgetClinicalNotes',
// })
@connect(({ clinicalnotes }) => ({
  clinicalnotes,
}))
class ClinicalNotes extends PureComponent {
  // constructor (props) {
  //   super(props)
  //   // console.log(this.state, props)
  // }

  toggleAttachmentModal = () => {
    const { clinicalnotes } = this.props

    this.props.dispatch({
      type: 'clinicalnotes/updateState',
      payload: {
        showAttachmentModal: !clinicalnotes.showAttachmentModal,
      },
    })
  }

  updateAttachments = (args) => ({ added, deleted }) => {
    console.log({ added, deleted }, args)
    const { form, field } = args
    let updated = [
      ...(field.value || []),
    ]
    if (added)
      updated = [
        ...updated,
        ...added.map((o) => ({
          ...o,
          fileIndexFK: o.id,
        })),
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    console.log(updated)
    form.setFieldValue('corAttachment', updated)
  }

  render () {
    console.log('ClinicalNotes', this.props)
    const { prefix = 'corDoctorNote[0].', clinicalnotes } = this.props

    return (
      <div>
        {/* <h6>Clinical Notes</h6> */}
        <FastField
          name={`${prefix}clinicianNote`}
          render={(args) => {
            return <RichEditor label='Clinical Notes' {...args} />
          }}
        />

        <FastField
          name={`${prefix}chiefComplaints`}
          render={(args) => {
            return <RichEditor label='Chief Complaints' {...args} />
          }}
        />

        <FastField
          name={`${prefix}plan`}
          render={(args) => {
            return <RichEditor label='Plan' {...args} />
          }}
        />

        <h6 style={{ marginTop: 10 }}>Attachment</h6>
        <FastField
          name='corAttachment'
          render={(args) => (
            <Attachment
              attachmentType='ClinicalNotes'
              handleUpdateAttachments={this.updateAttachments(args)}
              attachments={args.field.value}
              label=''
              isReadOnly
            />
          )}
        />

        {/*         
        <p>
          <a>Attachment002.pdf</a>
        </p>
        <p>
          <a>Attachment003.docx</a>
        </p>
        <p>
          <a>Scribble 01</a>
        </p> */}
        <CommonModal
          open={clinicalnotes.showAttachmentModal}
          title='Upload Attachment'
          maxWidth='sm'
          bodyNoPadding
          onClose={() => this.toggleAttachmentModal()}
        >
          <UploadAttachment updateAttachments={this.updateAttachments} />
        </CommonModal>
      </div>
    )
  }
}

export default ClinicalNotes
