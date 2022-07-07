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
  notification,
} from '@/components'
import CommonForm from '@/components/_medisys/Forms/CommonForm/index'
import Authorized from '@/utils/Authorized'
import { calculateAgeFromDOB } from '@/utils/dateUtils'

@connect(({ patient}) => ({
  patient: patient.entity,
}))
@withFormikExtend({
  mapPropsToValues: ({ forms, patient, visitEntity}) => {
    let values = {}
    if (forms.entity) {
      values = {
        ...forms.entity,
      }
    } else {
      const { formName, templateContent, defaultForm, formTemplateFK } = forms
      const { visit: { visitDoctor }} = visitEntity
      const primaryDoctor = (visitDoctor||[]).find(x=>x.isPrimaryDoctor)
      const title =
        primaryDoctor?.title && primaryDoctor.title !== 'Other'
          ? `${primaryDoctor.title} `
          : ''
      const fillData = {
        patientName: patient.name,
        doctorName: primaryDoctor ? `${title}${primaryDoctor.name}` : '',
        patientGender: patient.genderFK === 1 ? 'Female' : patient.genderFK === 2 ? 'Male' : 'Unknown' ,
        genderMale: patient.genderFK === 2,
        genderFemale: patient.genderFK === 1,
        patientDOB: moment(patient.dob).format('DD MMM YYYY'),
        patientAge: `${calculateAgeFromDOB(moment(patient.dob))}`,
        patientRefNo: patient.patientReferenceNo,
        patientAccNo: patient.patientAccountNo,
        patientNRIC: patient.patientAccountNo,
        todayDate: moment().format('DD MMM YYYY'),
      }
      values = {
        ...defaultForm,
        formName: formName,
        formData: { content: templateContent, signatureCounter: 0 },
        fillData,
        formTemplateFK: formTemplateFK,
      }
    }
    return values
  },
  displayName: 'Form',
})
class Form extends PureComponent {
  onSubmitButtonClicked = async action => {
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
      let payload = {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
        updateDate: moment().toDate(),
      }
      if (action === 'submit') {
        payload = {
          ...payload,
          statusFK: 3,
          submissionDate: moment(),
          submissionByUserFK: user.data.clinicianProfile.id,
        }
      } else if (action === 'finalize') {
        payload = {
          ...payload,
          statusFK: 2,
          finalizeDate: moment(),
          finalizeByUserFK: user.data.clinicianProfile.id,
        }
      } else {
        payload = {
          ...payload,
          statusFK: 1,
        }
      }
      dispatch({
        type: 'forms/upsertRow',
        payload,
      }).then(() => {
        if (onConfirm) onConfirm()
      })
    }
  }

  cancelForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { values } = this.props
    const { statusFK } = values

    const modifyAR = Authorized.check('queue.consultation.form.modify')
    const finalizeAR = Authorized.check('queue.consultation.form.finalize')

    const isHiddenModify = modifyAR && modifyAR.rights !== 'enable'
    const isHiddenFinalize = finalizeAR && finalizeAR.rights !== 'enable'

    return (
      <div>
        <CommonForm
          {...this.props}
        />
        <GridContainer
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button color='danger' icon={null} onClick={this.cancelForm}>
            Close
          </Button>
          {statusFK === 1 && !isHiddenModify && (
            <ProgressButton
              color='primary'
              icon={null}
              onClick={() => {
                this.onSubmitButtonClicked('save')
              }}
            >
              Save
            </ProgressButton>
          )}
          {statusFK === 1 && !isHiddenFinalize && (
            // <Authorized authority='queue.consultation.form.finalize'>
              <ProgressButton
                color='success'
                icon={null}
                onClick={() => {
                  if(!(values.formData.signatureCounter > 0)) {
                    notification.warning({message:'At least one signature is required.'})
                    return
                  }
                  this.props.dispatch({
                    type: 'global/updateAppState',
                    payload: {
                      openConfirm: true,
                      openConfirmContent: `Signed form is not editable after Finalized. Confirm to proceed ?`,
                      onConfirmSave: ()=> this.onSubmitButtonClicked('finalize'),
                    },
                  })
                }}
              >
                Finalize
              </ProgressButton>
            // </Authorized>
          )}

          {/* {(statusFK === 1 || statusFK === 2) && (
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
          )} */}
        </GridContainer>
      </div>
    )
  }
}
export default Form
