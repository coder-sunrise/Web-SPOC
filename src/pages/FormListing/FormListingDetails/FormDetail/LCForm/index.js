import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Yup from '@/utils/yup'
import { FORM_CATEGORY, FORM_FROM } from '@/utils/constants'
import {
  GridContainer,
  withFormikExtend,
  Button,
  ProgressButton,
} from '@/components'
import CommonLCForm from '@/components/_medisys/Forms/CommonLCForm/index'

const diagnosisSchema = Yup.object().shape({
  diagnosisCode: Yup.string().required(),
  diagnosisName: Yup.string().required(),
})

const nonSurgicalChargesSchema = Yup.object().shape({
  surgicalRoleFK: Yup.number().required(),
  surgicalSurgeonMCRNo: Yup.string().required(),
  surgicalSurgeonFK: Yup.string().required(),
  inpatientAttendanceFees: Yup.number().required(),
  otherFees: Yup.number().required(),
  gSTChargedFK: Yup.number().required(),
})

const surgicalChargesSchema = Yup.object().shape({
  surgicalRoleFK: Yup.number().required(),
  surgicalSurgeonMCRNo: Yup.string().required(),
  surgicalSurgeonFK: Yup.string().required(),
  surgeonFees: Yup.number().required(),
  implantFees: Yup.number().required(),
  otherFees: Yup.number().required(),
  gSTChargedFK: Yup.number().required(),
})

const procuderesSchema = Yup.object().shape({
  procedureDate: Yup.date().required(),
  procedureStartTime: Yup.date().required(),
  procedureEndTime: Yup.date().required(),
  surgicalProcedureFK: Yup.number().required(),
  surgicalProcedureTable: Yup.string().required(),
  surgicalCharges: Yup.array().of(surgicalChargesSchema),
})

@connect(({ formListing }) => ({
  formListing,
}))
@withFormikExtend({
  mapPropsToValues: ({ formListing, codetable }) => {
    let values = {}
    if (formListing.entity) {
      values = {
        ...formListing.entity,
      }
    } else {
      const { visitDetail = {} } = formListing
      const {
        visitDate,
        doctorProfileFK,
        patientName,
        patientNRICNo,
        patientAccountNo,
        cORDiagnosis = [],
      } = visitDetail
      const { doctorprofile } = codetable
      const doctor = doctorprofile.find((o) => o.id === doctorProfileFK)
      const activeICD10AM = cORDiagnosis.filter((o) => o.diagnosisICD10AMFK)
      // create principalDiagnosis
      let principalDiagnosisFK
      let principalDiagnosisCode
      let principalDiagnosisName
      if (activeICD10AM.length > 0) {
        principalDiagnosisFK = activeICD10AM[0].diagnosisICD10AMFK
        principalDiagnosisCode = activeICD10AM[0].diagnosisICD10AMCode
        principalDiagnosisName = activeICD10AM[0].diagnosisICD10AMName
      }

      // create secondDiagnosisA
      let secondDiagnosisAFK
      let secondDiagnosisACode
      let secondDiagnosisAName
      if (activeICD10AM.length > 1) {
        secondDiagnosisAFK = activeICD10AM[1].diagnosisICD10AMFK
        secondDiagnosisACode = activeICD10AM[1].diagnosisICD10AMCode
        secondDiagnosisAName = activeICD10AM[1].diagnosisICD10AMName
      }

      // create secondDiagnosisB
      let secondDiagnosisBFK
      let secondDiagnosisBCode
      let secondDiagnosisBName
      if (activeICD10AM.length > 2) {
        secondDiagnosisBFK = activeICD10AM[2].diagnosisICD10AMFK
        secondDiagnosisBCode = activeICD10AM[2].diagnosisICD10AMCode
        secondDiagnosisBName = activeICD10AM[2].diagnosisICD10AMName
      }

      // create otherDiagnosis
      let otherDiagnosis = []
      if (activeICD10AM.length > 3) {
        let uid = -1
        for (let index = 2; index < activeICD10AM.length; index++) {
          otherDiagnosis.push({
            uid,
            diagnosisFK: activeICD10AM[index].diagnosisICD10AMFK,
            diagnosisCode: activeICD10AM[index].diagnosisICD10AMCode,
            diagnosisName: activeICD10AM[index].diagnosisICD10AMName,
          })
          uid -= 1
        }
      }

      let title
      if (doctor) {
        title =
          doctor.clinicianProfile.title &&
          doctor.clinicianProfile.title !== 'Other'
            ? `${doctor.clinicianProfile.title} `
            : ''
      }

      values = {
        ...formListing.defaultLCForm,
        formData: {
          ...formListing.defaultLCForm.formData,
          patientName,
          patientNRICNo,
          patientAccountNo,
          admissionDate: visitDate,
          dischargeDate: visitDate,
          principalDiagnosisFK,
          principalDiagnosisCode,
          principalDiagnosisName,
          secondDiagnosisAFK,
          secondDiagnosisACode,
          secondDiagnosisAName,
          secondDiagnosisBFK,
          secondDiagnosisBCode,
          secondDiagnosisBName,
          otherDiagnosis,
          principalSurgeonFK: doctorProfileFK,
          principalSurgeonMCRNo: doctor ? doctor.doctorMCRNo : undefined,
          principalSurgeonName: doctor
            ? `${title}${doctor.clinicianProfile.name}`
            : undefined,
          principalSurgeonSignatureDate: moment(),

          procuderes: [
            {
              index: 1,
              procedureDate: visitDate,
              procedureStartTime: moment(),
              procedureEndTime: moment(),
              natureOfOpertation: 'Medical',
              surgicalCharges: [
                {
                  id: -1,
                  surgicalRoleFK: 1,
                  surgicalRoleName: 'Principal Surgeon',
                  surgicalSurgeonFK: doctorProfileFK,
                  surgicalSurgeonMCRNo: doctor ? doctor.doctorMCRNo : undefined,
                  surgicalSurgeonName: doctor
                    ? `${title}${doctor.clinicianProfile.name}`
                    : undefined,
                  surgeonFees: 0,
                  implantFees: 0,
                  otherFees: 0,
                  totalSurgicalFees: 0,
                  gSTChargedFK: 1,
                  gSTChargedName: 'Charged',
                  sortOrder: 0,
                },
              ],
            },
          ],
        },
      }
    }
    return values
  },
  validationSchema: ({ formCategory }) => {
    return Yup.object().shape({
      formData: Yup.object().shape({
        principalDiagnosisFK: Yup.number().required(),
        admittingSpecialtys: Yup.array().required(),
        principalSurgeonFK: Yup.number().required(),
        others: Yup.string().when('admittingSpecialtys', {
          is: (val) => val && val.find((o) => o === '99'),
          then: Yup.string().required(),
        }),
        otherDiagnosis: Yup.array().of(diagnosisSchema),
        procuderes: Yup.array().of(procuderesSchema),
        signatureThumbnail:
          formCategory === FORM_CATEGORY.CORFORM
            ? Yup.string().required()
            : undefined,
        principalSurgeonSignatureDate:
          formCategory === FORM_CATEGORY.CORFORM
            ? Yup.date().required()
            : undefined,
        admissionDate: Yup.date().required(),
        dischargeDate: Yup.date().required(),
      }),
    })
  },
  displayName: 'LCForm',
})
class LCForm extends PureComponent {
  constructor (props) {
    super(props)

    this.myRef = React.createRef()
  }

  onSubmitButtonClicked = async (action) => {
    const {
      dispatch,
      onConfirm,
      getNextSequence,
      user,
      values,
      resetForm,
      formCategory,
      validateForm,
      formListing,
      formFrom,
    } = this.props
    const { visitDetail } = formListing
    const isFormValid = await validateForm()
    if (!_.isEmpty(isFormValid)) {
      this.props.handleSubmit()
    } else {
      let nextSequence
      if (formFrom === FORM_FROM.QUEUELOG) {
        nextSequence = getNextSequence()
      }
      let saveData
      if (action === 'submit') {
        saveData = {
          sequence: nextSequence,
          ...values,
          formData: JSON.stringify({
            ...values.formData,
            otherDiagnosis: values.formData.otherDiagnosis.map((d) => {
              const { diagnosiss, ...retainData } = d
              return {
                ...retainData,
              }
            }),
          }),
          updateByUser: user.data.clinicianProfile.name,
          statusFK: 3,
          submissionDate: moment(),
          submissionByUserFK: user.data.clinicianProfile.id,
        }
      } else {
        saveData = {
          sequence: nextSequence,
          ...values,
          formData: JSON.stringify({
            ...values.formData,
            otherDiagnosis: values.formData.otherDiagnosis.map((d) => {
              const { diagnosiss, ...retainData } = d
              return {
                ...retainData,
              }
            }),
          }),
          updateByUser: user.data.clinicianProfile.name,
          statusFK:
            formCategory === FORM_CATEGORY.VISITFORM ? values.statusFK : 2,
          finalizeDate: moment(),
          finalizeByUserFK: user.data.clinicianProfile.id,
        }
      }
      const { currentCORId, visitID } = visitDetail
      dispatch({
        type: 'formListing/saveForm',
        payload: {
          visitID,
          currentCORId,
          formType:
            formCategory === FORM_CATEGORY.VISITFORM ? 'VisitForm' : 'CORForm',
          UpdateType: values.type,
          visitLetterOfCertification:
            formCategory === FORM_CATEGORY.VISITFORM
              ? [
                  {
                    ...saveData,
                  },
                ]
              : [],
          corLetterOfCertification:
            formCategory === FORM_CATEGORY.CORFORM
              ? [
                  {
                    ...saveData,
                  },
                ]
              : [],
        },
      }).then((r) => {
        if (r) {
          resetForm()
          if (onConfirm) onConfirm()
          if (formFrom === FORM_FROM.FORMMODULE) {
            this.props.dispatch({
              type: 'formListing/query',
            })
          } else if (formFrom === FORM_FROM.QUEUELOG) {
            this.props.dispatch({
              type: 'formListing/getVisitForm',
              payload: {
                id: formListing.visitID,
                formType:
                  formCategory === FORM_FROM.FORMMODULE
                    ? 'VisitForm'
                    : 'CORForm',
              },
            })
          }
        }
      })
    }
  }

  cancelLCForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const { values, formCategory } = this.props
    const { statusFK } = values
    return (
      <div>
        <CommonLCForm
          {...this.props}
          diagnosisSchema={diagnosisSchema}
          surgicalChargesSchema={surgicalChargesSchema}
          nonSurgicalChargesSchema={nonSurgicalChargesSchema}
        />
        <GridContainer
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button color='danger' icon={null} onClick={this.cancelLCForm}>
            cancel
          </Button>
          {(formCategory === FORM_CATEGORY.VISITFORM || statusFK === 1) && (
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('save')
              }}
            >
              <sapn>
                {formCategory === FORM_CATEGORY.VISITFORM ? 'save' : 'finalize'}
              </sapn>
            </ProgressButton>
          )}

          {formCategory === FORM_CATEGORY.CORFORM &&
          (statusFK === 1 || statusFK === 2) && (
            <ProgressButton
              color='success'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('submit')
              }}
            >
              submit
            </ProgressButton>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default LCForm
