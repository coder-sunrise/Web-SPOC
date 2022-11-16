import React, { PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
import { convertFromHTML } from 'draft-js'
import numeral from 'numeral'
import _ from 'lodash'
import { htmlDecodeByRegExp } from '@/utils/utils'
import { qtyFormat } from '@/utils/config'

import {
  GridContainer,
  GridItem,
  Select,
  SizeContainer,
  RichEditor,
  ButtonSelect,
} from '@/components'
import { tagList } from '@/utils/codes'

import { calculateAgeFromDOB } from '@/utils/dateUtils'
import ReferralLetter from './ReferralLetter'
import Memo from './Memo'
import MedicalCertificate from './MedicalCertificate'
import CertificateAttendance from './CertificateAttendance'
import Others from './Others'

const loadFromCodesConfig = {
  InsertConsumable: rows => {
    const pRows = rows.filter(o => !o.isDeleted && o.type === '4')
    if (pRows && pRows.length > 0) {
      const rowHTMLs = pRows.map(o => {
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
    let patientGender = codetable.ctgender.find(x => x.id === patient.genderFK)
    result = `<p>Patient Name: ${patient.name}</p>`
    result += `<p>Patient Ref. No.: ${patient.patientReferenceNo}</p>`
    result += `<p>Patient Acc. No.: ${patient.patientAccountNo}</p>`
    result += `<p>Gender/Age: ${patientGender.name.substring(
      0,
      1,
    )}/${calculateAgeFromDOB(patient.dob)}</p>`

    return result
  },
  loadFromCodes: [
    {
      value: 'corDoctorNote.note',
      name: 'Clinical Notes',
    },
    {
      value: 'corDoctorNote.chiefComplaints',
      name: 'Chief Complaints',
    },
    { value: 'corDoctorNote.plan', name: 'Plan' },
    {
      value: 'corDiagnosis',
      name: 'Diagnosis',
      getter: v => {
        const { corDiagnosis = [] } = v
        return corDiagnosis
          .filter(o => !!o.icD10DiagnosisDescription)
          .map(o => `<p>- ${o.icD10DiagnosisDescription}</p>`)
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
          .filter(o => !o.isDeleted && o.type === '3')
          .map(s => `<p>- ${s.subject}</p>`)
          .join('')

        const ordersHTML = [
          loadFromCodesConfig.InsertConsumable(rows, codetable, patient),
          service,
        ]

        let htmls = ordersHTML.join('')
        return htmls
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

const styles = theme => ({
  editor: {
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 10,
    top: 14,
  },
})
const templateReg = /<a.*?data-value="(.*?)".*?<\/a>/gm

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
  constructor(props) {
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
    const {
      consultationDocument: { rows, type },
    } = this.props
    const allDocs = rows.filter(s => !s.isDeleted)
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
      consultation,
      codetable,
      patient,
      dispatch,
      values,
    } = this.props
    const { documenttemplate = [] } = codetable
    const documentType = parseInt(currentType.value, 10) || -1
    return (
      <div className={classes.editorBtn}>
        <ButtonSelect
          options={documenttemplate.filter(
            template => template.documentTemplateTypeFK === documentType,
          )}
          textField='displayValue'
          onChange={(val, option) => {
            if (!val) return
            dispatch({
              type: 'settingDocumentTemplate/queryOne',
              payload: { id: option.id },
            }).then(r => {
              if (!r) {
                return
              }
              let msg = htmlDecodeByRegExp(r.templateContent)
              const match = msg.match(templateReg) || []
              match.forEach(s => {
                const value = s.match(/data-value="(.*?)"/)[1]
                const m = tagList.find(o => o.value === value)
                if (m && m.getter) msg = msg.replace(s, m.getter())
              })
              setFieldValue('content', msg)
              setTimeout(() => {
                editor.focus()
              }, 1)
            })
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

  render() {
    const { props } = this
    const {
      theme,
      classes,
      consultationDocument,
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
      currentType: types.find(o => o.value === type),
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
                onChange={v => {
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
          {type === '4' && <Others {...cfg} />}
          {type === '5' && <MedicalCertificate {...cfg} />}
          {type === '6' && <CertificateAttendance {...cfg} />}
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(props => (
  <SizeContainer size='sm'>
    {extraProps => {
      return <AddConsultationDocument {...props} {...extraProps} />
    }}
  </SizeContainer>
))
