import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { FORM_CATEGORY } from '@/utils/constants'
import {
  GridContainer,
  withFormikExtend,
  Button,
  CardContainer,
} from '@/components'
import PatientParticulars from './PatientParticulars'
import Diagnosis from './Diagnosis'
import Procedures from './Procedures'
import Certification from './Certification'
import NonSurgical from './NonSurgical'

@withFormikExtend({
  mapPropsToValues: ({ formListing, codetable }) => {
    const values = {
      ...(formListing.entity || formListing.defaultLCForm),
    }

    return values
  },
  validationSchema: Yup.object().shape({
    referralDate: Yup.date().required(),
    referredByUserFK: Yup.number().required(),
    to: Yup.string().required(),
    subject: Yup.string().required(),
  }),
  displayName: 'LCForm',
})
class LCForm extends PureComponent {
  saveLCForm = () => {
    const {
      dispatch,
      onConfirm,
      getNextSequence,
      user,
      values,
      resetForm,
      formCategory,
    } = this.props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'formListing/update',
      payload: {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
        statusFK:
          formCategory === FORM_CATEGORY.VISITFORM ? values.statusFK : 2,
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

  confirmLCForm = () => {
    const {
      dispatch,
      onConfirm,
      getNextSequence,
      user,
      values,
      resetForm,
    } = this.props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'formListing/update',
      payload: {
        sequence: nextSequence,
        ...values,
        updateByUser: user.data.clinicianProfile.name,
        statusFK: 3,
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

  cancelLCForm = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const { values, formCategory, height } = this.props
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
              <Diagnosis {...this.props} />
            </CardContainer>
          </div>
          <div>
            <h5>
              C - PROCEDURE - SPECIFIC CHARGES TO BE REIMBURSED TO THE
              SURGEON(S)
            </h5>
            <CardContainer hideHeader>
              <Procedures {...this.props} />
            </CardContainer>
          </div>
          <div>
            <h5>D – CERTIFICATION</h5>
            <CardContainer hideHeader>
              <Certification {...this.props} />
            </CardContainer>
          </div>
          <div>
            <h5>
              E - DOCTORS' NON-SURGICAL AND TREATMENT-RELATED CHARGES TO BE
              REIMBURSED
            </h5>
            <CardContainer hideHeader>
              {' '}
              <NonSurgical {...this.props} />{' '}
            </CardContainer>
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
            <Button color='primary' icon={null} onClick={this.saveLCForm}>
              finalize
            </Button>
          )}

          {formCategory === FORM_CATEGORY.CORFORM &&
          (statusFK === 1 || statusFK === 2) && (
            <Button color='success' icon={null} onClick={this.confirmLCForm}>
              submit
            </Button>
          )}
        </GridContainer>
      </div>
    )
  }
}
export default LCForm
