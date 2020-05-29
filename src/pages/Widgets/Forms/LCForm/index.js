import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Yup from '@/utils/yup'
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

@connect(({ patient, visitRegistration, diagnosis }) => ({
  patient: patient.entity,
  visit: visitRegistration.entity.visit,
  cORDiagnosis: diagnosis.rows,
}))
@withFormikExtend({
  mapPropsToValues: ({
    forms,
    codetable,
    patient,
    visit,
    cORDiagnosis = [],
  }) => {
    let values = {}
    if (forms.entity) {
      values = {
        ...forms.entity,
      }
    } else {
      console.log('cORDiagnosis', cORDiagnosis)
      const { visitDate, doctorProfileFK } = visit
      const { name, patientReferenceNo, patientAccountNo } = patient
      const { doctorprofile } = codetable
      const doctor = doctorprofile.find((o) => o.id === doctorProfileFK)
      const activeICD10AM = cORDiagnosis.filter((o) => o.diagnosisICD10AMFK)
      // create principalDiagnosis
      let principalDiagnosisFK
      if (activeICD10AM.length > 0) {
        principalDiagnosisFK = activeICD10AM[0].diagnosisICD10AMFK
      }

      // create secondDiagnosisA
      let secondDiagnosisAFK
      if (activeICD10AM.length > 1) {
        secondDiagnosisAFK = activeICD10AM[1].diagnosisICD10AMFK
      }

      // create secondDiagnosisB
      let secondDiagnosisBFK
      if (activeICD10AM.length > 2) {
        secondDiagnosisBFK = activeICD10AM[2].diagnosisICD10AMFK
      }

      // create otherDiagnosis
      let otherDiagnosis = []
      if (activeICD10AM.length > 3) {
        let uid = -1
        for (let index = 2; index < activeICD10AM.length; index++) {
          otherDiagnosis.push({
            uid,
            diagnosisFK: activeICD10AM[index].diagnosisICD10AMFK,
          })
          uid -= 1
        }
      }
      values = {
        ...forms.defaultLCForm,
        formData: {
          ...forms.defaultLCForm.formData,
          patientName: name,
          patientNRICNo: patientReferenceNo,
          patientAccountNo,
          admissionDate: visitDate,
          dischargeDate: visitDate,
          principalDiagnosisFK,
          secondDiagnosisAFK,
          secondDiagnosisACode: null,
          secondDiagnosisAName: null,
          secondDiagnosisBFK,
          secondDiagnosisBCode: null,
          secondDiagnosisBName: null,
          otherDiagnosis,
          principalSurgeonFK: doctorProfileFK,
          principalSurgeonMCRNo: doctor ? doctor.doctorMCRNo : undefined,
          principalSurgeonName: doctor
            ? doctor.clinicianProfile.name
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
                    ? doctor.clinicianProfile.name
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
  validationSchema: Yup.object().shape({
    formData: Yup.object().shape({
      principalDiagnosisFK: Yup.number().required(),
      admittingSpecialtys: Yup.array().required(),
      principalSurgeonFK: Yup.number().required(),
      others: Yup.number().when('admittingSpecialtys', {
        is: (val) => val && val.find((o) => o === '99'),
        then: Yup.string().required(),
      }),
      otherDiagnosis: Yup.array().of(diagnosisSchema),
      procuderes: Yup.array().of(procuderesSchema),
    }),
  }),
  displayName: 'LCForm',
})
class LCForm extends PureComponent {
  onSubmitButtonClicked = async (action) => {
    const {
      dispatch,
      onConfirm,
      getNextSequence,
      user,
      values,
      validateForm,
    } = this.props
    const isFormValid = await validateForm()
    if (!_.isEmpty(isFormValid)) {
      this.props.handleSubmit()
    } else {
      const nextSequence = getNextSequence()
      dispatch({
        type: 'forms/upsertRow',
        payload: {
          sequence: nextSequence,
          ...values,
          updateByUser: user.data.clinicianProfile.name,
          statusFK: action === 'submit' ? 3 : 2,
        },
      }).then(() => {
        if (onConfirm) onConfirm()
      })
    }
  }

  cancelLCForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const { values } = this.props
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
          {statusFK === 1 && (
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('save')
              }}
            >
              finalize
            </ProgressButton>
          )}

          {(statusFK === 1 || statusFK === 2) && (
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
