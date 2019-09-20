import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import withStyles from '@material-ui/core/styles/withStyles'
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
} from '@/components'

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
    value: 'corDoctorNote.chiefComplaints',
    name: 'Chief Complaints',
  },
  { value: 'corDoctorNote.plan', name: 'Plan' },
  {
    value: 'corDiagnosis',
    name: 'Diagnosis',
    getProps: (v) => {
      return 'test'
    },
  },
  {
    value: 'medication',
    name: 'Medication',
    getProps: (v) => {
      return 'test 123'
    },
  },
  {
    value: 'vaccination',
    name: 'Vaccination',
    getProps: (v) => {
      return 'test dsfsd 123'
    },
  },
]
const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 0,
    top: 12,
    width: 200,
  },
})

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
@connect(({ consultationDocument, user, codetable }) => ({
  consultationDocument,
  user,
  codetable,
}))
class AddConsultationDocument extends PureComponent {
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
    } = props
    // console.log(props)
    const { entity = {}, type } = consultationDocument
    console.log('form', this.form, parentProps)
    const cfg = {
      ...props,
      loadFromCodes,
      currentType: types.find((o) => o.value === type),
    }
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='fake'
                render={({ form }) => {
                  this.form = form
                  return null
                }}
              />
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
  <SizeContainer size='md'>
    {(extraProps) => {
      return <AddConsultationDocument {...props} {...extraProps} />
    }}
  </SizeContainer>
))
