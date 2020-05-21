import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import moment from 'moment'
import Yup from '@/utils/yup'
import { FORM_CATEGORY, FORM_FROM } from '@/utils/constants'
import { GridContainer, withFormikExtend, Button } from '@/components'
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

@connect(({ global, formListing }) => ({
  global,
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
      const {
        visitDate,
        doctorProfileFK,
        patientName,
        patientNRICNo,
        patientAccountNo,
        cORDiagnosis = [],
      } = formListing.visitDetail
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
        ...formListing.defaultLCForm,
        formData: {
          ...formListing.defaultLCForm.formData,
          patientName,
          patientNRICNo,
          patientAccountNo,
          admissionDate: visitDate,
          dischargeDate: visitDate,
          principalDiagnosisFK,
          secondDiagnosisAFK,
          secondDiagnosisBFK,
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
              natureOfOpertation: '1',
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
        is: (val) => val && val.find((o) => o === 99),
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
      const nextSequence = getNextSequence()
      let statusFK
      if (action === 'submit') {
        statusFK = 3
      } else {
        statusFK =
          formCategory === FORM_CATEGORY.VISITFORM ? values.statusFK : 2
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
                    sequence: nextSequence,
                    ...values,
                    formData: JSON.stringify(values.formData),
                    updateByUser: user.data.clinicianProfile.name,
                    statusFK,
                  },
                ]
              : [],
          CORLetterOfCertification:
            formCategory === FORM_CATEGORY.CORFORM
              ? [
                  {
                    sequence: nextSequence,
                    ...values,
                    formData: JSON.stringify(values.formData),
                    updateByUser: user.data.clinicianProfile.name,
                    statusFK,
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
              payload: {
                apiCriteria: {
                  startDate: moment().add(-1, 'month').formatUTC(),
                  endDate: moment().formatUTC(false),
                },
              },
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
            <Button
              disabled={global.disableSave}
              color='primary'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('save')
              }}
            >
              <sapn>
                {formCategory === FORM_CATEGORY.VISITFORM ? 'save' : 'finalize'}
              </sapn>
            </Button>
          )}

          {formCategory === FORM_CATEGORY.CORFORM &&
          (statusFK === 1 || statusFK === 2) && (
            <Button
              disabled={global.disableSave}
              color='success'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('submit')
              }}
            >
              submit
            </Button>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default LCForm
