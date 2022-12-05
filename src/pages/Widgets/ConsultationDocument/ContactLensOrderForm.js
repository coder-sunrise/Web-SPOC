import { GridContainer, GridItem, TextField, DatePicker } from '@/components'
import { FastField, withFormik } from 'formik'
import Yup from '@/utils/yup'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import ContactLensPrescriptionModule from './components/ContactLensPrescriptionModule'
import { useTheme } from '@material-ui/core'
import CodeSelect from '@/components/Select/CodeSelect'
import moment from 'moment'

const _styles = withStyles(theme => ({}), { withTheme: true })

const _formik = withFormik({
  mapPropsToValues: ({
    consultationDocument,
    patient,
    user,
    corVisionRefraction,
    forDispense,
    consultation,
  }) => {
    if (consultationDocument.entity) return consultationDocument.entity
    const {
      entity: { name = '', patientReferenceNo = '' },
    } = patient
    let formVisionRefraction = corVisionRefraction || {}
    if (forDispense) {
      formVisionRefraction =
        consultation.entity?.latestCORVisionRefraction || {}
    }
    return {
      type: consultationDocument.type,
      dateOrdered: moment(),
      dateRequired: moment(),
      issuedByUserFK: user.data.clinicianProfile.userProfileFK,
      issuedByUser: user.data.clinicianProfile.name,
      issuedByUserTitle: user.data.clinicianProfile.title,
      /*  default left value */
      leftSph: formVisionRefraction.subjectiveRefraction_LE_SPH,
      leftCyl: formVisionRefraction.subjectiveRefraction_LE_CYL,
      leftAxis: formVisionRefraction.subjectiveRefraction_LE_AXIS,
      leftAdd: formVisionRefraction.subjectiveRefraction_NearAddition_LE_Value,
      leftVa: `${formVisionRefraction.subjectiveRefraction_LE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_LE_VA_Comments || ''}`,
      /*  default right value */
      rightSph: formVisionRefraction.subjectiveRefraction_RE_SPH,
      rightCyl: formVisionRefraction.subjectiveRefraction_RE_CYL,
      rightAxis: formVisionRefraction.subjectiveRefraction_RE_AXIS,
      rightAdd: formVisionRefraction.subjectiveRefraction_NearAddition_RE_Value,
      rightVa: `${formVisionRefraction.subjectiveRefraction_RE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_RE_VA_Comments || ''}`,
    }
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence } = props
    const nextSequence = getNextSequence()
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        subject: 'Contact Lens Order Form',
        sequence: nextSequence,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
})

const ContactLensOrderForm = props => {
  let { classes, footer, handleSubmit } = props
  let { spacing } = useTheme()
  console.log(props)
  return (
    <>
      <header>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='jobReferenceNo'
              render={args => {
                return (
                  <TextField label='Job Reference Number' disabled {...args} />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='dateOrdered'
              render={args => {
                return <DatePicker label='Date Ordered' {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='supplierFK'
              render={args => {
                return (
                  <CodeSelect
                    code='ctsupplier'
                    labelField='displayValue'
                    label='Supplier'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <FastField
              name='dateRequired'
              render={args => {
                return <DatePicker label='Date Required' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </header>
      <article>
        <GridItem>
          <div
            style={{
              border: '1px solid #ccc',
              marginTop: spacing(2),
              borderRadius: '5px',
            }}
          >
            <GridItem xs>
              <div
                style={{
                  marginBottom: '-10px',
                  fontSize: '0.8rem',
                  fontWeight: 'bolder',
                }}
              >
                Lens Product
              </div>
            </GridItem>
            <GridContainer>
              <GridItem xs>
                <FastField
                  name='leftLensProductFK'
                  render={args => {
                    return (
                      <CodeSelect
                        code='inventoryconsumable'
                        labelField='displayValue'
                        label='Left Lens Product'
                        localFilter={item => item?.consumableCategory.id == 3}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs>
                <FastField
                  name='rightLensProductFK'
                  render={args => {
                    return (
                      <CodeSelect
                        code='inventoryconsumable'
                        labelField='displayValue'
                        label='Right Lens Product'
                        localFilter={item => item?.consumableCategory.id == 3}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </article>
      <section>
        <ContactLensPrescriptionModule />
        <GridItem xs>
          <FastField
            name='remarks'
            render={args => {
              return <TextField label='Remarks' {...args} />
            }}
          />
        </GridItem>
      </section>
      <footer>
        <GridItem>
          <div
            style={{
              marginTop: spacing(2),
              borderRadius: '5px',
            }}
          >
            <GridItem xs>
              <div
                style={{
                  marginBottom: '-10px',
                  fontSize: '0.8rem',
                  fontWeight: 'bolder',
                }}
              >
                SRP For
              </div>
            </GridItem>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='srpFullName'
                  render={args => {
                    return <TextField label='Full Name' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={3}>
                <FastField
                  name='yrClass'
                  render={args => {
                    return <TextField label='Yr/Class' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
        <GridItem>
          <div
            style={{
              marginTop: spacing(2),
              borderRadius: '5px',
            }}
          >
            <GridItem xs>
              <div
                style={{
                  marginBottom: '-10px',
                  fontSize: '0.8rem',
                  fontWeight: 'bolder',
                }}
              >
                Student
              </div>
            </GridItem>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='studentFullName'
                  render={args => {
                    return <TextField label='Full Name' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
        </GridItem>
      </footer>

      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </>
  )
}
export default compose(_styles, _formik)(ContactLensOrderForm)
