import React, { Component } from 'react'
import { connect } from 'dva'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common components
import moment from 'moment'
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
} from '@/components'

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
  mapPropsToValues: ({ claimSubmission }) => {
    return claimSubmission.entity || {}
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

  onSelectChange = (val) => {
    const { setFieldValue, values } = this.props
    const { diagnosis } = values

    let processedRows = []
    processedRows = diagnosis.map((x) => {
      return { ...x, isSelected: false }
    })
    val.map((x) => {
      const data = processedRows.find((diag) => diag.value === x)
      data.isSelected = true
      return x
    })

    setFieldValue('diagnosis', val)
  }

  render () {
    const { readOnly } = true
    const {
      classes,
      onConfirm,
      onClose,
      renderClaimDetails,
      values,
      codetable,
      allowEdit,
    } = this.props
    const { ctgender = [] } = codetable
    const {
      clinicianProfile: { title, name, doctorProfile },
      patientDetail: { dob, genderFK },
      patientName,
      // tier: maxDiagnosisSelectionCount,
      visitDate,
      patientDob,
      invoiceDate,
      diagnosis,
    } = values
    const age = moment().diff(dob, 'years')
    let patientGender = ctgender.find((x) => x.id === genderFK)
    const { doctorMCRNo } = doctorProfile
    let doctorNameLabel = `${title} ${name} (${doctorMCRNo})`
    let patientNameLabel = `${patientName} (${patientGender
      ? patientGender.code
      : ''}/${age})`

    const maxDiagnosisSelectionCount = 2

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
                <TextField
                  value={patientNameLabel}
                  disabled
                  label='Patient Name'
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
                  {/* <FastField
                    name='diagnosis'
                    render={(args) => (
                      <Select
                        disabled={!allowEdit}
                        maxSelected={maxDiagnosisSelectionCount}
                        mode='multiple'
                        // options={[
                        //   { name: 'Chief Complaints', value: '1' },
                        //   { name: 'Plan', value: '2' },
                        //   { name: 'Diagnosis', value: '3' },
                        //   { name: 'Consultation Document', value: '4' },
                        //   { name: 'Orders', value: '5' },
                        //   { name: 'Invoice', value: '7' },
                        // ]}
                        options={diagnosis}
                        onChange={this.onSelectChange}
                        maxTagCount={2}
                        {...args}
                      />
                    )}
                  /> */}

                  <Select
                    disabled={!allowEdit}
                    maxSelected={maxDiagnosisSelectionCount}
                    mode='multiple'
                    options={diagnosis}
                    onChange={this.onSelectChange}
                    maxTagCount={2}
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
            )}

            <GridItem md={12} className={classes.footer}>
              <Button color='danger' onClick={onClose}>
                Close
              </Button>
              {allowEdit ? (
                <Button color='primary' onClick={onConfirm}>
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
