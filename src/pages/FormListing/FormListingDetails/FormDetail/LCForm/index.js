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
  notification,
} from '@/components'
import CommonLCForm from '@/components/_medisys/Forms/CommonLCForm/index'
import Authorized from '@/utils/Authorized'

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
        patientAccountNo,
      } = visitDetail
      const { doctorprofile } = codetable
      const doctor = doctorprofile.find((o) => o.id === doctorProfileFK)

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
          patientNRICNo: patientAccountNo,
          patientAccountNo: undefined,
          admissionDate: visitDate,
          dischargeDate: visitDate,
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
        admissionDate: Yup.date().required(),
        dischargeDate: Yup.date().required(),
      }),
    })
  },
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
      if (
        (action === 'submit' || action === 'finalize') &&
        !values.formData.signatureThumbnail
      ) {
        notification.warning({
          message: `Signature is required.`,
        })
        return
      }
      let nextSequence
      if (formFrom === FORM_FROM.QUEUELOG) {
        nextSequence = getNextSequence()
      }
      let saveData = {
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
      }
      if (action === 'submit') {
        saveData = {
          ...saveData,
          statusFK: 3,
          submissionDate: moment(),
          submissionByUserFK: user.data.clinicianProfile.id,
        }
      } else if (action === 'finalize') {
        saveData = {
          ...saveData,
          statusFK: 2,
          finalizeDate: moment(),
          finalizeByUserFK: user.data.clinicianProfile.id,
        }
      } else {
        saveData = {
          ...saveData,
          statusFK: 1,
        }
      }
      const { currentCORId, visitID } = visitDetail
      if (formCategory === FORM_CATEGORY.VISITFORM) {
        dispatch({
          type: 'formListing/saveVisitForm',
          payload: {
            ...saveData,
            visitID,
          },
        }).then((r) => {
          if (r) {
            resetForm()
            if (onConfirm) onConfirm()
            this.props.dispatch({
              type: 'formListing/getVisitForms',
              payload: {
                id: formListing.visitID,
              },
            })
          }
        })
      } else {
        dispatch({
          type: 'formListing/saveCORForm',
          payload: {
            ...saveData,
            visitID,
            ClinicalObjectRecordFK:
              saveData.id && saveData.id > 0
                ? saveData.ClinicalObjectRecordFK
                : currentCORId,
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
                type: 'formListing/getCORForms',
                payload: {
                  id: formListing.visitID,
                },
              })
            }
          }
        })
      }
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
          {formCategory === FORM_CATEGORY.VISITFORM && (
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('save')
              }}
            >
              save
            </ProgressButton>
          )}
          {formCategory === FORM_CATEGORY.CORFORM &&
          statusFK === 1 && (
            <Authorized authority='forms.finalize'>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.onSubmitButtonClicked('finalize')
                }}
              >
                finalize
              </ProgressButton>
            </Authorized>
          )}

          {formCategory === FORM_CATEGORY.CORFORM &&
          (statusFK === 1 || statusFK === 2) && (
            <Authorized authority='forms.submit'>
              <ProgressButton
                color='success'
                icon={null}
                onClick={() => {
                  this.onSubmitButtonClicked('submit')
                }}
              >
                submit
              </ProgressButton>
            </Authorized>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default LCForm
