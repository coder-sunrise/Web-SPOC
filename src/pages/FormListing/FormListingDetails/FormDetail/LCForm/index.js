import React, { PureComponent } from 'react'
import { connect } from 'dva'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
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

@connect(({ global }) => ({ global }))
@withFormikExtend({
  mapPropsToValues: ({ formListing, codetable }) => {
    const values = {
      ...(formListing.entity || formListing.defaultLCForm),
    }

    return values
  },
  validationSchema: Yup.object().shape({
    dataContent: Yup.object().shape({
      principalDiagnosisFK: Yup.number().required(),
      admittingSpecialtyFK: Yup.number().required(),
      others: Yup.number().when('admittingSpecialtyFK', {
        is: (val) => val === 99,
        then: Yup.string().required(),
      }),
    }),
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
            <Accordion
              leftIcon
              expandIcon={<SolidExpandMore fontSize='large' />}
              defaultActive={[
                0,
              ]}
              mode='multiple'
              collapses={[
                {
                  title:
                    "E - DOCTORS' NON-SURGICAL AND TREATMENT-RELATED CHARGES TO BE REIMBURSED",
                  content: <NonSurgical {...this.props} />,
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
              onClick={this.saveLCForm}
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
              onClick={this.confirmLCForm}
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
