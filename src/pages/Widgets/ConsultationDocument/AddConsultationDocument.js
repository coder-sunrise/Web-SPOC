import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import { convertFromHTML } from 'draft-js'
import numeral from 'numeral'
import _ from 'lodash'
import { htmlEncodeByRegExp, htmlDecodeByRegExp } from '@/utils/utils'
import Yup from '@/utils/yup'
import { qtyFormat } from '@/utils/config'

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
import { calculateAgeFromDOB } from '@/utils/dateUtils'

const loadFromCodesConfig = {
  mapPrescriptions: (rows, codetable, patient, isExtPrescription = false) => {
    return rows.map((o) => {
      const {
        instruction,
        corPrescriptionItemPrecaution: precaution = [],
        remarks = '',
        quantity = 0,
        dispenseUOMDisplayValue = '',
      } = o
      const qtyFormatStr = numeral(quantity).format(qtyFormat)
      const { ctmedicationprecaution = [] } = codetable
      const subjectHtml = `<li> - ${o.subject} ${isExtPrescription
        ? ' (Ext.)'
        : ''}</li>`
      const instHtml = instruction !== '' ? `<li>${instruction}</li>` : ''
      const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''
      const qtyHtml = `<li>Quantity: ${qtyFormatStr} ${dispenseUOMDisplayValue}</li>`
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

      return `<ul>${subjectHtml}<ul>${instHtml}${qtyHtml}${precautionHtml}${remarksHtml}</ul></ul>`
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
        isExtPrescription,
      )
      return `<ul>
              <li><strong>${isExtPrescription
                ? 'External Prescription'
                : 'Medication'}</strong></li>
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
          quantity = 0,
          uomDisplayValue = '',
        } = v
        const qtyFormatStr = numeral(quantity).format(qtyFormat)
        const subjectHtml = `<li> - ${subject}</li>`
        const precautionHtml =
          usage + dosage + uom !== ''
            ? `<li>${usage} ${dosage} ${uom} </li>`
            : ''
        const qtyHtml = `<li>Quantity: ${qtyFormatStr} ${uomDisplayValue}</li>`
        const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''

        return `<ul>${subjectHtml} <ul> ${precautionHtml}${qtyHtml}${remarksHtml}</ul></ul>`
      })
    if (vRows && vRows.length > 0)
      return `<ul>
              <li><strong>Vaccination</strong></li>
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
              <li><strong>Open Prescription</strong></li>
              ${rowHTMLs.join('')}
           </ul>`
    }
    return ''
  },

  InsertConsumable: (rows, codetable, patient) => {
    const pRows = rows.filter((o) => !o.isDeleted && o.type === '4')
    if (pRows && pRows.length > 0) {
      const rowHTMLs = pRows.map((o) => {
        const {
          consumableName = '',
          unitOfMeasurement = '',
          quantity = 0,
          remarks = '',
        } = o

        const qtyFormatStr = numeral(quantity).format(qtyFormat)
        const subjectHtml = `<li> - ${consumableName}</li>`
        const qtyHtml = `<li>Quantity: ${qtyFormatStr} ${unitOfMeasurement}</li>`
        const remarksHtml = remarks !== '' ? `<li>${remarks}</li>` : ''

        return `<ul>${subjectHtml} <ul>${qtyHtml}${remarksHtml}</ul></ul>`
      })

      return `<ul>
              <li><strong>Consumable</strong></li>
              ${rowHTMLs.join('')}
           </ul>`
    }
    return ''
  },

  InsertPatientInfo: (codetable, patient) => {
    let result
    let patientGender = codetable.ctgender.find(
      (x) => x.id === patient.genderFK,
    )
    let patientAllergy
    for (let index = 0; index < patient.patientAllergy.length; index++) {
      if (patient.patientAllergy[index].type === 'Allergy')
        patientAllergy =
          (patientAllergy ? `${patientAllergy}, ` : '') +
          patient.patientAllergy[index].allergyName
    }
    result = `Patient Name: ${patient.name}`
    result += `<br/>Patient Ref. No.: ${patient.patientReferenceNo}`
    result += `<br/>Patient Acc. No.: ${patient.patientAccountNo}`
    result += `<br/>Gender/Age: ${patientGender.name.substring(
      0,
      1,
    )}/${calculateAgeFromDOB(patient.dob)}`

    result += `<br/>Drug Allergy: ${patientAllergy || 'NA'}`
    return result
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
          loadFromCodesConfig.InsertConsumable(rows, codetable, patient),
          service,
        ]

        let htmls = ordersHTML.join('')
        console.log(htmls)
        return htmls
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
    {
      value: 'patientInfo',
      name: 'Patient Info',
      getter: (v, codetable, patient) => {
        return loadFromCodesConfig.InsertPatientInfo(codetable, patient)
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

  getNextSequence = () => {
    const { consultationDocument: { rows, type } } = this.props
    const allDocs = rows.filter((s) => !s.isDeleted)
    let nextSequence = 1
    if (allDocs && allDocs.length > 0) {
      const { sequence } = _.maxBy(allDocs, 'sequence')
      nextSequence = sequence + 1
    }
    return nextSequence
  }

  getLoader = (editor, setFieldValue, currentType) => {
    const {
      classes,
      parentProps,
      consultation,
      codetable,
      patient,
      values,
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
            console.log(editor)
            if (editor && editor.props) {
              const { editorState } = editor.props
              editor.update(
                RichEditor.insertBlock(
                  editorState,
                  blocksFromHTML.contentBlocks,
                ),
              )
              setTimeout(() => {
                editor.focus()
              }, 1)
            }
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
      getNextSequence: this.getNextSequence,
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
