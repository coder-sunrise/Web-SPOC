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
} from '@/components'
import Yup from '@/utils/yup'

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
  mapPropsToValues: ({ claimSubmission, allowEdit }) => {
    const returnValue = claimSubmission.entity || {}
    const { diagnosis } = returnValue
    let diagnosisOptions = []
    let complicationList = []
    let selectedComplication = []

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


    })
  }

    if (diagnosis.length === diagnosisOptions.length && allowEdit) {
      diagnosisOptions.push(-99)
    }

    return {
      ...returnValue,
      diagnosisSelections: diagnosisOptions,
      complicationList,
      selectedComplication,
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
    const { diagnosisSelections,diagnosis } = values

    diagnosis.forEach((o) => {
      const selectedId = diagnosisSelections.find((i) => i === o.id)
      if (selectedId) {
        o.isSelected = true
      } else {
        o.isSelected = false
      }
    })

    validateForm()
    this.props.handleSubmit()
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


  render () {
    const { readOnly } = true
    const {
      classes,
      onClose,
      renderClaimDetails,
      values,
      codetable,
      allowEdit,
    } = this.props
    const {
      clinicianProfile: { title, name, doctorProfile },
      patientDetail: { dob, genderFK },
      visitDate,
      complicationList,
      patientDob,
      invoiceDate,
      diagnosis,
    } = values

    const { doctorMCRNo } = doctorProfile
    let doctorNameLabel = `${title} ${name} (${doctorMCRNo})`

    return (
      <SizeContainer size='md'>
        <React.Fragment>
          <GridContainer className={classes.container}>
            <GridItem md={12}>
              <h4>Visit Details</h4>
              <Divider />
            </GridItem>
            <GridItem md={5} container>
              <GridItem md={12}>
                <FastField
                  name='patientDetail.patientReferenceNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Patient Ref No.' />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <FastField
                  name='patientAccountNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Patient Acc No.' />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <FastField
                  name='patientName'
                  render={(args) => (
                    <TextField {...args} disabled label='Patient Name' />
                  )}
                />
              </GridItem>
            </GridItem>
            <GridItem md={1} />
            <GridItem md={5} container>
              <GridItem md={12}>
                <DatePicker
                  disabled
                  label='Visit Date'
                  format={dateFormatLongWithTimeNoSec}
                  value={visitDate}
                  showTime
                />
              </GridItem>
              <GridItem md={12}>
                <TextField disabled label='Doctor' value={doctorNameLabel} />
              </GridItem>
              <GridItem md={12}>
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
            <GridItem md={5} container>
              <GridItem md={12}>
                <FastField
                  name='invoiceNo'
                  render={(args) => (
                    <TextField {...args} disabled label='Invoice No.' />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <DatePicker
                  disabled
                  label='Invoice Date'
                  format={dateFormatLong}
                  value={invoiceDate}
                  showTime
                />
              </GridItem>
              <GridItem md={12}>
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
            {}
            {renderClaimDetails !== undefined ? (
              renderClaimDetails(readOnly)
            ) : (
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
            )}

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
