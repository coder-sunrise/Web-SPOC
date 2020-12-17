import React, { Component } from 'react'
import { connect } from 'dva'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  Select,
  TextField,
  SizeContainer,
  FastField,
  withFormikExtend,
  dateFormatLong,
  dateFormatLongWithTimeNoSec,
  Field,
  notification,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAgeFromDOB } from '@/utils/dateUtils'

const styles = (theme) => ({
  container: {
    '& h4': {
      fontWeight: 'bold',
      marginTop: theme.spacing(3),
    },
    '& hr': {
      height: 2,
    },
  },
  footer: {
    textAlign: 'right',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ claimSubmission, codetable }) => ({
  claimSubmission,
  codetable,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ claimSubmission, allowEdit, codetable }) => {
    const returnValue = claimSubmission.entity || {}
    const { diagnosis } = returnValue
    let diagnosisOptions = []
    let complicationList = []
    let selectedComplication = []
    let chargeCodeList = []
    let selectedChargeCode = null

    if (diagnosis) {
      diagnosis.forEach((o) => {
        if (o.isSelected) {
          diagnosisOptions.push(o.id)
        }

        o.invoiceClaimComplicationDtos.forEach((complication)=>{
          if(complication)
          {
            complicationList.push(complication)
          }
          if(o.isSelected){
            selectedComplication.push(complication.id)
          }
        })

        if(o.chargeCode) {
          chargeCodeList.push(`${o.chargeCode} - ${o.chargeCodeDescription}`)
          if(o.isPrimary) {
            selectedChargeCode = `${o.chargeCode} - ${o.chargeCodeDescription}`
          }
        }
    })
  }
    if(!selectedChargeCode)
    {
      return {
        ...returnValue,
        diagnosisSelections: diagnosisOptions,
        complicationList,
        selectedComplication,
        chargeCodeList,
      }
    }
    return {
      ...returnValue,
      diagnosisSelections: diagnosisOptions,
      complicationList,
      selectedComplication,
      chargeCodeList,
      selectedChargeCode,
    }
  },
  validationSchema: Yup.object().shape({
    diagnosisSelections: Yup.array()
      .required('At least one diagnosis is required.'),
    selectedComplication: Yup.array().when(['schemeCategoryDisplayValue', 'diagnosisSelections'],
      {
        is:(schemeCategoryDisplayValue, diagnosisSelections) => diagnosisSelections >= 2 && schemeCategoryDisplayValue === 'Chronic Tier 2',
        then : Yup.array().min(1,'At least two diagnosis / one diagnosis with one complication for Chronic Tier 2'),
        otherwise : Yup.array().min(0,'Not Required'),
      }),
    // selectedChargeCode: Yup.number().when('schemeTypeFK',{ 
    //   is:(schemeTypeFK) => this.isMedisave(schemeTypeFK),
    //   then: Yup.number().required('Charge code is required.'),
    // }),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm } = props
    dispatch({
      type: 'claimSubmission/updateState',
      payload: {
        entity: {
          ...values,
        },
      },
    })
    onConfirm()
  },
})


class ClaimDetails extends Component {
  constructor (props) {
    super(props)
    const { dispatch } = props
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctgender',
      },
    })
  }



  save = () => {
    const { values, validateForm } = this.props
    const { diagnosisSelections, diagnosis, selectedChargeCode } = values
    
    if(diagnosisSelections.length < 1)
    {
        notification.error({
          message: 'At least one diagnosis is required',
      })
      return null
    }
    if(this.isMedisave(values.schemeTypeFK) && !selectedChargeCode)
    {
        notification.error({
          message: 'Charge code is required',
      })
      return null
    }

    let chargeCodeSelections = []
    const selected = selectedChargeCode || ''

    diagnosis.forEach((o) => {
      const selectedId = diagnosisSelections.find((i) => i === o.id)
      o.isSelected = selectedId
      if(o.isSelected) chargeCodeSelections.push(o.chargeCode)

      o.isPrimary = selected.includes(`${o.chargeCode} - ${o.chargeCodeDescription}`)
    })

    const e = chargeCodeSelections.find((c) => selected.includes(c))
    if(this.isMedisave(values.schemeTypeFK) && !e)
    {
      notification.error({
        message: 'Charge code is not in selected list of diagnoses',
      })
      return null

    }

    validateForm()
    this.props.handleSubmit()
    return null
  }

  diagnosisOnChangeHandler = (v, op = {}) =>{
    const { setFieldValue } = this.props
    let latestSelectedComplication = []

    if(op){ // Op is the selected Item
      // Generate Latest Selected Complication
      op.forEach((o)=>{
        o.invoiceClaimComplicationDtos.forEach((complication) => {
          if(complication)
          {
            latestSelectedComplication.push(complication.id)
          }
        })
      })
    }
    setFieldValue('selectedComplication',latestSelectedComplication)
  }

  isMedisave = (schemeTypeFK) => {
    if(schemeTypeFK)
      return [12,13,14].indexOf(schemeTypeFK) >= 0
      
    return false
  }

  render () {
    const { readOnly } = true
    const {
      classes,
      onClose,
      values,
      codetable,
      allowEdit,
    } = this.props
    const {
      clinicianProfile: { title, name, doctorProfile },
      patientDetail: { dob, genderFK },
      visitDate,
      complicationList,
      chargeCodeList,
      patientDob,
      invoiceDate,
      diagnosis,
    } = values
    const { doctorMCRNo } = doctorProfile

    return (
      <SizeContainer size='md'>
        <React.Fragment>
          <GridContainer className={classes.container}>
            <GridItem md={12}>
              <h4>Visit Details</h4>
              <Divider />
            </GridItem>
            <GridItem md={12} container>
              <GridItem md={5}>
                <FastField
                  name='patientDetail.patientReferenceNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Patient Ref No.' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <DatePicker
                  disabled
                  label='Visit Date'
                  format={dateFormatLongWithTimeNoSec}
                  value={visitDate}
                  showTime
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='patientAccountNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Patient Acc No.' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <TextField disabled label='Doctor' value={`${title ?? ''} ${name} (${doctorMCRNo})`} />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='patientName'
                  render={(args) => (
                    <TextField 
                      value={`${values.patientName} (${values.gender}/${calculateAgeFromDOB(patientDob)})`}
                      disabled
                      label='Patient Name' 
                    />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <DatePicker
                  disabled
                  label='DOB'
                  format={dateFormatLong}
                  value={patientDob}
                />
              </GridItem>
            </GridItem>
            <GridItem md={12}>
              <h4>Invoice Details</h4>
              <Divider />
            </GridItem>
            <GridItem md={12} container>
              <GridItem md={5}>
                <FastField
                  name='invoiceNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Invoice No.' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <DatePicker
                  disabled
                  label='Invoice Date'
                  format={dateFormatLong}
                  value={invoiceDate}
                  showTime
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='invoiceAmt'
                  render={(args) => (
                    <NumberInput
                      {...args}
                      disabled
                      currency
                      label='Invoice Amount'
                    />
                  )}
                />
              </GridItem>
            </GridItem>

            <GridItem md={12}>
              <h4>Claim Details</h4>
              <Divider />
            </GridItem>
            {!this.isMedisave(values.schemeTypeFK) && // CHAS //
            <GridItem md={12} container>
              <GridItem md={5}>
                <FastField
                  name='schemeTypeDisplayValue'
                  render={(args) => (
                    <TextField {...args} disabled label='Scheme Type' />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
              <GridItem md={5}>
                <FastField
                  name='schemeCategoryDisplayValue'
                  render={(args) => (
                    <TextField {...args} disabled label='Scheme Category' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={2}>
                <FastField
                  name='tier'
                  render={(args) => (
                    <TextField {...args} disabled label='Tier' />
                  )}
                />
              </GridItem>
              <GridItem md={4} />
              <GridItem md={5}>
                <Field
                  name='diagnosisSelections'
                  render={(args) => (
                    <Select
                      label='Diagnosis'
                      disabled={!allowEdit}
                      mode='multiple'
                      options={diagnosis}
                      disableAll={!allowEdit}
                      labelField='diagnosisDescription'
                      valueField='id'
                      onChange={this.diagnosisOnChangeHandler}
                      maxTagCount={allowEdit ? 0 : undefined}
                      maxTagPlaceholder='diagnosis'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <Field
                  name='selectedComplication'
                  render={(args) => (
                    <Select
                      label='Complication'
                      disabled
                      mode='multiple'
                      disableAll
                      options={complicationList}
                      labelField='complicationDescription'
                      valueField='id'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={5}>
                <FastField
                  name='claimAmt'
                  render={(args) => (
                    <NumberInput
                      {...args}
                      disabled
                      currency
                      label='Claim Amount'
                    />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
            </GridItem>
            }
            {this.isMedisave(values.schemeTypeFK) && // MEDISAVE //
            <GridItem md={12} container>
              <GridItem md={5}>
                <FastField
                  name='schemeTypeDisplayValue'
                  render={(args) => (
                    <TextField {...args} disabled label='Scheme Type' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='status'
                  render={(args) => (
                    <TextField {...args} disabled label='Claim Status' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='payerName'
                  render={(args) => (
                    <TextField {...args} disabled label='Payer Name' />
                  )}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <DatePicker
                  disabled
                  label='Payer DOB'
                  format={dateFormatLong}
                  value={values.payerDob}
                />
              </GridItem>
              <GridItem md={1} />
              <GridItem md={5}>
                <FastField
                  name='payerAccountNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Payer Account No.' />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
              <GridItem md={5}>
                <Field
                  name='diagnosisSelections'
                  render={(args) => (
                    <Select
                      label='Diagnosis'
                      disabled={!allowEdit}
                      mode='multiple'
                      options={diagnosis}
                      disableAll// ={!allowEdit}
                      labelField='diagnosisDescription'
                      valueField='id'
                      // onChange={this.diagnosisOnSelectHandler}
                      maxTagCount={allowEdit ? 3 : undefined}
                      maxTagPlaceholder='diagnosis'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
              <GridItem md={5}>
                <Field
                  name='selectedChargeCode'
                  render={(args) => (
                    <Select
                      label='Charge Code'
                      disabled={!allowEdit}
                      disableAll
                      options={chargeCodeList}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
              <GridItem md={5}>
                <FastField
                  name='claimAmt'
                  render={(args) => (
                    <NumberInput
                      {...args}
                      disabled
                      currency
                      label='Claim Amount'
                    />
                  )}
                />
              </GridItem>
              <GridItem md={7} />
            </GridItem>
            }
            {values.status === 'Draft' && 
            <GridItem md={12}>
              <font color='red'>
                *Draft claim records are not editable. Please end the current session to edit record and view invoice.
              </font>
            </GridItem>
            }
            <GridItem md={12} className={classes.footer}>
              <Button color='danger' onClick={onClose}>
                Close
              </Button>
              {allowEdit ? (
                <Button color='primary' onClick={this.save}>
                  Save
                </Button>
              ) : (
                ''
              )}
            </GridItem>
            
          </GridContainer>
        </React.Fragment>
      </SizeContainer>
    )
  }
}

export default withStyles(styles, { name: 'ClaimDetails' })(ClaimDetails)
