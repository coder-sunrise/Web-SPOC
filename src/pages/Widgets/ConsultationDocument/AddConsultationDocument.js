import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import { convertFromHTML } from 'draft-js'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Checkbox,
  SizeContainer,
  RichEditor,
  ButtonSelect,
} from '@/components'
import { tagList } from '@/utils/codes'

import ReferralLetter from './ReferralLetter'
import Memo from './Memo'
import MedicalCertificate from './MedicalCertificate'
import CertificateAttendance from './CertificateAttendance'
import Others from './Others'
import VaccinationCertificate from './VaccinationCertificate'

const loadFromCodes = [
  {
    value: 'corDoctorNote[0].clinicianNote',
    name: 'Clinical Notes',
  },
  {
    value: 'corDoctorNote[0].chiefComplaints',
    name: 'Chief Complaints',
  },
  { value: 'corDoctorNote[0].plan', name: 'Plan' },
  {
    value: 'corDiagnosis',
    name: 'Diagnosis',
    getter: (v) => {
      const { corDiagnosis = [] } = v
      return corDiagnosis
        .filter((o) => !!o.diagnosisDescription)
        .map((o) => `<p>- ${o.diagnosisDescription}</p>`)
        .join('')
    },
  },
  {
    value: 'order',
    name: 'Orders',
    getter: (v) => {
      const { orders } = window.g_app._store.getState()
      if (!orders) return '-'
      const { rows = [] } = orders
      return rows
        .filter((o) => !o.isDeleted)
        .map((o) => `<p>- ${o.subject}</p>`)
        .join('')
    },
  },
]
const styles = (theme) => ({
  editor: {
    // marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 3,
    top: 8,
  },
})
const templateReg = /<a.*?data-value="(.*?)".*?<\/a>/gm

// @withFormikExtend({
//   mapPropsToValues: ({ consultationDocument }) => {
//     // console.log(diagnosis)
//     return consultationDocument.entity || consultationDocument.default
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
//   displayName: 'AddConsultationDocument',
// })
@connect(({ consultationDocument, user, codetable, visitRegistration }) => ({
  consultationDocument,
  user,
  codetable,
  visitEntity: visitRegistration.entity || {},
}))
class AddConsultationDocument extends PureComponent {
  constructor (props) {
    super(props)
    const { dispatch } = props

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'documenttemplate',
      },
    })
  }

  toggleModal = () => {
    const { consultationDocument } = this.props
    const { showModal } = consultationDocument

    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  getLoader = (editor, setFieldValue, currentType) => {
    const { classes, parentProps, codetable } = this.props
    const { documenttemplate } = codetable
    const documentType = parseInt(currentType.value, 10) || -1
    return (
      <div className={classes.editorBtn}>
        <ButtonSelect
          options={documenttemplate.filter(
            (template) => template.documentTemplateTypeFK === documentType,
          )}
          textField='displayValue'
          onClick={(option) => {
            let msg = option.templateContent
            const match = option.templateContent.match(templateReg) || []
            match.forEach((s) => {
              const text = s.match(/data-value="(.*?)"/)[1]
              const m = tagList.find((o) => o.text === text)
              if (m && m.getter) msg = msg.replace(s, m.getter())
            })
            setFieldValue('content', msg)
            setTimeout(() => {
              editor.focus()
            }, 1)
          }}
        >
          Load Template
        </ButtonSelect>
        <ButtonSelect
          options={loadFromCodes}
          onClick={(option) => {
            const { values } = parentProps
            const v = option.getter
              ? option.getter(values)
              : Object.byString(values, option.value) || '-'
            console.log(parentProps, option.value)
            const blocksFromHTML = convertFromHTML(htmlDecodeByRegExp(v))
            const { editorState } = editor.props
            editor.update(
              RichEditor.insertBlock(editorState, blocksFromHTML.contentBlocks),
            )
            setTimeout(() => {
              editor.focus()
            }, 1)
          }}
        >
          Load From
        </ButtonSelect>
      </div>
    )
  }

  render () {
    const { props } = this
    const {
      theme,
      classes,
      consultationDocument,
      parentProps,
      rowHeight,
      footer,
      dispatch,
      types,
      codetable,
    } = props
    const { entity = {}, type } = consultationDocument

    const cfg = {
      ...props,
      loadFromCodes,
      currentType: types.find((o) => o.value === type),
      templateLoader: this.getLoader,
    }

    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={6}>
              <Select
                label='Type'
                options={types}
                allowClear={false}
                value={type}
                disabled={entity.id || entity.uid}
                onChange={(v) => {
                  dispatch({
                    type: 'consultationDocument/updateState',
                    payload: {
                      type: v,
                    },
                  })
                }}
              />
            </GridItem>
          </GridContainer>
          {type === '1' && <ReferralLetter {...cfg} />}
          {type === '2' && <Memo {...cfg} />}
          {type === '3' && <MedicalCertificate {...cfg} />}
          {type === '4' && <CertificateAttendance {...cfg} />}
          {type === '5' && <Others {...cfg} />}
          {type === '6' && <VaccinationCertificate {...cfg} />}
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })((props) => (
  <SizeContainer size='sm'>
    {(extraProps) => {
      return <AddConsultationDocument {...props} {...extraProps} />
    }}
  </SizeContainer>
))
