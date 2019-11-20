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

const loadFromCodesConfig = {
  mapPrescriptions: (rows, codetable, patient) => {
    return rows.map((o) => {
      const {
        instruction,
        corPrescriptionItemPrecaution: precaution = [],
        remarks = '',
      } = o

      const { ctmedicationprecaution = [] } = codetable
      const subjectHtml = `<li> - ${o.subject}</li>`
      const instHtml = instruction !== '' ? `<li>${instruction}</li>` : ''
      const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''
      const precautionHtml = precaution
        .map((i) => {
          const codetablePrecaution = ctmedicationprecaution.find(
            (c) => c.id === i.medicationPrecautionFK,
          )
          if (codetablePrecaution && codetablePrecaution.translationLink) {
            const {
              translationLink: { translationMasters = [] },
            } = codetablePrecaution

            const transHtml = translationMasters
              .filter((t) => patient.translationLinkFK === t.languageFK)
              .map((m) => {
                return `<li>${m.displayValue}</li>`
              })
              .join('')

            if (i.precaution !== '' && transHtml !== '') {
              return `<li>${i.precaution}</li>
                    ${transHtml}`
            }
          }
          return ''
        })
        .join('')

      return `<ul>${subjectHtml}<ul>${instHtml}${precautionHtml}${remarksHtml}</ul></ul>`
    })
  },
  InsertMedication: (rows, codetable, patient, isExtPrescription = false) => {
    const pRows = rows.filter(
      (o) =>
        !o.isDeleted &&
        o.type === '1' &&
        (o.isExternalPrescription || false) === isExtPrescription,
    )
    if (pRows && pRows.length > 0) {
      const rowHTMLs = loadFromCodesConfig.mapPrescriptions(
        pRows,
        codetable,
        patient,
      )
      return `<ul>
              <li><p><strong>${isExtPrescription
                ? 'External Prescription'
                : 'Medication'}</strong></p></li>
               ${rowHTMLs.join('')}
            </ul>`
    }
    return ''
  },
  InsertVaccination: (rows, patient) => {
    const vRows = rows
      .filter((o) => !o.isDeleted && o.type === '2')
      .map((v) => {
        const {
          subject = '',
          usageMethodDisplayValue: usage = '',
          dosageDisplayValue: dosage = '',
          uomDisplayValue: uom = '',
          remarks = '',
        } = v

        const subjectHtml = `<li> - ${subject}</li>`
        const precautionHtml =
          usage + dosage + uom !== ''
            ? `<li>${usage} ${dosage} ${uom} </li>`
            : ''
        const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''

        return `<ul>${subjectHtml} <ul> ${precautionHtml} ${remarksHtml}</ul></ul>`
      })
    if (vRows && vRows.length > 0)
      return `<ul>
              <li><p><strong>Vaccination</strong></p></li>
              ${vRows.join('')}
            </ul>`
    return ''
  },

  InsertOpenPrescription: (rows, codetable, patient) => {
    const pRows = rows.filter((o) => !o.isDeleted && o.type === '5')
    if (pRows && pRows.length > 0) {
      const rowHTMLs = loadFromCodesConfig.mapPrescriptions(
        pRows,
        codetable,
        patient,
      )
      return `<ul>
              <li><p><strong>Open Prescription</strong></p></li>
              ${rowHTMLs.join('')}
           </ul>`
    }
    return ''
  },
  loadFromCodes: [
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
      getter: (v, codetable, patient) => {
        const { orders } = window.g_app._store.getState()
        if (!orders) return '-'

        const { rows = [] } = orders

        let service = rows
          .filter((o) => !o.isDeleted && o.type === '3')
          .map((s) => `<p>- ${s.subject}</p>`)
          .join('')

        const ordersHTML = [
          loadFromCodesConfig.InsertMedication(rows, codetable, patient, false),
          loadFromCodesConfig.InsertVaccination(rows, codetable, patient),
          loadFromCodesConfig.InsertOpenPrescription(rows, codetable, patient),
          service,
        ]

        return ordersHTML.join('<p/>')
      },
    },
    {
      value: 'externalPrescription',
      name: 'External Prescription',
      getter: (v, codetable, patient) => {
        const { orders } = window.g_app._store.getState()
        if (!orders) return '-'
        const { rows = [] } = orders

        return loadFromCodesConfig.InsertMedication(
          rows,
          codetable,
          patient,
          true,
        )
      },
    },
  ],
}

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
@connect(
  ({ consultationDocument, user, codetable, visitRegistration, patient }) => ({
    consultationDocument,
    user,
    codetable,
    visitEntity: visitRegistration.entity || {},
    patient,
  }),
)
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
    const {
      classes,
      parentProps,
      consultation,
      codetable,
      patient,
    } = this.props
    const { documenttemplate = [] } = codetable
    // console.log({ documenttemplate })
    const documentType = parseInt(currentType.value, 10) || -1
    return (
      <div className={classes.editorBtn}>
        <ButtonSelect
          options={documenttemplate.filter(
            (template) => template.documentTemplateTypeFK === documentType,
          )}
          textField='displayValue'
          onChange={(val, option) => {
            if (!val) return
            let msg = htmlDecodeByRegExp(option.templateContent)
            const match = msg.match(templateReg) || []
            // console.log(msg, templateReg, match, tagList)
            match.forEach((s) => {
              const value = s.match(/data-value="(.*?)"/)[1]
              const m = tagList.find((o) => o.value === value)
              // console.log(text, m)
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
          options={loadFromCodesConfig.loadFromCodes}
          valueField='value'
          onChange={(val, option) => {
            if (!val) return
            const { entity } = consultation
            const v = option.getter
              ? option.getter(entity, codetable, patient.entity)
              : Object.byString(entity, option.value) || '-'
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
    const { loadFromCodes } = loadFromCodesConfig
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
          {type === '3' && <VaccinationCertificate {...cfg} />}
          {type === '4' && <Others {...cfg} />}
          {type === '5' && <MedicalCertificate {...cfg} />}
          {type === '6' && <CertificateAttendance {...cfg} />}
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
