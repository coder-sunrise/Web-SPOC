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
import CommonConsentForm from '@/components/_medisys/Forms/CommonConsentForm/index'
import Authorized from '@/utils/Authorized'

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
        patientName,
        patientGender,
        patientDOB,
        patientAge,
        patientRefNo,
        todayDate,
      } = visitDetail
      const fillData = {
        patientName,
        patientGender: patientGender === 'F' ? 'Female' : patientGender === 'M' ? 'Male' : 'Unknown' ,
        patientDOB: moment(patientDOB).format('DD MMM YYYY'),
        patientAge: `${patientAge}`,
        patientRefNo,
        todayDate: moment(todayDate).format('DD MMM YYYY'),
      }
      values = {
        ...formListing.defaultConsentForm,
        formName: formListing.formName,
        formData: formListing.templateContent,
        fillData,
      }
    }
    return values
  },
  // validationSchema: ({ formCategory }) => {
  //   return Yup.object().shape({
  //     formData: Yup.object().shape({}),
  //   })
  // },
  displayName: 'ConsentForm',
})
class ConsentForm extends PureComponent {
  onSubmitButtonClicked = async action => {
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
      // if (
      //   (action === 'submit' || action === 'finalize') &&
      //   !values.formData.signature.some(x => x.value)
      // ) {
      //   notification.warning({
      //     message: `Signature is required.`,
      //   })
      //   return
      // }
      let nextSequence
      if (formFrom === FORM_FROM.QUEUELOG) {
        nextSequence = getNextSequence()
      }
      let saveData = {
        sequence: nextSequence,
        ...values,
        // formData: JSON.stringify({
        //   ...values.formData
        // }),
        formData: values.formData,
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
        }).then(r => {
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
            type: formListing.type,
            ...saveData,
            visitID,
            ClinicalObjectRecordFK:
              saveData.id && saveData.id > 0
                ? saveData.ClinicalObjectRecordFK
                : currentCORId,
          },
        }).then(r => {
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

  cancelConsentForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    const { values, formCategory } = this.props
    const { statusFK } = values
    return (
      <div>
        <CommonConsentForm {...this.props} />
        <GridContainer
          style={{
            marginTop: 20,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button color='danger' icon={null} onClick={this.cancelConsentForm}>
            Cancel
          </Button>
          {formCategory === FORM_CATEGORY.VISITFORM && (
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
          {formCategory === FORM_CATEGORY.CORFORM && statusFK === 1 && (
            <Authorized authority='forms.finalize'>
              <ProgressButton
                color='primary'
                icon={null}
                onClick={() => {
                  this.onSubmitButtonClicked('finalize')
                }}
              >
                Finalize
              </ProgressButton>
            </Authorized>
          )}

          {/* {formCategory === FORM_CATEGORY.CORFORM &&
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
            )} */}
        </GridContainer>
      </div>
    )
  }
}
export default ConsentForm
