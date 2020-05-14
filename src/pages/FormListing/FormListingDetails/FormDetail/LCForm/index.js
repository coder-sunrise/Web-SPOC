import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import moment from 'moment'
import Yup from '@/utils/yup'
import { FORM_CATEGORY } from '@/utils/constants'
import {
  GridContainer,
  withFormikExtend,
  Button,
  CardContainer,
  Accordion,
} from '@/components'
import PatientParticulars from './PatientParticulars'
import Diagnosis from './Diagnosis'
import Procedures from './Procedures'
import Certification from './Certification'
import NonSurgical from './NonSurgical'

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
      } = formListing.visitDetail
      const { doctorprofile } = codetable
      const doctor = doctorprofile.find((o) => o.id === doctorProfileFK)
      values = {
        ...formListing.defaultLCForm,
        formData: {
          ...formListing.defaultLCForm.formData,
          patientName,
          patientNRICNo,
          patientAccountNo,
          admissionDate: visitDate,
          dischargeDate: visitDate,
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
      admittingSpecialtyFK: Yup.number().required(),
      principalSurgeonFK: Yup.number().required(),
      others: Yup.number().when('admittingSpecialtyFK', {
        is: (val) => val === 99,
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
      visitDetail,
    } = this.props
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
              ? {
                  sequence: nextSequence,
                  ...values,
                  formData: JSON.stringify(values.formData),
                  updateByUser: user.data.clinicianProfile.name,
                  statusFK,
                }
              : undefined,
          CORLetterOfCertification:
            formCategory === FORM_CATEGORY.CORFORM
              ? {
                  sequence: nextSequence,
                  ...values,
                  formData: JSON.stringify(values.formData),
                  updateByUser: user.data.clinicianProfile.name,
                  statusFK,
                }
              : undefined,
        },
      }).then((r) => {
        if (r) {
          resetForm()
          if (onConfirm) onConfirm()
          dispatch({
            type: 'formListing/query',
          })
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
    const { values, formCategory, height, global } = this.props

    const { statusFK } = values
    return (
      <div>
        <div
          style={{
            overflow: 'auto',
            height: height - 200,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <div>
            <h5>A - PATIENT PARTICULARS</h5>
            <CardContainer hideHeader>
              <PatientParticulars {...this.props} />
            </CardContainer>
          </div>
          <div>
            <h5>B - DIAGNOSIS (In Order of Priority)</h5>
            <CardContainer hideHeader>
              <Diagnosis {...this.props} diagnosisSchema={diagnosisSchema} />
            </CardContainer>
          </div>
          <div>
            <h5>
              C - PROCEDURE - SPECIFIC CHARGES TO BE REIMBURSED TO THE
              SURGEON(S)
            </h5>
            <CardContainer hideHeader>
              <Procedures
                {...this.props}
                surgicalChargesSchema={surgicalChargesSchema}
              />
            </CardContainer>
          </div>
          <div>
            <h5>D – CERTIFICATION</h5>
            <CardContainer hideHeader>
              <Certification {...this.props} />
            </CardContainer>
          </div>
          <div>
            <Accordion
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              mode='multiple'
              collapses={[
                {
                  title:
                    "E - DOCTORS' NON-SURGICAL AND TREATMENT-RELATED CHARGES TO BE REIMBURSED",
                  content: (
                    <NonSurgical
                      {...this.props}
                      nonSurgicalChargesSchema={nonSurgicalChargesSchema}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
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
              finalize
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
