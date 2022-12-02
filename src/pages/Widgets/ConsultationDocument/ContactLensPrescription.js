import {
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
} from '@/components'
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
      patientName: name,
      patientReferenceNo,
      dateofPrescription: moment(),
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
        subject: 'Contact Lens Prescription',
        sequence: nextSequence,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
})

const ContactLensPrescription = props => {
  let { classes, footer, handleSubmit } = props
  let { spacing } = useTheme()
  console.log(props)
  return (
    <>
      <header>
        <GridContainer>
          <GridItem xs={4}>
            <FastField
              name='patientReferenceNo'
              render={args => {
                return <TextField label='SPOC ID' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='patientName'
              render={args => {
                return <TextField label='Name' disabled {...args} />
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='dateofPrescription'
              render={args => {
                return <DatePicker label='Date of Prescription' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
      </header>
      <article>
        <ContactLensPrescriptionModule />
      </article>
      <section>
        <GridItem>
          <div
            style={{
              border: '1px solid #ccc',
              marginTop: spacing(2),
              borderRadius: '5px',
            }}
          >
            <GridItem xs>
              <div style={{ marginBottom: '-10px', fontSize: '0.8rem' }}>
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
      </section>
      <footer>
        <GridItem xs>
          <FastField
            name='remarks'
            render={args => {
              return <TextField label='Remarks' {...args} />
            }}
          />
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
export default compose(_styles, _formik)(ContactLensPrescription)
